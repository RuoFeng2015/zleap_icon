/**
 * Changelog Generator Module
 *
 * Generates changelog entries by comparing icon manifests and
 * producing Markdown-formatted version history.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import type {
  IconManifest,
  IconMetadata,
  IconDiff,
  ChangelogEntry,
  VersionChanges,
} from './types'

/**
 * Computes the diff between two icon manifests
 *
 * Identifies icons that were added, modified, or removed between versions.
 * Modification is detected by comparing SVG content when available,
 * or by comparing dimensions if SVG content is not present.
 *
 * @param currentManifest - The new/current manifest
 * @param previousManifest - The old/previous manifest
 * @returns IconDiff containing added, modified, and removed icons
 *
 * Requirements: 10.3
 */
export function computeIconDiff(
  currentManifest: IconManifest,
  previousManifest: IconManifest
): IconDiff {
  // Create maps for efficient lookup by normalized name
  const currentIconMap = new Map<string, IconMetadata>()
  for (const icon of currentManifest.icons) {
    currentIconMap.set(icon.normalizedName, icon)
  }

  const previousIconMap = new Map<string, IconMetadata>()
  for (const icon of previousManifest.icons) {
    previousIconMap.set(icon.normalizedName, icon)
  }

  const added: IconMetadata[] = []
  const modified: IconMetadata[] = []
  const removed: IconMetadata[] = []

  // Find added and modified icons
  for (const icon of currentManifest.icons) {
    const previousIcon = previousIconMap.get(icon.normalizedName)
    if (!previousIcon) {
      // Icon exists in current but not in previous -> added
      added.push(icon)
    } else if (hasIconChanged(icon, previousIcon)) {
      // Icon exists in both but has changed -> modified
      modified.push(icon)
    }
  }

  // Find removed icons
  for (const icon of previousManifest.icons) {
    if (!currentIconMap.has(icon.normalizedName)) {
      // Icon exists in previous but not in current -> removed
      removed.push(icon)
    }
  }

  return { added, modified, removed }
}

/**
 * Determines if an icon has changed between versions
 *
 * @param current - Current version of the icon
 * @param previous - Previous version of the icon
 * @returns True if the icon has changed
 */
export function hasIconChanged(
  current: IconMetadata,
  previous: IconMetadata
): boolean {
  // If SVG content is available, compare it
  if (current.svgContent !== undefined && previous.svgContent !== undefined) {
    return current.svgContent !== previous.svgContent
  }

  // Fall back to comparing dimensions
  if (current.width !== previous.width || current.height !== previous.height) {
    return true
  }

  return false
}

/**
 * Checks if a diff has any changes
 *
 * @param diff - The icon diff to check
 * @returns True if there are any changes
 */
export function hasChanges(diff: IconDiff): boolean {
  return (
    diff.added.length > 0 || diff.modified.length > 0 || diff.removed.length > 0
  )
}

/**
 * Options for changelog generation
 */
export interface ChangelogOptions {
  /** Version number for the release */
  version: string
  /** Update message from the designer */
  message: string
  /** Optional date override (defaults to current date) */
  date?: string
}

/**
 * Formats a date to ISO format (YYYY-MM-DD)
 *
 * @param date - Date to format (defaults to current date)
 * @returns ISO formatted date string
 */
export function formatDate(date?: Date | string): string {
  if (typeof date === 'string') {
    // If already a string, try to parse and reformat
    const parsed = new Date(date)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }
    return date
  }
  const d = date || new Date()
  return d.toISOString().split('T')[0]
}

/**
 * Creates a ChangelogEntry from a diff and options
 *
 * @param diff - The icon diff
 * @param options - Changelog generation options
 * @returns ChangelogEntry object
 *
 * Requirements: 10.2, 10.4, 10.5
 */
export function createChangelogEntry(
  diff: IconDiff,
  options: ChangelogOptions
): ChangelogEntry {
  const changes: VersionChanges = {
    added: diff.added.map((icon) => icon.normalizedName),
    modified: diff.modified.map((icon) => icon.normalizedName),
    removed: diff.removed.map((icon) => icon.normalizedName),
  }

  return {
    version: options.version,
    date: formatDate(options.date),
    message: options.message,
    changes,
  }
}

/**
 * Generates a Markdown-formatted changelog entry
 *
 * @param entry - The changelog entry to format
 * @returns Markdown string
 *
 * Requirements: 10.1, 10.2, 10.4, 10.5
 */
