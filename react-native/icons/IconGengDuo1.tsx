import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGengDuo1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGengDuo1 = forwardRef<unknown, IconGengDuo1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#0D131A" d="M6 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path fill="#0D131A" d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/><path fill="#0D131A" d="M18 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/></svg>`,
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

IconGengDuo1.displayName = 'IconGengDuo1'

export default IconGengDuo1
