import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface Icon0AllThreeNofocusProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const Icon0AllThreeNofocus = forwardRef<unknown, Icon0AllThreeNofocusProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg viewBox="0 0 85.4 85.4"><g fill-rule="evenodd" clip-rule="evenodd"><path fill="#d1d0d2" d="M42.7 85.4c23.6 0 42.7-19.1 42.7-42.7S66.3 0 42.7 0 0 19.1 0 42.7s19.1 42.7 42.7 42.7"/><path fill="#c7c7c7" d="M42.7 81.7c21.6 0 39.1-17.5 39.1-39.1S64.3 3.5 42.7 3.5 3.6 21 3.6 42.6s17.5 39.1 39.1 39.1"/></g></svg>`,
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

Icon0AllThreeNofocus.displayName = 'Icon0AllThreeNofocus'

export default Icon0AllThreeNofocus
