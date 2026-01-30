import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconCheckProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconCheck icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconCheck = forwardRef<SVGSVGElement, IconCheckProps>(
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
        <path fill="#1E1E1E" d="M0 0h24v24H0z"/><path fill="white" d="M-476.854-79.92h1269.19v1186.9h-1269.19z"/><path stroke="#4A4A4A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m20 6.5-11 11-5-5"/>
      </svg>
    );
  }
);

IconCheck.displayName = 'IconCheck';

export default IconCheck;
