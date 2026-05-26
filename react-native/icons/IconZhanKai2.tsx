import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZhanKai2Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZhanKai2 = forwardRef<unknown, IconZhanKai2Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#F4F4F5"/><path stroke="#4A5565" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.143" d="M9.714 7.429H7.43v2.285m0-2.285 2.857 2.857m4-2.857h2.285v2.285m0-2.285-2.857 2.857m-4 6.286H7.43v-2.286m0 2.286 2.857-2.858m6.285 2.858-2.857-2.858m.572 2.858h2.285v-2.286"/></svg>`,
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

IconZhanKai2.displayName = 'IconZhanKai2'

export default IconZhanKai2
