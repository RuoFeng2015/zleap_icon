import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuSystemLogActiveProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuSystemLogActive = forwardRef<unknown, IconMenuSystemLogActiveProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 49 49"><rect width="48.047" height="48.047" x=".023" y=".023" fill="#F6F6F6" rx="9.773"/><rect width="48.047" height="48.047" x=".023" y=".023" stroke="#E9E2DA" stroke-width=".047" rx="9.773"/><g filter="url(#a)"><path fill="white" d="M16.714 39.047H33.38c1.15 0 2.084-.933 2.084-2.083V18.476c0-.567-.231-1.11-.64-1.502l-4.172-4.012a2.08 2.08 0 0 0-1.444-.582H16.714c-1.151 0-2.084.933-2.084 2.084v22.5c0 1.15.933 2.083 2.084 2.083"/></g><rect width="15.494" height="1.89" x="17.547" y="28.213" fill="#E0E0E0" rx=".945"/><rect width="15.494" height="1.89" x="17.547" y="32.603" fill="#E0E0E0" rx=".945"/><path stroke="url(#b)" stroke-width="1.042" d="M30.267 11.86c.203-.01.402.037.59.13l.186.107.043.028.036.037 4.942 4.971c.41.414.4.948.209 1.333-.174.35-.553.684-1.028.685h-4.267c-.568 0-1.04-.368-1.344-.775a2.65 2.65 0 0 1-.524-1.553v-3.616c0-.364.169-.796.489-1.072.17-.147.397-.26.668-.274Z"/><g filter="url(#c)"><circle cx="18.102" cy="17.102" r="6.389" fill="#8B8A89"/></g><path fill="white" d="M20.685 18.128h-2.793a.613.613 0 0 1-.623-.603v-3.986c0-.333.279-.603.623-.603s.623.27.623.603v3.382h2.17c.344 0 .623.27.623.603a.614.614 0 0 1-.623.604"/><defs><filter id="a" width="30.25" height="36.083" x="9.922" y="9.339" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1.667"/><feGaussianBlur stdDeviation="2.354"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_43_1049"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_43_1049" mode="normal" result="shape"/></filter><filter id="c" width="18.555" height="18.555" x="8.936" y="7.936" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_43_1049"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.556" dy="-.556"/><feGaussianBlur stdDeviation="1.111"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="effect1_dropShadow_43_1049" mode="normal" result="effect2_dropShadow_43_1049"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_43_1049" mode="normal" result="shape"/></filter><linearGradient id="b" x1="35.547" x2="28.644" y1="11.547" y2="17.821" gradientUnits="userSpaceOnUse"><stop offset=".306" stop-color="#F6F6F6"/><stop offset="1" stop-color="#E0E0E0"/></linearGradient></defs></svg>`,
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

IconMenuSystemLogActive.displayName = 'IconMenuSystemLogActive'

export default IconMenuSystemLogActive
