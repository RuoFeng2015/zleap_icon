import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconJieShuProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconJieShu = forwardRef<unknown, IconJieShuProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FEF2F2"/><path fill="#FB2C36" d="M13.846 9.23h-3.692a.923.923 0 0 0-.923.924v3.692c0 .51.413.923.923.923h3.692c.51 0 .923-.413.923-.923v-3.692a.923.923 0 0 0-.923-.923"/></svg>`,
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

IconJieShu.displayName = 'IconJieShu'

export default IconJieShu
