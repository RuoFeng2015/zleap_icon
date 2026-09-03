import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconXiaoXi1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconXiaoXi1 = forwardRef<unknown, IconXiaoXi1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 48 48"><g filter="url(#a)"><rect width="48" height="48" fill="url(#b)" rx="12"/><g filter="url(#c)"><g filter="url(#d)"><path fill="url(#e)" d="M30.39 11.22a9.585 9.585 0 0 1 9.586 9.585V24a9.585 9.585 0 0 1-9.585 9.585H19.849c-1.8 1.864-2.132 2.104-3.766 3.43-.103-1.497 0-1.166-.335-3.614-4.402-.867-7.723-4.745-7.723-9.401v-3.195a9.585 9.585 0 0 1 9.585-9.585z"/></g><g filter="url(#f)"><path fill="url(#g)" d="M18.163 22.642a1.837 1.837 0 1 0-3.675 0 1.837 1.837 0 0 0 3.675 0"/></g><g filter="url(#h)"><path fill="url(#i)" d="M25.836 22.642a1.837 1.837 0 1 0-3.674 0 1.837 1.837 0 0 0 3.674 0"/></g><g filter="url(#j)"><path fill="url(#k)" d="M33.51 22.642a1.837 1.837 0 1 0-3.674 0 1.837 1.837 0 0 0 3.674 0"/></g></g></g><defs><filter id="a" width="49.2" height="49.2" x="-.6" y="-.6" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.0508626 0 0 0 0 0.542653 0 0 0 0 0.396577 0 0 0 1 0"/><feBlend in2="effect1_innerShadow_1063_1503" mode="normal" result="effect2_innerShadow_1063_1503"/></filter><filter id="c" width="37.101" height="30.945" x="5.025" y="8.22" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation=".575"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-1" dy="-1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend in2="effect1_dropShadow_1063_1503" mode="normal" result="effect2_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_1063_1503" mode="normal" result="shape"/></filter><filter id="d" width="33.151" height="26.995" x="7.425" y="10.62" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.372549 0 0 0 0 0.486275 0 0 0 0 0.435294 0 0 0 0.15 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.371794 0 0 0 0 0.48771 0 0 0 0 0.436707 0 0 0 0.15 0"/><feBlend in2="effect1_innerShadow_1063_1503" mode="normal" result="effect2_innerShadow_1063_1503"/></filter><filter id="f" width="3.874" height="3.874" x="14.488" y="20.805" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".1" dy=".1"/><feGaussianBlur stdDeviation=".05"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1063_1503" mode="normal" result="shape"/></filter><filter id="h" width="3.874" height="3.874" x="22.162" y="20.805" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".1" dy=".1"/><feGaussianBlur stdDeviation=".05"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1063_1503" mode="normal" result="shape"/></filter><filter id="j" width="3.874" height="3.874" x="29.836" y="20.805" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".1" dy=".1"/><feGaussianBlur stdDeviation=".05"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1063_1503" mode="normal" result="shape"/></filter><radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="rotate(96.551 20.697 5.981)scale(60.4066)" gradientUnits="userSpaceOnUse"><stop offset=".564" stop-color="#2AAF80"/><stop offset="1" stop-color="#0D694F"/></radialGradient><radialGradient id="g" cx="0" cy="0" r="1" gradientTransform="rotate(90 -3.158 19.484)scale(1.83715)" gradientUnits="userSpaceOnUse"><stop stop-color="#0B5445"/><stop offset="1" stop-color="#092F27"/></radialGradient><radialGradient id="i" cx="0" cy="0" r="1" gradientTransform="rotate(90 .679 23.32)scale(1.83715)" gradientUnits="userSpaceOnUse"><stop stop-color="#0B5445"/><stop offset="1" stop-color="#092F27"/></radialGradient><radialGradient id="k" cx="0" cy="0" r="1" gradientTransform="rotate(90 4.516 27.157)scale(1.83715)" gradientUnits="userSpaceOnUse"><stop stop-color="#FED955"/><stop offset="1" stop-color="#EFB82F"/></radialGradient><linearGradient id="e" x1="12.818" x2="46.27" y1="2.091" y2="37.866" gradientUnits="userSpaceOnUse"><stop stop-color="#F2FFF9"/><stop offset="1" stop-color="#F2FFF9" stop-opacity=".88"/></linearGradient></defs></svg>`,
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
        viewBox="0 0 48 48"
        {...props}
      />
    )
  },
)

IconXiaoXi1.displayName = 'IconXiaoXi1'

export default IconXiaoXi1
