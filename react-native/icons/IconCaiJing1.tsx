import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconCaiJing1Props extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconCaiJing1 = forwardRef<unknown, IconCaiJing1Props>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 36 36"><rect width="129.6" height="87.6" x="-46.8" y="-9.8" stroke="#DDDDDD" stroke-width=".4" rx="11.8"/><path fill="#54575B" d="M22.455 23.275a1.35 1.35 0 0 1-.573-.186l-3.446-2.522a2.4 2.4 0 0 0-2.8-.025L8.418 25.63a1.2 1.2 0 0 0-.509.98v6.34A3.05 3.05 0 0 0 10.96 36h22.333a3.05 3.05 0 0 0 3.051-3.05V16.69a1.2 1.2 0 0 0-1.868-.997L23.433 23.09c-.287.169-.64.253-.978.186"/><path fill="#8D8F91" d="m9.91 22.001 6.932-4.747 4.97 3.67c.187.106.397.177.607.19.35.046.712-.013 1.004-.19L35.7 12.6a1.58 1.58 0 0 0 .794-2.083 1.62 1.62 0 0 0-1.412-.947h-7.795c-.864 0-1.552.698-1.552 1.574s.688 1.575 1.552 1.575h2.637l-7.258 4.948-4.971-3.67a1.47 1.47 0 0 0-1.004-.19 1.4 1.4 0 0 0-.619.19l-7.713 5.268c-.723.45-.945 1.433-.502 2.19A1.57 1.57 0 0 0 9.911 22"/><rect width="35.76" height="35.76" x=".12" y=".12" stroke="#D1D5DA" stroke-width=".24" rx="11.88"/></svg>`,
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

IconCaiJing1.displayName = 'IconCaiJing1'

export default IconCaiJing1
