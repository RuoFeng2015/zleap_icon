import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconShaiXuan2Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconShaiXuan2 = forwardRef<unknown, IconShaiXuan2Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M19.565 5.275h-5.883"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M10.319 5.275H4.436"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M19.565 12H12"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M8.638 12H4.436"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M19.564 18.725H15.36"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M12 18.725H4.436"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M13.682 3.596v3.362"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M8.639 10.318v3.362"/><path stroke="#525252" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.681" d="M15.361 17.043v3.362"/></svg>`,
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

IconShaiXuan2.displayName = 'IconShaiXuan2'

export default IconShaiXuan2
