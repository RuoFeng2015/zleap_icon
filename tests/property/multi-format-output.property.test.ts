/**
 * Property-Based Tests for Multi-Format Output Consistency
 *
 * Feature: figma-icon-automation
 * Property 11: Multi-Format Output Consistency
 *
 * Validates: Requirements 11.1, 11.2, 11.3, 11.5
 *
 * For any icon in the library:
 * - A React component file SHALL exist in src/icons/
 * - A raw SVG file SHALL exist in svg/
 * - An entry SHALL exist in the SVG sprite file
 * - An entry SHALL exist in icons.json metadata
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateSprite,
  generateSpriteFromManifest,
  generateJsonMetadata,
  generateJsonMetadataFromManifest,
  toSymbolId,
  createSpriteSymbol,
  createIconJsonEntry,
  validateSpriteCompleteness,
  validateJsonMetadataCompleteness,
  serializeJsonMetadata,
} from '../../src/multi-format-output'
import type { IconMetadata, IconManifest } from '../../src/types'

/**
 * Generates a valid icon name (lowercase with hyphens)
 */
const validIconNameArbitrary = fc.stringMatching(/^[a-z][a-z0-9-]{1,20}$/)

/**
 * Generates valid icon dimensions
 */
const validDimensionArbitrary = fc.constantFrom(16, 20, 24, 32)

/**
 * Generates a valid SVG content string
 */
const validSvgContentArbitrary = fc
  .record({
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
    pathData: fc.stringMatching(/^M[0-9 ]+$/),
  })
  .map(
    ({ width, height, pathData }) =>
      `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><path d="${pathData}"/></svg>`
  )

/**
 * Generates a valid IconMetadata object with SVG content
 */
const iconMetadataWithSvgArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
    svgContent: validSvgContentArbitrary,
  })
  .map(({ id, name, width, height, svgContent }) => ({
    id,
    name,
    originalName: name,
    normalizedName: `Icon${name.charAt(0).toUpperCase()}${name
      .slice(1)
      .replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`,
    width,
    height,
    svgContent,
  }))

/**
 * Generates a list of unique IconMetadata objects with SVG content
 */
const uniqueIconMetadataListArbitrary = fc
  .array(iconMetadataWithSvgArbitrary, { minLength: 1, maxLength: 20 })
  .map((icons) => {
    // Ensure unique IDs and names
    const seenIds = new Set<string>()
    const seenNames = new Set<string>()
    return icons.filter((icon) => {
      if (seenIds.has(icon.id) || seenNames.has(icon.name)) {
        return false
      }
      seenIds.add(icon.id)
      seenNames.add(icon.name)
      return true
    })
  })
  .filter((icons) => icons.length > 0)

/**
 * Generates a valid IconManifest with SVG content
 */
const iconManifestWithSvgArbitrary = fc
  .record({
    version: fc.stringMatching(/^\d+\.\d+\.\d+$/),
    icons: uniqueIconMetadataListArbitrary,
  })
  .map(({ version, icons }) => ({
    version,
    generatedAt: new Date().toISOString(),
    totalCount: icons.length,
    icons,
  }))

