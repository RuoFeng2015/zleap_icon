/**
 * Property-Based Tests for Icon Manifest Completeness
 *
 * Feature: figma-icon-automation
 * Property 2: Icon Manifest Completeness
 *
 * Validates: Requirements 2.6
 *
 * For any set of successfully exported icons, the generated IconManifest SHALL
 * contain exactly one entry for each icon with all required metadata fields
 * (id, name, normalizedName, width, height).
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateManifest,
  generateManifestFromExports,
  createIconMetadata,
  normalizeIconName,
  isValidManifest,
  isValidIconMetadata,
  serializeManifest,
  parseManifest,
} from '../../src/manifest-generator'
import type { FilteredIconComponent } from '../../src/icon-filter'
import type { IconExportResult } from '../../src/svg-exporter'
import type { IconManifest, IconMetadata } from '../../src/types'

/**
 * Generates a valid icon name (lowercase with hyphens)
 */
const validIconNameArbitrary = fc.stringMatching(/^[a-z][a-z0-9-]{1,20}$/)

/**
 * Generates valid icon dimensions
 */
const validDimensionArbitrary = fc.constantFrom(16, 20, 24, 32)

/**
 * Generates a FilteredIconComponent
 */
const filteredIconComponentArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
  })
  .map(({ id, name, width, height }) => ({
    id,
    name,
    width,
    height,
    original: {
      id,
      name,
      type: 'COMPONENT' as const,
      absoluteBoundingBox: { width, height },
    },
  }))

/**
 * Generates a successful IconExportResult
 */
const successfulExportResultArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    svgContent: fc.constant('<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'),
    filePath: fc.constant('/tmp/icon.svg'),
  })
  .map(({ id, name, svgContent, filePath }) => ({
    id,
    name,
    success: true as const,
    svgContent,
    filePath,
  }))

/**
 * Generates a failed IconExportResult
 */
const failedExportResultArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    error: fc.constant('Export failed'),
  })
  .map(({ id, name, error }) => ({
    id,
    name,
    success: false as const,
    error,
  }))

/**
 * Generates a list of unique FilteredIconComponents
 */
const uniqueIconComponentsArbitrary = fc
  .array(filteredIconComponentArbitrary, { minLength: 1, maxLength: 20 })
  .map((components) => {
    // Ensure unique IDs and names
    const seenIds = new Set<string>()
    const seenNames = new Set<string>()
    return components.filter((c) => {
      if (seenIds.has(c.id) || seenNames.has(c.name)) {
        return false
      }
      seenIds.add(c.id)
      seenNames.add(c.name)
      return true
    })
  })
  .filter((components) => components.length > 0)

/**
 * Creates matching export results for components
 */
function createMatchingExportResults(
  components: FilteredIconComponent[]
): IconExportResult[] {
  return components.map((c) => ({
    id: c.id,
    name: c.name,
    success: true,
    svgContent: `<svg viewBox="0 0 ${c.width} ${c.height}"><path d="M0 0"/></svg>`,
    filePath: `/tmp/${c.name}.svg`,
  }))
}

