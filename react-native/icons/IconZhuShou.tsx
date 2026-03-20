import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZhuShouProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZhuShou = forwardRef<unknown, IconZhuShouProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#343330" d="M12 2.25A9.75 9.75 0 1 0 21.75 12 9.76 9.76 0 0 0 12 2.25m0 18A8.25 8.25 0 1 1 20.25 12 8.26 8.26 0 0 1 12 20.25M7.5 10.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0m9.75 0a.75.75 0 0 1-.75.75h-2.25a.75.75 0 1 1 0-1.5h2.25a.75.75 0 0 1 .75.75m-.851 4.5C15.434 16.293 13.83 17.25 12 17.25s-3.434-.956-4.4-2.625a.75.75 0 1 1 1.3-.75c.7 1.21 1.8 1.875 3.1 1.875s2.4-.666 3.101-1.875a.75.75 0 1 1 1.298.75"/></svg>`,
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

IconZhuShou.displayName = 'IconZhuShou'

export default IconZhuShou
