import React, { forwardRef, useMemo } from 'react'
import type { ComponentProps } from 'react'
import { SvgXml } from 'react-native-svg'

export interface IconSiMiWenJianJiaYouNeiRongProps extends Omit<ComponentProps<typeof SvgXml>, 'xml' | 'width' | 'height'> {
  size?: number | string
  color?: string
}

export const IconSiMiWenJianJiaYouNeiRong = forwardRef<unknown, IconSiMiWenJianJiaYouNeiRongProps>(
  ({ size = 24, color, ...props }, ref) => {
    const baseXml = useMemo(
      () => `<svg fill="none" viewBox="0 0 544 432"><g filter="url(#a)"><path fill="#EF7F4B" d="M16 38.806v346.388C16 399.998 28.002 412 42.806 412h458.388C515.998 412 528 399.998 528 385.194V93.473c0-14.805-12.002-26.806-26.806-26.806H260.603c-10.421 0-19.86-6.083-25.312-14.965C225.357 35.517 207.444 12 187.225 12H42.765C27.96 12 16 24.002 16 38.806"/><rect width="482" height="173" x="31" y="83.246" fill="white" rx="20"/><path fill="url(#b)" d="M528 127.52v248.673C528 390.998 515.998 403 501.194 403H42.806C28.002 403 16 390.998 16 376.193V127.519c0-14.805 11.962-26.806 26.767-26.806h135.411c45.571 0 39.204-.002 70.366 0 85.023.003 201.002.001 252.695 0 14.805 0 26.761 12.002 26.761 26.807"/><g clip-path="url(#c)" filter="url(#d)"><path fill="#FDBA74" fill-rule="evenodd" d="M364.622 122.858c-31.752 3.882-57.54 26.694-64.722 57.252-1.857 7.897-1.819 7.177-2.002 38.078l-.168 28.408-12.533.152c-11.211.136-12.692.21-14.043.71-6.387 2.364-11.271 7.727-12.506 13.734-.575 2.798-.453 141.179.127 143.471 1.645 6.506 7.074 11.938 13.575 13.584 2.733.693 198.119.693 200.852 0 6.464-1.637 11.797-6.919 13.427-13.297.823-3.218.964-140.938.148-144.162-1.266-5.007-5.117-9.871-9.517-12.022-4.015-1.962-4.515-2.019-17.709-2.019H447.7l-.11-28.332c-.118-30.372-.089-29.746-1.731-37.329-7.941-36.662-44.324-62.74-81.237-58.228m11.736 29.909c20.607 1.825 36.695 15.921 41.49 36.351.638 2.721.654 3.345.752 30.204l.1 27.425h-91.852l.105-27.425c.117-30.485-.009-28.491 2.23-35.283 5.662-17.173 21.46-29.652 39.574-31.261 3.863-.343 3.857-.343 7.601-.011m2.005 140.838c19.283 4.611 23.497 31.229 6.568 41.495l-1.887 1.144v15.145c0 15.133-.001 15.145-.657 15.844l-.657.699h-17.97l-.626-.796c-.614-.781-.626-1.078-.626-15.824v-15.027l-2.039-1.318c-21.584-13.955-7.139-47.348 17.894-41.362" clip-rule="evenodd"/></g></g><defs><filter id="a" width="544" height="432.246" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2645_1745"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2645_1745" mode="normal" result="shape"/></filter><filter id="d" width="235.049" height="302.416" x="255.273" y="119.351" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="-1"/><feGaussianBlur stdDeviation="1"/><feColorMatrix type="matrix" values="0 0 0 0 0.87451 0 0 0 0 0.643137 0 0 0 0 0.4 0 0 0 0.5 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2645_1745"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-1" dy="1"/><feGaussianBlur stdDeviation="1"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.815686 0 0 0 0 0.509804 0 0 0 0.3 0"/><feBlend in2="effect1_dropShadow_2645_1745" mode="normal" result="effect2_dropShadow_2645_1745"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_2645_1745" mode="normal" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-3" dy="3"/><feGaussianBlur stdDeviation="4"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.87451 0 0 0 0 0.643137 0 0 0 0 0.4 0 0 0 0.9 0"/><feBlend in2="shape" mode="normal" result="effect3_innerShadow_2645_1745"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="3" dy="-3"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.815686 0 0 0 0 0.509804 0 0 0 0.9 0"/><feBlend in2="effect3_innerShadow_2645_1745" mode="normal" result="effect4_innerShadow_2645_1745"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-3" dy="-3"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.87451 0 0 0 0 0.643137 0 0 0 0 0.4 0 0 0 0.2 0"/><feBlend in2="effect4_innerShadow_2645_1745" mode="normal" result="effect5_innerShadow_2645_1745"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="3" dy="3"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix type="matrix" values="0 0 0 0 0.87451 0 0 0 0 0.643137 0 0 0 0 0.4 0 0 0 0.2 0"/><feBlend in2="effect5_innerShadow_2645_1745" mode="normal" result="effect6_innerShadow_2645_1745"/></filter><linearGradient id="b" x1="528" x2="51.871" y1="100.712" y2="451.665" gradientUnits="userSpaceOnUse"><stop offset=".234" stop-color="#FFB76D"/><stop offset="1" stop-color="#EF7F4B"/></linearGradient><clipPath id="c"><rect width="512" height="326" x="16" y="77" fill="white" rx="25.466"/></clipPath></defs></svg>`,
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
        viewBox="0 0 544 432"
        {...props}
      />
    )
  },
)

IconSiMiWenJianJiaYouNeiRong.displayName = 'IconSiMiWenJianJiaYouNeiRong'

export default IconSiMiWenJianJiaYouNeiRong
