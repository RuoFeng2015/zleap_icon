import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconLuYin1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconLuYin1 = forwardRef<unknown, IconLuYin1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#4A4A4A" stroke="#4A4A4A" stroke-linejoin="round" stroke-width="1.5" d="M15.5 5.5a3.5 3.5 0 1 0-7 0V12a3.5 3.5 0 1 0 7 0z"/><path stroke="#4A4A4A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 11.5a7.5 7.5 0 0 0 15 0"/><path stroke="#4A4A4A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19v3"/></svg>`,
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

IconLuYin1.displayName = 'IconLuYin1'

export default IconLuYin1
