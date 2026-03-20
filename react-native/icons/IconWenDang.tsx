import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconWenDangProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconWenDang = forwardRef<unknown, IconWenDangProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#4A4A4A" stroke="#4A4A4A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.5 15h7"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.5 18H12"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.5 8.5h5"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11V6"/></svg>`,
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

IconWenDang.displayName = 'IconWenDang'

export default IconWenDang
