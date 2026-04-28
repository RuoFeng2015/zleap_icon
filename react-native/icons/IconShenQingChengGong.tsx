import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconShenQingChengGongProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconShenQingChengGong = forwardRef<unknown, IconShenQingChengGongProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 70 70"><path stroke="#FF6900" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.375" d="m26.25 35 5.833 5.833L43.75 29.167M61.25 35a26.25 26.25 0 1 1-52.5 0 26.25 26.25 0 0 1 52.5 0"/></svg>`,
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
        viewBox="0 0 70 70"
        {...props}
      />
    )
  },
)

IconShenQingChengGong.displayName = 'IconShenQingChengGong'

export default IconShenQingChengGong
