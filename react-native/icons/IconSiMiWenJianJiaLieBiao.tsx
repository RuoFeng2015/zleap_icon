import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconSiMiWenJianJiaLieBiaoProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconSiMiWenJianJiaLieBiao = forwardRef<unknown, IconSiMiWenJianJiaLieBiaoProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#4A4A4A" stroke="#4A4A4A" stroke-linejoin="round" stroke-width="1.5" d="M2.5 4a1 1 0 0 1 1-1h6L12 6h8.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1z"/><path fill="white" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.5 13h-7v4h7z"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 13v-1.5a1.5 1.5 0 1 0-3 0V13"/></svg>`,
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

IconSiMiWenJianJiaLieBiao.displayName = 'IconSiMiWenJianJiaLieBiao'

export default IconSiMiWenJianJiaLieBiao
