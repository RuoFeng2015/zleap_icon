import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconLianXiRen1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconLianXiRen1 = forwardRef<unknown, IconLianXiRen1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#52525B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.555" d="M12 13.538a3.846 3.846 0 1 0 0-7.692 3.846 3.846 0 0 0 0 7.692"/><path stroke="#52525B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.555" d="M5.43 19.538a7.693 7.693 0 0 1 13.14 0"/><path stroke="#52525B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.555" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10"/></svg>`,
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

IconLianXiRen1.displayName = 'IconLianXiRen1'

export default IconLianXiRen1
