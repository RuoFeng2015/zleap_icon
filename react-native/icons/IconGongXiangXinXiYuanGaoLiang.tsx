import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGongXiangXinXiYuanGaoLiangProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGongXiangXinXiYuanGaoLiang = forwardRef<unknown, IconGongXiangXinXiYuanGaoLiangProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path fill="#00B96B" stroke="#00B96B" stroke-width=".803" d="M8.393 4.177a2.41 2.41 0 1 1 0 4.82 2.41 2.41 0 0 1 0-4.82Z"/><path fill="#00B96B" stroke="#00B96B" stroke-width=".803" d="M8.394 11.004c2.751 0 5 2.121 5.204 4.82H3.19a5.215 5.215 0 0 1 5.204-4.82Z"/><path stroke="#00B96B" stroke-linecap="round" stroke-width="1.606" d="M17.228 10.603h-4.016"/><path stroke="#00B96B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.606" d="m15.22 8.595 2.008 2.008-2.008 2.007"/></svg>`,
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
        viewBox="0 0 20 20"
        {...props}
      />
    )
  },
)

IconGongXiangXinXiYuanGaoLiang.displayName = 'IconGongXiangXinXiYuanGaoLiang'

export default IconGongXiangXinXiYuanGaoLiang
