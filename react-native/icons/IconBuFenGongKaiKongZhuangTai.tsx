import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconBuFenGongKaiKongZhuangTaiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconBuFenGongKaiKongZhuangTai = forwardRef<unknown, IconBuFenGongKaiKongZhuangTaiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 544 432"><g filter="url(#a)"><path fill="#EF7F4B" d="M16 38.806v346.388C16 399.998 28.002 412 42.806 412h458.388C515.998 412 528 399.998 528 385.194V93.473c0-14.805-12.002-26.806-26.806-26.806H260.603c-10.421 0-19.86-6.083-25.312-14.965C225.357 35.517 207.444 12 187.225 12H42.765C27.96 12 16 24.002 16 38.806"/><path fill="url(#b)" d="M528 127.52v248.673C528 390.998 515.998 403 501.194 403H42.806C28.002 403 16 390.998 16 376.193V127.519c0-14.805 11.962-26.806 26.767-26.806h135.411c45.571 0 39.204-.002 70.366 0 85.023.003 201.002.001 252.695 0 14.805 0 26.761 12.002 26.761 26.807"/></g><defs><linearGradient id="b" x1="528" x2="51.871" y1="100.712" y2="451.665" gradientUnits="userSpaceOnUse"><stop offset=".234" stop-color="#FFB76D"/><stop offset="1" stop-color="#EF7F4B"/></linearGradient><filter id="a" width="544" height="432.246" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2645_1752"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2645_1752" mode="normal" result="shape"/></filter></defs></svg>`,
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
        viewBox="0 0 544 432"
        {...props}
      />
    )
  },
)

IconBuFenGongKaiKongZhuangTai.displayName = 'IconBuFenGongKaiKongZhuangTai'

export default IconBuFenGongKaiKongZhuangTai
