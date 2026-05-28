import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconKuaiJin15MiaoProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconKuaiJin15Miao = forwardRef<unknown, IconKuaiJin15MiaoProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width=".95" d="M10.099 16.436v-6.337l-1.267 1.188"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width=".95" d="M12.633 16.04a1.98 1.98 0 1 0 0-3.168l.396-2.773h2.773"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.584" d="M18.05 6.564a8.77 8.77 0 0 1 .438 12.455c-3.341 3.56-8.955 3.755-12.538.435A8.77 8.77 0 0 1 5.512 7a8.89 8.89 0 0 1 7.115-2.781m-1.26-2.04 2.259 2.141-2.26 2.295"/></svg>`,
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

IconKuaiJin15Miao.displayName = 'IconKuaiJin15Miao'

export default IconKuaiJin15Miao
