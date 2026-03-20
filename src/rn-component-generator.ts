import type { IconMetadata, ComponentTemplate } from './types'
import { extractViewBox } from './svg-transformer'
import { toPascalCase } from './component-generator'

function escapeTemplateLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function isPreservedColor(value: string): boolean {
  const color = value.toLowerCase().replace(/\s/g, '')
  return (
    color === 'none' ||
    color === 'currentcolor' ||
    color === 'white' ||
    color === '#fff' ||
    color === '#ffffff' ||
    color.startsWith('url(')
  )
}

function isMultiColorSvg(svgContent: string): boolean {
  const matches = svgContent.match(/(fill|stroke)="([^"]+)"/gi) || []
  const colors = new Set<string>()

  for (const item of matches) {
    const value = item.split('=')[1]?.replace(/^"|"$/g, '')
    if (!value) continue
    if (isPreservedColor(value)) continue
    colors.add(value.toLowerCase())
  }

  return colors.size > 1
}

function generateComponentName(iconName: string): string {
  const pascalName = toPascalCase(iconName)
  return pascalName ? `Icon${pascalName}` : 'Icon'
}

export function generateReactNativeComponent(icon: IconMetadata): ComponentTemplate {
  const componentName = generateComponentName(icon.name)
  const propsName = `${componentName}Props`
  const viewBox = extractViewBox(icon.svgContent || '') || '0 0 24 24'
  const sourceSvg = icon.svgContent || '<svg viewBox="0 0 24 24"></svg>'
  const escapedXml = escapeTemplateLiteral(sourceSvg)
  const multicolor = isMultiColorSvg(sourceSvg)

  const content = `import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface ${propsName} extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const ${componentName} = forwardRef<unknown, ${propsName}>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => \`${escapedXml}\`,
      [],
    )

    const xml = useMemo(() => {
${multicolor
  ? `      return baseXml`
  : `      if (!color) return baseXml
      return baseXml.replace(
        /(fill|stroke)="([^"]+)"/gi,
        (_match, attr, value) => {
          const normalized = String(value).toLowerCase().replace(/\\s/g, '')
          if (
            normalized === 'none' ||
            normalized === 'currentcolor' ||
            normalized === 'white' ||
            normalized === '#fff' ||
            normalized === '#ffffff' ||
            normalized.startsWith('url(')
          ) {
            return \`\${attr}="\${value}"\`
          }
          return \`\${attr}="\${color}"\`
        },
      )`}
    }, [baseXml, color])

    return (
      <SvgXml
        ref={ref as never}
        xml={xml}
        width={size}
        height={size}
        viewBox="${viewBox}"
        {...props}
      />
    )
  },
)

${componentName}.displayName = '${componentName}'

export default ${componentName}
`

  return {
    componentName,
    fileName: `${componentName}.tsx`,
    content,
    types: `export { ${componentName}, type ${propsName} } from './${componentName}'`,
  }
}

export function generateReactNativeIndex(components: ComponentTemplate[]): string {
  const sorted = [...components].sort((a, b) =>
    a.componentName.localeCompare(b.componentName),
  )
  const imports = sorted
    .map((c) => `import { ${c.componentName} } from './icons/${c.componentName}'`)
    .join('\n')

  const exports = sorted
    .map(
      (c) =>
        `export { ${c.componentName}, type ${c.componentName}Props } from './icons/${c.componentName}'`,
    )
    .join('\n')

  const names = sorted.map((c) => c.componentName).join(',\n  ')

  return `/**
 * React Native icon exports (auto-generated)
 */

${imports}

${exports}

export const allIcons = {
  ${names}
} as const

export type IconName = keyof typeof allIcons
`
}
