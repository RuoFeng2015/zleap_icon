/**
 * Component Generator Module
 *
 * Handles React component generation from optimized SVG content.
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6
 */

import type { IconMetadata, ComponentTemplate } from './types'
import { extractSvgInnerContent, extractViewBox, extractSvgRootFill } from './svg-transformer'

/**
 * Converts a string to PascalCase format
 *
 * Handles various input formats:
 * - kebab-case: "arrow-right" -> "ArrowRight"
 * - snake_case: "arrow_right" -> "ArrowRight"
 * - space separated: "arrow right" -> "ArrowRight"
 * - mixed: "arrow-right_up" -> "ArrowRightUp"
 * - already PascalCase: "ArrowRight" -> "ArrowRight"
 * - camelCase: "arrowRight" -> "ArrowRight"
 *
 * @param str - Input string in any format
 * @returns PascalCase formatted string
 *
 * Requirements: 4.3
 */
export function toPascalCase(str: string): string {
  if (!str || str.trim().length === 0) {
    return ''
  }

  // Split by common delimiters: hyphen, underscore, space, and camelCase boundaries
  const words = str
    // Insert space before uppercase letters (for camelCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace delimiters with spaces
    .replace(/[-_\s]+/g, ' ')
    // Trim and split
    .trim()
    .split(/\s+/)
    // Filter out empty strings
    .filter((word) => word.length > 0)

  // Capitalize first letter of each word, lowercase the rest
  return words
    .map((word) => {
      if (word.length === 0) return ''
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

/**
 * Generates a valid React component name from an icon name
 *
 * @param iconName - Original icon name
 * @param prefix - Prefix to add (default: "Icon")
 * @returns Valid React component name
 *
 * Requirements: 4.3
 */
export function generateComponentName(
  iconName: string,
  prefix: string = 'Icon',
): string {
  const pascalName = toPascalCase(iconName)
  if (!pascalName) {
    return prefix
  }
  return `${prefix}${pascalName}`
}

/**
 * Check if SVG content contains multiple colors (multicolor icon)
 * @param svgContent - SVG content to check
 * @returns True if the SVG has multiple colors
 */
function isMulticolorSvg(svgContent: string): boolean {
  // Check for multiple fill colors (excluding none and currentColor)
  const fillMatches =
    svgContent.match(/fill="(?!none|currentColor)[^"]+"/g) || []
  const uniqueFills = new Set(fillMatches)

  // Check for multiple stroke colors
  const strokeMatches =
    svgContent.match(/stroke="(?!none|currentColor)[^"]+"/g) || []
  const uniqueStrokes = new Set(strokeMatches)

  // Check for gradients or patterns
  const hasGradient =
    svgContent.includes('<linearGradient') ||
    svgContent.includes('<radialGradient') ||
    svgContent.includes('<pattern')

  return uniqueFills.size > 1 || uniqueStrokes.size > 1 || hasGradient
}

/**
 * 保留颜色列表：这些颜色不会被替换为 currentColor
 * 主要是浅色/白色，用作图标的装饰或镂空效果
 */
const PRESERVED_COLORS = [
  'white',
  '#fff',
  '#ffffff',
  '#FFF',
  '#FFFFFF',
  'rgb(255, 255, 255)',
  'rgb(255,255,255)',
  // 也可以保留一些特殊颜色，如需要
]

/**
 * 判断颜色是否应该被保留（不替换为 currentColor）
 * @param color - 颜色值
 * @returns true 如果颜色应该被保留
 */
function shouldPreserveColor(color: string): boolean {
  const normalizedColor = color.toLowerCase().replace(/\s/g, '')
  
  // 检查是否在保留列表中
  for (const preserved of PRESERVED_COLORS) {
    if (normalizedColor === preserved.toLowerCase().replace(/\s/g, '')) {
      return true
    }
  }
  
  // 检查是否是接近白色的颜色 (#fff, #ffffff 或 rgb 接近 255,255,255)
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hexMatch) {
    const hex = hexMatch[1]
    let r, g, b
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
    // 如果颜色非常接近白色（所有通道 > 240），保留它
    if (r > 240 && g > 240 && b > 240) {
      return true
    }
  }
  
  return false
}

/**
 * 替换 SVG 内容中的主体颜色为 currentColor，保留装饰颜色
 * 适用于多色图标，使其可以通过 color prop 控制主体颜色
 * 
 * @param content - SVG 内部内容
 * @returns 处理后的内容
 */
function replaceMainColors(content: string): string {
  // 替换 fill 属性中的主体颜色
  let result = content.replace(
    /fill="(#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|[a-z]+)"/gi,
    (match, color) => {
      if (color === 'none' || color === 'currentColor') {
        return match
      }
      if (shouldPreserveColor(color)) {
        return match
      }
      return 'fill="currentColor"'
    }
  )
  
  // 替换 stroke 属性中的主体颜色
  result = result.replace(
    /stroke="(#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|[a-z]+)"/gi,
    (match, color) => {
      if (color === 'none' || color === 'currentColor') {
        return match
      }
      if (shouldPreserveColor(color)) {
        return match
      }
      return 'stroke="currentColor"'
    }
  )
  
  return result
}

/**
 * Generates a React component template from icon metadata and JSX content
 *
 * @param icon - Icon metadata
 * @param jsxContent - JSX-compatible SVG content
 * @returns ComponentTemplate with component code and type definitions
 *
 * Requirements: 4.1, 4.2, 4.6
 */
export function generateComponent(
  icon: IconMetadata,
  jsxContent: string,
  rawSvgContent?: string,
): ComponentTemplate {
  const componentName = generateComponentName(icon.name)
  const propsName = `${componentName}Props`

  // Extract inner SVG content and viewBox
  const innerContent = extractSvgInnerContent(jsxContent)
  const viewBox = extractViewBox(jsxContent) || '0 0 24 24'

  // Check if this is a multicolor icon
  const isMulticolor = isMulticolorSvg(jsxContent)

  // Check if content has gradient/defs that need unique IDs
  const hasGradients = innerContent.includes('<defs>') && 
    (innerContent.includes('linearGradient') || innerContent.includes('radialGradient'))

  // For gradients, use raw SVG content (not JSX converted) for dangerouslySetInnerHTML
  let rawInnerContent = rawSvgContent ? extractSvgInnerContent(rawSvgContent) : innerContent

  // Move <defs> to the beginning of SVG content (gradients must be defined before use)
  if (hasGradients) {
    const defsMatch = rawInnerContent.match(/<defs>[\s\S]*?<\/defs>/)
    if (defsMatch) {
      rawInnerContent = defsMatch[0] + rawInnerContent.replace(/<defs>[\s\S]*?<\/defs>/, '')
    }
  }

  // Extract the root fill attribute from original SVG (important for icons with stroke paths)
  const rootFill = rawSvgContent ? extractSvgRootFill(rawSvgContent) : null

  // Determine fill prop based on SVG type and original fill attribute
  // - If original has fill="none", preserve it (stroke-based icons)
  // - For gradient icons with explicit fill, preserve the fill
  // - For multicolor icons, we'll replace main colors with currentColor
  // - For single-color icons, apply fill={color}
  let fillProp: string
  if (rootFill === 'none') {
    // Stroke-based icons: preserve fill="none" to prevent default black fill
    fillProp = '\n        fill="none"'
  } else if (hasGradients && rootFill) {
    fillProp = `\n        fill="${rootFill}"`
  } else if (isMulticolor) {
    // 多色图标：不在 SVG 根元素设置 fill，使用 currentColor 继承
    fillProp = '\n        fill="none"'
  } else {
    // fill 类型图标：使用 color 或默认 currentColor
    fillProp = '\n        fill={color || \"currentColor\"}'
  }
  // 更新注释：多色图标现在支持通过 color 修改主体颜色
  const colorComment = isMulticolor
    ? '/** Icon color (controls the main color, preserves white/light decorations) */'
    : '/** Icon color */'

  let content: string

  if (hasGradients) {
    // For icons with gradients, use useId to generate unique IDs
    content = `import React, { forwardRef, useId } from 'react';
import type { SVGProps } from 'react';

export interface ${propsName} extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  ${colorComment}
  color?: string;
}

/**
 * ${componentName} icon component${isMulticolor ? ' (multicolor)' : ''}
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const ${componentName} = forwardRef<SVGSVGElement, ${propsName}>(
  ({ size = 24, color, className, style, ...props }, ref) => {
    const uniqueId = useId();
    
     // Replace gradient IDs with unique ones
    const svgContent = \`${rawInnerContent.replace(/id="([^"]+)"/g, 'id="${uniqueId}$1"').replace(/url\(#([^)]+)\)/g, 'url(#${uniqueId}$1)')}\`;
    
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="${viewBox}"${fillProp}
        className={className}
        style={style}
        {...props}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);

${componentName}.displayName = '${componentName}';

export default ${componentName};
`
  } else {
    // For icons without gradients, use the original approach
    // For stroke-based icons (fill="none"), replace hardcoded colors with currentColor
    // and apply color via style prop
    const isStrokeIcon = rootFill === 'none'
    let processedContent = innerContent
    
    if (isMulticolor) {
      // 多色图标：替换主体颜色为 currentColor，保留装饰颜色（白色等）
      processedContent = replaceMainColors(innerContent)
    } else if (isStrokeIcon) {
      // Replace hardcoded stroke/fill colors with currentColor for single-color stroke icons
      processedContent = innerContent
        .replace(/stroke="#[0-9A-Fa-f]{3,6}"/g, 'stroke="currentColor"')
        .replace(/fill="#[0-9A-Fa-f]{3,6}"/g, 'fill="currentColor"')
    }
    
    // 对于 stroke 图标和多色图标，使用条件性 style 来应用颜色
    // 只有当用户传入 color prop 时才设置内联样式，否则让 Tailwind 类名生效
    const needsColorStyle = isStrokeIcon || isMulticolor
    const styleProp = needsColorStyle
      ? '\n        style={{ ...(color ? { color } : {}), ...style }}'
      : '\n        style={style}'
    
    content = `import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface ${propsName} extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  ${colorComment}
  color?: string;
}

/**
 * ${componentName} icon component${isMulticolor ? ' (multicolor)' : ''}
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const ${componentName} = forwardRef<SVGSVGElement, ${propsName}>(
  ({ size = 24, color, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="${viewBox}"${fillProp}
        className={className}${styleProp}
        {...props}
      >
        ${processedContent}
      </svg>
    );
  }
);

${componentName}.displayName = '${componentName}';

export default ${componentName};
`
  }

  const types = `export { ${componentName}, type ${propsName} } from './${componentName}';`

  return {
    componentName,
    fileName: `${componentName}.tsx`,
    content,
    types,
  }
}

/**
 * Generates multiple component templates from a list of icons
 *
 * @param icons - Array of icon metadata with JSX content
 * @returns Array of ComponentTemplate objects
 *
 * Requirements: 4.1, 4.2, 4.6
 */
export function generateComponents(
  icons: Array<{ metadata: IconMetadata; jsxContent: string }>,
): ComponentTemplate[] {
  return icons.map(({ metadata, jsxContent }) =>
    generateComponent(metadata, jsxContent),
  )
}

/**
 * Result of generating an index file
 */
export interface IndexFileResult {
  /** The generated index.ts content */
  content: string
  /** List of all exported component names */
  componentNames: string[]
  /** The allIcons object export */
  allIconsExport: string
  /** The IconName type definition */
  iconNameType: string
}

/**
 * Generates the index.ts file content that exports all icon components
 *
 * @param components - Array of ComponentTemplate objects
 * @returns IndexFileResult with the generated content
 *
 * Requirements: 4.5
 */
export function generateIndexFile(
  components: ComponentTemplate[],
): IndexFileResult {
  // Sort components alphabetically for consistent output
  const sortedComponents = [...components].sort((a, b) =>
    a.componentName.localeCompare(b.componentName),
  )

  const componentNames = sortedComponents.map((c) => c.componentName)

  // Generate imports for allIcons object
  const imports = sortedComponents
    .map(
      (c) => `import { ${c.componentName} } from './icons/${c.componentName}';`,
    )
    .join('\n')

  // Generate re-exports with types
  const reExports = sortedComponents
    .map(
      (c) =>
        `export { ${c.componentName}, type ${c.componentName}Props } from './icons/${c.componentName}';`,
    )
    .join('\n')

  // Generate allIcons object
  const allIconsExport = `
/**
 * Object containing all icon components
 */
export const allIcons = {
  ${componentNames.join(',\n  ')}
} as const;`

  // Generate IconName type
  const iconNameType = `
/**
 * Union type of all icon component names
 */
export type IconName = keyof typeof allIcons;`

  // Combine all parts
  const content = `/**
 * Icon Library - Auto-generated from Figma
 *
 * This file exports all icon components and related types.
 * Do not edit this file manually - it is generated by the build process.
 */

${imports}

${reExports}
${allIconsExport}
${iconNameType}
`

  return {
    content,
    componentNames,
    allIconsExport,
    iconNameType,
  }
}

/**
 * Generates a minimal index file for a subset of icons
 *
 * @param componentNames - Array of component names to export
 * @returns The generated index.ts content
 *
 * Requirements: 4.5
 */
export function generateMinimalIndexFile(componentNames: string[]): string {
  const sortedNames = [...componentNames].sort()

  // Generate imports for allIcons object
  const imports = sortedNames
    .map((name) => `import { ${name} } from './icons/${name}';`)
    .join('\n')

  // Generate re-exports with types
  const reExports = sortedNames
    .map(
      (name) => `export { ${name}, type ${name}Props } from './icons/${name}';`,
    )
    .join('\n')

  const allIconsExport = `
export const allIcons = {
  ${sortedNames.join(',\n  ')}
} as const;

export type IconName = keyof typeof allIcons;
`

  return `${imports}\n\n${reExports}\n${allIconsExport}`
}
