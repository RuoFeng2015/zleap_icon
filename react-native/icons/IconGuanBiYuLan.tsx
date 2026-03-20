import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGuanBiYuLanProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGuanBiYuLan = forwardRef<unknown, IconGuanBiYuLanProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8c.317.61.798 1.175 1.411 1.678C6.131 11.087 8.89 12 12 12s5.87-.913 7.589-2.322C20.202 9.175 20.683 8.61 21 8"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.489 12 1.035 3.864"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18.677 10.677 2.828 2.828"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.5 13.505 2.828-2.828"/><path stroke="#0D131A" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.464 15.864 9.499 12"/></svg>`,
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

IconGuanBiYuLan.displayName = 'IconGuanBiYuLan'

export default IconGuanBiYuLan
