import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconBiJiBenProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconBiJiBen = forwardRef<unknown, IconBiJiBenProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#737373" stroke-linejoin="round" stroke-width="1.5" d="M4 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 2v20"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6h4"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10h4"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 2h6"/><path stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 22h6"/></svg>`,
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

IconBiJiBen.displayName = 'IconBiJiBen'

export default IconBiJiBen
