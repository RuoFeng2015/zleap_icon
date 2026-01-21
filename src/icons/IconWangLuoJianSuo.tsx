import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWangLuoJianSuoProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconWangLuoJianSuo icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWangLuoJianSuo = forwardRef<SVGSVGElement, IconWangLuoJianSuoProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        style={style}
        {...props}
      >
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-465.778-638.25h793v822h-793z"/><path stroke="#0D131A" d="M6 17H2v4h4zM20 3H4v6h16zm-8 14V9"/><path stroke="#0D131A" d="M4 17v-4h16v4m2 0h-4v4h4zm-8 0h-4v4h4zM7 6h1"/>
      </svg>
    );
  }
);

IconWangLuoJianSuo.displayName = 'IconWangLuoJianSuo';

export default IconWangLuoJianSuo;
