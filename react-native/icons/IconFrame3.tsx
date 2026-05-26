import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFrame3Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFrame3 = forwardRef<unknown, IconFrame3Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><g filter="url(#a)"><mask id="b" width="1440" height="961" x="-16" y="-85" fill="black" maskUnits="userSpaceOnUse"/><path fill="#D4D4D4" d="M330-84h-.5v960h1V-84z"/><path stroke="#A3A3A3" stroke-linejoin="round" stroke-width="1.25" d="M2.081 3.333c0-.46.373-.833.833-.833h5L9.998 5h7.083c.46 0 .833.373.833.833v10.834c0 .46-.373.833-.833.833H2.914a.833.833 0 0 1-.833-.833z"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M12.5 10.828 10 8.333l-2.5 2.5"/><path stroke="#A3A3A3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M10 8.333v5.834"/><path fill="#E7E5E4" d="M-16-84v1h1440v-2H-16z" mask="url(#b)"/></g><defs><filter id="a" width="1448" height="969" x="-20" y="-85" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_326_19041"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_326_19041" mode="normal" result="shape"/></filter></defs></svg>`,
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

IconFrame3.displayName = 'IconFrame3'

export default IconFrame3
