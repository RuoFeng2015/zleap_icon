import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconTanSuoProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconTanSuo = forwardRef<unknown, IconTanSuoProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16 16.5 4 4"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 11.5a7 7 0 1 1-7-7"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="m15.5 3.5.258.697c.338.914.507 1.371.84 1.704.334.334.791.503 1.705.841L19 7l-.697.258c-.914.338-1.371.507-1.704.84-.334.334-.503.791-.841 1.705l-.258.697-.258-.697c-.338-.914-.507-1.371-.84-1.704-.334-.334-.791-.503-1.705-.841L12 7l.697-.258c.914-.338 1.371-.507 1.704-.84.334-.334.503-.791.841-1.705z"/></svg>`,
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

IconTanSuo.displayName = 'IconTanSuo'

export default IconTanSuo
