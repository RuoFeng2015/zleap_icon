/**
 * Icon Manifest Generator Module
 *
 * Generates IconManifest containing all icon metadata.
 * The manifest serves as the source of truth for the icon library.
 *
 * Requirements: 2.6
 */

import type { IconMetadata, IconManifest } from './types'
import type { FilteredIconComponent } from './icon-filter'
import type { IconExportResult } from './svg-exporter'
import { toPascalCase } from './component-generator'

/**
 * Options for manifest generation
 */
export interface ManifestGeneratorOptions {
  /** Version string for the manifest */
  version: string
  /** Whether to include SVG content in the manifest */
  includeSvgContent?: boolean
}

/**
 * Default manifest generator options
 */
const DEFAULT_OPTIONS: ManifestGeneratorOptions = {
  version: '1.0.0',
  includeSvgContent: false,
}

/**
 * Normalizes an icon name to PascalCase format with Icon prefix
 *
 * @param name - Original icon name
 * @returns Normalized PascalCase name
 */
export function normalizeIconName(name: string): string {
  const pascalName = toPascalCase(name)
  if (!pascalName) {
    return 'Icon'
  }
  return `Icon${pascalName}`
}

/**
 * Creates IconMetadata from a FilteredIconComponent
 *
 * @param component - Filtered icon component from Figma
 * @param svgContent - Optional SVG content
 * @returns IconMetadata object
 */
export function createIconMetadata(
  component: FilteredIconComponent,
  svgContent?: string
): IconMetadata {
  return {
    id: component.id,
    name: component.name,
    originalName: component.name,
    normalizedName: normalizeIconName(component.name),
    width: component.width,
    height: component.height,
    svgContent,
  }
}

/**
 * Creates IconMetadata from an export result
 *
 * @param exportResult - Result from SVG export
 * @param component - Original filtered component
 * @returns IconMetadata object or null if export failed
 */
export function createIconMetadataFromExport(
  exportResult: IconExportResult,
  component: FilteredIconComponent
): IconMetadata | null {
  if (!exportResult.success) {
    return null
  }

  return {
    id: exportResult.id,
    name: exportResult.name,
    originalName: exportResult.name,
    normalizedName: normalizeIconName(exportResult.name),
    width: component.width,
    height: component.height,
    svgContent: exportResult.svgContent,
  }
}

/**
 * Generates an IconManifest from filtered icon components
 *
 * @param components - Array of filtered icon components
 * @param options - Manifest generation options
 * @returns IconManifest object
 */
export function generateManifest(
  components: FilteredIconComponent[],
  options: Partial<ManifestGeneratorOptions> = {}
): IconManifest {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const icons: IconMetadata[] = components.map((component) =>
    createIconMetadata(
      component,
      opts.includeSvgContent ? undefined : undefined
    )
  )

  return {
    version: opts.version,
    generatedAt: new Date().toISOString(),
    totalCount: icons.length,
    icons,
  }
}

/**
 * Generates an IconManifest from export results
 *
 * @param exportResults - Array of export results
 * @param components - Original filtered components (for dimension info)
 * @param options - Manifest generation options
 * @returns IconManifest object
 */
export function generateManifestFromExports(
  exportResults: IconExportResult[],
  components: FilteredIconComponent[],
  options: Partial<ManifestGeneratorOptions> = {}
): IconManifest {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Create a map of component ID to component for quick lookup
  const componentMap = new Map<string, FilteredIconComponent>()
  for (const component of components) {
    componentMap.set(component.id, component)
  }

  const icons: IconMetadata[] = []

  for (const result of exportResults) {
    if (result.success) {
      const component = componentMap.get(result.id)
      if (component) {
        icons.push({
          id: result.id,
          name: result.name,
          originalName: result.name,
          normalizedName: normalizeIconName(result.name),
          width: component.width,
          height: component.height,
          svgContent: opts.includeSvgContent ? result.svgContent : undefined,
        })
      }
    }
  }

  return {
    version: opts.version,
    generatedAt: new Date().toISOString(),
    totalCount: icons.length,
    icons,
  }
}

