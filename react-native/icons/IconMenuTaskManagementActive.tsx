import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuTaskManagementActiveProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuTaskManagementActive = forwardRef<unknown, IconMenuTaskManagementActiveProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 49 49"><rect width="48.2" height="48.2" x=".1" y=".1" fill="#F6F6F6" rx="10.1"/><rect width="48.2" height="48.2" x=".1" y=".1" stroke="#D4D4D8" stroke-width=".2" rx="10.1"/><g filter="url(#a)"><path fill="#D9D9D9" d="M35.913 31.24v-1.062l1.192-.896a.275.275 0 0 0 0-.343l-1.13-1.9a.27.27 0 0 0-.342-.104l-1.41.539a4.2 4.2 0 0 0-.804-.539L33.2 25.44a.28.28 0 0 0-.278-.24h-2.338a.287.287 0 0 0-.264.299l-.2 1.495a4 4 0 0 0-.96.539l-1.41-.539a.3.3 0 0 0-.34.105l-1.147 1.838a.275.275 0 0 0 0 .344l1.192.896a3 3 0 0 0 0 .539 3 3 0 0 0 0 .523l-1.192.912a.26.26 0 0 0 0 .343l1.131 1.883a.28.28 0 0 0 .341.12l1.41-.54c.294.216.617.391.96.524l.2 1.495c.03.127.145.22.279.224h2.26a.276.276 0 0 0 .279-.224l.201-1.495c.34-.137.664-.312.96-.523l1.41.538a.28.28 0 0 0 .34-.119l1.131-1.883a.263.263 0 0 0-.077-.343l-1.177-.912zm-4.197 1.375c-1.094.007-1.99-.842-1.997-1.9-.009-1.057.871-1.92 1.967-1.927s1.99.841 1.997 1.899v.03c0 1.048-.88 1.899-1.967 1.899z"/></g><g filter="url(#b)"><path fill="#919191" d="M35.2 10.2a3 3 0 0 1 3 3v9.219c0 .975-1.426 1.502-2.233.953a8.762 8.762 0 0 0-12.05 12.35c.597.83.038 2.478-.984 2.478H13.2a3 3 0 0 1-3-3v-22a3 3 0 0 1 3-3zM16.804 22.351a3.17 3.17 0 1 0 0 6.34 3.17 3.17 0 0 0 0-6.34m0 2.113a1.057 1.057 0 1 1-.001 2.114 1.057 1.057 0 0 1 0-2.114m3.652-9.728a1.057 1.057 0 0 0-1.494 0l-1.98 1.98a1 1 0 0 1-1.414 0l-.394-.395a1.057 1.057 0 0 0-1.494 1.494l1.888 1.889a1 1 0 0 0 1.415 0l3.473-3.474a1.057 1.057 0 0 0 0-1.494m2.952 3.464a1.057 1.057 0 0 0 0 2.113H27.2a1.057 1.057 0 0 0 0-2.113zm0-3.773a1.057 1.057 0 0 0 0 2.113h10.567a1.057 1.057 0 0 0 0-2.113z"/></g><defs><filter id="a" width="11.938" height="11.938" x="25.731" y="24.731" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_323_4198"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".703"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect1_innerShadow_323_4198" mode="normal" result="effect2_innerShadow_323_4198"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".469" dy=".469"/><feGaussianBlur stdDeviation=".938"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.117647 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_323_4198" mode="normal" result="effect3_innerShadow_323_4198"/></filter><filter id="b" width="30.406" height="30.875" x="9.731" y="9.731" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".938" dy="1.406"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0 0.394602 0 0 0 0.08 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_323_4198"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_323_4198" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".5" dy=".5"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.109684 0 0 0 0 0.0922738 0 0 0 0 0.0922738 0 0 0 0.1 0"/><feBlend in2="shape" mode="normal" result="effect2_innerShadow_323_4198"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.469" dy="-.469"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend in2="effect2_innerShadow_323_4198" mode="normal" result="effect3_innerShadow_323_4198"/></filter></defs></svg>`,
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

IconMenuTaskManagementActive.displayName = 'IconMenuTaskManagementActive'

export default IconMenuTaskManagementActive
