import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconRenWuProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconRenWu = forwardRef<unknown, IconRenWuProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><path fill="#FCD34D" stroke="#FCD34D" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M15.836 1.668H4.169a.833.833 0 0 0-.833.833v15c0 .46.373.834.833.834h11.667c.46 0 .833-.373.833-.834v-15a.833.833 0 0 0-.833-.833"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M7.086 12.5h5.833"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M7.086 15h2.917"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M12.5 5.418 9.167 8.751 7.5 7.085"/></svg>`,
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

IconRenWu.displayName = 'IconRenWu'

export default IconRenWu
