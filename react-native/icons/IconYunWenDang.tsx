import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconYunWenDangProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconYunWenDang = forwardRef<unknown, IconYunWenDangProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 48 48"><g filter="url(#a)"><rect width="48" height="48" fill="url(#b)" rx="12"/><g filter="url(#c)"><path fill="url(#d)" d="M13.975 30.291a6.057 6.057 0 0 1-1.9-11.816 7.36 7.36 0 0 1 7.244-6.116A8.432 8.432 0 0 1 34.4 17.525a6.423 6.423 0 0 1-1.426 12.766z"/></g><g filter="url(#e)"><path fill="url(#f)" d="M17.747 18.932h8.68q.543 0 .938.395l3.797 3.797q.395.395.395.937v10.16a2.466 2.466 0 0 1-2.466 2.466H17.747a2.466 2.466 0 0 1-2.466-2.466V21.398a2.466 2.466 0 0 1 2.466-2.466"/><path fill="#123D57" fill-opacity=".15" d="M26.822 19.376v3.008a1.38 1.38 0 0 0 1.381 1.381h3.009z" opacity=".82"/><path stroke="#123D57" stroke-linecap="round" stroke-opacity=".3" stroke-width="1.184" d="M18.732 33.431h8.878m-8.878-4.11h8.878m-8.878-4.11h4.932" opacity=".66"/><path stroke="white" stroke-linecap="round" stroke-opacity=".3" stroke-width=".69" d="M16.563 23.075a4.93 4.93 0 0 1 4.34-3.551"/></g></g><defs><filter id="a" width="49.2" height="49.2" x="-.6" y="-.6" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.256957 0 0 0 0 0.607507 0 0 0 0 0.788436 0 0 0 1 0"/><feBlend in2="effect1_innerShadow_1063_1503" mode="normal" result="effect2_innerShadow_1063_1503"/></filter><filter id="c" width="32.221" height="23.22" x="7.891" y="8.111" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="effect1_innerShadow_1063_1503" mode="normal" result="effect2_innerShadow_1063_1503"/></filter><filter id="e" width="20.221" height="21.7" x="14.295" y="17.946" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".986" dy=".986"/><feGaussianBlur stdDeviation=".986"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1063_1503" mode="normal" result="shape"/></filter><linearGradient id="d" x1="13.737" x2="32.738" y1="10.103" y2="33.854" gradientUnits="userSpaceOnUse"><stop stop-color="#DDF9FC"/><stop offset="1" stop-color="#82D5E2"/></linearGradient><linearGradient id="f" x1="22.452" x2="22.59" y1="18.135" y2="42.023" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#DDF9FC" stop-opacity=".88"/></linearGradient><radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="rotate(96.551 20.697 5.981)scale(60.4066)" gradientUnits="userSpaceOnUse"><stop offset=".564" stop-color="#47C3D1"/><stop offset="1" stop-color="#2C81BA"/></radialGradient></defs></svg>`,
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

IconYunWenDang.displayName = 'IconYunWenDang'

export default IconYunWenDang
