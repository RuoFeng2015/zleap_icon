import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconXiaoXiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconXiaoXi = forwardRef<unknown, IconXiaoXiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.23" d="M20.197 12A8.197 8.197 0 0 1 12 20.198H3.803V12a8.197 8.197 0 0 1 16.394 0"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.23" d="M7.901 9.54h7.378"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.23" d="M7.901 12.82h7.378"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.23" d="M7.901 16.099H12"/></svg>`,
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

IconXiaoXi.displayName = 'IconXiaoXi'

export default IconXiaoXi
