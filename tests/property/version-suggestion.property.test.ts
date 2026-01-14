/**
 * Property-Based Tests for Semantic Version Suggestion
 *
 * Feature: figma-icon-automation
 * Property 13: Semantic Version Suggestion
 *
 * Validates: Requirements 13.1, 13.2, 13.3, 13.4
 *
 * For any icon diff between versions:
 * - If only icons are added → suggest minor version bump
 * - If icons are removed or breaking changes exist → suggest major version bump
 * - If only icons are modified → suggest patch version bump
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  suggestVersionBump,
  incrementVersion,
  parseVersion,
  isValidVersion,
  compareVersions,
  suggestNewVersion,
} from '../../src/version-manager'
import type { IconDiff, IconMetadata, VersionBumpType } from '../../src/types'

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
 * Generates valid icon dimensions
 */
const validDimensionArbitrary = fc.constantFrom(16, 20, 24, 32)

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
  .array(iconMetadataArbitrary, { minLength: 0, maxLength: 10 })
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
 * Generates an IconDiff with only additions (no removals, no modifications)
 */
const additionsOnlyDiffArbitrary = fc
  .array(iconMetadataArbitrary, { minLength: 1, maxLength: 10 })
  .map((icons) => {
    const seenNames = new Set<string>()
    const uniqueIcons = icons.filter((icon) => {
      if (seenNames.has(icon.normalizedName)) return false
      seenNames.add(icon.normalizedName)
      return true
    })
    return {
      added: uniqueIcons,
      modified: [] as IconMetadata[],
      removed: [] as IconMetadata[],
    } as IconDiff
  })

/**
 * Generates an IconDiff with only modifications (no additions, no removals)
 */
const modificationsOnlyDiffArbitrary = fc
  .array(iconMetadataArbitrary, { minLength: 1, maxLength: 10 })
  .map((icons) => {
    const seenNames = new Set<string>()
    const uniqueIcons = icons.filter((icon) => {
      if (seenNames.has(icon.normalizedName)) return false
      seenNames.add(icon.normalizedName)
      return true
    })
    return {
      added: [] as IconMetadata[],
      modified: uniqueIcons,
      removed: [] as IconMetadata[],
    } as IconDiff
  })

/**
 * Generates an IconDiff with removals (may have other changes too)
 */
const removalsIncludedDiffArbitrary = fc
  .record({
    added: uniqueIconsArbitrary,
    modified: uniqueIconsArbitrary,
    removed: fc.array(iconMetadataArbitrary, { minLength: 1, maxLength: 5 }),
  })
  .map(({ added, modified, removed }) => {
    // Ensure removed icons are unique
    const seenNames = new Set<string>()
    const uniqueRemoved = removed.filter((icon) => {
      if (seenNames.has(icon.normalizedName)) return false
      seenNames.add(icon.normalizedName)
      return true
    })
    return {
      added,
      modified,
      removed: uniqueRemoved,
    } as IconDiff
  })

/**
 * Generates an empty IconDiff (no changes)
 */
const emptyDiffArbitrary = fc.constant({
  added: [] as IconMetadata[],
  modified: [] as IconMetadata[],
  removed: [] as IconMetadata[],
} as IconDiff)

/**
 * Generates an IconDiff with additions and modifications but no removals
 */
const additionsAndModificationsDiffArbitrary = fc
  .record({
    added: fc.array(iconMetadataArbitrary, { minLength: 1, maxLength: 5 }),
    modified: fc.array(iconMetadataArbitrary, { minLength: 1, maxLength: 5 }),
  })
  .map(({ added, modified }) => {
    const seenNames = new Set<string>()
    const uniqueAdded = added.filter((icon) => {
      if (seenNames.has(icon.normalizedName)) return false
      seenNames.add(icon.normalizedName)
      return true
    })
    const uniqueModified = modified.filter((icon) => {
      if (seenNames.has(icon.normalizedName)) return false
      seenNames.add(icon.normalizedName)
      return true
    })
    return {
      added: uniqueAdded,
      modified: uniqueModified,
      removed: [] as IconMetadata[],
    } as IconDiff
  })

