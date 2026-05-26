import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFrame1261156360Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFrame1261156360 = forwardRef<unknown, IconFrame1261156360Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><g filter="url(#a)"><mask id="b" width="1440" height="961" x="-275" y="-85" fill="black" maskUnits="userSpaceOnUse"/><path fill="#D4D4D4" d="M71-84h-.5v960h1V-84z"/><path stroke="#FF8A00" stroke-linejoin="round" stroke-width="1.25" d="M16.25 2.5H3.75c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V3.75c0-.69-.56-1.25-1.25-1.25Z"/><path stroke="#FF8A00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M10 6.667v6.666"/><path stroke="#FF8A00" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M6.662 10h6.667"/><path fill="#E7E5E4" d="M-275-84v1h1440v-2H-275z" mask="url(#b)"/></g><defs><filter id="a" width="1448" height="969" x="-279" y="-85" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_326_19041"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_326_19041" mode="normal" result="shape"/></filter></defs></svg>`,
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
        viewBox="0 0 20 20"
        {...props}
      />
    )
  },
)

IconFrame1261156360.displayName = 'IconFrame1261156360'

export default IconFrame1261156360
