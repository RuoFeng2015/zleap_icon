import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconIconProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconIcon = forwardRef<unknown, IconIconProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 15 15"><mask id="b" fill="white"/><mask id="a" fill="white"/><path fill="black" fill-opacity=".07" d="M43.5 40.5v-1h-360v2h360z" mask="url(#a)"/><path stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="m11.25 3.75-7.5 7.5"/><path stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="m3.75 3.75 7.5 7.5"/><path fill="#F4F4F5" d="M-317.5 935.5h1v-960h-2v960z" mask="url(#b)"/></svg>`,
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
        viewBox="0 0 15 15"
        {...props}
      />
    )
  },
)

IconIcon.displayName = 'IconIcon'

export default IconIcon
