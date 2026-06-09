import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuQaAssistantProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuQaAssistant = forwardRef<unknown, IconMenuQaAssistantProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 120 120"><path fill="url(#a)" d="M0 30C0 13.432 13.432 0 30 0h60c16.569 0 30 13.432 30 30v60c0 16.569-13.431 30-30 30H30c-16.568 0-30-13.431-30-30z"/><path fill="url(#b)" d="M92.838 29.752H66.493c-2.197 0-3.973 1.794-3.973 4.014v20.636a2 2 0 0 0 2 2h2.728a2 2 0 0 1 2 2v1.553c0 1.735 2.057 2.647 3.342 1.483l4.994-4.519a2 2 0 0 1 1.342-.517h13.906c2.19 0 3.973-1.794 3.973-4.014V33.766c0-2.22-1.776-4.014-3.974-4.014zM80.003 48.525h-8.577a1.95 1.95 0 0 1-1.944-1.964c0-1.087.868-1.965 1.944-1.965h8.577c1.076 0 1.945.878 1.945 1.965a1.95 1.95 0 0 1-1.945 1.964m7.908-7.327H71.426a1.95 1.95 0 0 1-1.944-1.965c0-1.087.868-1.964 1.944-1.964h16.485c1.076 0 1.945.877 1.945 1.964a1.95 1.95 0 0 1-1.945 1.965" opacity=".8"/><path fill="url(#c)" d="M45.464 66.488c5.84 0 10.543-4.58 10.543-10.244S51.305 46 45.464 46 34.92 50.58 34.92 56.244s4.727 10.244 10.543 10.244"/><path fill="url(#d)" d="M60.487 87C62.442 87 64 85.481 64 83.577c0-1.639.099-3.326-.594-4.869-.52-1.18-1.41-2.241-2.302-3.133-1.955-2-4.454-3.447-7.103-4.411s-5.643-1.47-8.538-1.47h.074c-2.895 0-5.89.506-8.538 1.47s-5.148 2.41-7.103 4.411c-.891.916-1.782 1.976-2.302 3.133-.693 1.543-.594 3.254-.594 4.87 0 1.88 1.584 3.422 3.514 3.422z"/><path stroke="url(#e)" d="M45.464 66.488c5.84 0 10.543-4.58 10.543-10.244S51.305 46 45.464 46 34.92 50.58 34.92 56.244s4.727 10.244 10.543 10.244Z"/><path stroke="url(#f)" d="M60.487 87C62.442 87 64 85.481 64 83.577c0-1.639.099-3.326-.594-4.869-.52-1.18-1.41-2.241-2.302-3.133-1.955-2-4.454-3.447-7.103-4.411s-5.643-1.47-8.538-1.47h.074c-2.895 0-5.89.506-8.538 1.47s-5.148 2.41-7.103 4.411c-.891.916-1.782 1.976-2.302 3.133-.693 1.543-.594 3.254-.594 4.87 0 1.88 1.584 3.422 3.514 3.422z"/><defs><linearGradient id="a" x1="60" x2="60" y1="0" y2="120" gradientUnits="userSpaceOnUse"><stop stop-color="#FE9D02"/><stop offset="1" stop-color="#F7701D"/></linearGradient><linearGradient id="b" x1="79.662" x2="79.662" y1="29.752" y2="64.463" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#FFFCEF"/></linearGradient><linearGradient id="c" x1="45.501" x2="45.501" y1="46" y2="87" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#EB8B16"/></linearGradient><linearGradient id="d" x1="45.501" x2="45.501" y1="46" y2="87" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#EB8B16"/></linearGradient><linearGradient id="e" x1="45.501" x2="45.501" y1="46" y2="87" gradientUnits="userSpaceOnUse"><stop offset=".232" stop-color="white"/><stop offset="1" stop-color="#FFAD47"/></linearGradient><linearGradient id="f" x1="45.501" x2="45.501" y1="46" y2="87" gradientUnits="userSpaceOnUse"><stop offset=".232" stop-color="white"/><stop offset="1" stop-color="#FFAD47"/></linearGradient></defs></svg>`,
      [],
    )

    const xml = useMemo(() => {
      if (!color) return baseXml
      return baseXml.replace(
        /(fill|stroke)="([^"]+)"/gi,
        (_match, attr, value) => {
          const normalized = String(value).toLowerCase().replace(/\s/g, '')
          if (
            normalized === 'none' ||
            normalized === 'currentcolor' ||
            normalized === 'white' ||
            normalized === '#fff' ||
            normalized === '#ffffff' ||
            normalized.startsWith('url(')
          ) {
            return `${attr}="${value}"`
          }
          return `${attr}="${color}"`
        },
      )
    }, [baseXml, color])

    return (
      <SvgXml
        ref={ref as never}
        xml={xml}
        width={size}
        height={size}
        viewBox="0 0 120 120"
        {...props}
      />
    )
  },
)

IconMenuQaAssistant.displayName = 'IconMenuQaAssistant'

export default IconMenuQaAssistant
