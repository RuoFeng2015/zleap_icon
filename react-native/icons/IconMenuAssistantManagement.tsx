import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconMenuAssistantManagementProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconMenuAssistantManagement = forwardRef<unknown, IconMenuAssistantManagementProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 120 120"><rect width="120" height="120" fill="url(#a)" rx="30"/><path fill="url(#b)" stroke="url(#c)" d="M63 35.111a2 2 0 0 1 2 2V38.8a2 2 0 0 1-2 2H45a14.32 14.32 0 0 0-10.102 4.166 14.2 14.2 0 0 0-4.184 10.056V72.09c0 1.868.37 3.717 1.088 5.442a14.2 14.2 0 0 0 3.096 4.614A14.32 14.32 0 0 0 45 86.312h28.571c1.877 0 3.734-.368 5.467-1.083a14.3 14.3 0 0 0 4.635-3.082 14.2 14.2 0 0 0 3.097-4.615 14.2 14.2 0 0 0 1.087-5.442V57.022a2 2 0 0 1 2-2h1.714a2 2 0 0 1 2 2V72.09c0 5.28-2.107 10.345-5.857 14.08A20.05 20.05 0 0 1 73.57 92H45a20.05 20.05 0 0 1-14.142-5.832A19.87 19.87 0 0 1 25 72.088V55.023a19.87 19.87 0 0 1 5.858-14.08A20.05 20.05 0 0 1 45 35.113zm20.526-6.05v.006c.726 2.769 1.949 4.992 3.668 6.71 1.715 1.706 3.955 2.924 6.743 3.646 1.417.37 1.417 2.384 0 2.754-2.788.722-5.028 1.94-6.743 3.652-1.714 1.707-2.943 3.937-3.668 6.713-.372 1.41-2.395 1.41-2.766 0-.726-2.776-1.949-5.006-3.669-6.713-1.714-1.707-3.954-2.93-6.742-3.652-1.418-.37-1.418-2.384 0-2.754 2.788-.722 5.028-1.94 6.742-3.652 1.715-1.707 2.943-3.937 3.669-6.713.371-1.41 2.392-1.41 2.765-.003z"/><path fill="url(#d)" d="m71.667 61.04.215-.215a2.546 2.546 0 1 0-3.6-3.6l-.235.235-.433.427q-.004.001-.005-.002a.003.003 0 0 0-.005-.002l-.937.925-1.607 1.586-1.381 1.368a2.53 2.53 0 0 0-.752 1.794 2.5 2.5 0 0 0 .752 1.793l4.602 4.558a2.548 2.548 0 1 0 3.585-3.622l-2.59-2.562a.235.235 0 0 1 0-.335l1.008-.998z"/><path fill="url(#e)" d="M52.7 67.958v-8.805a3.197 3.197 0 1 0-6.395 0v8.805a3.198 3.198 0 0 0 6.395 0"/><defs><linearGradient id="a" x1="60" x2="60" y1="0" y2="120" gradientUnits="userSpaceOnUse"><stop stop-color="#1D6FF2"/><stop offset="1" stop-color="#1AC8FC"/></linearGradient><linearGradient id="b" x1="61.962" x2="61.962" y1="28" y2="92" gradientUnits="userSpaceOnUse"><stop stop-color="#E2F7FF"/><stop offset="1" stop-color="#95D1FF"/></linearGradient><linearGradient id="c" x1="61.962" x2="61.962" y1="28" y2="92" gradientUnits="userSpaceOnUse"><stop stop-color="#F4FCFF"/><stop offset="1" stop-color="#7FD6FF"/></linearGradient><linearGradient id="d" x1="60.768" x2="60.768" y1="55.429" y2="71.683" gradientUnits="userSpaceOnUse"><stop stop-color="#D2F2FF"/><stop offset="1" stop-color="#95D1FF"/></linearGradient><linearGradient id="e" x1="60.768" x2="60.768" y1="55.429" y2="71.683" gradientUnits="userSpaceOnUse"><stop stop-color="#D2F2FF"/><stop offset="1" stop-color="#95D1FF"/></linearGradient></defs></svg>`,
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

IconMenuAssistantManagement.displayName = 'IconMenuAssistantManagement'

export default IconMenuAssistantManagement
