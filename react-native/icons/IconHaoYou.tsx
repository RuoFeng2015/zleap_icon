import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconHaoYouProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconHaoYou = forwardRef<unknown, IconHaoYouProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 21v-2a4 4 0 0 0-3-3.87"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
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
        viewBox="0 0 24 24"
        {...props}
      />
    )
  },
)

IconHaoYou.displayName = 'IconHaoYou'

export default IconHaoYou
