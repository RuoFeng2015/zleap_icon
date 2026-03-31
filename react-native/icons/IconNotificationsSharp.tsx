import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconNotificationsSharpProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconNotificationsSharp = forwardRef<unknown, IconNotificationsSharpProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="black" d="M12 22.5a3.75 3.75 0 0 0 3.436-2.25H8.564A3.75 3.75 0 0 0 12 22.5"/><path fill="black" d="M18.75 13.5v-2.837c0-3.304-1.282-6.181-4.5-6.913l-.375-2.25h-3.75L9.75 3.75c-3.229.732-4.5 3.598-4.5 6.913V13.5L3 16.5v2.25h18V16.5z"/></svg>`,
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

IconNotificationsSharp.displayName = 'IconNotificationsSharp'

export default IconNotificationsSharp
