import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconYiDianZan1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconYiDianZan1 = forwardRef<unknown, IconYiDianZan1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#FF8A00" stroke="#FF8A00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.5 3.418a5.5 5.5 0 0 0-5.5 5.5c0 5.5 6.5 10.5 10 11.664 3.5-1.163 10-6.164 10-11.664a5.5 5.5 0 0 0-10-3.163 5.5 5.5 0 0 0-4.5-2.337"/></svg>`,
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

IconYiDianZan1.displayName = 'IconYiDianZan1'

export default IconYiDianZan1
