import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface Icon2Minimize3PressProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const Icon2Minimize3Press = forwardRef<unknown, Icon2Minimize3PressProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg viewBox="0 0 85.4 85.4"><g fill-rule="evenodd" clip-rule="evenodd"><path fill="#a67f36" d="M42.7 85.4c23.6 0 42.7-19.1 42.7-42.7S66.3 0 42.7 0 0 19.1 0 42.7c0 23.5 19 42.7 42.7 42.7"/><path fill="#b8923b" d="M42.7 81.7c21.6 0 39.1-17.5 39.1-39.1S64.3 3.5 42.7 3.5 3.6 21 3.6 42.6C3.5 64.2 21 81.7 42.7 81.7"/><path fill="#532a0a" d="M17.7 39.1h49.9c1.9 0 3.5 1.6 3.5 3.5v.1c0 1.9-1.6 3.5-3.5 3.5H17.7c-1.9 0-3.5-1.6-3.5-3.5v-.1c0-1.9 1.6-3.5 3.5-3.5"/></g></svg>`,
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

Icon2Minimize3Press.displayName = 'Icon2Minimize3Press'

export default Icon2Minimize3Press
