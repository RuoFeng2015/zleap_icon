import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconWoDeXinXiYuanGaoLiangProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconWoDeXinXiYuanGaoLiang = forwardRef<unknown, IconWoDeXinXiYuanGaoLiangProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path fill="#00B96B" d="M4.333 6.5A1.667 1.667 0 0 1 6 4.834h2.917l1.25 1.25H16a1.667 1.667 0 0 1 1.667 1.666v5A1.667 1.667 0 0 1 16 14.417H6a1.667 1.667 0 0 1-1.667-1.667z" opacity=".3"/><path fill="#00B96B" d="M2.667 8.167A1.667 1.667 0 0 1 4.333 6.5h3.334l1.25 1.25h5.416A1.667 1.667 0 0 1 16 9.417v4.166a1.666 1.666 0 0 1-1.667 1.667h-10a1.667 1.667 0 0 1-1.666-1.667z" opacity=".9"/></svg>`,
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

IconWoDeXinXiYuanGaoLiang.displayName = 'IconWoDeXinXiYuanGaoLiang'

export default IconWoDeXinXiYuanGaoLiang
