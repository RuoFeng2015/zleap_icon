/**
 * Version Manager Module
 *
 * Provides semantic version suggestions based on icon changes.
 * Follows SemVer conventions:
 * - major: breaking changes (icon removals)
 * - minor: new features (icon additions)
 * - patch: bug fixes (icon modifications only)
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4
 */

import type { IconDiff, VersionBumpType, VersionSuggestion } from './types'

/**
 * Suggests a semantic version bump type based on icon changes
 *
 * Rules (per Requirements 13.1-13.4):
 * - If icons are removed → major (breaking change)
 * - If icons are added (with or without modifications) → minor (new feature)
 * - If only icons are modified → patch (bug fix)
 * - If no changes → patch (default)
 *
 * @param diff - The icon diff containing added, modified, and removed icons
 * @returns VersionSuggestion with bump type and reason
 *
 * Requirements: 13.1, 13.2, 13.3, 13.4
 */
export function suggestVersionBump(diff: IconDiff): VersionSuggestion {
  const hasRemovals = diff.removed.length > 0
  const hasAdditions = diff.added.length > 0
  const hasModifications = diff.modified.length > 0

  // Rule 1: Removals are breaking changes → major
  // Requirements: 13.3
  if (hasRemovals) {
    const removedCount = diff.removed.length
    const reason =
      removedCount === 1
        ? `1 icon removed (breaking change)`
        : `${removedCount} icons removed (breaking change)`
    return {
      bumpType: 'major',
      reason,
    }
  }

  // Rule 2: Additions are new features → minor
  // Requirements: 13.2
  if (hasAdditions) {
    const addedCount = diff.added.length
    const modifiedCount = diff.modified.length
    let reason = addedCount === 1 ? `1 icon added` : `${addedCount} icons added`
    if (modifiedCount > 0) {
      reason +=
        modifiedCount === 1
          ? `, 1 icon modified`
          : `, ${modifiedCount} icons modified`
    }
    return {
      bumpType: 'minor',
      reason,
    }
  }

  // Rule 3: Only modifications → patch
  // Requirements: 13.4
  if (hasModifications) {
    const modifiedCount = diff.modified.length
    const reason =
      modifiedCount === 1
        ? `1 icon modified`
        : `${modifiedCount} icons modified`
    return {
      bumpType: 'patch',
      reason,
    }
  }

  // No changes → default to patch
  return {
    bumpType: 'patch',
    reason: 'No changes detected',
  }
}

/**
 * Increments a semantic version string based on bump type
 *
 * @param currentVersion - Current version string (e.g., "1.2.3")
 * @param bumpType - Type of version bump
 * @returns New version string
 *
 * Requirements: 13.1
 */
export function incrementVersion(
  currentVersion: string,
  bumpType: VersionBumpType
): string {
  const parts = parseVersion(currentVersion)

  switch (bumpType) {
    case 'major':
      return `${parts.major + 1}.0.0`
    case 'minor':
      return `${parts.major}.${parts.minor + 1}.0`
    case 'patch':
      return `${parts.major}.${parts.minor}.${parts.patch + 1}`
  }
}

/**
 * Parsed semantic version components
 */
export interface ParsedVersion {
  major: number
  minor: number
  patch: number
}

/**
 * Parses a semantic version string into components
 *
 * @param version - Version string (e.g., "1.2.3")
 * @returns Parsed version components
 * @throws Error if version format is invalid
 */
export function parseVersion(version: string): ParsedVersion {
  // Remove 'v' prefix if present
  const cleanVersion = version.startsWith('v') ? version.slice(1) : version

  const match = cleanVersion.match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) {
    throw new Error(`Invalid version format: ${version}`)
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  }
}

/**
 * Validates a semantic version string
 *
 * @param version - Version string to validate
 * @returns True if valid semantic version
 */
export function isValidVersion(version: string): boolean {
  try {
    parseVersion(version)
    return true
  } catch {
    return false
  }
}

/**
 * Compares two semantic versions
 *
 * @param a - First version
 * @param b - Second version
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const parsedA = parseVersion(a)
  const parsedB = parseVersion(b)

  if (parsedA.major !== parsedB.major) {
    return parsedA.major < parsedB.major ? -1 : 1
  }
  if (parsedA.minor !== parsedB.minor) {
    return parsedA.minor < parsedB.minor ? -1 : 1
  }
  if (parsedA.patch !== parsedB.patch) {
    return parsedA.patch < parsedB.patch ? -1 : 1
  }
  return 0
}

/**
 * Suggests a new version based on current version and icon diff
 *
 * Convenience function that combines suggestVersionBump and incrementVersion.
 *
 * @param currentVersion - Current version string
 * @param diff - Icon diff
 * @returns Object with suggested version and reason
 */
export function suggestNewVersion(
  currentVersion: string,
  diff: IconDiff
): { version: string; suggestion: VersionSuggestion } {
  const suggestion = suggestVersionBump(diff)
  const version = incrementVersion(currentVersion, suggestion.bumpType)
  return { version, suggestion }
}
