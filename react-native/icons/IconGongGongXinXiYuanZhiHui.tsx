import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGongGongXinXiYuanZhiHuiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGongGongXinXiYuanZhiHui = forwardRef<unknown, IconGongGongXinXiYuanZhiHuiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path fill="#9CA3AF" d="M10 17.228a7.227 7.227 0 1 0 0-14.455 7.227 7.227 0 0 0 0 14.455" opacity=".18"/><path fill="#9CA3AF" d="M10 17.228c1.68 0 3.043-3.236 3.043-7.228S11.681 2.772 10 2.772c-1.68 0-3.043 3.236-3.043 7.228S8.32 17.227 10 17.227" opacity=".28"/><path stroke="#9CA3AF" stroke-linecap="round" stroke-width=".837" d="M2.772 7.337h14.455M2.772 12.663h14.455"/><path stroke="#9CA3AF" stroke-linecap="round" stroke-width="1.065" d="M2.772 10h14.455"/><path stroke="#9CA3AF" stroke-width=".837" d="M10 17.228c1.68 0 3.043-3.236 3.043-7.228S11.681 2.772 10 2.772c-1.68 0-3.043 3.236-3.043 7.228S8.32 17.227 10 17.227Z"/><path stroke="#9CA3AF" stroke-width="1.369" d="M10 17.228a7.227 7.227 0 1 0 0-14.455 7.227 7.227 0 0 0 0 14.455Z"/></svg>`,
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

IconGongGongXinXiYuanZhiHui.displayName = 'IconGongGongXinXiYuanZhiHui'

export default IconGongGongXinXiYuanZhiHui
