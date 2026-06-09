import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuQaAssistantActiveProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuQaAssistantActive = forwardRef<unknown, IconMenuQaAssistantActiveProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 49 50"><rect width="48.2" height="49.2" x=".099" y=".1" fill="#F6F6F6" rx="10.1"/><rect width="48.2" height="49.2" x=".099" y=".1" stroke="#D4D4D8" stroke-width=".2" rx="10.1"/><g filter="url(#a)"><path fill="#ECECEC" d="M37.334 12.35H26.796c-.878 0-1.589.732-1.589 1.638v7.898c0 .743.602 1.345 1.346 1.345h.344c.553 0 1.002.449 1.002 1.002 0 .874 1.04 1.329 1.681.736l1.36-1.257c.335-.309.774-.48 1.23-.48h5.162c.876 0 1.59-.733 1.59-1.64v-7.604c0-.906-.711-1.639-1.59-1.639zM32.2 20.014h-3.43a.79.79 0 0 1-.778-.802.79.79 0 0 1 .778-.803h3.43a.79.79 0 0 1 .778.803.79.79 0 0 1-.778.802m3.164-2.992H28.77a.79.79 0 0 1-.778-.802.79.79 0 0 1 .778-.802h6.594a.79.79 0 0 1 .778.802.79.79 0 0 1-.778.802"/></g><g fill="#8F8F8F" filter="url(#b)"><path d="M18.684 27.695c2.367 0 4.273-1.899 4.273-4.247 0-2.349-1.906-4.248-4.273-4.248s-4.273 1.9-4.273 4.248 1.916 4.247 4.273 4.247"/><path d="M24.773 36.2c.792 0 1.424-.63 1.424-1.419 0-.68.04-1.38-.24-2.019-.211-.49-.572-.93-.933-1.299-.793-.83-1.806-1.43-2.88-1.829-1.072-.4-2.286-.61-3.46-.61h.03c-1.173 0-2.387.21-3.46.61-1.074.4-2.087 1-2.88 1.829-.36.38-.721.82-.932 1.3-.28.639-.24 1.348-.24 2.018 0 .78.641 1.42 1.424 1.42z"/></g><defs><filter id="a" width="14.652" height="13.825" x="24.738" y="11.88" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_15648_46540"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect1_innerShadow_15648_46540" mode="normal" result="effect2_innerShadow_15648_46540"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".938"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46540" mode="normal" result="effect3_innerShadow_15648_46540"/></filter><filter id="b" width="17.406" height="19.875" x="10.73" y="18.731" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".938" dy="1.406"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0.08 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_15648_46540"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_15648_46540" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".5" dy=".5"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.109684 0 0 0 0 0.0922738 0 0 0 0 0.0922738 0 0 0 0.1 0"/><feBlend in2="shape" mode="normal" result="effect2_innerShadow_15648_46540"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_15648_46540" mode="normal" result="effect3_innerShadow_15648_46540"/></filter></defs></svg>`,
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
        viewBox="0 0 49 50"
        {...props}
      />
    )
  },
)

IconMenuQaAssistantActive.displayName = 'IconMenuQaAssistantActive'

export default IconMenuQaAssistantActive
