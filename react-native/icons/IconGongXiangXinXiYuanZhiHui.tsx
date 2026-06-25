import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGongXiangXinXiYuanZhiHuiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGongXiangXinXiYuanZhiHui = forwardRef<unknown, IconGongXiangXinXiYuanZhiHuiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path fill="#9CA3AF" d="M8.394 9.398a2.811 2.811 0 1 0 0-5.622 2.811 2.811 0 0 0 0 5.622"/><path fill="#9CA3AF" d="M2.772 16.224a5.62 5.62 0 0 1 5.622-5.622 5.62 5.62 0 0 1 5.622 5.622z"/><path stroke="#9CA3AF" stroke-linecap="round" stroke-width="1.606" d="M17.228 10.603h-4.016"/><path stroke="#9CA3AF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.606" d="m15.22 8.595 2.008 2.008-2.008 2.007"/></svg>`,
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

IconGongXiangXinXiYuanZhiHui.displayName = 'IconGongXiangXinXiYuanZhiHui'

export default IconGongXiangXinXiYuanZhiHui
