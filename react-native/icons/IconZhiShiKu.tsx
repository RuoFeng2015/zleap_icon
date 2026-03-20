import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZhiShiKuProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZhiShiKu = forwardRef<unknown, IconZhiShiKuProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#4A4A4A" stroke="#4A4A4A" stroke-linejoin="round" stroke-width="1.5" d="M16 3h-5v18h5z"/><path fill="#4A4A4A" stroke="#4A4A4A" stroke-linejoin="round" stroke-width="1.5" d="M21 3h-5v18h5z"/><path fill="#4A4A4A" stroke="#4A4A4A" stroke-linejoin="round" stroke-width="1.5" d="m5 3 4 .5L7.25 21 3 20.5z"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.5 9V7.5"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 9V7.5"/></svg>`,
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

IconZhiShiKu.displayName = 'IconZhiShiKu'

export default IconZhiShiKu
