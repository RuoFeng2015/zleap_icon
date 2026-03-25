import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconSheZhi1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconSheZhi1 = forwardRef<unknown, IconSheZhi1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M9.142 21.586a10 10 0 0 1-4.348-2.652 3 3 0 0 0-2.59-4.919A10.04 10.04 0 0 1 2.457 9H2.5a3 3 0 0 0 2.692-4.325 10 10 0 0 1 4.134-2.313 3 3 0 0 0 5.348 0 10 10 0 0 1 4.134 2.313A3 3 0 0 0 21.542 9a10.044 10.044 0 0 1 .255 5.015 3 3 0 0 0-2.59 4.919 10 10 0 0 1-4.349 2.652 3.001 3.001 0 0 0-5.716 0Z"/><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/></svg>`,
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

IconSheZhi1.displayName = 'IconSheZhi1'

export default IconSheZhi1
