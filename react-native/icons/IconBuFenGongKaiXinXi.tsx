import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconBuFenGongKaiXinXiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconBuFenGongKaiXinXi = forwardRef<unknown, IconBuFenGongKaiXinXiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 84 106"><g filter="url(#a)"><path fill="#FED7AA" d="M75.5 21.904v63.2A8.896 8.896 0 0 1 66.604 94H16.896A8.896 8.896 0 0 1 8 85.104V12.896A8.896 8.896 0 0 1 16.896 4h39.112z"/><g filter="url(#b)"><path fill="#E4E7EC" d="M75.5 21.904H58.232a2.224 2.224 0 0 1-2.224-2.224V4z"/></g></g><defs><filter id="a" width="83.5" height="106" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="4"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2647_1738"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2647_1738" mode="normal" result="shape"/></filter><filter id="b" width="28.388" height="26.799" x="49.336" y="1.776" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-2.224" dy="2.224"/><feGaussianBlur stdDeviation="2.224"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2647_1738"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2647_1738" mode="normal" result="shape"/></filter></defs></svg>`,
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
        viewBox="0 0 84 106"
        {...props}
      />
    )
  },
)

IconBuFenGongKaiXinXi.displayName = 'IconBuFenGongKaiXinXi'

export default IconBuFenGongKaiXinXi
