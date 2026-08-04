import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGeminiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGemini = forwardRef<unknown, IconGeminiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg style="flex:0 0 auto;line-height:1" viewBox="0 0 24 24"><path fill="#3186FF" d="M20.616 10.835a14.2 14.2 0 0 1-4.45-3.001 14.1 14.1 0 0 1-3.678-6.452.503.503 0 0 0-.975 0 14.13 14.13 0 0 1-3.679 6.452 14.2 14.2 0 0 1-4.45 3.001q-.976.42-2.002.678a.502.502 0 0 0 0 .975q1.025.258 2.002.677a14.2 14.2 0 0 1 4.45 3.001 14.1 14.1 0 0 1 3.679 6.453.502.502 0 0 0 .975 0q.258-1.026.677-2.003a14.2 14.2 0 0 1 3.001-4.45 14.1 14.1 0 0 1 6.453-3.678.503.503 0 0 0 0-.975 13 13 0 0 1-2.003-.678"/><path fill="url(#a)" d="M20.616 10.835a14.2 14.2 0 0 1-4.45-3.001 14.1 14.1 0 0 1-3.678-6.452.503.503 0 0 0-.975 0 14.13 14.13 0 0 1-3.679 6.452 14.2 14.2 0 0 1-4.45 3.001q-.976.42-2.002.678a.502.502 0 0 0 0 .975q1.025.258 2.002.677a14.2 14.2 0 0 1 4.45 3.001 14.1 14.1 0 0 1 3.679 6.453.502.502 0 0 0 .975 0q.258-1.026.677-2.003a14.2 14.2 0 0 1 3.001-4.45 14.1 14.1 0 0 1 6.453-3.678.503.503 0 0 0 0-.975 13 13 0 0 1-2.003-.678"/><path fill="url(#b)" d="M20.616 10.835a14.2 14.2 0 0 1-4.45-3.001 14.1 14.1 0 0 1-3.678-6.452.503.503 0 0 0-.975 0 14.13 14.13 0 0 1-3.679 6.452 14.2 14.2 0 0 1-4.45 3.001q-.976.42-2.002.678a.502.502 0 0 0 0 .975q1.025.258 2.002.677a14.2 14.2 0 0 1 4.45 3.001 14.1 14.1 0 0 1 3.679 6.453.502.502 0 0 0 .975 0q.258-1.026.677-2.003a14.2 14.2 0 0 1 3.001-4.45 14.1 14.1 0 0 1 6.453-3.678.503.503 0 0 0 0-.975 13 13 0 0 1-2.003-.678"/><path fill="url(#c)" d="M20.616 10.835a14.2 14.2 0 0 1-4.45-3.001 14.1 14.1 0 0 1-3.678-6.452.503.503 0 0 0-.975 0 14.13 14.13 0 0 1-3.679 6.452 14.2 14.2 0 0 1-4.45 3.001q-.976.42-2.002.678a.502.502 0 0 0 0 .975q1.025.258 2.002.677a14.2 14.2 0 0 1 4.45 3.001 14.1 14.1 0 0 1 3.679 6.453.502.502 0 0 0 .975 0q.258-1.026.677-2.003a14.2 14.2 0 0 1 3.001-4.45 14.1 14.1 0 0 1 6.453-3.678.503.503 0 0 0 0-.975 13 13 0 0 1-2.003-.678"/><defs><linearGradient id="a" x1="7" x2="11" y1="15.5" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#08B962"/><stop offset="1" stop-color="#08B962" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="8" x2="11.5" y1="5.5" y2="11" gradientUnits="userSpaceOnUse"><stop stop-color="#F94543"/><stop offset="1" stop-color="#F94543" stop-opacity="0"/></linearGradient><linearGradient id="c" x1="3.5" x2="17.5" y1="13.5" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#FABC12"/><stop offset=".46" stop-color="#FABC12" stop-opacity="0"/></linearGradient></defs></svg>`,
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

IconGemini.displayName = 'IconGemini'

export default IconGemini
