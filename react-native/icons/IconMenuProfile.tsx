import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuProfileProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuProfile = forwardRef<unknown, IconMenuProfileProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 120 120"><rect width="120" height="120" fill="url(#a)" rx="30"/><path fill="url(#b)" fill-opacity=".6" d="M60 98c20.987 0 38-17.013 38-38S80.987 22 60 22 22 39.013 22 60s17.013 38 38 38" opacity=".8"/><path fill="url(#c)" stroke="url(#d)" d="M60 67.1c14.257 0 25.893 7.812 28.008 17.814C81.143 92.633 71.14 97.5 60 97.5s-21.144-4.867-28.009-12.586C34.106 74.912 45.743 67.1 60 67.1Zm-.5-32.6c7.749 0 14 6.06 14 13.5s-6.251 13.5-14 13.5-14-6.06-14-13.5 6.251-13.5 14-13.5Z"/><defs><linearGradient id="a" x1="86.5" x2="19" y1="0" y2="120" gradientUnits="userSpaceOnUse"><stop offset=".377" stop-color="#595FFF"/><stop offset="1" stop-color="#C38DFF"/></linearGradient><linearGradient id="b" x1="60" x2="60" y1="22" y2="98" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="white"/></linearGradient><linearGradient id="c" x1="60" x2="60" y1="34" y2="98" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#8C90FB"/></linearGradient><linearGradient id="d" x1="60" x2="60" y1="34" y2="98" gradientUnits="userSpaceOnUse"><stop offset=".096" stop-color="white"/><stop offset="1" stop-color="#A7A9FC"/></linearGradient></defs></svg>`,
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

IconMenuProfile.displayName = 'IconMenuProfile'

export default IconMenuProfile
