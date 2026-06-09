import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuSearchAssistantActiveProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuSearchAssistantActive = forwardRef<unknown, IconMenuSearchAssistantActiveProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 49 49"><rect width="48.2" height="48.2" x=".099" y=".1" fill="#F6F6F6" rx="10.1"/><rect width="48.2" height="48.2" x=".099" y=".1" stroke="#D4D4D8" stroke-width=".2" rx="10.1"/><g filter="url(#a)"><path fill="#D9D9D9" d="m32.56 34.143-2.739-2.8a6.54 6.54 0 0 0 1.058-3.575c0-3.614-2.911-6.543-6.504-6.543s-6.504 2.929-6.504 6.543 2.912 6.544 6.504 6.544a6.46 6.46 0 0 0 3.396-.962l2.75 2.81c.28.288.649.43 1.02.43a1.4 1.4 0 0 0 1.004-.413c.563-.559.57-1.47.015-2.037zm-8.185-1.486c-2.678 0-4.857-2.191-4.857-4.886s2.179-4.887 4.857-4.887 4.857 2.192 4.857 4.887-2.178 4.886-4.857 4.886"/></g><g filter="url(#b)"><path fill="#D9D9D9" d="M20.387 27.848c0-2.216 1.672-4.107 3.841-4.107a.662.662 0 1 1 0 1.325c-1.34 0-2.517 1.195-2.517 2.782a.662.662 0 1 1-1.324 0"/></g><g filter="url(#c)"><path fill="#919191" d="M39.575 25.002c0 1.276-.356 2.513-1.124 3.545-.925 1.236-2.349 2.097-3.833 2.473-.78.196-1.545.18-2.341.18a.583.583 0 0 1-.536-.8c.852-2.261.592-4.998-.773-7.023-2.832-4.705-10.315-4.697-13.148 0-1.364 2.017-1.62 4.766-.772 7.023a.583.583 0 0 1-.536.8h-1.577c-6.351.065-7.83-8.65-2.395-10.9.44-.182.743-.61.804-1.082.336-2.613 3.093-4.42 5.656-3.856.494.109 1.031-.057 1.344-.455 3.783-4.816 12.635-2.874 13.822 3.206.088.453.43.822.873.95 2.624.756 4.536 3.129 4.536 5.939"/></g><defs><filter id="a" width="16.039" height="16.303" x="17.402" y="20.756" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_15648_46561"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect1_innerShadow_15648_46561" mode="normal" result="effect2_innerShadow_15648_46561"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".938"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46561" mode="normal" result="effect3_innerShadow_15648_46561"/></filter><filter id="b" width="5.441" height="5.706" x="19.918" y="23.273" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_15648_46561"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect1_innerShadow_15648_46561" mode="normal" result="effect2_innerShadow_15648_46561"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".938"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46561" mode="normal" result="effect3_innerShadow_15648_46561"/></filter><filter id="c" width="31.338" height="20.15" x="9.012" y="12.013" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".375" dy=".563"/><feGaussianBlur stdDeviation=".2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0.08 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_15648_46561"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_15648_46561" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".2" dy=".2"/><feGaussianBlur stdDeviation=".2"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.109684 0 0 0 0 0.0922738 0 0 0 0 0.0922738 0 0 0 0.1 0"/><feBlend in2="shape" mode="normal" result="effect2_innerShadow_15648_46561"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.188" dy="-.188"/><feGaussianBlur stdDeviation=".2"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46561" mode="normal" result="effect3_innerShadow_15648_46561"/></filter></defs></svg>`,
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

IconMenuSearchAssistantActive.displayName = 'IconMenuSearchAssistantActive'

export default IconMenuSearchAssistantActive
