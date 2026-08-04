import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconEyeOffIconProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconEyeOffIcon = forwardRef<unknown, IconEyeOffIconProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path stroke="currentColor" d="M2.5 6.668c.264.508.665.98 1.176 1.398C5.11 9.24 7.408 10.001 10 10.001s4.891-.76 6.324-1.935c.51-.419.911-.89 1.176-1.398" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/><path stroke="currentColor" d="m12.074 10 .863 3.22" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/><path stroke="currentColor" d="m15.563 8.898 2.356 2.357" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/><path stroke="currentColor" d="m2.082 11.256 2.357-2.358" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/><path stroke="currentColor" d="M7.055 13.22 7.917 10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/></svg>`,
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

IconEyeOffIcon.displayName = 'IconEyeOffIcon'

export default IconEyeOffIcon
