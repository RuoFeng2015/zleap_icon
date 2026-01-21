/**
 * Component Generator Module
 *
 * Handles React component generation from optimized SVG content.
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6
 */

import type { IconMetadata, ComponentTemplate } from './types'
import { extractSvgInnerContent, extractViewBox } from './svg-transformer'

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
  const rawInnerContent = rawSvgContent ? extractSvgInnerContent(rawSvgContent) : innerContent

  // For multicolor icons, don't apply fill prop to svg element
  // For single-color icons, apply fill prop
  const fillProp = isMulticolor ? '' : '\n        fill={color}'
  const colorComment = isMulticolor
    ? '/** Icon color (not applicable for multicolor icons) */'
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
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
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
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
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
      >
        ${innerContent}
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
