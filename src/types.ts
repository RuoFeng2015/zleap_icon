import type { SVGProps } from 'react'

// ============================================
// Icon Metadata Types
// ============================================

/**
 * Metadata for a single icon
 */
export interface IconMetadata {
  /** Unique identifier from Figma */
  id: string
  /** Original name in Figma */
  name: string
  /** Original name as it appears in Figma */
  originalName: string
  /** PascalCase normalized name for component */
  normalizedName: string
  /** Icon width in pixels */
  width: number
  /** Icon height in pixels */
  height: number
  /** SVG content string */
  svgContent?: string
}

/**
 * Manifest containing all icons and metadata
 */
export interface IconManifest {
  /** Semantic version of the icon library */
  version: string
  /** ISO timestamp when manifest was generated */
  generatedAt: string
  /** Total number of icons */
  totalCount: number
  /** Array of icon metadata */
  icons: IconMetadata[]
}

// ============================================
// Validation Types
// ============================================

/**
 * Validation rules configuration
 */
export interface ValidationRules {
  /** Allowed icon sizes in pixels */
  allowedSizes: number[]
  /** Regex pattern for valid icon names */
  namingPattern: RegExp
  /** Maximum SVG file size in bytes */
  maxFileSize: number
  /** Required SVG attributes */
  requiredAttributes: string[]
  /** SVG elements that are not allowed */
  forbiddenElements: string[]
}

/**
 * Single validation error or warning
 */
export interface ValidationError {
  /** Name of the icon with the issue */
  iconName: string
  /** Rule that was violated */
  rule: string
  /** Human-readable error message */
  message: string
  /** Severity level */
  severity: 'error' | 'warning'
}

/**
 * Alias for ValidationError when used as warning
 */
export type ValidationWarning = ValidationError

/**
 * Result of validating an icon
 */
export interface ValidationResult {
  /** Whether the icon passed all validations */
  isValid: boolean
  /** List of validation errors */
  errors: ValidationError[]
  /** List of validation warnings */
  warnings: ValidationWarning[]
}

// ============================================
// Figma Plugin Types
// ============================================

/**
 * Plugin configuration stored in Figma client storage
 */
export interface PluginConfig {
  /** GitHub repository in format "org/repo" */
  githubRepo: string
  /** GitHub Personal Access Token */
  githubToken: string
  /** Figma file key (auto-detected) */
  figmaFileKey: string
  /** Default branch name */
  defaultBranch: string
}

/**
 * Sync request payload sent to GitHub Actions
 */
export interface SyncRequest {
  /** Semantic version for the release */
  version: string
  /** Update description/message */
  message: string
  /** Figma file key */
  fileKey: string
  /** ISO timestamp of the request */
  timestamp: string
}

/**
 * Result of a sync operation
 */
export interface SyncResult {
  /** Whether the sync was successful */
  success: boolean
  /** URL to the created PR (if successful) */
  prUrl?: string
  /** Error message (if failed) */
  error?: string
}

/**
 * Plugin UI state
 */
export interface PluginUIState {
  /** Current plugin configuration */
  config: PluginConfig | null
  /** Whether plugin is configured */
  isConfigured: boolean
  /** Whether sync is in progress */
  isSyncing: boolean
  /** Result of last sync operation */
  lastSyncResult: SyncResult | null
}

// ============================================
// Figma API Types
// ============================================

/**
 * Figma component from API response
 */
export interface FigmaComponent {
  /** Component ID */
  id: string
  /** Component name */
  name: string
  /** Node type (COMPONENT or FRAME for imported SVGs) */
  type: 'COMPONENT' | 'FRAME' | string
  /** Bounding box dimensions */
  absoluteBoundingBox: {
    width: number
    height: number
  }
}

/**
 * Figma node (generic)
 */
export interface FigmaNode {
  /** Node ID */
  id: string
  /** Node name */
  name: string
  /** Node type */
  type: string
  /** Child nodes */
  children?: FigmaNode[]
  /** Bounding box dimensions (available on most visible nodes) */
  absoluteBoundingBox?: {
    x?: number
    y?: number
    width: number
    height: number
  }
}

/**
 * Figma file API response
 */
