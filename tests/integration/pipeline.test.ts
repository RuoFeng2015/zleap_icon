/**
 * End-to-End Integration Tests for Icon Sync Pipeline
 *
 * Simulates the complete icon synchronization flow from Figma data
 * through to all output artifacts.
 *
 * Requirements: All (Full pipeline validation)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import type {
  FigmaFileResponse,
  FigmaComponent,
  IconMetadata,
  IconManifest,
} from '../../src/types'
import {
  filterIconComponents,
  type FilteredIconComponent,
} from '../../src/icon-filter'
import { transformSvg } from '../../src/svg-transformer'
import {
  generateComponent,
  generateIndexFile,
  toPascalCase,
} from '../../src/component-generator'
import {
  generateManifest,
  normalizeIconName,
} from '../../src/manifest-generator'
import {
  generateSprite,
  generateJsonMetadata,
} from '../../src/multi-format-output'
import {
  computeIconDiff,
  generateChangelog,
} from '../../src/changelog-generator'
import { suggestVersionBump } from '../../src/version-manager'
import { validateIcon, defaultValidationRules } from '../../src/icon-validator'
import { filterIcons } from '../../src/icon-search'

// Test output directory
const TEST_OUTPUT_DIR = 'tests/integration/.test-output'

/**
 * Creates mock Figma file response with icon components
 */
function createMockFigmaResponse(
  icons: Array<{ name: string; width: number; height: number }>
): FigmaFileResponse {
  const components: Record<string, FigmaComponent> = {}

  icons.forEach((icon, index) => {
    const id = `icon-${index}`
    components[id] = {
      id,
      name: icon.name,
      type: 'COMPONENT',
      absoluteBoundingBox: {
        width: icon.width,
        height: icon.height,
      },
    }
  })

  return {
    document: {
      children: [],
    },
    components,
  }
}

/**
 * Creates mock SVG content for an icon
 */
