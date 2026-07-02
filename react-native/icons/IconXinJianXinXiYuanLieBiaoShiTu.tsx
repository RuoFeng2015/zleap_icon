import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconXinJianXinXiYuanLieBiaoShiTuProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconXinJianXinXiYuanLieBiaoShiTu = forwardRef<unknown, IconXinJianXinXiYuanLieBiaoShiTuProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 22 22"><path stroke="#C4C4C4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.467" d="M11 9.167v5.5"/><path stroke="#C4C4C4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.467" d="M8.25 11.917h5.5"/><path stroke="#C4C4C4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.467" d="M18.333 18.333a1.833 1.833 0 0 0 1.834-1.833V7.333A1.833 1.833 0 0 0 18.333 5.5h-7.241a1.83 1.83 0 0 1-1.55-.825l-.742-1.1a1.83 1.83 0 0 0-1.53-.825H3.666a1.833 1.833 0 0 0-1.834 1.833V16.5a1.834 1.834 0 0 0 1.834 1.833z"/></svg>`,
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
        viewBox="0 0 22 22"
        {...props}
      />
    )
  },
)

IconXinJianXinXiYuanLieBiaoShiTu.displayName = 'IconXinJianXinXiYuanLieBiaoShiTu'

export default IconXinJianXinXiYuanLieBiaoShiTu
