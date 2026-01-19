/**
 * SVG Transformer Module
 *
 * Handles SVG optimization using SVGO and conversion to JSX format.
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { optimize, type Config as SvgoConfig } from 'svgo'
import type { TransformOptions, TransformResult } from './types'

/**
 * Default SVGO configuration for icon optimization
 * - Removes dimensions (width/height)
 * - Preserves original colors (不替换为 currentColor)
 * - Removes unnecessary metadata
 */
export const defaultSvgoConfig: SvgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 禁用颜色转换，保留原始颜色
          convertColors: false,
          // 禁用移除 viewBox
          removeViewBox: false,
        },
      },
    },
    'removeDimensions',
    'removeXMLNS',
  ],
}

/**
 * Default transformation options
 */
export const defaultTransformOptions: TransformOptions = {
  replaceColors: true,
  removeSize: true,
  removeFill: true,
  addViewBox: true,
}

/**
 * Optimizes SVG content using SVGO
 *
 * @param svgContent - Raw SVG string
 * @param config - Optional SVGO configuration override
 * @returns Optimized SVG string
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
export function optimizeSvg(
  svgContent: string,
  config: SvgoConfig = defaultSvgoConfig,
): string {
  const result = optimize(svgContent, config)
  return result.data
}

/**
 * Map of SVG attribute names to their JSX equivalents
 */
const svgToJsxAttributeMap: Record<string, string> = {
  class: 'className',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-style': 'fontStyle',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'text-decoration': 'textDecoration',
  'dominant-baseline': 'dominantBaseline',
  'alignment-baseline': 'alignmentBaseline',
  'baseline-shift': 'baselineShift',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'lighting-color': 'lightingColor',
  'marker-start': 'markerStart',
  'marker-mid': 'markerMid',
  'marker-end': 'markerEnd',
  'paint-order': 'paintOrder',
  'shape-rendering': 'shapeRendering',
  'vector-effect': 'vectorEffect',
  'pointer-events': 'pointerEvents',
  'xlink:href': 'xlinkHref',
  'xml:space': 'xmlSpace',
  'xmlns:xlink': 'xmlnsXlink',
}

/**
 * Converts a kebab-case attribute name to camelCase
 *
 * @param attr - Attribute name in kebab-case
 * @returns Attribute name in camelCase
 */
export function kebabToCamelCase(attr: string): string {
  // Check if it's a known SVG attribute that needs special handling
  if (svgToJsxAttributeMap[attr]) {
    return svgToJsxAttributeMap[attr]
  }

  // Convert kebab-case to camelCase
  return attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts SVG content to JSX-compatible format
 *
 * Transforms attribute names from kebab-case to camelCase
 * as required by React/JSX.
 *
 * @param svgContent - SVG string with standard attribute names
 * @returns SVG string with JSX-compatible attribute names
 *
 * Requirements: 3.5
 */
export function convertToJsx(svgContent: string): string {
  // Match all attributes in the SVG
  // Pattern: attribute-name="value" or attribute-name='value'
  return svgContent.replace(
    /\s([a-z][a-z0-9]*(?:-[a-z0-9]+)+)=/gi,
    (_, attrName) => {
      const jsxAttrName = kebabToCamelCase(attrName.toLowerCase())
      return ` ${jsxAttrName}=`
    },
  )
}

/**
 * Transforms SVG content: optimizes and converts to JSX format
 *
 * @param svgContent - Raw SVG string
 * @param options - Transformation options
 * @param svgoConfig - Optional SVGO configuration override
 * @returns TransformResult with original/optimized sizes and content
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */
export function transformSvg(
  svgContent: string,
  _options: TransformOptions = defaultTransformOptions,
  svgoConfig: SvgoConfig = defaultSvgoConfig,
): TransformResult {
  const originalSize = svgContent.length

  // Optimize SVG with SVGO
  // Note: _options is reserved for future use when custom transform options are needed
  const optimizedSvg = optimizeSvg(svgContent, svgoConfig)

  // Convert to JSX format
  const jsxContent = convertToJsx(optimizedSvg)

  return {
    originalSize,
    optimizedSize: optimizedSvg.length,
    svgContent: optimizedSvg,
    jsxContent,
  }
}

/**
 * Extracts the inner content of an SVG element (everything between <svg> tags)
 *
 * @param svgContent - Full SVG string
 * @returns Inner content of the SVG
 */
export function extractSvgInnerContent(svgContent: string): string {
  // Match content between <svg ...> and </svg>
  const match = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)
  return match ? match[1].trim() : ''
}

/**
 * Extracts the viewBox attribute from an SVG string
 *
 * @param svgContent - SVG string
 * @returns viewBox value or null if not found
 */
export function extractViewBox(svgContent: string): string | null {
  const match = svgContent.match(/viewBox=["']([^"']+)["']/i)
  return match ? match[1] : null
}

/**
 * Checks if SVG content contains width/height attributes
 *
 * @param svgContent - SVG string
 * @returns true if width or height attributes are present
 */
export function hasFixedDimensions(svgContent: string): boolean {
  const widthMatch = svgContent.match(/<svg[^>]*\swidth=["'][^"']+["']/i)
  const heightMatch = svgContent.match(/<svg[^>]*\sheight=["'][^"']+["']/i)
  return !!(widthMatch || heightMatch)
}

/**
 * Checks if SVG content uses currentColor for fill
 *
 * @param svgContent - SVG string
 * @returns true if fill="currentColor" is present on the svg element
 */
export function usesCurrentColor(svgContent: string): boolean {
  // Check if the SVG element has fill="currentColor"
  const svgTagMatch = svgContent.match(/<svg[^>]*>/i)
  if (!svgTagMatch) return false
  return /fill=["']currentColor["']/i.test(svgTagMatch[0])
}

/**
 * Checks if all attribute names in SVG are in JSX camelCase format
 *
 * @param svgContent - SVG string
 * @returns true if all attributes are in camelCase
 */
export function hasJsxAttributes(svgContent: string): boolean {
  // List of common kebab-case SVG attributes that should be converted
  const kebabAttributes = [
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'fill-rule',
    'clip-rule',
    'clip-path',
    'font-family',
    'font-size',
  ]

  for (const attr of kebabAttributes) {
    // Check if the kebab-case version exists (it shouldn't after conversion)
    const regex = new RegExp(`\\s${attr}=`, 'i')
    if (regex.test(svgContent)) {
      return false
    }
  }

  return true
}
