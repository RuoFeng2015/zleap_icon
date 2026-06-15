import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconHuiDingBu2Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconHuiDingBu2 = forwardRef<unknown, IconHuiDingBu2Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><path fill="#DADADA" d="M0 0h24v24H0z"/><path fill="#636363" d="m18.707 14.684-6.685-6.205-.26-.262-6.469 6.468 1.061 1.061 5.437-5.436 5.895 5.473z"/></svg>`,
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

IconHuiDingBu2.displayName = 'IconHuiDingBu2'

export default IconHuiDingBu2
