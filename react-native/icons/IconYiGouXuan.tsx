import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconYiGouXuanProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconYiGouXuan = forwardRef<unknown, IconYiGouXuanProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="white" stroke="#D4D4D8" stroke-width="1.5"/><path stroke="#18181B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.108" d="m7.082 12 3.513 3.513 7.025-7.025"/></svg>`,
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
        viewBox="0 0 24 24"
        {...props}
      />
    )
  },
)

IconYiGouXuan.displayName = 'IconYiGouXuan'

export default IconYiGouXuan
