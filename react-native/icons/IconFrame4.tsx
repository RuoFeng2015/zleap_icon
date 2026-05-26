import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFrame4Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFrame4 = forwardRef<unknown, IconFrame4Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 18 18"><g filter="url(#a)"><mask id="b" fill="white"><path d="M-155-291c0-8.837 7.163-16 16-16h368c8.837 0 16 7.163 16 16V36c0 8.837-7.163 16-16 16h-368c-8.837 0-16-7.163-16-16z"/></mask><path fill="white" d="M-155-291c0-8.837 7.163-16 16-16h368c8.837 0 16 7.163 16 16V36c0 8.837-7.163 16-16 16h-368c-8.837 0-16-7.163-16-16z" shape-rendering="crispEdges"/><path fill="#E5E7EB" d="M-139-307v1h368v-2h-368zm384 16h-1V36h2v-327zM229 52v-1h-368v2h368zm-384-16h1v-327h-2V36zm16 16v-1c-8.284 0-15-6.716-15-15h-2c0 9.389 7.611 17 17 17zm384-16h-1c0 8.284-6.716 15-15 15v2c9.389 0 17-7.611 17-17zm-16-343v1c8.284 0 15 6.716 15 15h2c0-9.389-7.611-17-17-17zm-368 0v-1c-9.389 0-17 7.611-17 17h2c0-8.284 6.716-15 15-15z" mask="url(#b)"/><path fill="white" d="M-124-12.5h338a9.5 9.5 0 0 1 9.5 9.5v24a9.5 9.5 0 0 1-9.5 9.5h-338a9.5 9.5 0 0 1-9.5-9.5V-3a9.5 9.5 0 0 1 9.5-9.5"/><path stroke="#D1D5DC" d="M-124-12.5h338a9.5 9.5 0 0 1 9.5 9.5v24a9.5 9.5 0 0 1-9.5 9.5h-338a9.5 9.5 0 0 1-9.5-9.5V-3a9.5 9.5 0 0 1 9.5-9.5Z"/><path stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.125" d="M13.773 13.773a6.75 6.75 0 1 1 0-9.546c.622.622 1.977 2.148 1.977 2.148"/><path stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.125" d="M15.75 3v3.375h-3.375"/></g><defs><filter id="a" width="476" height="435" x="-193" y="-320" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feMorphology in="SourceAlpha" operator="erode" radius="12" result="effect1_dropShadow_326_19041"/><feOffset dy="25"/><feGaussianBlur stdDeviation="25"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_326_19041"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_326_19041" mode="normal" result="shape"/></filter></defs></svg>`,
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
        viewBox="0 0 18 18"
        {...props}
      />
    )
  },
)

IconFrame4.displayName = 'IconFrame4'

export default IconFrame4