export interface FigmaFileResponse {
  /** Document structure */
  document: FigmaNode
  /** Components in the file */
  components: Record<string, FigmaComponent>
}

// ============================================
// SVG Transform Types
// ============================================

/**
 * SVGO plugin configuration
 */
export interface SvgoPlugin {
  name: string
  params?: Record<string, unknown>
}

/**
 * SVGO configuration
 */
export interface SvgoConfig {
  plugins: (string | SvgoPlugin)[]
}

/**
 * SVG transformation options
 */
export interface TransformOptions {
  /** Replace colors with currentColor */
  replaceColors: boolean
  /** Remove width/height attributes */
  removeSize: boolean
  /** Remove fill attributes */
  removeFill: boolean
  /** Ensure viewBox is present */
  addViewBox: boolean
}

/**
 * Result of SVG transformation
 */
export interface TransformResult {
  /** Original SVG size in bytes */
  originalSize: number
  /** Optimized SVG size in bytes */
  optimizedSize: number
  /** Optimized SVG string */
  svgContent: string
  /** JSX-compatible SVG string */
  jsxContent: string
}

// ============================================
// Component Generator Types
// ============================================

/**
 * Icon component props interface
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string
  /** Icon color */
  color?: string
}

/**
 * Generated component template
 */
export interface ComponentTemplate {
  /** Component name (e.g., "IconArrowRight") */
  componentName: string
  /** File name (e.g., "IconArrowRight.tsx") */
  fileName: string
  /** Full component code */
  content: string
  /** Type definitions */
  types: string
}

/**
 * Component generator configuration
 */
export interface GeneratorConfig {
  /** Output directory for components */
  outputDir: string
  /** Prefix for icon components */
  iconPrefix: string
  /** Whether to generate TypeScript */
  typescript: boolean
  /** Whether to generate type definitions */
  generateTypes: boolean
  /** Whether to generate index file */
  generateIndex: boolean
}

// ============================================
// Changelog Types
// ============================================

/**
 * Changes in a version
 */
export interface VersionChanges {
  /** Added icons */
  added: string[]
  /** Modified icons */
  modified: string[]
  /** Removed icons */
  removed: string[]
}

/**
 * Changelog entry for a version
 */
export interface ChangelogEntry {
  /** Version number */
  version: string
  /** Release date */
  date: string
  /** Update message */
  message: string
  /** Changes in this version */
  changes: VersionChanges
}

/**
 * Diff between two icon manifests
 */
export interface IconDiff {
  /** Added icons */
  added: IconMetadata[]
  /** Modified icons */
  modified: IconMetadata[]
  /** Removed icons */
  removed: IconMetadata[]
}

// ============================================
// Multi-Format Output Types
// ============================================

/**
 * Output format configuration
 */
export interface OutputFormats {
  /** Generate React components */
  react: boolean
  /** Generate raw SVG files */
  svg: boolean
  /** Generate SVG sprite */
  sprite: boolean
  /** Generate JSON metadata */
  json: boolean
}

/**
 * SVG sprite symbol
 */
export interface SpriteSymbol {
  /** Symbol ID */
  id: string
  /** ViewBox attribute */
  viewBox: string
  /** SVG content inside symbol */
  content: string
}

/**
 * SVG sprite structure
 */
export interface SvgSprite {
  /** Full sprite SVG content */
  content: string
  /** Individual symbols */
  symbols: SpriteSymbol[]
}

// ============================================
// Error Handling Types
// ============================================

/**
 * Standardized error response
 */
export interface ErrorResponse {
  /** Error code for programmatic handling */
  code: string
  /** Human-readable error message */
  message: string
  /** Additional error details */
  details?: unknown
  /** Whether retry might succeed */
  recoverable: boolean
  /** Suggested action to resolve */
  suggestion?: string
}

// ============================================
// Version Management Types
// ============================================

/**
 * Semantic version bump type
 */
export type VersionBumpType = 'major' | 'minor' | 'patch'

/**
 * Version suggestion result
 */
export interface VersionSuggestion {
  /** Suggested bump type */
  bumpType: VersionBumpType
  /** Reason for the suggestion */
  reason: string
}
