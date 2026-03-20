import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFuZhiLianJieProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFuZhiLianJie = forwardRef<unknown, IconFuZhiLianJieProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#38BDF8"/><g stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width=".9"><path d="m11.44 10.092 2.286-2.285c.665-.666 1.758-.651 2.442.032.683.684.698 1.777.032 2.443l-1.983 1.983"/><path d="M9.775 11.75 7.79 13.732c-.665.665-.65 1.759.033 2.442s1.776.698 2.442.033l2.285-2.285"/><path d="M11.473 12.537c-.684-.684-.698-1.777-.033-2.443"/><path d="M12.55 11.45c.684.683.699 1.776.034 2.441"/></g></svg>`,
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

IconFuZhiLianJie.displayName = 'IconFuZhiLianJie'

export default IconFuZhiLianJie