export function generateChangelogMarkdown(entry: ChangelogEntry): string {
  const lines: string[] = []

  // Version header with date
  lines.push(`## [${entry.version}] - ${entry.date}`)
  lines.push('')

  // Designer's update message
  if (entry.message) {
    lines.push(entry.message)
    lines.push('')
  }

  // Added section
  lines.push('### Added')
  if (entry.changes.added.length > 0) {
    for (const name of entry.changes.added) {
      lines.push(`- ${name}`)
    }
  } else {
    lines.push('- None')
  }
  lines.push('')

  // Modified section
  lines.push('### Modified')
  if (entry.changes.modified.length > 0) {
    for (const name of entry.changes.modified) {
      lines.push(`- ${name}`)
    }
  } else {
    lines.push('- None')
  }
  lines.push('')

  // Removed section
  lines.push('### Removed')
  if (entry.changes.removed.length > 0) {
    for (const name of entry.changes.removed) {
      lines.push(`- ${name}`)
    }
  } else {
    lines.push('- None')
  }
  lines.push('')

  return lines.join('\n')
}

/**
 * Generates a complete changelog entry from two manifests
 *
 * This is a convenience function that combines diff computation
 * and markdown generation.
 *
 * @param currentManifest - The new/current manifest
 * @param previousManifest - The old/previous manifest
 * @param options - Changelog generation options
 * @returns Markdown-formatted changelog entry
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */
export function generateChangelog(
  currentManifest: IconManifest,
  previousManifest: IconManifest,
  options: ChangelogOptions
): string {
  const diff = computeIconDiff(currentManifest, previousManifest)
  const entry = createChangelogEntry(diff, options)
  return generateChangelogMarkdown(entry)
}

/**
 * Prepends a new changelog entry to an existing changelog file content
 *
 * @param existingContent - Existing CHANGELOG.md content
 * @param newEntry - New changelog entry markdown
 * @returns Updated changelog content
 */
export function prependToChangelog(
  existingContent: string,
  newEntry: string
): string {
  // Find the first version header to insert before
  const versionHeaderRegex = /^## \[/m
  const match = existingContent.match(versionHeaderRegex)

  if (match && match.index !== undefined) {
    // Insert new entry before the first version header
    const before = existingContent.slice(0, match.index)
    const after = existingContent.slice(match.index)
    return before + newEntry + after
  }

  // If no existing version headers, append to the end
  return existingContent + '\n' + newEntry
}

/**
 * Creates an initial CHANGELOG.md content with header
 *
 * @param projectName - Name of the project
 * @returns Initial changelog content
 */
export function createInitialChangelog(
  projectName: string = 'Icon Library'
): string {
  return `# Changelog

All notable changes to ${projectName} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`
}

/**
 * Parses a changelog entry from markdown
 *
 * @param markdown - Markdown content of a single entry
 * @returns Parsed ChangelogEntry or null if parsing fails
 */
export function parseChangelogEntry(markdown: string): ChangelogEntry | null {
  // Match version header: ## [1.0.0] - 2024-01-15
  const headerMatch = markdown.match(/^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})/m)
  if (!headerMatch) {
    return null
  }

  const version = headerMatch[1]
  const date = headerMatch[2]

  // Extract message (text between header and first ### section)
  const headerEnd = markdown.indexOf('\n', headerMatch.index || 0)
  const firstSection = markdown.indexOf('###')
  let message = ''
  if (headerEnd !== -1 && firstSection !== -1 && firstSection > headerEnd) {
    message = markdown.slice(headerEnd, firstSection).trim()
  }

  // Parse sections
  const added = parseChangeSection(markdown, 'Added')
  const modified = parseChangeSection(markdown, 'Modified')
  const removed = parseChangeSection(markdown, 'Removed')

  return {
    version,
    date,
    message,
    changes: { added, modified, removed },
  }
}

/**
 * Parses a change section from markdown
 *
 * @param markdown - Full markdown content
 * @param sectionName - Name of the section (Added, Modified, Removed)
 * @returns Array of icon names in the section
 */
function parseChangeSection(markdown: string, sectionName: string): string[] {
  const sectionRegex = new RegExp(`### ${sectionName}\\n([\\s\\S]*?)(?=###|$)`)
  const match = markdown.match(sectionRegex)
  if (!match) {
    return []
  }

  const content = match[1]
  const items: string[] = []

  // Match list items: - IconName
  const itemRegex = /^- (.+)$/gm
  let itemMatch
  while ((itemMatch = itemRegex.exec(content)) !== null) {
    const item = itemMatch[1].trim()
    if (item !== 'None') {
      items.push(item)
    }
  }

  return items
}
