import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconShangYeProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconShangYe = forwardRef<unknown, IconShangYeProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 36 36"><rect width="132.6" height="87.6" x="-48.3" y="-9.8" stroke="#DDDDDD" stroke-width=".4" rx="11.8"/><path fill="#292D32" d="M35.953 27.25h-8.73c-.51 0-.9.38-1.07.86a.65.65 0 0 1-.61.43h-4.31c-.51 0-.9-.38-1.07-.86a.65.65 0 0 0-.61-.43h-9.36l-1.8-1.36v7.92c0 1.21.95 2.19 2.13 2.19h25.32c1.17 0 2.13-.98 2.13-2.19v-8l-1.95 1.54-.07-.09z"/><path fill="#8D8F91" d="M35.843 14.578h-5.14v-.38c0-3.18-2.51-5.75-5.6-5.75h-3.85c-3.09 0-5.6 2.58-5.6 5.75v.38h-5.13c-1.18 0-2.13.98-2.13 2.19v6.39l.31.64 1.95 1.54c.14.11.32.17.5.17h8.25c.44 0 .85-.36.81-.8a.87.87 0 0 1 .87-.94h4.31c.44 0 .85.36.81.8-.04.51.36.94.87.94h8.04c.18 0 .36-.06.5-.17l2.33-1.84.03.04v-6.78c0-1.21-.95-2.19-2.13-2.19zm-7.77 0h-9.8v-.12c0-2.07 1.63-3.75 3.65-3.75h2.51c2.01 0 3.65 1.68 3.65 3.75v.12z"/><rect width="35.76" height="35.76" x=".12" y=".12" stroke="#D1D5DA" stroke-width=".24" rx="11.88"/></svg>`,
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

IconShangYe.displayName = 'IconShangYe'

export default IconShangYe
