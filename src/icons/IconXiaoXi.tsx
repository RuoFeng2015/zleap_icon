import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconXiaoXiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconXiaoXi icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXiaoXi = forwardRef<SVGSVGElement, IconXiaoXiProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-200.111-337.125h793v822h-793z"/><path stroke="#0D131A" d="M2 3h20v15h-7.5L12 20.5 9.5 18H2zm9.5 7.5h1.001m3.999 0h1m-11 0h1"/>
      </svg>
    );
  }
);

IconXiaoXi.displayName = 'IconXiaoXi';

export default IconXiaoXi;
