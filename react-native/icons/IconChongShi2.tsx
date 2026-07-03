import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconChongShi2Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconChongShi2 = forwardRef<unknown, IconChongShi2Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#FF8A00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 4v8"/><path stroke="#FF8A00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12v8"/><path stroke="#FF8A00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12A9 9 0 0 0 5.524 5.75M3 12a9 9 0 0 0 15.25 6.476"/></svg>`,
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

IconChongShi2.displayName = 'IconChongShi2'

export default IconChongShi2
