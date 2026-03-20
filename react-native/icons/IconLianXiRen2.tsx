import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconLianXiRen2Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconLianXiRen2 = forwardRef<unknown, IconLianXiRen2Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#171717" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 21H7c-4 0-5-1-5-5V8c0-4 1-5 5-5h10c4 0 5 1 5 5v8c0 4-1 5-5 5"/><path stroke="#171717" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 8h5"/><path stroke="#171717" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12h4"/><path stroke="#171717" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16h2"/><path stroke="#171717" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.5 11.29a1.81 1.81 0 1 0 0-3.62 1.81 1.81 0 0 0 0 3.62"/><path stroke="#171717" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16.33a3.02 3.02 0 0 0-2.74-2.72 7.7 7.7 0 0 0-1.52 0A3.03 3.03 0 0 0 5 16.33"/></svg>`,
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

IconLianXiRen2.displayName = 'IconLianXiRen2'

export default IconLianXiRen2
