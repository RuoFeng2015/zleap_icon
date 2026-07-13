import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconGongKaiXinXiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconGongKaiXinXi = forwardRef<unknown, IconGongKaiXinXiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 90 90"><path fill="#BAE6FD" d="M78.75 17.904v63.2A8.896 8.896 0 0 1 69.854 90H20.146a8.896 8.896 0 0 1-8.896-8.896V8.896A8.896 8.896 0 0 1 20.146 0h39.112z"/><g filter="url(#a)"><path fill="#E4E7EC" d="M78.75 17.904H61.482a2.224 2.224 0 0 1-2.224-2.224V0z"/></g><defs><filter id="a" width="28.388" height="26.799" x="52.586" y="-2.224" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-2.224" dy="2.224"/><feGaussianBlur stdDeviation="2.224"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1063_1503" mode="normal" result="shape"/></filter></defs></svg>`,
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
        viewBox="0 0 90 90"
        {...props}
      />
    )
  },
)

IconGongKaiXinXi.displayName = 'IconGongKaiXinXi'

export default IconGongKaiXinXi
