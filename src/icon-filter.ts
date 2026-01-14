/**
 * Icon Component Filtering Module
 *
 * Provides functions to filter and identify icon components from Figma file data.
 * Filters components based on type and naming conventions.
 *
 * Requirements: 2.2
 */

import type { FigmaComponent, FigmaNode, FigmaFileResponse } from './types'

/**
 * Default icon naming pattern - matches lowercase names with hyphens
 * Examples: "arrow-right", "check-circle", "user-profile"
 */
export const DEFAULT_ICON_NAME_PATTERN = /^[a-z][a-z0-9-]*$/

/**
 * Icon filter configuration
 */
export interface IconFilterConfig {
  /** Pattern to match icon names */
  namePattern: RegExp
  /** Prefix that icon names should start with (optional) */
  namePrefix?: string
  /** Suffix that icon names should end with (optional) */
  nameSuffix?: string
  /** Minimum icon size in pixels */
  minSize?: number
  /** Maximum icon size in pixels */
  maxSize?: number
}

/**
 * Default filter configuration
 */
export const DEFAULT_FILTER_CONFIG: IconFilterConfig = {
  namePattern: DEFAULT_ICON_NAME_PATTERN,
  minSize: 8,
  maxSize: 128,
}

/**
 * Filtered icon component with additional metadata
 */
export interface FilteredIconComponent {
  /** Component ID */
  id: string
  /** Component name */
  name: string
  /** Component width */
  width: number
  /** Component height */
  height: number
  /** Original Figma component data */
  original: FigmaComponent
}

/**
 * Result of filtering operation
 */
export interface FilterResult {
  /** Successfully filtered icon components */
  icons: FilteredIconComponent[]
  /** Components that were skipped (not matching criteria) */
  skipped: Array<{
    id: string
    name: string
    reason: string
  }>
  /** Total components processed */
  totalProcessed: number
}

/**
 * Checks if a component matches the icon naming convention
 *
 * @param name - Component name to check
 * @param config - Filter configuration
 * @returns True if the name matches the icon naming convention
 */
export function matchesIconNamingConvention(
  name: string,
  config: IconFilterConfig = DEFAULT_FILTER_CONFIG
): boolean {
  if (!name || typeof name !== 'string') {
    return false
  }

  // Check name pattern
  if (!config.namePattern.test(name)) {
    return false
  }

  // Check prefix if specified
  if (config.namePrefix && !name.startsWith(config.namePrefix)) {
    return false
  }

  // Check suffix if specified
  if (config.nameSuffix && !name.endsWith(config.nameSuffix)) {
    return false
  }

  return true
}

/**
 * Checks if a component has valid icon dimensions
 *
 * @param width - Component width
 * @param height - Component height
 * @param config - Filter configuration
 * @returns True if dimensions are within valid range
 */
export function hasValidIconDimensions(
  width: number,
  height: number,
  config: IconFilterConfig = DEFAULT_FILTER_CONFIG
): boolean {
  if (typeof width !== 'number' || typeof height !== 'number') {
    return false
  }

  if (width <= 0 || height <= 0) {
    return false
  }

  if (config.minSize !== undefined) {
    if (width < config.minSize || height < config.minSize) {
      return false
    }
  }

  if (config.maxSize !== undefined) {
    if (width > config.maxSize || height > config.maxSize) {
      return false
    }
  }

  return true
}

/**
 * Checks if a Figma node is a COMPONENT type
 *
 * @param node - Figma node or component to check
 * @returns True if the node is a COMPONENT type
 */
export function isComponentType(
  node: FigmaNode | FigmaComponent | { type?: string }
): boolean {
  return node && node.type === 'COMPONENT'
}

/**
 * Filters a single component to determine if it's a valid icon
 *
 * @param component - Figma component to check
 * @param config - Filter configuration
 * @returns Object with isIcon flag and reason if not an icon
 */
export function filterIconComponent(
  component: FigmaComponent,
  config: IconFilterConfig = DEFAULT_FILTER_CONFIG
): { isIcon: boolean; reason?: string } {
  // Check if it's a component type
  if (!isComponentType(component)) {
    return { isIcon: false, reason: 'Not a COMPONENT type' }
  }

  // Check naming convention
  if (!matchesIconNamingConvention(component.name, config)) {
    return {
      isIcon: false,
      reason: `Name "${component.name}" does not match icon naming convention`,
    }
  }

  // Check dimensions
  const { width, height } = component.absoluteBoundingBox || {
    width: 0,
    height: 0,
  }
  if (!hasValidIconDimensions(width, height, config)) {
    return {
      isIcon: false,
      reason: `Dimensions ${width}x${height} are outside valid range`,
    }
  }

  return { isIcon: true }
}

/**
 * Filters icon components from a Figma file response
 *
 * @param fileResponse - Figma file API response
 * @param config - Filter configuration
 * @returns Filter result with icons and skipped components
 */
export function filterIconComponents(
  fileResponse: FigmaFileResponse,
  config: IconFilterConfig = DEFAULT_FILTER_CONFIG
): FilterResult {
  const icons: FilteredIconComponent[] = []
  const skipped: FilterResult['skipped'] = []

  const components = fileResponse.components || {}
  const componentEntries = Object.entries(components)

  for (const [id, component] of componentEntries) {
    const result = filterIconComponent(component, config)

    if (result.isIcon) {
      const { width, height } = component.absoluteBoundingBox
      icons.push({
        id,
        name: component.name,
        width,
        height,
        original: component,
      })
    } else {
      skipped.push({
        id,
        name: component.name,
        reason: result.reason || 'Unknown reason',
      })
    }
  }

  return {
    icons,
    skipped,
    totalProcessed: componentEntries.length,
  }
}

/**
 * Extracts component IDs from filtered icons
 *
 * @param icons - Array of filtered icon components
 * @returns Array of component IDs
 */
export function extractComponentIds(icons: FilteredIconComponent[]): string[] {
  return icons.map((icon) => icon.id)
}

/**
 * Filters components from a mixed list of Figma nodes
 * Recursively searches through the node tree to find COMPONENT nodes
 *
 * @param nodes - Array of Figma nodes
 * @param config - Filter configuration
 * @returns Array of filtered icon components
 */
export function filterIconsFromNodes(
  nodes: FigmaNode[],
  config: IconFilterConfig = DEFAULT_FILTER_CONFIG
): FilteredIconComponent[] {
  const icons: FilteredIconComponent[] = []

  function traverse(node: FigmaNode): void {
    if (node.type === 'COMPONENT') {
      // Create a FigmaComponent-like object for filtering
      const component: FigmaComponent = {
        id: node.id,
        name: node.name,
        type: 'COMPONENT',
        absoluteBoundingBox: {
          width: 24, // Default size if not available
          height: 24,
        },
      }

      const result = filterIconComponent(component, config)
      if (result.isIcon) {
        icons.push({
          id: node.id,
          name: node.name,
          width: component.absoluteBoundingBox.width,
          height: component.absoluteBoundingBox.height,
          original: component,
        })
      }
    }

    // Recursively process children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }

  for (const node of nodes) {
    traverse(node)
  }

  return icons
}
