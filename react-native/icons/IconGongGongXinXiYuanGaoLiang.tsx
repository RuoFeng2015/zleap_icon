import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGongGongXinXiYuanGaoLiangProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGongGongXinXiYuanGaoLiang = forwardRef<unknown, IconGongGongXinXiYuanGaoLiangProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path fill="#00B96B" d="M10 17.125a7.125 7.125 0 1 0 0-14.25 7.125 7.125 0 0 0 0 14.25" opacity=".18"/><path fill="#00B96B" d="M10 17.125c1.657 0 3-3.19 3-7.125s-1.343-7.125-3-7.125S7 6.065 7 10s1.343 7.125 3 7.125" opacity=".28"/><path stroke="#00B96B" stroke-linecap="round" stroke-width=".825" d="M2.875 7.375h14.25m-14.25 5.25h14.25"/><path stroke="#00B96B" stroke-linecap="round" stroke-width="1.05" d="M2.875 10h14.25"/><path stroke="#00B96B" stroke-width=".825" d="M10 17.125c1.657 0 3-3.19 3-7.125s-1.343-7.125-3-7.125S7 6.065 7 10s1.343 7.125 3 7.125Z"/><path stroke="#00B96B" stroke-width="1.35" d="M10 17.125a7.125 7.125 0 1 0 0-14.25 7.125 7.125 0 0 0 0 14.25Z"/></svg>`,
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

IconGongGongXinXiYuanGaoLiang.displayName = 'IconGongGongXinXiYuanGaoLiang'

export default IconGongGongXinXiYuanGaoLiang
