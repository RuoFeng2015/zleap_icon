/**
 * Property-Based Tests for Changelog Entry Format
 *
 * Feature: figma-icon-automation
 * Property 10: Changelog Entry Format
 *
 * Validates: Requirements 10.2, 10.3, 10.4, 10.5
 *
 * For any version release, the generated changelog entry SHALL:
 * - Be grouped under the correct version number
 * - Include the release date in ISO format
 * - Categorize changes into added/modified/removed sections
 * - Include the designer's update message
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  computeIconDiff,
  createChangelogEntry,
  generateChangelogMarkdown,
  generateChangelog,
  formatDate,
  parseChangelogEntry,
  hasIconChanged,
  hasChanges,
} from '../../src/changelog-generator'
import type { IconManifest, IconMetadata, IconDiff } from '../../src/types'

/**
 * Generates a valid semantic version string
 */
const versionArbitrary = fc
  .tuple(
    fc.integer({ min: 0, max: 99 }),
    fc.integer({ min: 0, max: 99 }),
    fc.integer({ min: 0, max: 99 })
  )
  .map(([major, minor, patch]) => `${major}.${minor}.${patch}`)

/**
 * Generates a valid icon name (lowercase with hyphens)
 */
const validIconNameArbitrary = fc.stringMatching(/^[a-z][a-z0-9-]{1,20}$/)

/**
 * Generates a valid normalized icon name (PascalCase with Icon prefix)
 */
const normalizedIconNameArbitrary = validIconNameArbitrary.map((name) => {
  const pascal = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return `Icon${pascal}`
})

/**
 * Generates valid icon dimensions
 */
const validDimensionArbitrary = fc.constantFrom(16, 20, 24, 32)

/**
 * Generates a valid update message
 */
const updateMessageArbitrary = fc.stringOf(
  fc.constantFrom(
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?-'
  ),
  { minLength: 1, maxLength: 100 }
)

/**
 * Generates a valid ISO date string
 */
const isoDateArbitrary = fc
  .date({
    min: new Date('2020-01-01'),
    max: new Date('2030-12-31'),
  })
  .map((d) => d.toISOString().split('T')[0])

/**
 * Generates an IconMetadata object
 */
const iconMetadataArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
    svgContent: fc.option(
      fc.constant('<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'),
      { nil: undefined }
    ),
  })
  .map(({ id, name, width, height, svgContent }) => ({
    id,
    name,
    originalName: name,
    normalizedName: `Icon${name
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')}`,
    width,
    height,
    svgContent,
  }))

/**
 * Generates a list of unique IconMetadata objects
 */
const uniqueIconsArbitrary = fc
  .array(iconMetadataArbitrary, { minLength: 0, maxLength: 15 })
  .map((icons) => {
    const seenNames = new Set<string>()
    return icons.filter((icon) => {
      if (seenNames.has(icon.normalizedName)) {
        return false
      }
      seenNames.add(icon.normalizedName)
      return true
    })
  })

/**
 * Generates an IconManifest
 */
const iconManifestArbitrary = fc
  .record({
    version: versionArbitrary,
    icons: uniqueIconsArbitrary,
  })
  .map(({ version, icons }) => ({
    version,
    generatedAt: new Date().toISOString(),
    totalCount: icons.length,
    icons,
  }))

/**
 * Generates two manifests with guaranteed differences
 */