describe('Property 11: Multi-Format Output Consistency', () => {
  /**
   * Feature: figma-icon-automation, Property 11: Multi-Format Output Consistency
   * Validates: Requirements 11.1, 11.2, 11.3, 11.5
   */

  describe('SVG Sprite Generation (Requirement 11.2)', () => {
    it('should generate a sprite symbol for each icon with SVG content', () => {
      fc.assert(
        fc.property(uniqueIconMetadataListArbitrary, (icons) => {
          const sprite = generateSprite(icons)

          // Sprite should have exactly one symbol for each icon
          expect(sprite.symbols.length).toBe(icons.length)
        }),
        { numRuns: 100 }
      )
    })

    it('should use symbol elements to encapsulate each icon', () => {
      fc.assert(
        fc.property(uniqueIconMetadataListArbitrary, (icons) => {
          const sprite = generateSprite(icons)

          // Each symbol should have an id and viewBox
          for (const symbol of sprite.symbols) {
            expect(symbol.id).toBeDefined()
            expect(symbol.id.length).toBeGreaterThan(0)
            expect(symbol.viewBox).toBeDefined()
            expect(symbol.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/)
            expect(symbol.content).toBeDefined()
          }

          // Sprite content should contain all symbol IDs
          for (const symbol of sprite.symbols) {
            expect(sprite.content).toContain(`id="${symbol.id}"`)
            expect(sprite.content).toContain(`<symbol`)
            expect(sprite.content).toContain(`</symbol>`)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should generate valid SVG sprite structure', () => {
      fc.assert(
        fc.property(uniqueIconMetadataListArbitrary, (icons) => {
          const sprite = generateSprite(icons)

          // Sprite should be valid SVG
          expect(sprite.content).toMatch(/^<svg[^>]*>/)
          expect(sprite.content).toMatch(/<\/svg>$/)
          expect(sprite.content).toContain('xmlns="http://www.w3.org/2000/svg"')
          expect(sprite.content).toContain('style="display: none;"')
        }),
        { numRuns: 100 }
      )
    })

    it('should convert icon names to valid symbol IDs', () => {
      fc.assert(
        fc.property(validIconNameArbitrary, (name) => {
          const symbolId = toSymbolId(
            `Icon${name.charAt(0).toUpperCase()}${name.slice(1)}`
          )

          // Symbol ID should be lowercase kebab-case
          expect(symbolId).toMatch(/^[a-z][a-z0-9-]*$/)
          // Should not contain uppercase letters
          expect(symbolId).not.toMatch(/[A-Z]/)
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve viewBox from original SVG', () => {
      fc.assert(
        fc.property(iconMetadataWithSvgArbitrary, (icon) => {
          const symbol = createSpriteSymbol(icon)

          expect(symbol).not.toBeNull()
          // ViewBox should be extracted from SVG content
          expect(symbol!.viewBox).toMatch(/^0 0 \d+ \d+$/)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('JSON Metadata Generation (Requirements 11.3, 11.5)', () => {
    it('should generate a JSON entry for each icon', () => {
      fc.assert(
        fc.property(
          uniqueIconMetadataListArbitrary,
          fc.stringMatching(/^\d+\.\d+\.\d+$/),
          (icons, version) => {
            const metadata = generateJsonMetadata(icons, version)

            // Metadata should have exactly one entry for each icon
            expect(metadata.totalCount).toBe(icons.length)
            expect(metadata.icons.length).toBe(icons.length)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should include icon name, path, and size information', () => {
      fc.assert(
        fc.property(iconMetadataWithSvgArbitrary, (icon) => {
          const entry = createIconJsonEntry(icon)

          // Entry should have all required fields
          expect(entry.name).toBe(icon.normalizedName)
          expect(entry.originalName).toBe(icon.originalName)
          expect(entry.svgPath).toBeDefined()
          expect(entry.svgPath.length).toBeGreaterThan(0)
          expect(entry.componentPath).toBeDefined()
          expect(entry.componentPath.length).toBeGreaterThan(0)
          expect(entry.size.width).toBe(icon.width)
          expect(entry.size.height).toBe(icon.height)
        }),
        { numRuns: 100 }
      )
    })

    it('should generate correct file paths', () => {
      fc.assert(
        fc.property(iconMetadataWithSvgArbitrary, (icon) => {
          const entry = createIconJsonEntry(icon, {
            svgBasePath: 'svg',
            componentBasePath: 'src/icons',
          })

          // SVG path should end with .svg
          expect(entry.svgPath).toMatch(/\.svg$/)
          expect(entry.svgPath).toMatch(/^svg\//)

          // Component path should end with .tsx
          expect(entry.componentPath).toMatch(/\.tsx$/)
          expect(entry.componentPath).toMatch(/^src\/icons\//)
        }),
        { numRuns: 100 }
      )
    })

    it('should include version and timestamp in metadata', () => {
      fc.assert(
        fc.property(
          uniqueIconMetadataListArbitrary,
          fc.stringMatching(/^\d+\.\d+\.\d+$/),
          (icons, version) => {
            const before = new Date().toISOString()
            const metadata = generateJsonMetadata(icons, version)
            const after = new Date().toISOString()

            expect(metadata.version).toBe(version)
            expect(metadata.generatedAt).toBeDefined()
            expect(metadata.generatedAt >= before).toBe(true)
            expect(metadata.generatedAt <= after).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should serialize to valid JSON', () => {
      fc.assert(
        fc.property(
          uniqueIconMetadataListArbitrary,
          fc.stringMatching(/^\d+\.\d+\.\d+$/),
          (icons, version) => {
            const metadata = generateJsonMetadata(icons, version)
            const serialized = serializeJsonMetadata(metadata)

            // Should be valid JSON
            expect(() => JSON.parse(serialized)).not.toThrow()

            // Parsed JSON should match original
            const parsed = JSON.parse(serialized)
            expect(parsed.version).toBe(metadata.version)
            expect(parsed.totalCount).toBe(metadata.totalCount)
            expect(parsed.icons.length).toBe(metadata.icons.length)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Cross-Format Consistency', () => {
    it('should have matching entries in sprite and JSON metadata', () => {
      fc.assert(
        fc.property(iconManifestWithSvgArbitrary, (manifest) => {
          const sprite = generateSpriteFromManifest(manifest)
          const metadata = generateJsonMetadataFromManifest(manifest)

          // Both should have the same number of entries
          expect(sprite.symbols.length).toBe(metadata.icons.length)

          // Each icon in metadata should have a corresponding sprite symbol
          for (const iconEntry of metadata.icons) {
            const expectedSymbolId = toSymbolId(iconEntry.name)
            const symbol = sprite.symbols.find((s) => s.id === expectedSymbolId)
            expect(symbol).toBeDefined()
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should validate sprite completeness against icon names', () => {
      fc.assert(
        fc.property(uniqueIconMetadataListArbitrary, (icons) => {
          const sprite = generateSprite(icons)
          const iconNames = icons.map((i) => i.normalizedName)

          const missing = validateSpriteCompleteness(sprite, iconNames)

          // No icons should be missing from sprite
          expect(missing).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should validate JSON metadata completeness against icon names', () => {
      fc.assert(
        fc.property(
          uniqueIconMetadataListArbitrary,
          fc.stringMatching(/^\d+\.\d+\.\d+$/),
          (icons, version) => {
            const metadata = generateJsonMetadata(icons, version)
            const iconNames = icons.map((i) => i.normalizedName)

            const missing = validateJsonMetadataCompleteness(
              metadata,
              iconNames
            )

            // No icons should be missing from metadata
            expect(missing).toHaveLength(0)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty icon list for sprite', () => {
      const sprite = generateSprite([])

      expect(sprite.symbols).toHaveLength(0)
      expect(sprite.content).toContain('<svg')
      expect(sprite.content).toContain('</svg>')
    })

    it('should handle empty icon list for JSON metadata', () => {
      const metadata = generateJsonMetadata([], '1.0.0')

      expect(metadata.totalCount).toBe(0)
      expect(metadata.icons).toHaveLength(0)
    })

    it('should handle single icon', () => {
      fc.assert(
        fc.property(iconMetadataWithSvgArbitrary, (icon) => {
          const sprite = generateSprite([icon])
          const metadata = generateJsonMetadata([icon], '1.0.0')

          expect(sprite.symbols).toHaveLength(1)
          expect(metadata.icons).toHaveLength(1)
        }),
        { numRuns: 100 }
      )
    })

    it('should handle icons without SVG content in sprite', () => {
      fc.assert(
        fc.property(iconMetadataWithSvgArbitrary, (icon) => {
          const iconWithoutSvg: IconMetadata = {
            ...icon,
            svgContent: undefined,
          }

          const sprite = generateSprite([iconWithoutSvg])

          // Should not create symbol for icon without SVG content
          expect(sprite.symbols).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Symbol ID Transformation', () => {
    it('should remove Icon prefix from normalized names', () => {
      fc.assert(
        fc.property(validIconNameArbitrary, (name) => {
          const normalizedName = `Icon${name
            .charAt(0)
            .toUpperCase()}${name.slice(1)}`
          const symbolId = toSymbolId(normalizedName)

          // Symbol ID should not start with "icon-" (prefix removed)
          expect(symbolId).not.toMatch(/^icon-/)
        }),
        { numRuns: 100 }
      )
    })

    it('should convert PascalCase to kebab-case', () => {
      // Test specific cases
      expect(toSymbolId('IconArrowRight')).toBe('arrow-right')
      expect(toSymbolId('IconCheckCircle')).toBe('check-circle')
      expect(toSymbolId('IconHome')).toBe('home')
    })
  })
})
