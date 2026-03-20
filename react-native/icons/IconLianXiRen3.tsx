import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconLianXiRen3Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconLianXiRen3 = forwardRef<unknown, IconLianXiRen3Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 48 48"><path fill="white" d="M-43 47H5v48h-48z"/><circle cx="25.264" cy="21.008" r="6" stroke="black" stroke-width="3"/><path stroke="black" stroke-linecap="round" stroke-width="3" d="M16.307 31.523s3.196-4.41 8.768-4.486 9.177 4.486 9.177 4.486"/><rect width="29.849" height="35.898" x="10.405" y="6.051" stroke="black" stroke-width="3" rx="1.5"/><path stroke="black" stroke-linecap="round" stroke-width="3" d="m5.708 13.444 3.469.018"/><path stroke="black" stroke-linecap="round" stroke-width="3" d="m5.693 23.994 3.469-.017"/><path stroke="black" stroke-linecap="round" stroke-width="3" d="m5.693 34.412 3.469-.017"/></svg>`,
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
        viewBox="0 0 48 48"
        {...props}
      />
    )
  },
)

IconLianXiRen3.displayName = 'IconLianXiRen3'

export default IconLianXiRen3
