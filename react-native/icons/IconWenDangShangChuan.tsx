import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconWenDangShangChuanProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconWenDangShangChuan = forwardRef<unknown, IconWenDangShangChuanProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 11.5V7l-4.5-5H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h6"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 14.5v7"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 18h7"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 2v5h5"/></svg>`,
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

IconWenDangShangChuan.displayName = 'IconWenDangShangChuan'

export default IconWenDangShangChuan