describe('Property 13: Semantic Version Suggestion', () => {
  /**
   * Feature: figma-icon-automation, Property 13: Semantic Version Suggestion
   * Validates: Requirements 13.1, 13.2, 13.3, 13.4
   */

  describe('Major Version Bump - Icon Removals (Requirement 13.3)', () => {
    it('should suggest major bump when icons are removed', () => {
      fc.assert(
        fc.property(removalsIncludedDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)

          expect(suggestion.bumpType).toBe('major')
          expect(suggestion.reason).toContain('removed')
          expect(suggestion.reason).toContain('breaking change')
        }),
        { numRuns: 100 }
      )
    })

    it('should prioritize removals over additions for major bump', () => {
      fc.assert(
        fc.property(
          fc.record({
            added: fc.array(iconMetadataArbitrary, {
              minLength: 1,
              maxLength: 5,
            }),
            removed: fc.array(iconMetadataArbitrary, {
              minLength: 1,
              maxLength: 5,
            }),
          }),
          ({ added, removed }) => {
            const diff: IconDiff = {
              added,
              modified: [],
              removed,
            }

            const suggestion = suggestVersionBump(diff)

            // Even with additions, removals should trigger major bump
            expect(suggestion.bumpType).toBe('major')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should include removal count in reason', () => {
      fc.assert(
        fc.property(removalsIncludedDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)
          const count = diff.removed.length

          if (count === 1) {
            expect(suggestion.reason).toContain('1 icon removed')
          } else {
            expect(suggestion.reason).toContain(`${count} icons removed`)
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Minor Version Bump - Icon Additions (Requirement 13.2)', () => {
    it('should suggest minor bump when only icons are added', () => {
      fc.assert(
        fc.property(additionsOnlyDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)

          expect(suggestion.bumpType).toBe('minor')
          expect(suggestion.reason).toContain('added')
        }),
        { numRuns: 100 }
      )
    })

    it('should suggest minor bump when icons are added with modifications', () => {
      fc.assert(
        fc.property(additionsAndModificationsDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)

          expect(suggestion.bumpType).toBe('minor')
          expect(suggestion.reason).toContain('added')
        }),
        { numRuns: 100 }
      )
    })

    it('should include addition count in reason', () => {
      fc.assert(
        fc.property(additionsOnlyDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)
          const count = diff.added.length

          if (count === 1) {
            expect(suggestion.reason).toContain('1 icon added')
          } else {
            expect(suggestion.reason).toContain(`${count} icons added`)
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should mention modifications in reason when present with additions', () => {
      fc.assert(
        fc.property(additionsAndModificationsDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)

          if (diff.modified.length > 0) {
            expect(suggestion.reason).toContain('modified')
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Patch Version Bump - Icon Modifications (Requirement 13.4)', () => {
    it('should suggest patch bump when only icons are modified', () => {
      fc.assert(
        fc.property(modificationsOnlyDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)

          expect(suggestion.bumpType).toBe('patch')
          expect(suggestion.reason).toContain('modified')
        }),
        { numRuns: 100 }
      )
    })

    it('should include modification count in reason', () => {
      fc.assert(
        fc.property(modificationsOnlyDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)
          const count = diff.modified.length

          if (count === 1) {
            expect(suggestion.reason).toContain('1 icon modified')
          } else {
            expect(suggestion.reason).toContain(`${count} icons modified`)
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('No Changes - Default Patch (Requirement 13.1)', () => {
    it('should suggest patch bump when no changes detected', () => {
      fc.assert(
        fc.property(emptyDiffArbitrary, (diff) => {
          const suggestion = suggestVersionBump(diff)

          expect(suggestion.bumpType).toBe('patch')
          expect(suggestion.reason).toContain('No changes')
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Version Increment Correctness (Requirement 13.1)', () => {
    it('should correctly increment major version', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          const newVersion = incrementVersion(version, 'major')
          const oldParsed = parseVersion(version)
          const newParsed = parseVersion(newVersion)

          expect(newParsed.major).toBe(oldParsed.major + 1)
          expect(newParsed.minor).toBe(0)
          expect(newParsed.patch).toBe(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should correctly increment minor version', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          const newVersion = incrementVersion(version, 'minor')
          const oldParsed = parseVersion(version)
          const newParsed = parseVersion(newVersion)

          expect(newParsed.major).toBe(oldParsed.major)
          expect(newParsed.minor).toBe(oldParsed.minor + 1)
          expect(newParsed.patch).toBe(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should correctly increment patch version', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          const newVersion = incrementVersion(version, 'patch')
          const oldParsed = parseVersion(version)
          const newParsed = parseVersion(newVersion)

          expect(newParsed.major).toBe(oldParsed.major)
          expect(newParsed.minor).toBe(oldParsed.minor)
          expect(newParsed.patch).toBe(oldParsed.patch + 1)
        }),
        { numRuns: 100 }
      )
    })

    it('should produce valid semantic versions after increment', () => {
      fc.assert(
        fc.property(
          versionArbitrary,
          fc.constantFrom<VersionBumpType>('major', 'minor', 'patch'),
          (version, bumpType) => {
            const newVersion = incrementVersion(version, bumpType)

            expect(isValidVersion(newVersion)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should always produce a higher version after increment', () => {
      fc.assert(
        fc.property(
          versionArbitrary,
          fc.constantFrom<VersionBumpType>('major', 'minor', 'patch'),
          (version, bumpType) => {
            const newVersion = incrementVersion(version, bumpType)

            expect(compareVersions(newVersion, version)).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Version Parsing and Validation', () => {
    it('should parse valid semantic versions', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          const parsed = parseVersion(version)

          expect(parsed.major).toBeGreaterThanOrEqual(0)
          expect(parsed.minor).toBeGreaterThanOrEqual(0)
          expect(parsed.patch).toBeGreaterThanOrEqual(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should validate correct semantic versions', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          expect(isValidVersion(version)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should handle versions with v prefix', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          const vPrefixed = `v${version}`
          const parsed = parseVersion(vPrefixed)
          const originalParsed = parseVersion(version)

          expect(parsed.major).toBe(originalParsed.major)
          expect(parsed.minor).toBe(originalParsed.minor)
          expect(parsed.patch).toBe(originalParsed.patch)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Version Comparison', () => {
    it('should return 0 for identical versions', () => {
      fc.assert(
        fc.property(versionArbitrary, (version) => {
          expect(compareVersions(version, version)).toBe(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should correctly compare major versions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 98 }),
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 0, max: 99 }),
          (major, minor, patch) => {
            const lower = `${major}.${minor}.${patch}`
            const higher = `${major + 1}.${minor}.${patch}`

            expect(compareVersions(lower, higher)).toBe(-1)
            expect(compareVersions(higher, lower)).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly compare minor versions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 0, max: 98 }),
          fc.integer({ min: 0, max: 99 }),
          (major, minor, patch) => {
            const lower = `${major}.${minor}.${patch}`
            const higher = `${major}.${minor + 1}.${patch}`

            expect(compareVersions(lower, higher)).toBe(-1)
            expect(compareVersions(higher, lower)).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly compare patch versions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 0, max: 98 }),
          (major, minor, patch) => {
            const lower = `${major}.${minor}.${patch}`
            const higher = `${major}.${minor}.${patch + 1}`

            expect(compareVersions(lower, higher)).toBe(-1)
            expect(compareVersions(higher, lower)).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Suggest New Version Integration', () => {
    it('should combine suggestion and increment correctly', () => {
      fc.assert(
        fc.property(
          versionArbitrary,
          fc.oneof(
            additionsOnlyDiffArbitrary,
            modificationsOnlyDiffArbitrary,
            removalsIncludedDiffArbitrary,
            emptyDiffArbitrary
          ),
          (currentVersion, diff) => {
            const result = suggestNewVersion(currentVersion, diff)

            // Suggestion should match direct call
            const directSuggestion = suggestVersionBump(diff)
            expect(result.suggestion.bumpType).toBe(directSuggestion.bumpType)

            // Version should be incremented correctly
            const expectedVersion = incrementVersion(
              currentVersion,
              directSuggestion.bumpType
            )
            expect(result.version).toBe(expectedVersion)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should always produce a valid higher version', () => {
      fc.assert(
        fc.property(
          versionArbitrary,
          fc.oneof(
            additionsOnlyDiffArbitrary,
            modificationsOnlyDiffArbitrary,
            removalsIncludedDiffArbitrary,
            emptyDiffArbitrary
          ),
          (currentVersion, diff) => {
            const result = suggestNewVersion(currentVersion, diff)

            expect(isValidVersion(result.version)).toBe(true)
            expect(compareVersions(result.version, currentVersion)).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Bump Type Priority', () => {
    it('should follow priority: removals > additions > modifications', () => {
      fc.assert(
        fc.property(
          fc.record({
            added: fc.array(iconMetadataArbitrary, {
              minLength: 1,
              maxLength: 3,
            }),
            modified: fc.array(iconMetadataArbitrary, {
              minLength: 1,
              maxLength: 3,
            }),
            removed: fc.array(iconMetadataArbitrary, {
              minLength: 1,
              maxLength: 3,
            }),
          }),
          ({ added, modified, removed }) => {
            // All three types of changes
            const fullDiff: IconDiff = { added, modified, removed }
            expect(suggestVersionBump(fullDiff).bumpType).toBe('major')

            // Additions and modifications only
            const noRemovalsDiff: IconDiff = {
              added,
              modified,
              removed: [],
            }
            expect(suggestVersionBump(noRemovalsDiff).bumpType).toBe('minor')

            // Modifications only
            const modOnlyDiff: IconDiff = {
              added: [],
              modified,
              removed: [],
            }
            expect(suggestVersionBump(modOnlyDiff).bumpType).toBe('patch')
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
