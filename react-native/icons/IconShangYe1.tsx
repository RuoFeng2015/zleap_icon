import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconShangYe1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconShangYe1 = forwardRef<unknown, IconShangYe1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 36 36"><rect width="132" height="87" x="-48" y="-9.5" stroke="#FF8D28" rx="11.5"/><rect width="36" height="36" fill="#FD894C" rx="12"/><path fill="#FCEA8D" d="M36.165 13.607H30.92v-.386c0-3.24-2.556-5.867-5.707-5.867h-3.928c-3.152 0-5.706 2.625-5.706 5.867v.386h-5.235c-1.2 0-2.17.999-2.17 2.23v5.948a2 2 0 0 0 .762 1.571l1.224.965a2 2 0 0 0 1.238.429h7.938c.49 0 .886-.397.886-.886 0-.49.397-.886.886-.886h4.331c.49 0 .886.397.886.886 0 .49.397.886.886.886H35.7l2.602-2.051.033.043v-6.907c0-1.23-.972-2.228-2.17-2.228m-7.923 0H18.25v-.125c0-2.112 1.665-3.822 3.718-3.822h2.557c2.052 0 3.717 1.71 3.717 3.822zm8.031 13.481h-9.286a.66.66 0 0 0-.66.662.66.66 0 0 1-.662.66h-4.78a.66.66 0 0 1-.662-.66.66.66 0 0 0-.66-.662h-9.55l-.235-.177a1 1 0 0 0-1.603.798v6.06c0 1.234.97 2.231 2.17 2.231h25.82c1.197 0 2.17-.997 2.17-2.231v-8.152l-1.99 1.566z"/></svg>`,
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
        viewBox="0 0 36 36"
        {...props}
      />
    )
  },
)

IconShangYe1.displayName = 'IconShangYe1'

export default IconShangYe1
