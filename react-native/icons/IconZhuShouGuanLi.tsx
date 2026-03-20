import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZhuShouGuanLiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZhuShouGuanLi = forwardRef<unknown, IconZhuShouGuanLiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#0D131A" d="M9.75 3.75h-4.5a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-4.5a1.5 1.5 0 0 0-1.5-1.5m0 6h-4.5v-4.5h4.5zm9-6h-4.5a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-4.5a1.5 1.5 0 0 0-1.5-1.5m0 6h-4.5v-4.5h4.5zm-9 3h-4.5a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-4.5a1.5 1.5 0 0 0-1.5-1.5m0 6h-4.5v-4.5h4.5zm9-6h-4.5a1.5 1.5 0 0 0-1.5 1.5v4.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-4.5a1.5 1.5 0 0 0-1.5-1.5m0 6h-4.5v-4.5h4.5z"/></svg>`,
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

IconZhuShouGuanLi.displayName = 'IconZhuShouGuanLi'

export default IconZhuShouGuanLi
