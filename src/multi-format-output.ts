/**
 * Multi-Format Output Module
 *
 * Generates multiple output formats from icon metadata:
 * - SVG Sprite file with symbol elements
 * - JSON metadata file
 *
 * Requirements: 11.2, 11.3, 11.5
 */

import type {
  IconMetadata,
  IconManifest,
  SvgSprite,
  SpriteSymbol,
} from './types'
import { extractSvgInnerContent, extractViewBox } from './svg-transformer'

// ============================================
// SVG Sprite Generator (Requirement 11.2)
// ============================================

/**
 * Options for sprite generation
 */
export interface SpriteGeneratorOptions {
  /** Default viewBox if not found in SVG */
  defaultViewBox?: string
  /** Whether to include comments in output */
  includeComments?: boolean
}

/**
 * Default sprite generator options
 */
const DEFAULT_SPRITE_OPTIONS: SpriteGeneratorOptions = {
  defaultViewBox: '0 0 24 24',
  includeComments: false,
}

/**
 * Converts an icon name to a valid symbol ID
 * Uses lowercase kebab-case format
 *
 * @param name - Icon name (can be PascalCase, camelCase, etc.)
 * @returns Lowercase kebab-case ID
 */
export function toSymbolId(name: string): string {
  if (!name || name.trim().length === 0) {
    return 'icon'
  }

  // Remove "Icon" prefix if present
  let cleanName = name
  if (cleanName.startsWith('Icon') && cleanName.length > 4) {
    cleanName = cleanName.slice(4)
  }

  // Convert PascalCase/camelCase to kebab-case
  return cleanName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Creates a sprite symbol from icon metadata
 *
 * @param icon - Icon metadata with SVG content
 * @param options - Sprite generator options
 * @returns SpriteSymbol object or null if no SVG content
 */
export function createSpriteSymbol(
  icon: IconMetadata,
  options: SpriteGeneratorOptions = DEFAULT_SPRITE_OPTIONS,
): SpriteSymbol | null {
  if (!icon.svgContent) {
    return null
  }

  const id = toSymbolId(icon.normalizedName)
  const viewBox =
    extractViewBox(icon.svgContent) || options.defaultViewBox || '0 0 24 24'
  const content = extractSvgInnerContent(icon.svgContent)

  return {
    id,
    viewBox,
    content,
  }
}

/**
 * Generates an SVG sprite from a list of icons
 *
 * @param icons - Array of icon metadata with SVG content
 * @param options - Sprite generator options
 * @returns SvgSprite object with full sprite content and symbols
 *
 * Requirements: 11.2
 */
export function generateSprite(
  icons: IconMetadata[],
  options: Partial<SpriteGeneratorOptions> = {},
): SvgSprite {
  const opts = { ...DEFAULT_SPRITE_OPTIONS, ...options }

  // Create symbols from icons that have SVG content
  const symbols: SpriteSymbol[] = []
  for (const icon of icons) {
    const symbol = createSpriteSymbol(icon, opts)
    if (symbol) {
      symbols.push(symbol)
    }
  }

  // Sort symbols alphabetically by ID for consistent output
  symbols.sort((a, b) => a.id.localeCompare(b.id))

  // Generate sprite content
  const symbolsContent = symbols
    .map(
      (s) => `  <symbol id="${s.id}" viewBox="${s.viewBox}">
    ${s.content}
  </symbol>`,
    )
    .join('\n')

  const content = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
${symbolsContent}
</svg>`

  return {
    content,
    symbols,
  }
}

/**
 * Generates an SVG sprite from an IconManifest
 *
 * @param manifest - Icon manifest with icons
 * @param options - Sprite generator options
 * @returns SvgSprite object
 *
 * Requirements: 11.2
 */
export function generateSpriteFromManifest(
  manifest: IconManifest,
  options: Partial<SpriteGeneratorOptions> = {},
): SvgSprite {
  return generateSprite(manifest.icons, options)
}

// ============================================
// JSON Metadata Generator (Requirements 11.3, 11.5)
// ============================================

/**
 * Icon entry in the JSON metadata file
 */
export interface IconJsonEntry {
  /** Normalized icon name (PascalCase with Icon prefix) */
  name: string
  /** Original name from Figma */
  originalName: string
  /** Path to the SVG file */
  svgPath: string
  /** Path to the React component */
  componentPath: string
  /** Icon dimensions */
  size: {
    width: number
    height: number
  }
  /** Creation timestamp */
  createdAt?: string
}

/**
 * JSON metadata file structure
 */
export interface IconsJsonMetadata {
  /** Version of the icon library */
  version: string
  /** ISO timestamp when generated */
  generatedAt: string
  /** Total number of icons */
  totalCount: number
  /** Array of icon entries */
  icons: IconJsonEntry[]
}

/**
 * Options for JSON metadata generation
 */
export interface JsonMetadataOptions {
  /** Base path for SVG files */
  svgBasePath?: string
  /** Base path for component files */
  componentBasePath?: string
}

/**
 * Default JSON metadata options
 */
const DEFAULT_JSON_OPTIONS: JsonMetadataOptions = {
  svgBasePath: 'svg',
  componentBasePath: 'src/icons',
}

/**
 * Creates a JSON entry for an icon
 *
 * @param icon - Icon metadata
 * @param options - JSON metadata options
 * @returns IconJsonEntry object
 */
export function createIconJsonEntry(
  icon: IconMetadata,
  options: JsonMetadataOptions = DEFAULT_JSON_OPTIONS,
): IconJsonEntry {
  // Use originalName for SVG file (preserves Chinese characters)
  const svgFileName = icon.originalName + '.svg'
  const componentFileName = icon.normalizedName + '.tsx'

  return {
    name: icon.normalizedName,
    originalName: icon.originalName,
    svgPath: `${options.svgBasePath}/${svgFileName}`,
    componentPath: `${options.componentBasePath}/${componentFileName}`,
    size: {
      width: icon.width,
      height: icon.height,
    },
    createdAt: icon.createdAt,
  }
}

/**
 * Generates JSON metadata from a list of icons
 *
 * @param icons - Array of icon metadata
 * @param version - Version string
 * @param options - JSON metadata options
 * @returns IconsJsonMetadata object
 *
 * Requirements: 11.3, 11.5
 */
export function generateJsonMetadata(
  icons: IconMetadata[],
  version: string,
  options: Partial<JsonMetadataOptions> = {},
): IconsJsonMetadata {
  const opts = { ...DEFAULT_JSON_OPTIONS, ...options }

  const iconEntries = icons.map((icon) => createIconJsonEntry(icon, opts))

  // Sort entries alphabetically by name for consistent output
  // Removed internal sorting to respect the order passed from generate-outputs.ts (which sorts by date)
  // iconEntries.sort((a, b) => a.name.localeCompare(b.name))

  return {
    version,
    generatedAt: new Date().toISOString(),
    totalCount: iconEntries.length,
    icons: iconEntries,
  }
}

/**
 * Generates JSON metadata from an IconManifest
 *
 * @param manifest - Icon manifest
 * @param options - JSON metadata options
 * @returns IconsJsonMetadata object
 *
 * Requirements: 11.3, 11.5
 */
export function generateJsonMetadataFromManifest(
  manifest: IconManifest,
  options: Partial<JsonMetadataOptions> = {},
): IconsJsonMetadata {
  return generateJsonMetadata(manifest.icons, manifest.version, options)
}

/**
 * Serializes JSON metadata to a formatted string
 *
 * @param metadata - JSON metadata object
 * @param pretty - Whether to format with indentation
 * @returns JSON string
 */
export function serializeJsonMetadata(
  metadata: IconsJsonMetadata,
  pretty: boolean = true,
): string {
  return JSON.stringify(metadata, null, pretty ? 2 : undefined)
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Validates that a sprite has all expected symbols
 *
 * @param sprite - Generated sprite
 * @param expectedIconNames - Expected icon names
 * @returns Array of missing icon names
 */
export function validateSpriteCompleteness(
  sprite: SvgSprite,
  expectedIconNames: string[],
): string[] {
  const symbolIds = new Set(sprite.symbols.map((s) => s.id))
  const missing: string[] = []

  for (const name of expectedIconNames) {
    const expectedId = toSymbolId(name)
    if (!symbolIds.has(expectedId)) {
      missing.push(name)
    }
  }

  return missing
}

/**
 * Validates that JSON metadata has all expected icons
 *
 * @param metadata - Generated JSON metadata
 * @param expectedIconNames - Expected icon names
 * @returns Array of missing icon names
 */
export function validateJsonMetadataCompleteness(
  metadata: IconsJsonMetadata,
  expectedIconNames: string[],
): string[] {
  const metadataNames = new Set(metadata.icons.map((i) => i.name))
  const missing: string[] = []

  for (const name of expectedIconNames) {
    if (!metadataNames.has(name)) {
      missing.push(name)
    }
  }

  return missing
}
