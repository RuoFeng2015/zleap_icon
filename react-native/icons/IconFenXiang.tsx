import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFenXiangProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFenXiang = forwardRef<unknown, IconFenXiangProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 2.483a.2.2 0 0 1 .341-.142l8.514 8.514a.2.2 0 0 1-.005.286l-8.513 8.04a.2.2 0 0 1-.337-.145V14.2a.2.2 0 0 0-.202-.198c-5.328.11-8.292 4.577-9.349 6.563-.103.194-.442.115-.436-.105.2-7.831 2.749-12.864 9.784-12.959A.205.205 0 0 0 13 7.3z"/></svg>`,
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

IconFenXiang.displayName = 'IconFenXiang'

export default IconFenXiang
