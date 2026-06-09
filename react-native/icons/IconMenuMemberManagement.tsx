import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuMemberManagementProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuMemberManagement = forwardRef<unknown, IconMenuMemberManagementProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 120 120"><rect width="120" height="120" fill="url(#a)" rx="30"/><path fill="url(#b)" stroke="url(#c)" d="M60.4 59c6.35 0 11.5-5.15 11.5-11.5S66.75 36 60.4 36s-11.5 5.15-11.5 11.5S54.05 59 60.4 59Z"/><path fill="url(#d)" d="M35.79 59c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8" opacity=".8"/><path fill="url(#e)" d="M85 59c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8" opacity=".8"/><path fill="url(#f)" stroke="url(#g)" d="M79.67 75.3s0 .04.01.07c.51 2.69.35 7.95-3.68 7.95H44.65c-3.3 0-3.76-3.46-3.75-5.79s.43-4.16 1.72-6.16c1.1-1.71 2.54-3.22 4.2-4.48 3.54-2.7 8.02-4.19 12.56-4.38.34-.01.68-.02 1.02-.02 8.36 0 17.66 4.56 19.28 12.81z"/><path fill="url(#h)" d="M39.26 69.2c1.33-2.06 3.15-3.91 5.23-5.5.06-.05.12-.08.18-.13-2.68-1.37-5.9-2.08-8.88-2.08-.28 0-.55 0-.83.02-3.68.16-7.31 1.37-10.17 3.55-1.34 1.02-2.51 2.24-3.4 3.62-1.04 1.62-1.38 3.1-1.39 4.99s.37 4.69 3.04 4.69h13.88c-.01-.28-.02-.56-.02-.85.02-3.28.73-5.77 2.36-8.31" opacity=".8"/><path fill="url(#i)" d="m100.62 71.92-.01-.06C99.3 65.18 91.76 61.49 85 61.49c-.28 0-.55 0-.83.02-2.72.12-5.64.81-8.01 2.04 3.57 2.64 6.5 6.29 7.43 10.92l.04.19c.1.53.32 1.97.25 3.7h13.77c3.27 0 3.4-4.26 2.98-6.44z" opacity=".8"/><defs><linearGradient id="a" x1="60" x2="60" y1="5.031" y2="119.458" gradientUnits="userSpaceOnUse"><stop stop-color="#7386F4"/><stop offset="1" stop-color="#44EEF5"/></linearGradient><linearGradient id="b" x1="60.4" x2="60.4" y1="36" y2="59" gradientUnits="userSpaceOnUse"><stop offset=".127" stop-color="white"/><stop offset="1" stop-color="#4CCBF5" stop-opacity=".7"/></linearGradient><linearGradient id="c" x1="60.4" x2="60.4" y1="36" y2="59" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#71DCF1"/></linearGradient><linearGradient id="d" x1="35.457" x2="35.457" y1="43" y2="59" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#D0FFF7" stop-opacity=".7"/></linearGradient><linearGradient id="e" x1="84.667" x2="84.667" y1="43" y2="59" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#D0FFF7" stop-opacity=".7"/></linearGradient><linearGradient id="f" x1="60.393" x2="60.393" y1="62.49" y2="83.32" gradientUnits="userSpaceOnUse"><stop offset=".127" stop-color="white"/><stop offset="1" stop-color="#4CCBF5" stop-opacity=".7"/></linearGradient><linearGradient id="g" x1="60.393" x2="60.393" y1="62.49" y2="83.32" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#71DCF1"/></linearGradient><linearGradient id="h" x1="31.821" x2="31.821" y1="61.49" y2="78.36" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#D0FFF7" stop-opacity=".7"/></linearGradient><linearGradient id="i" x1="87.968" x2="87.968" y1="61.49" y2="78.36" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#D0FFF7" stop-opacity=".7"/></linearGradient></defs></svg>`,
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
        viewBox="0 0 120 120"
        {...props}
      />
    )
  },
)

IconMenuMemberManagement.displayName = 'IconMenuMemberManagement'

export default IconMenuMemberManagement
