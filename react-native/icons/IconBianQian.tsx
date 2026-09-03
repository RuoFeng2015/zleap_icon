import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconBianQianProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconBianQian = forwardRef<unknown, IconBianQianProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 48 48"><g filter="url(#a)"><rect width="48" height="48" fill="url(#b)" rx="12"/><mask id="c" width="50" height="51" x="-1" y="-1" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#8E8E93" d="M48.621 13.433a69 69 0 0 0-.022-1.477c-.029-1.073-.092-2.155-.283-3.217a10.8 10.8 0 0 0-1.008-3.056 10.28 10.28 0 0 0-4.496-4.494A10.9 10.9 0 0 0 39.752.18c-1.061-.19-2.144-.254-3.217-.283a71 71 0 0 0-1.478-.022q-.877-.004-1.755-.003L26.51-.15h-5.08l-6.673.024q-.879 0-1.758.003-.741.005-1.481.022c-1.076.03-2.16.093-3.225.283C7.214.375 6.21.691 5.23 1.19A10.3 10.3 0 0 0 .724 5.683c-.5.978-.816 1.98-1.01 3.058-.191 1.06-.254 2.142-.283 3.215q-.02.739-.022 1.477c-.004.585-.034 1.311-.034 1.896v11.715l.03 6.72q-.001.877.004 1.756.003.74.022 1.479c.029 1.074.092 2.158.283 3.22.194 1.078.51 2.082 1.01 3.06a10.3 10.3 0 0 0 4.505 4.502c.981.498 1.986.815 3.066 1.009 1.063.19 2.148.254 3.223.283q.74.018 1.48.022.88.004 1.76.003h18.545q.877 0 1.754-.003a71 71 0 0 0 1.478-.022c1.074-.03 2.157-.093 3.218-.284a10.9 10.9 0 0 0 3.058-1.008 10.3 10.3 0 0 0 4.497-4.5c.498-.98.815-1.984 1.008-3.063.19-1.062.254-2.145.283-3.219q.02-.74.022-1.48.004-.877.003-1.756V15.187q0-.878-.003-1.754"/></mask><g mask="url(#c)"><path fill="url(#d)" d="M49.397 12.612a72 72 0 0 0-.023-1.524c-.03-1.107-.095-2.223-.291-3.318-.2-1.11-.526-2.144-1.04-3.152A10.6 10.6 0 0 0 43.405-.02a11.2 11.2 0 0 0-3.156-1.039c-1.095-.196-2.211-.262-3.318-.291a73 73 0 0 0-1.525-.023q-.905-.005-1.81-.004L26.589-1.4h-5.24l-6.883.025q-.906-.001-1.813.004-.765.003-1.528.023c-1.11.03-2.229.095-3.326.291-1.113.2-2.149.526-3.16 1.04A10.63 10.63 0 0 0-.01 4.616 11.2 11.2 0 0 0-1.05 7.771c-.197 1.094-.262 2.21-.292 3.317q-.02.762-.023 1.524c-.003.603-.034 1.352-.034 1.955v12.084l.03 6.931q-.001.906.004 1.812.004.763.023 1.526c.03 1.108.095 2.226.293 3.322A11.2 11.2 0 0 0-.01 43.4a10.6 10.6 0 0 0 4.647 4.642c1.012.515 2.049.841 3.162 1.041 1.097.197 2.216.262 3.325.292q.763.02 1.528.023.906.004 1.813.003h19.13q.905 0 1.81-.003a73 73 0 0 0 1.525-.023c1.107-.03 2.224-.095 3.32-.292 1.11-.2 2.144-.526 3.153-1.04a10.6 10.6 0 0 0 4.639-4.643c.514-1.01.84-2.046 1.04-3.158.196-1.096.262-2.213.292-3.321q.02-.763.022-1.526.005-.906.004-1.812V14.421q.001-.904-.004-1.81"/><path stroke="#8E8E93" stroke-dasharray="0.91 0.91" stroke-linecap="round" stroke-width=".453" d="M-6.307 15.003h60.615" opacity=".33"/><rect width="51.144" height=".474" x="-1.572" y="24.473" fill="#8E8E93" opacity=".33" rx=".237"/><rect width="51.144" height=".474" x="-1.572" y="36.312" fill="#8E8E93" opacity=".33" rx=".237"/><g filter="url(#e)"><path fill="url(#f)" d="M-1.336-1.098h50.67v14.207h-50.67z"/><path stroke="url(#g)" stroke-width=".453" d="M-1.11-.872h50.217v13.754H-1.11z"/></g></g></g><defs><linearGradient id="b" x1="24" x2="24" y1="0" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#F7F7F7"/></linearGradient><linearGradient id="d" x1="24" x2="24" y1="-1.401" y2="49.4" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#F7F7F7"/></linearGradient><linearGradient id="f" x1="24.24" x2="24.24" y1="3.099" y2="13.323" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD728"/><stop offset="1" stop-color="#FEC418"/></linearGradient><linearGradient id="g" x1="31.408" x2="30.586" y1="5.359" y2="9.559" gradientUnits="userSpaceOnUse"><stop stop-opacity=".15"/><stop offset="1" stop-opacity=".14"/></linearGradient><filter id="a" width="49.2" height="49.2" x="-.6" y="-.6" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6" dy=".6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="shape" mode="normal" result="effect1_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.6" dy="-.6"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="effect1_innerShadow_1063_1503" mode="normal" result="effect2_innerShadow_1063_1503"/></filter><filter id="e" width="61.538" height="25.075" x="-6.77" y="-6.532" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy=".453"/><feGaussianBlur stdDeviation=".453"/><feColorMatrix type="matrix" values="0 0 0 0 0.625 0 0 0 0 0.446429 0 0 0 0 0 0 0 0 0.21 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="2.717"/><feColorMatrix type="matrix" values="0 0 0 0 0.1875 0 0 0 0 0.134821 0 0 0 0 0.003125 0 0 0 0.1 0"/><feBlend in2="effect1_dropShadow_1063_1503" mode="normal" result="effect2_dropShadow_1063_1503"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_1063_1503" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="1.811"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/><feBlend in2="shape" mode="normal" result="effect3_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy=".906"/><feGaussianBlur stdDeviation=".453"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.44 0"/><feBlend in2="effect3_innerShadow_1063_1503" mode="normal" result="effect4_innerShadow_1063_1503"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.906"/><feGaussianBlur stdDeviation=".453"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.558333 0 0 0 0 0.335 0 0 0 0 0 0 0 0 0.1 0"/><feBlend in2="effect4_innerShadow_1063_1503" mode="normal" result="effect5_innerShadow_1063_1503"/></filter></defs></svg>`,
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
        viewBox="0 0 48 48"
        {...props}
      />
    )
  },
)

IconBianQian.displayName = 'IconBianQian'

export default IconBianQian