describe('Property 2: Icon Manifest Completeness', () => {
  /**
   * Feature: figma-icon-automation, Property 2: Icon Manifest Completeness
   * Validates: Requirements 2.6
   */

  describe('Manifest Entry Count', () => {
    it('should contain exactly one entry for each icon component', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          // Manifest should have exactly the same number of icons as input
          expect(manifest.totalCount).toBe(components.length)
          expect(manifest.icons.length).toBe(components.length)
        }),
        { numRuns: 100 }
      )
    })

    it('should contain exactly one entry for each successfully exported icon', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const exportResults = createMatchingExportResults(components)
          const manifest = generateManifestFromExports(
            exportResults,
            components
          )

          // Manifest should have exactly the same number of icons as successful exports
          expect(manifest.totalCount).toBe(components.length)
          expect(manifest.icons.length).toBe(components.length)
        }),
        { numRuns: 100 }
      )
    })

    it('should not include failed exports in the manifest', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          // Make half the exports fail
          const exportResults: IconExportResult[] = components.map((c, i) => {
            if (i % 2 === 0) {
              return {
                id: c.id,
                name: c.name,
                success: true,
                svgContent: '<svg></svg>',
                filePath: `/tmp/${c.name}.svg`,
              }
            }
            return {
              id: c.id,
              name: c.name,
              success: false,
              error: 'Export failed',
            }
          })

          const manifest = generateManifestFromExports(
            exportResults,
            components
          )
          const successfulCount = exportResults.filter((r) => r.success).length

          expect(manifest.totalCount).toBe(successfulCount)
          expect(manifest.icons.length).toBe(successfulCount)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Required Metadata Fields', () => {
    it('should include id field for each icon', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          for (const icon of manifest.icons) {
            expect(icon.id).toBeDefined()
            expect(typeof icon.id).toBe('string')
            expect(icon.id.length).toBeGreaterThan(0)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should include name field for each icon', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          for (const icon of manifest.icons) {
            expect(icon.name).toBeDefined()
            expect(typeof icon.name).toBe('string')
            expect(icon.name.length).toBeGreaterThan(0)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should include normalizedName field for each icon', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          for (const icon of manifest.icons) {
            expect(icon.normalizedName).toBeDefined()
            expect(typeof icon.normalizedName).toBe('string')
            expect(icon.normalizedName.length).toBeGreaterThan(0)
            // Normalized name should start with "Icon"
            expect(icon.normalizedName.startsWith('Icon')).toBe(true)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should include width field for each icon', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          for (const icon of manifest.icons) {
            expect(icon.width).toBeDefined()
            expect(typeof icon.width).toBe('number')
            expect(icon.width).toBeGreaterThan(0)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should include height field for each icon', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          for (const icon of manifest.icons) {
            expect(icon.height).toBeDefined()
            expect(typeof icon.height).toBe('number')
            expect(icon.height).toBeGreaterThan(0)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve original dimensions from components', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          // Create a map of component ID to dimensions
          const componentDimensions = new Map<
            string,
            { width: number; height: number }
          >()
          for (const c of components) {
            componentDimensions.set(c.id, { width: c.width, height: c.height })
          }

          // Verify each icon has correct dimensions
          for (const icon of manifest.icons) {
            const expected = componentDimensions.get(icon.id)
            expect(expected).toBeDefined()
            expect(icon.width).toBe(expected!.width)
            expect(icon.height).toBe(expected!.height)
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Manifest Metadata', () => {
    it('should include version string', () => {
      fc.assert(
        fc.property(
          uniqueIconComponentsArbitrary,
          fc.stringMatching(/^\d+\.\d+\.\d+$/),
          (components, version) => {
            const manifest = generateManifest(components, { version })

            expect(manifest.version).toBe(version)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should include generatedAt timestamp', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const before = new Date().toISOString()
          const manifest = generateManifest(components)
          const after = new Date().toISOString()

          expect(manifest.generatedAt).toBeDefined()
          expect(typeof manifest.generatedAt).toBe('string')
          // Timestamp should be between before and after
          expect(manifest.generatedAt >= before).toBe(true)
          expect(manifest.generatedAt <= after).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should have totalCount matching icons array length', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          expect(manifest.totalCount).toBe(manifest.icons.length)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Manifest Validation', () => {
    it('should produce valid manifests', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)

          expect(isValidManifest(manifest)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should produce valid icon metadata', () => {
      fc.assert(
        fc.property(filteredIconComponentArbitrary, (component) => {
          const metadata = createIconMetadata(component)

          expect(isValidIconMetadata(metadata)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Serialization Round-Trip', () => {
    it('should serialize and parse manifests correctly', () => {
      fc.assert(
        fc.property(uniqueIconComponentsArbitrary, (components) => {
          const manifest = generateManifest(components)
          const serialized = serializeManifest(manifest)
          const parsed = parseManifest(serialized)

          expect(parsed).not.toBeNull()
          expect(parsed!.version).toBe(manifest.version)
          expect(parsed!.totalCount).toBe(manifest.totalCount)
          expect(parsed!.icons.length).toBe(manifest.icons.length)

          // Verify each icon is preserved
          for (let i = 0; i < manifest.icons.length; i++) {
            expect(parsed!.icons[i].id).toBe(manifest.icons[i].id)
            expect(parsed!.icons[i].name).toBe(manifest.icons[i].name)
            expect(parsed!.icons[i].normalizedName).toBe(
              manifest.icons[i].normalizedName
            )
            expect(parsed!.icons[i].width).toBe(manifest.icons[i].width)
            expect(parsed!.icons[i].height).toBe(manifest.icons[i].height)
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Name Normalization', () => {
    it('should normalize names to PascalCase with Icon prefix', () => {
      fc.assert(
        fc.property(validIconNameArbitrary, (name) => {
          const normalized = normalizeIconName(name)

          // Should start with "Icon"
          expect(normalized.startsWith('Icon')).toBe(true)
          // Should be PascalCase (first char after "Icon" should be uppercase)
          expect(normalized.charAt(4)).toMatch(/[A-Z]/)
          // Should only contain alphanumeric characters
          expect(normalized).toMatch(/^[A-Za-z0-9]+$/)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty component list', () => {
      const manifest = generateManifest([])

      expect(manifest.totalCount).toBe(0)
      expect(manifest.icons).toHaveLength(0)
      expect(isValidManifest(manifest)).toBe(true)
    })

    it('should handle single component', () => {
      fc.assert(
        fc.property(filteredIconComponentArbitrary, (component) => {
          const manifest = generateManifest([component])

          expect(manifest.totalCount).toBe(1)
          expect(manifest.icons).toHaveLength(1)
          expect(manifest.icons[0].id).toBe(component.id)
        }),
        { numRuns: 100 }
      )
    })
  })
})
