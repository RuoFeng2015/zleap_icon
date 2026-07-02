import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconKaPianBuJuProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconKaPianBuJu = forwardRef<unknown, IconKaPianBuJuProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Z"/><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M10.5 6.5h-4v4h4z"/><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M17.5 6.5h-4v4h4z"/><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M10.5 13.5h-4v4h4z"/><path stroke="#0D131A" stroke-linejoin="round" stroke-width="1.5" d="M17.5 13.5h-4v4h4z"/></svg>`,
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

IconKaPianBuJu.displayName = 'IconKaPianBuJu'

export default IconKaPianBuJu
