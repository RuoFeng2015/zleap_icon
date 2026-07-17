import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconSiMiHeBuFenGongKaiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconSiMiHeBuFenGongKai = forwardRef<unknown, IconSiMiHeBuFenGongKaiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 100 100"><path fill="url(#a)" d="M82 24.308v59.924a8.435 8.435 0 0 1-8.435 8.435h-47.13A8.435 8.435 0 0 1 18 84.232V15.768a8.435 8.435 0 0 1 8.435-8.435h37.084z"/><g filter="url(#b)"><path fill="#E4E7EC" d="M82 24.308H65.627A2.11 2.11 0 0 1 63.52 22.2V7.333z"/></g><defs><linearGradient id="a" x1="3.245" x2="82" y1="92.667" y2="18" gradientUnits="userSpaceOnUse"><stop offset=".249" stop-color="#F5AB51"/><stop offset=".95" stop-color="#FFDB98"/></linearGradient><filter id="b" width="26.916" height="25.41" x="57.193" y="5.224" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-2.109" dy="2.109"/><feGaussianBlur stdDeviation="2.109"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1063_1503" mode="normal" result="shape"/></filter></defs></svg>`,
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
        viewBox="0 0 100 100"
        {...props}
      />
    )
  },
)

IconSiMiHeBuFenGongKai.displayName = 'IconSiMiHeBuFenGongKai'

export default IconSiMiHeBuFenGongKai
