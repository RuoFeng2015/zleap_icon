import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWenDangProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (controls the main color, preserves white/light decorations) */
  color?: string;
}

/**
 * IconWenDang icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWenDang = forwardRef<SVGSVGElement, IconWenDangProps>(
  ({ size = 24, color, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ ...(color ? { color } : {}), ...style }}
        {...props}
      >
        <path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 15h7"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 18H12"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 8.5h5"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11V6"/>
      </svg>
    );
  }
);

IconWenDang.displayName = 'IconWenDang';

export default IconWenDang;
