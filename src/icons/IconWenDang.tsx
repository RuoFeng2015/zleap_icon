import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWenDangProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconWenDang icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWenDang = forwardRef<SVGSVGElement, IconWenDangProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-554.333-136.375h793v822h-793z"/><path fill="#4A4A4A" stroke="#4A4A4A" d="M16 3h-5v18h5zm5 0h-5v18h5zM5 3l4 .5L7.25 21 3 20.5z"/><path stroke="white" d="M18.5 9V7.5m-5 1.5V7.5"/>
      </svg>
    );
  }
);

IconWenDang.displayName = 'IconWenDang';

export default IconWenDang;
