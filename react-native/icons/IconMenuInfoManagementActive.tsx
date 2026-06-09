import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuInfoManagementActiveProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuInfoManagementActive = forwardRef<unknown, IconMenuInfoManagementActiveProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 49 49"><rect width="48.2" height="48.2" x=".099" y=".1" fill="#F6F6F6" rx="10.1"/><rect width="48.2" height="48.2" x=".099" y=".1" stroke="#D4D4D8" stroke-width=".2" rx="10.1"/><g filter="url(#a)"><path fill="#D9D9D9" d="M33.714 12.532h-8.14a.01.01 0 0 0-.006.007.01.01 0 0 1-.007.007c-1.438.002-2.5.69-2.926 1.88a4 4 0 0 0-.201 1.254v4.887c0 .954.288 1.744.84 2.295.55.55 1.34.84 2.294.84.514 0 .94.426.94.94a.803.803 0 0 0 1.25.667l2.173-1.457c.151-.1.34-.164.527-.164h3.259c.45 0 .877-.063 1.266-.201 1.19-.427 1.868-1.492 1.868-2.933v-4.888c0-1.931-1.203-3.134-3.134-3.134zm-7.683 6.594a.94.94 0 0 1-.94-.94c0-.514.426-.94.94-.94s.94.426.94.94-.413.94-.94.94m3.532 0a.94.94 0 0 1-.94-.94c0-.514.426-.94.94-.94s.94.426.94.94-.426.94-.94.94m3.523 0a.94.94 0 0 1-.94-.94c0-.514.426-.94.94-.94s.94.426.94.94-.426.94-.94.94"/></g><g filter="url(#b)"><path fill="#919191" d="M31.543 25.533c-.349 0-.697.1-.986.298l-2.865 1.908a1.92 1.92 0 0 1-1.085.328 2 2 0 0 1-.93-.238l-.01-.003a1.92 1.92 0 0 1-1.01-1.697c0-.387-.289-.745-.706-.884a4.9 4.9 0 0 1-1.901-1.153c-.925-.924-1.443-2.256-1.443-3.736V14.2a1 1 0 0 0-1-1h-3.249a4.153 4.153 0 0 0-4.159 4.144v11.14a4.146 4.146 0 0 0 4.16 4.145H32.04a4.146 4.146 0 0 0 4.16-4.144v-1.952a1 1 0 0 0-1-1zM28.727 35.73h-2.26a1.5 1.5 0 0 1-1.502-1.49v-.368a.734.734 0 0 0-.736-.735.734.734 0 0 0-.736.735v.368A1.49 1.49 0 0 1 22 35.729h-2.259a.747.747 0 0 0-.736.736c0 .397.338.735.736.735h8.986a.74.74 0 0 0 .736-.735.74.74 0 0 0-.736-.736"/></g><defs><filter id="a" width="15.355" height="13.852" x="21.965" y="12.063" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_15648_46485"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect1_innerShadow_15648_46485" mode="normal" result="effect2_innerShadow_15648_46485"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".938"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46485" mode="normal" result="effect3_innerShadow_15648_46485"/></filter><filter id="b" width="26.406" height="26.875" x="11.73" y="12.731" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".938" dy="1.406"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0.08 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_15648_46485"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_15648_46485" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".5" dy=".5"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.109684 0 0 0 0 0.0922738 0 0 0 0 0.0922738 0 0 0 0.1 0"/><feBlend in2="shape" mode="normal" result="effect2_innerShadow_15648_46485"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46485" mode="normal" result="effect3_innerShadow_15648_46485"/></filter></defs></svg>`,
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

IconMenuInfoManagementActive.displayName = 'IconMenuInfoManagementActive'

export default IconMenuInfoManagementActive
