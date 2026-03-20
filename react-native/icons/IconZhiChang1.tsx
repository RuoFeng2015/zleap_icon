import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconZhiChang1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconZhiChang1 = forwardRef<unknown, IconZhiChang1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 36 36"><rect width="132.6" height="87.6" x="-48.3" y="-9.8" stroke="#DDDDDD" stroke-width=".4" rx="11.8"/><path fill="#54575B" d="M10.424 15.58a5.146 5.146 0 1 0 10.293 0 5.146 5.146 0 0 0-10.293 0"/><path fill="#54575B" d="m17.974 33.367 1.261-7.004h7.58c-.467-2.855-2.967-5.045-5.944-5.045h-1.976l-1.67 2.88-.806 1.389a1 1 0 0 1-1.73 0l-.805-1.389-1.67-2.88h-1.942c-3.323 0-6.033 2.71-6.033 6.016v6.033h.06a2.06 2.06 0 0 0 1.406 1.584l3.033.955c1.074.34 2.215-.273 2.556-1.347v-.017c.126-.397.121-.804.011-1.175zm-9.577-1.869v-3.585h.597v3.773z"/><path fill="#8D8F91" d="m20.548 27.462-1.363 7.618h-5.777l-.17.92h16.989l1.534-8.538z"/><path stroke="#D1D5DA" stroke-width=".24" d="M12 .12h12C30.561.12 35.88 5.44 35.88 12v12c0 6.561-5.319 11.88-11.88 11.88H12C5.439 35.88.12 30.56.12 24V12C.12 5.439 5.44.12 12 .12Z"/></svg>`,
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

IconZhiChang1.displayName = 'IconZhiChang1'

export default IconZhiChang1
