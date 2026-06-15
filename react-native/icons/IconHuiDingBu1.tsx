import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconHuiDingBu1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconHuiDingBu1 = forwardRef<unknown, IconHuiDingBu1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 38 38"><path fill="#DADADA" d="M0 0h38v38H0z"/><circle cx="19" cy="19" r="18.5" fill="white" stroke="#EAEBEF"/><path fill="#636363" d="m25.707 21.684-6.685-6.206-.26-.261-6.469 6.469 1.061 1.06 5.437-5.435 5.895 5.472z"/></svg>`,
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
        viewBox="0 0 38 38"
        {...props}
      />
    )
  },
)

IconHuiDingBu1.displayName = 'IconHuiDingBu1'

export default IconHuiDingBu1
