import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconFrame6Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconFrame6 = forwardRef<unknown, IconFrame6Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 20 20"><rect width="500" height="336" x="-36" y="-290" fill="#F9F9FA" rx="20"/><path fill="#D4D4D8" stroke="#D4D4D8" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M15.836 1.668H4.169a.833.833 0 0 0-.833.833v15c0 .46.373.834.833.834h11.667c.46 0 .833-.373.833-.834v-15a.833.833 0 0 0-.833-.833"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M7.086 12.5h5.833"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M7.086 15h2.917"/><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M12.5 5.418 9.167 8.751 7.5 7.085"/></svg>`,
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
        viewBox="0 0 20 20"
        {...props}
      />
    )
  },
)

IconFrame6.displayName = 'IconFrame6'

export default IconFrame6
