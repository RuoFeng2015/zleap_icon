import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconShanChuDELETEProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconShanChuDELETE = forwardRef<unknown, IconShanChuDELETEProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M4.5 5v17h15V5z"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 10v6.5"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10v6.5"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 5h20"/><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="m8 5 1.645-3h4.744L16 5z"/></svg>`,
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

IconShanChuDELETE.displayName = 'IconShanChuDELETE'

export default IconShanChuDELETE