const manifestPairWithDiffArbitrary = fc
  .record({
    baseIcons: uniqueIconsArbitrary,
    addedIcons: uniqueIconsArbitrary,
    removedCount: fc.integer({ min: 0, max: 3 }),
    modifyCount: fc.integer({ min: 0, max: 3 }),
    oldVersion: versionArbitrary,
    newVersion: versionArbitrary,
  })
  .map(
    ({
      baseIcons,
      addedIcons,
      removedCount,
      modifyCount,
      oldVersion,
      newVersion,
    }) => {
      // Ensure unique names across base and added
      const usedNames = new Set(baseIcons.map((i) => i.normalizedName))
      const uniqueAdded = addedIcons.filter((i) => {
        if (usedNames.has(i.normalizedName)) return false
        usedNames.add(i.normalizedName)
        return true
      })

      // Create previous manifest with base icons
      const previousIcons = [...baseIcons]

      // Create current manifest: remove some, modify some, add new ones
      const toRemove = Math.min(removedCount, baseIcons.length)
      const toModify = Math.min(
        modifyCount,
        Math.max(0, baseIcons.length - toRemove)
      )

      const currentIcons: IconMetadata[] = []

      // Add icons that weren't removed, potentially modified
      for (let i = toRemove; i < baseIcons.length; i++) {
        if (i < toRemove + toModify) {
          // Modify this icon by changing its SVG content
          currentIcons.push({
            ...baseIcons[i],
            svgContent: '<svg viewBox="0 0 24 24"><path d="M1 1"/></svg>',
          })
        } else {
          currentIcons.push(baseIcons[i])
        }
      }

      // Add new icons
      currentIcons.push(...uniqueAdded)

      const previousManifest: IconManifest = {
        version: oldVersion,
        generatedAt: new Date().toISOString(),
        totalCount: previousIcons.length,
        icons: previousIcons,
      }

      const currentManifest: IconManifest = {
        version: newVersion,
        generatedAt: new Date().toISOString(),
        totalCount: currentIcons.length,
        icons: currentIcons,
      }

      return { previousManifest, currentManifest }
    }
  )

