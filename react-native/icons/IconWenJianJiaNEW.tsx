import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconWenJianJiaNEWProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconWenJianJiaNEW = forwardRef<unknown, IconWenJianJiaNEWProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg class="icon" version="1.1" viewBox="0 0 1024 1024"><path fill="#217aff" d="M970.667 170.667H468.62l-35.673-59.46a53.59 53.59 0 0 0-45.734-25.874H96a53.393 53.393 0 0 0-53.333 53.334v704A53.393 53.393 0 0 0 96 896h874.667A53.393 53.393 0 0 0 1024 842.667V224a53.393 53.393 0 0 0-53.333-53.333m0 42.666A10.667 10.667 0 0 1 981.333 224v75.74a53.6 53.6 0 0 0-10.666-1.073H551.453a10.72 10.72 0 0 1-9.146-5.18l-48.094-80.154z"/></svg>`,
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
        viewBox="0 0 1024 1024"
        {...props}
      />
    )
  },
)

IconWenJianJiaNEW.displayName = 'IconWenJianJiaNEW'

export default IconWenJianJiaNEW
