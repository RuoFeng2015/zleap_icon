import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconYiShouCang1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconYiShouCang1 = forwardRef<unknown, IconYiShouCang1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#FCD34D" stroke="#FCD34D" stroke-linejoin="round" stroke-width="1.5" d="M12.9 4.317a1 1 0 0 0-1.793.004L9.175 8.265a1 1 0 0 1-.755.55l-4.418.64a1 1 0 0 0-.555 1.705l3.205 3.134a1 1 0 0 1 .286.888l-.755 4.297a1 1 0 0 0 1.455 1.056l3.89-2.075a1 1 0 0 1 .942 0l3.895 2.076a1 1 0 0 0 1.456-1.054l-.751-4.301a1 1 0 0 1 .285-.887l3.203-3.136a1 1 0 0 0-.556-1.704l-4.388-.64a1 1 0 0 1-.751-.545z"/></svg>`,
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

IconYiShouCang1.displayName = 'IconYiShouCang1'

export default IconYiShouCang1
