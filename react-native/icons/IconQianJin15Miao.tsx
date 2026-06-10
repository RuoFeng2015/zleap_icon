import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconQianJin15MiaoProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconQianJin15Miao = forwardRef<unknown, IconQianJin15MiaoProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 26"><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.125" d="M9.75 17.813v-7.5l-1.5 1.406"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.125" d="M12.75 17.344a2.344 2.344 0 1 0 0-3.75l.469-3.282H16.5"/><path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.875" d="M19.161 6.128a10.383 10.383 0 0 1 .518 14.742c-3.955 4.214-10.599 4.444-14.84.515a10.383 10.383 0 0 1-.518-14.742 10.52 10.52 0 0 1 8.422-3.292M11.25.938l2.674 2.533-2.674 2.717"/></svg>`,
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
        viewBox="0 0 24 26"
        {...props}
      />
    )
  },
)

IconQianJin15Miao.displayName = 'IconQianJin15Miao'

export default IconQianJin15Miao
