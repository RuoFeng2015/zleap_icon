import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFrame5Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFrame5 = forwardRef<unknown, IconFrame5Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 42 42"><path stroke="#D4D4D8" stroke-linejoin="round" stroke-width="2.625" d="M27.125 21V9.625a6.125 6.125 0 0 0-12.25 0V21a6.125 6.125 0 0 0 12.25 0Z"/><path stroke="#D4D4D8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.625" d="M7.875 20.125c0 7.249 5.876 13.125 13.125 13.125 1.534 0 3.007-.263 4.375-.747m8.75-12.378c0 1.867-.39 3.642-1.092 5.25"/><path stroke="#D4D4D8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.625" d="M21 33.25v5.25"/><path stroke="#D4D4D8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.625" d="M36.75 36.75 5.25 5.25"/></svg>`,
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
        viewBox="0 0 42 42"
        {...props}
      />
    )
  },
)

IconFrame5.displayName = 'IconFrame5'

export default IconFrame5
