import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconShuJuKuProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconShuJuKu = forwardRef<unknown, IconShuJuKuProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 48 48"><g filter="url(#a)"><rect width="48" height="48" fill="url(#b)" rx="12"/><g filter="url(#c)"><path fill="url(#d)" d="M34.787 12.853H13.212a5.034 5.034 0 1 0 0 10.068h21.575a5.034 5.034 0 0 0 0-10.068" shape-rendering="crispEdges"/></g><g filter="url(#e)"><path fill="url(#f)" d="M34.787 25.079H13.212a5.034 5.034 0 1 0 0 10.068h21.575a5.034 5.034 0 0 0 0-10.068"/></g><path stroke="#211F43" stroke-linecap="round" stroke-width="1.582" d="M13.213 17.887h14.383" opacity=".52"/><path stroke="#211F43" stroke-linecap="round" stroke-width="1.582" d="M13.213 30.113H24.72" opacity=".46"/><path fill="#76DDCE" d="M34.069 19.829a1.942 1.942 0 1 0 0-3.884 1.942 1.942 0 0 0 0 3.884"/><path fill="#75A1DC" d="M34.069 32.055a1.942 1.942 0 1 0 0-3.884 1.942 1.942 0 0 0 0 3.884"/></g><defs><filter id="a" width="49.2" height="49.2" x="-.6" y="-.6" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.41713 0 0 0 0 0.457255 0 0 0 0 0.734784 0 0 0 1 0"/><feBlend in2="effect1_innerShadow_1063_1503" mode="normal" result="effect2_innerShadow_1063_1503"/></filter><filter id="c" width="37.645" height="16.068" x="5.178" y="9.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-1" dy="-1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="effect1_dropShadow_1063_1503" mode="normal" result="effect2_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_1063_1503" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.494923 0 0 0 0 0.447403 0 0 0 0 0.447403 0 0 0 0.15 0"/><feBlend in2="shape" mode="normal" result="effect3_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="effect3_innerShadow_1063_1503" mode="normal" result="effect4_innerShadow_1063_1503"/></filter><filter id="e" width="37.645" height="16.068" x="5.178" y="22.079" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-1" dy="-1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="effect1_dropShadow_1063_1503" mode="normal" result="effect2_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_1063_1503" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.494118 0 0 0 0 0.447059 0 0 0 0 0.447059 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect3_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="effect3_innerShadow_1063_1503" mode="normal" result="effect4_innerShadow_1063_1503"/></filter><linearGradient id="d" x1="11.054" x2="36.945" y1="14.291" y2="45.935" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#EDE5FF" stop-opacity=".88"/></linearGradient><linearGradient id="f" x1="12.493" x2="35.506" y1="15.73" y2="44.497" gradientUnits="userSpaceOnUse"><stop stop-color="#EDE5FF"/><stop offset="1" stop-color="#A494DA"/></linearGradient><radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="rotate(96.551 20.697 5.981)scale(60.4066)" gradientUnits="userSpaceOnUse"><stop offset=".564" stop-color="#8769D3"/><stop offset="1" stop-color="#4C5AAC"/></radialGradient></defs></svg>`,
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
        viewBox="0 0 48 48"
        {...props}
      />
    )
  },
)

IconShuJuKu.displayName = 'IconShuJuKu'

export default IconShuJuKu
