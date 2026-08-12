import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface Icon3Maximize3PressProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const Icon3Maximize3Press = forwardRef<unknown, Icon3Maximize3PressProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg viewBox="0 0 85.4 85.4"><g fill-rule="evenodd" clip-rule="evenodd"><path fill="#428234" d="M42.7 85.4c23.6 0 42.7-19.1 42.7-42.7S66.3 0 42.7 0 0 19.1 0 42.7s19.1 42.7 42.7 42.7"/><path fill="#4a9741" d="M42.7 81.8c21.6 0 39.1-17.5 39.1-39.1S64.3 3.6 42.7 3.6 3.6 21.1 3.6 42.7c0 21.5 17.5 39.1 39.1 39.1"/><path fill="#113107" d="M31.2 20.8h26.7c3.6 0 6.5 2.9 6.5 6.5V54zm23.2 43.7H27.6c-3.6 0-6.5-2.9-6.5-6.5V31.2z"/></g></svg>`,
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
        viewBox="0 0 85.4 85.4"
        {...props}
      />
    )
  },
)

Icon3Maximize3Press.displayName = 'Icon3Maximize3Press'

export default Icon3Maximize3Press
