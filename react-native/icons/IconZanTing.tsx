import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZanTingProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZanTing = forwardRef<unknown, IconZanTingProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#171717" d="M13.655 5.793c0-.457.37-.827.827-.827h2.483c.457 0 .828.37.828.827v13.242c0 .457-.37.827-.828.827h-2.483a.83.83 0 0 1-.827-.827z"/><path fill="#171717" d="M6.207 5.793c0-.457.37-.827.827-.827h2.483c.457 0 .828.37.828.827v13.242c0 .457-.371.827-.828.827H7.034a.83.83 0 0 1-.827-.827z"/></svg>`,
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

IconZanTing.displayName = 'IconZanTing'

export default IconZanTing
