import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuHomeProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuHome = forwardRef<unknown, IconMenuHomeProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 49 49"><rect width="48.1" height="48.1" x=".052" y=".05" fill="#FAFAFA" rx="10.05"/><rect width="48.1" height="48.1" x=".052" y=".05" stroke="#D4D4D8" stroke-width=".1" rx="10.05"/><path fill="url(#a)" d="M11.102 14.877a3.75 3.75 0 0 1 3.75-3.75h4.5a3.75 3.75 0 0 1 3.75 3.75v7.5a3.75 3.75 0 0 1-3.75 3.75h-4.5a3.75 3.75 0 0 1-3.75-3.75z"/><path fill="url(#b)" d="M11.102 31.127a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"/><path fill="url(#c)" d="M25.102 28.877a3.75 3.75 0 0 1 3.75-3.75h4.5a3.75 3.75 0 0 1 3.75 3.75v4.5a3.75 3.75 0 0 1-3.75 3.75h-4.5a3.75 3.75 0 0 1-3.75-3.75z"/><path fill="url(#d)" d="M25.102 17.127a6 6 0 1 1 12 0 6 6 0 0 1-12 0"/><defs><linearGradient id="a" x1="17.102" x2="17.102" y1="11.127" y2="26.127" gradientUnits="userSpaceOnUse"><stop stop-color="#5BF776"/><stop offset="1" stop-color="#0DBC29"/></linearGradient><linearGradient id="b" x1="17.102" x2="17.102" y1="29.118" y2="37.118" gradientUnits="userSpaceOnUse"><stop stop-color="#C873F5"/><stop offset="1" stop-color="#7B33BB"/></linearGradient><linearGradient id="c" x1="31.102" x2="31.102" y1="25.127" y2="37.127" gradientUnits="userSpaceOnUse"><stop stop-color="#FE9D02"/><stop offset="1" stop-color="#F7701D"/></linearGradient><linearGradient id="d" x1="31.102" x2="31.102" y1="11.127" y2="23.127" gradientUnits="userSpaceOnUse"><stop stop-color="#1D6FF2"/><stop offset="1" stop-color="#1AC8FC"/></linearGradient></defs></svg>`,
      [],
    )

    const xml = useMemo(() => {
      return baseXml
    }, [baseXml, color])

    return (
      <SvgXml
        ref={ref as never}
        xml={xml}
        width={size}
        height={size}
        viewBox="0 0 49 49"
        {...props}
      />
    )
  },
)

IconMenuHome.displayName = 'IconMenuHome'

export default IconMenuHome
