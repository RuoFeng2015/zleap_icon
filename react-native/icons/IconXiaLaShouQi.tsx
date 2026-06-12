import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconXiaLaShouQiProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconXiaLaShouQi = forwardRef<unknown, IconXiaLaShouQiProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#F4F4F5"/><path stroke="#3F3F46" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="m7 9.5 5 5 5-5"/></svg>`,
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

IconXiaLaShouQi.displayName = 'IconXiaLaShouQi'

export default IconXiaLaShouQi
