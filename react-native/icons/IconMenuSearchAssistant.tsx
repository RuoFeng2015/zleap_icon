import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuSearchAssistantProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuSearchAssistant = forwardRef<unknown, IconMenuSearchAssistantProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 120 119"><rect width="120" height="119" fill="url(#a)" rx="30"/><path fill="url(#b)" stroke="url(#c)" d="M97.098 61.477c0 3.164-.883 6.228-2.787 8.786-2.291 3.065-5.822 5.197-9.5 6.129-1.935.486-3.829.446-5.803.446-1.021 0-1.695-1.031-1.328-1.983 2.112-5.603 1.467-12.386-1.915-17.404-7.021-11.662-25.566-11.642-32.588 0-3.382 4.998-4.017 11.81-1.914 17.404.357.962-.307 1.983-1.329 1.983h-3.907c-16.453.169-19.716-23.433-4.007-27.667-.545-8.29 8.688-14.23 16.165-10.899 8.837-14.746 34.344-9.262 35.772 8.063 7.458 1.19 13.14 7.516 13.14 15.142Z"/><path fill="url(#d)" d="m79.908 84.15-6.847-6.942a16.1 16.1 0 0 0 2.644-8.863c0-8.96-7.279-16.222-16.26-16.222s-16.26 7.262-16.26 16.222 7.279 16.223 16.26 16.223c3.11 0 6.016-.875 8.49-2.384l6.873 6.968a3.56 3.56 0 0 0 2.553 1.065c.93 0 1.814-.34 2.507-1.025a3.564 3.564 0 0 0 .04-5.049zm-20.463-3.684c-6.697 0-12.143-5.433-12.143-12.114s5.446-12.115 12.143-12.115c6.696 0 12.143 5.434 12.143 12.115 0 6.68-5.447 12.114-12.143 12.114"/><path fill="url(#e)" d="M49.477 68.543c0-5.494 4.18-10.18 9.603-10.18.915 0 1.656.735 1.656 1.642s-.741 1.642-1.656 1.642c-3.35 0-6.292 2.963-6.292 6.896 0 .907-.741 1.642-1.656 1.642a1.65 1.65 0 0 1-1.655-1.642"/><defs><linearGradient id="a" x1="60" x2="60" y1="0" y2="119" gradientUnits="userSpaceOnUse"><stop stop-color="#FBAB00"/><stop offset="1" stop-color="#FF7B10"/></linearGradient><linearGradient id="b" x1="55" x2="55.5" y1="20" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#FEFBFB"/><stop offset="1" stop-color="#FFAA21"/></linearGradient><linearGradient id="c" x1="59.454" x2="59.454" y1="29.75" y2="76.839" gradientUnits="userSpaceOnUse"><stop offset=".232" stop-color="#FFF8EB"/><stop offset="1" stop-color="#FF9A37"/></linearGradient><linearGradient id="d" x1="62.06" x2="62" y1="52.123" y2="104" gradientUnits="userSpaceOnUse"><stop stop-color="#FEFBFB"/><stop offset="1" stop-color="#FFAA21"/></linearGradient><linearGradient id="e" x1="55.106" x2="55" y1="58.362" y2="85" gradientUnits="userSpaceOnUse"><stop stop-color="#FEFBFB"/><stop offset="1" stop-color="#FFAA21"/></linearGradient></defs></svg>`,
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
        viewBox="0 0 120 119"
        {...props}
      />
    )
  },
)

IconMenuSearchAssistant.displayName = 'IconMenuSearchAssistant'

export default IconMenuSearchAssistant
