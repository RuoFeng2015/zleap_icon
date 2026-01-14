/**
 * Icon search/filter functionality
 */

export interface IconInfo {
  name: string
  originalName: string
  svgPath?: string
  componentPath?: string
  size?: {
    width: number
    height: number
  }
}

/**
 * Filter icons by search query
 * Returns only icons whose names contain the search query (case-insensitive)
 *
 * @param icons - Array of icon objects
 * @param query - Search query string
 * @returns Filtered icons matching the query
 */
export function filterIcons(icons: IconInfo[], query: string): IconInfo[] {
  if (!query || query.trim() === '') {
    return icons
  }

  const normalizedQuery = query.toLowerCase().trim()

  return icons.filter((icon) => {
    const name = (icon.name || '').toLowerCase()
    const originalName = (icon.originalName || '').toLowerCase()
    return (
      name.includes(normalizedQuery) || originalName.includes(normalizedQuery)
    )
  })
}

/**
 * Check if an icon matches a search query
 *
 * @param icon - Icon object to check
 * @param query - Search query string
 * @returns True if icon matches the query
 */
export function iconMatchesQuery(icon: IconInfo, query: string): boolean {
  if (!query || query.trim() === '') {
    return true
  }

  const normalizedQuery = query.toLowerCase().trim()
  const name = (icon.name || '').toLowerCase()
  const originalName = (icon.originalName || '').toLowerCase()

  return (
    name.includes(normalizedQuery) || originalName.includes(normalizedQuery)
  )
}
