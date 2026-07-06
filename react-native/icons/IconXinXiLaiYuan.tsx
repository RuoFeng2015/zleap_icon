import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconXinXiLaiYuanProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconXinXiLaiYuan = forwardRef<unknown, IconXinXiLaiYuanProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#FBBF24" stroke-width="1.846" d="M8.572 1.714H3.429c-.947 0-1.714.768-1.714 1.715v5.143c0 .946.767 1.714 1.714 1.714h5.143c.947 0 1.714-.768 1.714-1.714V3.429c0-.947-.767-1.715-1.714-1.715Z"/><path stroke="#FBBF24" stroke-width="1.846" d="M20.572 1.714h-5.143c-.947 0-1.714.768-1.714 1.715v5.143c0 .946.767 1.714 1.714 1.714h5.143c.947 0 1.714-.768 1.714-1.714V3.429c0-.947-.767-1.715-1.714-1.715Z"/><path stroke="#FBBF24" stroke-width="1.846" d="M8.572 13.714H3.429c-.947 0-1.714.768-1.714 1.715v5.143c0 .946.767 1.714 1.714 1.714h5.143c.947 0 1.714-.768 1.714-1.715V15.43c0-.947-.767-1.715-1.714-1.715Z"/><path stroke="#FBBF24" stroke-width="1.846" d="M20.572 13.714h-5.143c-.947 0-1.714.768-1.714 1.715v5.143c0 .946.767 1.714 1.714 1.714h5.143c.947 0 1.714-.768 1.714-1.715V15.43c0-.947-.767-1.715-1.714-1.715Z"/></svg>`,
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

IconXinXiLaiYuan.displayName = 'IconXinXiLaiYuan'

export default IconXinXiLaiYuan