/**
 * Validates that a manifest has all required fields
 *
 * @param manifest - Manifest to validate
 * @returns True if manifest is valid
 */
export function isValidManifest(manifest: unknown): manifest is IconManifest {
  if (!manifest || typeof manifest !== 'object') {
    return false
  }

  const m = manifest as Record<string, unknown>

  if (typeof m.version !== 'string') {
    return false
  }

  if (typeof m.generatedAt !== 'string') {
    return false
  }

  if (typeof m.totalCount !== 'number') {
    return false
  }

  if (!Array.isArray(m.icons)) {
    return false
  }

  // Validate each icon has required fields
  for (const icon of m.icons) {
    if (!isValidIconMetadata(icon)) {
      return false
    }
  }

  return true
}

/**
 * Validates that an icon metadata object has all required fields
 *
 * @param icon - Icon metadata to validate
 * @returns True if icon metadata is valid
 */
export function isValidIconMetadata(icon: unknown): icon is IconMetadata {
  if (!icon || typeof icon !== 'object') {
    return false
  }

  const i = icon as Record<string, unknown>

  const requiredStringFields = ['id', 'name', 'originalName', 'normalizedName']
  for (const field of requiredStringFields) {
    if (typeof i[field] !== 'string' || i[field] === '') {
      return false
    }
  }

  const requiredNumberFields = ['width', 'height']
  for (const field of requiredNumberFields) {
    if (typeof i[field] !== 'number' || i[field] <= 0) {
      return false
    }
  }

  return true
}

/**
 * Merges two manifests, preferring icons from the newer manifest
 *
 * @param oldManifest - Previous manifest
 * @param newManifest - New manifest
 * @returns Merged manifest
 */
export function mergeManifests(
  oldManifest: IconManifest,
  newManifest: IconManifest
): IconManifest {
  // Create a map of old icons by normalized name
  const oldIconMap = new Map<string, IconMetadata>()
  for (const icon of oldManifest.icons) {
    oldIconMap.set(icon.normalizedName, icon)
  }

  // Create a map of new icons by normalized name
  const newIconMap = new Map<string, IconMetadata>()
  for (const icon of newManifest.icons) {
    newIconMap.set(icon.normalizedName, icon)
  }

  // Merge: new icons take precedence
  const mergedIcons: IconMetadata[] = []
  const seenNames = new Set<string>()

  // Add all new icons
  for (const icon of newManifest.icons) {
    mergedIcons.push(icon)
    seenNames.add(icon.normalizedName)
  }

  // Add old icons that aren't in the new manifest
  for (const icon of oldManifest.icons) {
    if (!seenNames.has(icon.normalizedName)) {
      mergedIcons.push(icon)
    }
  }

  return {
    version: newManifest.version,
    generatedAt: newManifest.generatedAt,
    totalCount: mergedIcons.length,
    icons: mergedIcons,
  }
}

/**
 * Serializes a manifest to JSON string
 *
 * @param manifest - Manifest to serialize
 * @param pretty - Whether to format with indentation
 * @returns JSON string
 */
export function serializeManifest(
  manifest: IconManifest,
  pretty: boolean = true
): string {
  return JSON.stringify(manifest, null, pretty ? 2 : undefined)
}

/**
 * Parses a manifest from JSON string
 *
 * @param json - JSON string to parse
 * @returns Parsed manifest or null if invalid
 */
export function parseManifest(json: string): IconManifest | null {
  try {
    const parsed = JSON.parse(json)
    if (isValidManifest(parsed)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

/**
 * Gets icon metadata by normalized name from a manifest
 *
 * @param manifest - Manifest to search
 * @param normalizedName - Normalized icon name to find
 * @returns IconMetadata or undefined if not found
 */
export function getIconByName(
  manifest: IconManifest,
  normalizedName: string
): IconMetadata | undefined {
  return manifest.icons.find((icon) => icon.normalizedName === normalizedName)
}

/**
 * Gets all icon names from a manifest
 *
 * @param manifest - Manifest to extract names from
 * @returns Array of normalized icon names
 */
export function getIconNames(manifest: IconManifest): string[] {
  return manifest.icons.map((icon) => icon.normalizedName)
}
