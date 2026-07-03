import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconSiYuanBiJiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconSiYuanBiJi = forwardRef<unknown, IconSiYuanBiJiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 2v4a2 2 0 0 0 2 2h4"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 9H8"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 13H8"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 17H8"/></svg>`,
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

IconSiYuanBiJi.displayName = 'IconSiYuanBiJi'

export default IconSiYuanBiJi
