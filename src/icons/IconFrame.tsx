import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFrameProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (for multicolor icons, original fills/strokes are preserved) */
  color?: string;
}

/**
 * IconFrame icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconFrame = forwardRef<SVGSVGElement, IconFrameProps>(
  ({ size = 24, color, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        style={style}
        {...props}
      >
        <g filter="url(#a)"><rect width="479" height="590.575" x="-207.504" y="-223.584" stroke="#D9D9D9" rx="15.5"/><circle cx="31.996" cy="32.416" r="162.5" fill="#FEF3D2"/><path stroke="#FFE9A4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6.582 13.33c0-1.472 1.178-2.665 2.631-2.665h44.73c1.453 0 2.63 1.193 2.63 2.666v37.327c0 1.473-1.177 2.666-2.63 2.666H9.213c-1.453 0-2.631-1.193-2.631-2.666z" clipRule="evenodd"/><path stroke="#FFE9A4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.075 23.996c1.09 0 1.973-.895 1.973-2s-.883-2-1.973-2-1.973.896-1.973 2 .883 2 1.973 2" clipRule="evenodd"/><path stroke="#FFE9A4" strokeLinejoin="round" strokeWidth="3" d="m19.738 31.994 6.578 5.333 7.893-9.332 22.365 17.33v5.333c0 1.472-1.178 2.666-2.631 2.666H9.213c-1.453 0-2.631-1.194-2.631-2.666v-5.333z"/></g><defs><filter id="a" width="536" height="647.575" x="-236.004" y="-248.084" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1970_14250"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_1970_14250" mode="normal" result="shape"/></filter></defs>
      </svg>
    );
  }
);

IconFrame.displayName = 'IconFrame';

export default IconFrame;
