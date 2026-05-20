import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconYinPin1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconYinPin1 = forwardRef<unknown, IconYinPin1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#A3A3A3" stroke-width="1.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-width="1.5" d="M15 9v6"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-width="1.5" d="M18 11v2"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-width="1.5" d="M9 9v6"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-width="1.5" d="M6 11v2"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-width="1.5" d="M12 7v10"/></svg>`,
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

IconYinPin1.displayName = 'IconYinPin1'

export default IconYinPin1
