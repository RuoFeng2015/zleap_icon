import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZanTingProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZanTing = forwardRef<unknown, IconZanTingProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#F4F4F5"/><path fill="#6B7280" d="M9.949 7.898h-.41a.82.82 0 0 0-.821.82v6.564c0 .454.367.82.82.82h.41a.82.82 0 0 0 .821-.82V8.718a.82.82 0 0 0-.82-.82"/><path fill="#6B7280" d="M14.462 7.898h-.41a.82.82 0 0 0-.821.82v6.564c0 .454.367.82.82.82h.41a.82.82 0 0 0 .821-.82V8.718a.82.82 0 0 0-.82-.82"/></svg>`,
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

IconZanTing.displayName = 'IconZanTing'

export default IconZanTing
