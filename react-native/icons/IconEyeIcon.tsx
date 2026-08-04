import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconEyeIconProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconEyeIcon = forwardRef<unknown, IconEyeIconProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path stroke="currentColor" d="M10.001 15c4.603 0 8.334-5 8.334-5S14.604 5 10 5s-8.333 5-8.333 5 3.73 5 8.333 5Z" strokeLinejoin="round" strokeWidth="1.25"/><path stroke="currentColor" d="M10.001 12.085a2.083 2.083 0 1 0 0-4.167 2.083 2.083 0 0 0 0 4.167Z" strokeLinejoin="round" strokeWidth="1.25"/></svg>`,
      [],
    )

    const xml = useMemo(() => {
      if (!color) return baseXml
      return baseXml.replace(
        /(fill|stroke)="([^"]+)"/gi,
        (_match, attr, value) => {
          const normalized = String(value).toLowerCase().replace(/\s/g, '')
          if (
            normalized === 'none' ||
            normalized === 'currentcolor' ||
            normalized === 'white' ||
            normalized === '#fff' ||
            normalized === '#ffffff' ||
            normalized.startsWith('url(')
          ) {
            return `${attr}="${value}"`
          }
          return `${attr}="${color}"`
        },
      )
    }, [baseXml, color])

    return (
      <SvgXml
        ref={ref as never}
        xml={xml}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        {...props}
      />
    )
  },
)

IconEyeIcon.displayName = 'IconEyeIcon'

export default IconEyeIcon