function createMockSvg(name: string, size: number = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="#000000">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`
}

/**
 * Creates mock SVG content with stroke attributes for JSX conversion testing
 */
function createMockSvgWithStrokes(name: string, size: number = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor">
  <path d="M12 2L2 7l10 5 10-5-10-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
}

/**
 * Creates IconMetadata with SVG content
 */
function createIconMetadata(
  name: string,
  size: number = 24,
  svgContent?: string
): IconMetadata {
  return {
    id: `icon-${name}`,
    name,
    originalName: name,
    normalizedName: normalizeIconName(name),
    width: size,
    height: size,
    svgContent: svgContent || createMockSvg(name, size),
  }
}

describe('End-to-End Integration: Icon Sync Pipeline', () => {
  beforeEach(async () => {
    // Create test output directory
    await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true })
  })

  afterEach(async () => {
    // Clean up test output directory
    try {
      await fs.rm(TEST_OUTPUT_DIR, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  })

  describe('Phase 1: Figma Data Processing', () => {
    it('should filter icon components from Figma file response', () => {
      // Arrange: Create mock Figma response with mixed components
      const figmaResponse = createMockFigmaResponse([
        { name: 'arrow-right', width: 24, height: 24 },
        { name: 'check-circle', width: 24, height: 24 },
        { name: 'close', width: 24, height: 24 },
        { name: 'InvalidName', width: 24, height: 24 }, // Should be skipped (uppercase)
      ])

      // Act: Filter icon components
      const result = filterIconComponents(figmaResponse)

      // Assert: Verify filtering results
      expect(result.icons.length).toBe(3)
      expect(result.skipped.length).toBe(1)
      expect(result.icons.map((i) => i.name)).toContain('arrow-right')
      expect(result.icons.map((i) => i.name)).toContain('check-circle')
      expect(result.icons.map((i) => i.name)).toContain('close')
    })

    it('should generate manifest from filtered components', () => {
      // Arrange
      const filteredIcons: FilteredIconComponent[] = [
        {
          id: '1',
          name: 'arrow-right',
          width: 24,
          height: 24,
          original: {
            id: '1',
            name: 'arrow-right',
            type: 'COMPONENT',
            absoluteBoundingBox: { width: 24, height: 24 },
          },
        },
        {
          id: '2',
          name: 'check',
          width: 24,
          height: 24,
          original: {
            id: '2',
            name: 'check',
            type: 'COMPONENT',
            absoluteBoundingBox: { width: 24, height: 24 },
          },
        },
      ]

      // Act
      const manifest = generateManifest(filteredIcons, { version: '1.0.0' })

      // Assert
      expect(manifest.version).toBe('1.0.0')
      expect(manifest.totalCount).toBe(2)
      expect(manifest.icons.length).toBe(2)
      expect(manifest.icons[0].normalizedName).toBe('IconArrowRight')
      expect(manifest.icons[1].normalizedName).toBe('IconCheck')
      expect(manifest.generatedAt).toBeDefined()
    })
  })

  describe('Phase 2: SVG Transformation', () => {
    it('should optimize and transform SVG to JSX format', () => {
      // Arrange: Use SVG with stroke attributes to test JSX conversion
      const rawSvg = createMockSvgWithStrokes('test-icon', 24)

      // Act
      const result = transformSvg(rawSvg)

      // Assert: Core optimization invariants
      expect(result.optimizedSize).toBeLessThanOrEqual(result.originalSize)
      // Check that SVG element doesn't have width/height attributes (use more specific regex)
      expect(result.svgContent).not.toMatch(/<svg[^>]*\swidth="\d+"[^>]*>/)
      expect(result.svgContent).not.toMatch(/<svg[^>]*\sheight="\d+"[^>]*>/)
      expect(result.svgContent).toMatch(/fill="currentColor"/)

      // Assert: JSX attribute conversion (stroke attributes should be converted to camelCase)
      expect(result.jsxContent).toMatch(/strokeWidth=/)
      expect(result.jsxContent).toMatch(/strokeLinecap=/)
      expect(result.jsxContent).toMatch(/strokeLinejoin=/)
    })

    it('should preserve viewBox during transformation', () => {
      // Arrange
      const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#000">
        <rect x="4" y="4" width="24" height="24"/>
      </svg>`

      // Act
      const result = transformSvg(rawSvg)

      // Assert
      expect(result.svgContent).toMatch(/viewBox="0 0 32 32"/)
    })
  })

  describe('Phase 3: React Component Generation', () => {
    it('should generate valid React component from icon metadata', () => {
      // Arrange
      const icon = createIconMetadata('arrow-right')
      const transformedSvg = transformSvg(icon.svgContent!)

      // Act
      const component = generateComponent(icon, transformedSvg.jsxContent)

      // Assert
      expect(component.componentName).toBe('IconArrowRight')
      expect(component.fileName).toBe('IconArrowRight.tsx')
      expect(component.content).toContain('forwardRef')
      expect(component.content).toContain('size = 24')
      expect(component.content).toContain("color = 'currentColor'")
      expect(component.content).toContain('className')
      expect(component.content).toContain('...props')
      expect(component.content).toContain('IconArrowRightProps')
    })

    it('should generate index file with all exports', () => {
      // Arrange
      const icons = [
        createIconMetadata('arrow-right'),
        createIconMetadata('check'),
        createIconMetadata('close-circle'),
      ]

      const components = icons.map((icon) => {
        const transformed = transformSvg(icon.svgContent!)
        return generateComponent(icon, transformed.jsxContent)
      })

      // Act
      const indexFile = generateIndexFile(components)

      // Assert
      expect(indexFile.componentNames).toHaveLength(3)
      expect(indexFile.content).toContain('IconArrowRight')
      expect(indexFile.content).toContain('IconCheck')
      expect(indexFile.content).toContain('IconCloseCircle')
      expect(indexFile.content).toContain('allIcons')
      expect(indexFile.content).toContain('IconName')
      expect(indexFile.content).toContain('type IconArrowRightProps')
    })

    it('should handle various naming formats correctly', () => {
      // Test different naming conventions
      const testCases = [
        { input: 'arrow-right', expected: 'ArrowRight' },
        { input: 'check_circle', expected: 'CheckCircle' },
        { input: 'close', expected: 'Close' },
        { input: 'arrow-up-right', expected: 'ArrowUpRight' },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(toPascalCase(input)).toBe(expected)
      })
    })
  })

  describe('Phase 4: Multi-Format Output Generation', () => {
    it('should generate SVG sprite with all icons', () => {
      // Arrange
      const icons = [
        createIconMetadata('arrow-right'),
        createIconMetadata('check'),
        createIconMetadata('close'),
      ]

      // Act
      const sprite = generateSprite(icons)

      // Assert
      expect(sprite.symbols).toHaveLength(3)
      expect(sprite.content).toContain('<svg')
      expect(sprite.content).toContain('</svg>')
      expect(sprite.content).toContain('symbol id="arrow-right"')
      expect(sprite.content).toContain('symbol id="check"')
      expect(sprite.content).toContain('symbol id="close"')
      expect(sprite.content).toContain('viewBox=')
    })

    it('should generate JSON metadata with all icon information', () => {
      // Arrange
      const icons = [
        createIconMetadata('arrow-right', 24),
        createIconMetadata('check', 24),
      ]

      // Act
      const metadata = generateJsonMetadata(icons, '1.0.0')

      // Assert
      expect(metadata.version).toBe('1.0.0')
      expect(metadata.totalCount).toBe(2)
      expect(metadata.icons).toHaveLength(2)
      expect(metadata.icons[0].name).toBe('IconArrowRight')
      expect(metadata.icons[0].svgPath).toContain('.svg')
      expect(metadata.icons[0].componentPath).toContain('.tsx')
      expect(metadata.icons[0].size.width).toBe(24)
      expect(metadata.icons[0].size.height).toBe(24)
    })
  })

  describe('Phase 5: Validation', () => {
    it('should validate icons against rules', () => {
      // Arrange: Valid icon
      const validIcon = createIconMetadata('arrow-right', 24)

      // Act
      const result = validateIcon(validIcon, defaultValidationRules)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid icon sizes', () => {
      // Arrange: Icon with invalid size
      const invalidIcon = createIconMetadata('arrow-right', 48) // 48 not in allowed sizes

      // Act
      const result = validateIcon(invalidIcon, defaultValidationRules)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.rule === 'size')).toBe(true)
    })

    it('should detect forbidden SVG elements', () => {
      // Arrange: Icon with forbidden element
      const iconWithForbidden: IconMetadata = {
        ...createIconMetadata('bad-icon', 24),
        svgContent: `<svg viewBox="0 0 24 24"><image href="test.png"/></svg>`,
      }

      // Act
      const result = validateIcon(iconWithForbidden, defaultValidationRules)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.rule === 'forbidden-elements')).toBe(
        true
      )
    })
  })

  describe('Phase 6: Changelog Generation', () => {
    it('should compute diff between manifests', () => {
      // Arrange
      const previousManifest: IconManifest = {
        version: '1.0.0',
        generatedAt: '2024-01-01T00:00:00Z',
        totalCount: 2,
        icons: [createIconMetadata('arrow-right'), createIconMetadata('check')],
      }

      const currentManifest: IconManifest = {
        version: '1.1.0',
        generatedAt: '2024-01-15T00:00:00Z',
        totalCount: 3,
        icons: [
          createIconMetadata('arrow-right'),
          createIconMetadata('close'), // Added
          { ...createIconMetadata('check'), svgContent: '<svg>modified</svg>' }, // Modified
        ],
      }

      // Act
      const diff = computeIconDiff(currentManifest, previousManifest)

      // Assert
      expect(diff.added).toHaveLength(1)
      expect(diff.added[0].normalizedName).toBe('IconClose')
      expect(diff.modified).toHaveLength(1)
      expect(diff.modified[0].normalizedName).toBe('IconCheck')
      expect(diff.removed).toHaveLength(0)
    })

    it('should generate changelog markdown', () => {
      // Arrange
      const previousManifest: IconManifest = {
        version: '1.0.0',
        generatedAt: '2024-01-01T00:00:00Z',
        totalCount: 1,
        icons: [createIconMetadata('arrow-right')],
      }

      const currentManifest: IconManifest = {
        version: '1.1.0',
        generatedAt: '2024-01-15T00:00:00Z',
        totalCount: 2,
        icons: [createIconMetadata('arrow-right'), createIconMetadata('check')],
      }

      // Act
      const changelog = generateChangelog(currentManifest, previousManifest, {
        version: '1.1.0',
        message: 'Added new check icon',
      })

      // Assert
      expect(changelog).toContain('## [1.1.0]')
      expect(changelog).toContain('Added new check icon')
      expect(changelog).toContain('### Added')
      expect(changelog).toContain('IconCheck')
    })
  })

  describe('Phase 7: Version Management', () => {
    it('should suggest minor bump for additions', () => {
      // Arrange
      const diff = {
        added: [createIconMetadata('new-icon')],
        modified: [],
        removed: [],
      }

      // Act
      const suggestion = suggestVersionBump(diff)

      // Assert
      expect(suggestion.bumpType).toBe('minor')
      expect(suggestion.reason).toContain('added')
    })

    it('should suggest major bump for removals', () => {
      // Arrange
      const diff = {
        added: [],
        modified: [],
        removed: [createIconMetadata('removed-icon')],
      }

      // Act
      const suggestion = suggestVersionBump(diff)

      // Assert
      expect(suggestion.bumpType).toBe('major')
      expect(suggestion.reason).toContain('removed')
    })

    it('should suggest patch bump for modifications only', () => {
      // Arrange
      const diff = {
        added: [],
        modified: [createIconMetadata('modified-icon')],
        removed: [],
      }

      // Act
      const suggestion = suggestVersionBump(diff)

      // Assert
      expect(suggestion.bumpType).toBe('patch')
      expect(suggestion.reason).toContain('modified')
    })
  })

  describe('Phase 8: Search/Filter Functionality', () => {
    it('should filter icons by search query', () => {
      // Arrange
      const icons = [
        { name: 'IconArrowRight', originalName: 'arrow-right' },
        { name: 'IconArrowLeft', originalName: 'arrow-left' },
        { name: 'IconCheck', originalName: 'check' },
        { name: 'IconClose', originalName: 'close' },
      ]

      // Act
      const filtered = filterIcons(icons, 'arrow')

      // Assert
      expect(filtered).toHaveLength(2)
      expect(filtered.map((i) => i.name)).toContain('IconArrowRight')
      expect(filtered.map((i) => i.name)).toContain('IconArrowLeft')
    })

    it('should be case-insensitive', () => {
      // Arrange
      const icons = [
        { name: 'IconArrowRight', originalName: 'arrow-right' },
        { name: 'IconCheck', originalName: 'check' },
      ]

      // Act
      const filtered = filterIcons(icons, 'ARROW')

      // Assert
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('IconArrowRight')
    })

    it('should return all icons for empty query', () => {
      // Arrange
      const icons = [
        { name: 'IconArrowRight', originalName: 'arrow-right' },
        { name: 'IconCheck', originalName: 'check' },
      ]

      // Act
      const filtered = filterIcons(icons, '')

      // Assert
      expect(filtered).toHaveLength(2)
    })
  })

  describe('Full Pipeline Integration', () => {
    it('should process icons through complete pipeline', async () => {
      // Step 1: Create mock Figma response
      const figmaResponse = createMockFigmaResponse([
        { name: 'arrow-right', width: 24, height: 24 },
        { name: 'check', width: 24, height: 24 },
        { name: 'close-circle', width: 24, height: 24 },
      ])

      // Step 2: Filter icon components
      const filterResult = filterIconComponents(figmaResponse)
      expect(filterResult.icons).toHaveLength(3)

      // Step 3: Create icon metadata with SVG content
      const iconsWithSvg: IconMetadata[] = filterResult.icons.map((icon) => ({
        id: icon.id,
        name: icon.name,
        originalName: icon.name,
        normalizedName: normalizeIconName(icon.name),
        width: icon.width,
        height: icon.height,
        svgContent: createMockSvg(icon.name, icon.width),
      }))

      // Step 4: Transform SVGs
      const transformedIcons = iconsWithSvg.map((icon) => ({
        metadata: icon,
        transformed: transformSvg(icon.svgContent!),
      }))

      // Verify transformations
      transformedIcons.forEach(({ transformed }) => {
        // Core optimization: fill should be currentColor
        expect(transformed.svgContent).toMatch(/fill="currentColor"/)
        // Size should be optimized
        expect(transformed.optimizedSize).toBeLessThanOrEqual(
          transformed.originalSize
        )
      })

      // Step 5: Generate React components
      const components = transformedIcons.map(({ metadata, transformed }) =>
        generateComponent(metadata, transformed.jsxContent)
      )

      expect(components).toHaveLength(3)
      components.forEach((comp) => {
        expect(comp.content).toContain('forwardRef')
        expect(comp.content).toContain('Props')
      })

      // Step 6: Generate index file
      const indexFile = generateIndexFile(components)
      expect(indexFile.componentNames).toHaveLength(3)
      expect(indexFile.content).toContain('allIcons')

      // Step 7: Generate manifest
      const manifest: IconManifest = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        totalCount: iconsWithSvg.length,
        icons: iconsWithSvg,
      }

      expect(manifest.totalCount).toBe(3)

      // Step 8: Generate sprite
      const sprite = generateSprite(iconsWithSvg)
      expect(sprite.symbols).toHaveLength(3)

      // Step 9: Generate JSON metadata
      const jsonMetadata = generateJsonMetadata(iconsWithSvg, '1.0.0')
      expect(jsonMetadata.icons).toHaveLength(3)

      // Step 10: Validate all icons
      const validationResults = iconsWithSvg.map((icon) =>
        validateIcon(icon, defaultValidationRules)
      )
      validationResults.forEach((result) => {
        expect(result.isValid).toBe(true)
      })

      // Step 11: Test search functionality
      const searchResults = filterIcons(
        iconsWithSvg.map((i) => ({
          name: i.normalizedName,
          originalName: i.originalName,
        })),
        'arrow'
      )
      expect(searchResults).toHaveLength(1)
    })

    it('should handle version updates correctly', () => {
      // Initial version
      const v1Manifest: IconManifest = {
        version: '1.0.0',
        generatedAt: '2024-01-01T00:00:00Z',
        totalCount: 2,
        icons: [createIconMetadata('arrow-right'), createIconMetadata('check')],
      }

      // Version with additions
      const v2Manifest: IconManifest = {
        version: '1.1.0',
        generatedAt: '2024-01-15T00:00:00Z',
        totalCount: 3,
        icons: [
          createIconMetadata('arrow-right'),
          createIconMetadata('check'),
          createIconMetadata('close'),
        ],
      }

      // Compute diff
      const diff = computeIconDiff(v2Manifest, v1Manifest)
      expect(diff.added).toHaveLength(1)
      expect(diff.removed).toHaveLength(0)

      // Suggest version
      const suggestion = suggestVersionBump(diff)
      expect(suggestion.bumpType).toBe('minor')

      // Generate changelog
      const changelog = generateChangelog(v2Manifest, v1Manifest, {
        version: '1.1.0',
        message: 'Added close icon',
      })
      expect(changelog).toContain('IconClose')
      expect(changelog).toContain('### Added')
    })
  })
})
