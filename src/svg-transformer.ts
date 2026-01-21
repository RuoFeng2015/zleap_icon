/**
 * SVG Transformer Module
 *
 * Handles SVG optimization using SVGO and conversion to JSX format.
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { optimize, type Config as SvgoConfig, type CustomPlugin } from 'svgo'
import type { TransformOptions, TransformResult } from './types'

/**
 * 自定义 SVGO 插件：清理 Figma 导出的 SVG 问题元素
 * - 移除超大背景路径（设计稿背景泄漏）
 * - 移除 clipPath 内的填充路径
 * - 移除不需要的白色/透明填充背景
 */
const cleanFigmaExport: CustomPlugin = {
  name: 'cleanFigmaExport',
  fn: () => {
    return {
      element: {
        enter: (node, parentNode) => {
          // 移除超大尺寸的背景路径（如 d="M0 0h1440v1024H0z"）
          if (node.name === 'path' && node.attributes.d) {
            const d = node.attributes.d
            // 检测矩形路径，尺寸超过 500 的视为设计稿背景
            const rectMatch = d.match(/M[0\s-]*[0\s-]*[hH](\d+)[vV](\d+)/)
            if (rectMatch) {
              const width = parseInt(rectMatch[1], 10)
              const height = parseInt(rectMatch[2], 10)
              if (width > 500 || height > 500) {
                // 从父节点移除此元素
                if (parentNode.type === 'element' && parentNode.children) {
                  const index = parentNode.children.indexOf(node)
                  if (index > -1) {
                    parentNode.children.splice(index, 1)
                  }
                }
                return
              }
            }
          }

          // 移除 clipPath 定义中的纯白色填充路径
          if (node.name === 'clipPath') {
            if (node.children) {
              node.children = node.children.filter((child: any) => {
                if (child.type === 'element' && child.name === 'path') {
                  const fill = child.attributes?.fill
                  // 保留非白色填充的元素
                  return fill !== 'white' && fill !== '#fff' && fill !== '#ffffff'
                }
                return true
              })
            }
          }

          // 移除带有 transform="translate(负值)" 的大背景
          if (node.name === 'path' && node.attributes.transform) {
            const transform = node.attributes.transform
            if (transform.includes('translate(-') && node.attributes.d) {
              const d = node.attributes.d
              // 如果是大矩形路径，移除
              if (d.match(/[hH]\d{3,}[vV]\d{3,}/)) {
                if (parentNode.type === 'element' && parentNode.children) {
                  const index = parentNode.children.indexOf(node)
                  if (index > -1) {
                    parentNode.children.splice(index, 1)
                  }
                }
              }
            }
          }
        },
      },
    }
  },
}

/**
 * Default SVGO configuration for icon optimization
 * - Removes dimensions (width/height)
 * - Preserves original colors (不替换为 currentColor)
 * - Removes unnecessary metadata
 * - Cleans up Figma export artifacts
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
          // 禁用移除未使用的 defs（保留渐变定义）
          removeUselessDefs: false,
          // 禁用移除未知属性（保留 stop-color 等属性）
          removeUnknownsAndDefaults: false,
          // 禁用合并路径（可能影响渐变引用）
          mergePaths: false,
          // 禁用路径转换（保留原始路径数据）
          convertPathData: {
            floatPrecision: 3,
          },
        },
      },
    },
    'removeDimensions',
    'removeXMLNS',
    // 添加自定义清理插件
    cleanFigmaExport,
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
 * Extracts the fill attribute from the root SVG element
 *
 * @param svgContent - SVG string
 * @returns fill value or null if not found
 */
export function extractSvgRootFill(svgContent: string): string | null {
  const match = svgContent.match(/<svg[^>]*\sfill=["']([^"']+)["']/i)
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