describe('Property 10: Changelog Entry Format', () => {
  /**
   * Feature: figma-icon-automation, Property 10: Changelog Entry Format
   * Validates: Requirements 10.2, 10.3, 10.4, 10.5
   */

  describe('Version Number Grouping (Requirement 10.2)', () => {
    it('should include the correct version number in the header', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            // Version should appear in the header format: ## [X.Y.Z]
            expect(markdown).toContain(`## [${version}]`)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should group changes under the version header', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            // Version header should come before any section headers
            const versionIndex = markdown.indexOf(`## [${version}]`)
            const addedIndex = markdown.indexOf('### Added')
            const modifiedIndex = markdown.indexOf('### Modified')
            const removedIndex = markdown.indexOf('### Removed')

            expect(versionIndex).toBeLessThan(addedIndex)
            expect(versionIndex).toBeLessThan(modifiedIndex)
            expect(versionIndex).toBeLessThan(removedIndex)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('ISO Date Format (Requirement 10.4)', () => {
    it('should include the release date in ISO format (YYYY-MM-DD)', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          isoDateArbitrary,
          ({ previousManifest, currentManifest }, version, message, date) => {
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message, date }
            )

            // Date should appear in the header: ## [X.Y.Z] - YYYY-MM-DD
            expect(markdown).toContain(`## [${version}] - ${date}`)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should format dates correctly', () => {
      fc.assert(
        fc.property(
          fc.date({
            min: new Date('2020-01-01'),
            max: new Date('2030-12-31'),
          }),
          (date) => {
            const formatted = formatDate(date)

            // Should match YYYY-MM-DD format
            expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/)

            // Should be a valid date
            const parsed = new Date(formatted)
            expect(isNaN(parsed.getTime())).toBe(false)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Change Categorization (Requirement 10.3)', () => {
    it('should categorize changes into added/modified/removed sections', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            // All three sections should be present
            expect(markdown).toContain('### Added')
            expect(markdown).toContain('### Modified')
            expect(markdown).toContain('### Removed')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly identify added icons', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          ({ previousManifest, currentManifest }) => {
            const diff = computeIconDiff(currentManifest, previousManifest)

            // Added icons should be in current but not in previous
            const previousNames = new Set(
              previousManifest.icons.map((i) => i.normalizedName)
            )

            for (const icon of diff.added) {
              expect(previousNames.has(icon.normalizedName)).toBe(false)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly identify removed icons', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          ({ previousManifest, currentManifest }) => {
            const diff = computeIconDiff(currentManifest, previousManifest)

            // Removed icons should be in previous but not in current
            const currentNames = new Set(
              currentManifest.icons.map((i) => i.normalizedName)
            )

            for (const icon of diff.removed) {
              expect(currentNames.has(icon.normalizedName)).toBe(false)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly identify modified icons', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          ({ previousManifest, currentManifest }) => {
            const diff = computeIconDiff(currentManifest, previousManifest)

            // Modified icons should exist in both manifests
            const previousNames = new Set(
              previousManifest.icons.map((i) => i.normalizedName)
            )
            const currentNames = new Set(
              currentManifest.icons.map((i) => i.normalizedName)
            )

            for (const icon of diff.modified) {
              expect(previousNames.has(icon.normalizedName)).toBe(true)
              expect(currentNames.has(icon.normalizedName)).toBe(true)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should list added icons in the Added section', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const diff = computeIconDiff(currentManifest, previousManifest)
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            // Each added icon should appear in the markdown
            for (const icon of diff.added) {
              expect(markdown).toContain(`- ${icon.normalizedName}`)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should list removed icons in the Removed section', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const diff = computeIconDiff(currentManifest, previousManifest)
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            // Each removed icon should appear in the markdown
            for (const icon of diff.removed) {
              expect(markdown).toContain(`- ${icon.normalizedName}`)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Update Message Inclusion (Requirement 10.5)', () => {
    it('should include the designer update message', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            // Message should appear in the changelog
            expect(markdown).toContain(message)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should place message after version header and before sections', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          ({ previousManifest, currentManifest }, version, message) => {
            const markdown = generateChangelog(
              currentManifest,
              previousManifest,
              { version, message }
            )

            const versionIndex = markdown.indexOf(`## [${version}]`)
            const messageIndex = markdown.indexOf(message)
            const addedIndex = markdown.indexOf('### Added')

            // Message should be between version header and first section
            expect(messageIndex).toBeGreaterThan(versionIndex)
            expect(messageIndex).toBeLessThan(addedIndex)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Changelog Entry Creation', () => {
    it('should create valid changelog entries from diffs', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          isoDateArbitrary,
          ({ previousManifest, currentManifest }, version, message, date) => {
            const diff = computeIconDiff(currentManifest, previousManifest)
            const entry = createChangelogEntry(diff, { version, message, date })

            // Entry should have correct version
            expect(entry.version).toBe(version)

            // Entry should have correct date
            expect(entry.date).toBe(date)

            // Entry should have correct message
            expect(entry.message).toBe(message)

            // Entry changes should match diff
            expect(entry.changes.added.length).toBe(diff.added.length)
            expect(entry.changes.modified.length).toBe(diff.modified.length)
            expect(entry.changes.removed.length).toBe(diff.removed.length)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Diff Computation Correctness', () => {
    it('should produce empty diff for identical manifests', () => {
      fc.assert(
        fc.property(iconManifestArbitrary, (manifest) => {
          const diff = computeIconDiff(manifest, manifest)

          expect(diff.added).toHaveLength(0)
          expect(diff.modified).toHaveLength(0)
          expect(diff.removed).toHaveLength(0)
          expect(hasChanges(diff)).toBe(false)
        }),
        { numRuns: 100 }
      )
    })

    it('should detect all icons as added when previous is empty', () => {
      fc.assert(
        fc.property(iconManifestArbitrary, (manifest) => {
          const emptyManifest: IconManifest = {
            version: '0.0.0',
            generatedAt: new Date().toISOString(),
            totalCount: 0,
            icons: [],
          }

          const diff = computeIconDiff(manifest, emptyManifest)

          expect(diff.added.length).toBe(manifest.icons.length)
          expect(diff.modified).toHaveLength(0)
          expect(diff.removed).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should detect all icons as removed when current is empty', () => {
      fc.assert(
        fc.property(iconManifestArbitrary, (manifest) => {
          const emptyManifest: IconManifest = {
            version: '0.0.0',
            generatedAt: new Date().toISOString(),
            totalCount: 0,
            icons: [],
          }

          const diff = computeIconDiff(emptyManifest, manifest)

          expect(diff.added).toHaveLength(0)
          expect(diff.modified).toHaveLength(0)
          expect(diff.removed.length).toBe(manifest.icons.length)
        }),
        { numRuns: 100 }
      )
    })

    it('should have no overlap between added, modified, and removed', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          ({ previousManifest, currentManifest }) => {
            const diff = computeIconDiff(currentManifest, previousManifest)

            const addedNames = new Set(diff.added.map((i) => i.normalizedName))
            const modifiedNames = new Set(
              diff.modified.map((i) => i.normalizedName)
            )
            const removedNames = new Set(
              diff.removed.map((i) => i.normalizedName)
            )

            // No overlap between categories
            for (const name of addedNames) {
              expect(modifiedNames.has(name)).toBe(false)
              expect(removedNames.has(name)).toBe(false)
            }

            for (const name of modifiedNames) {
              expect(addedNames.has(name)).toBe(false)
              expect(removedNames.has(name)).toBe(false)
            }

            for (const name of removedNames) {
              expect(addedNames.has(name)).toBe(false)
              expect(modifiedNames.has(name)).toBe(false)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Markdown Round-Trip', () => {
    it('should parse generated markdown back to equivalent entry', () => {
      fc.assert(
        fc.property(
          manifestPairWithDiffArbitrary,
          versionArbitrary,
          updateMessageArbitrary,
          isoDateArbitrary,
          ({ previousManifest, currentManifest }, version, message, date) => {
            const diff = computeIconDiff(currentManifest, previousManifest)
            const entry = createChangelogEntry(diff, { version, message, date })
            const markdown = generateChangelogMarkdown(entry)
            const parsed = parseChangelogEntry(markdown)

            expect(parsed).not.toBeNull()
            expect(parsed!.version).toBe(version)
            expect(parsed!.date).toBe(date)

            // Changes should match
            expect(parsed!.changes.added.length).toBe(
              entry.changes.added.length
            )
            expect(parsed!.changes.modified.length).toBe(
              entry.changes.modified.length
            )
            expect(parsed!.changes.removed.length).toBe(
              entry.changes.removed.length
            )

            // Icon names should match
            expect(new Set(parsed!.changes.added)).toEqual(
              new Set(entry.changes.added)
            )
            expect(new Set(parsed!.changes.modified)).toEqual(
              new Set(entry.changes.modified)
            )
            expect(new Set(parsed!.changes.removed)).toEqual(
              new Set(entry.changes.removed)
            )
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Icon Change Detection', () => {
    it('should detect changes when SVG content differs', () => {
      fc.assert(
        fc.property(iconMetadataArbitrary, (icon) => {
          const current = {
            ...icon,
            svgContent: '<svg><path d="M0 0"/></svg>',
          }
          const previous = {
            ...icon,
            svgContent: '<svg><path d="M1 1"/></svg>',
          }

          expect(hasIconChanged(current, previous)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should not detect changes when SVG content is identical', () => {
      fc.assert(
        fc.property(iconMetadataArbitrary, (icon) => {
          const svgContent = '<svg><path d="M0 0"/></svg>'
          const current = { ...icon, svgContent }
          const previous = { ...icon, svgContent }

          expect(hasIconChanged(current, previous)).toBe(false)
        }),
        { numRuns: 100 }
      )
    })

    it('should detect changes when dimensions differ', () => {
      fc.assert(
        fc.property(
          iconMetadataArbitrary,
          fc.constantFrom(16, 20, 24, 32),
          (icon, newWidth) => {
            // Only test when dimensions actually differ
            if (newWidth === icon.width) return true

            const current = {
              ...icon,
              width: newWidth,
              svgContent: undefined,
            }
            const previous = {
              ...icon,
              svgContent: undefined,
            }

            return hasIconChanged(current, previous) === true
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
