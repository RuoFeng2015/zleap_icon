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
        fill="none"
        className={className}
        style={{ color, ...style }}
        {...props}
      >
        <path fill="#4A4A4A" stroke="#4A4A4A" strokeLinejoin="round" strokeWidth="1.5" d="M16 3h-5v18h5z"/><path fill="#4A4A4A" stroke="#4A4A4A" strokeLinejoin="round" strokeWidth="1.5" d="M21 3h-5v18h5z"/><path fill="#4A4A4A" stroke="#4A4A4A" strokeLinejoin="round" strokeWidth="1.5" d="m5 3 4 .5L7.25 21 3 20.5z"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.5 9V7.5"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 9V7.5"/>
      </svg>
    );
  }
);

IconWenDang.displayName = 'IconWenDang';

export default IconWenDang;
