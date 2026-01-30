import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconZhanKaiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconZhanKai icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconZhanKai = forwardRef<SVGSVGElement, IconZhanKaiProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ color, ...style }}
        {...props}
      >
        <path fill="#1E1E1E" d="M0 0h24v24H0z"/><path fill="white" d="M-288.454-79.92h1269.19V211h-1269.19z"/><path fill="#4A4A4A" d="M21.965 5.143h-2.01a.43.43 0 0 0-.345.177L12 15.809 4.39 5.319a.43.43 0 0 0-.345-.176H2.036a.215.215 0 0 0-.174.34l9.445 13.02a.855.855 0 0 0 1.384 0l9.445-13.02a.213.213 0 0 0-.171-.34"/>
      </svg>
    );
  }
);

IconZhanKai.displayName = 'IconZhanKai';

export default IconZhanKai;
