import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWenJianProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (controls the main color, preserves white/light decorations) */
  color?: string;
}

/**
 * IconWenJian icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWenJian = forwardRef<SVGSVGElement, IconWenJianProps>(
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
        <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M2.5 4a1 1 0 0 1 1-1h6L12 6h8.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1z"/><path stroke="white" strokeLinejoin="round" strokeWidth="1.5" d="M21.5 11h-19"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.5 8v6"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.5 8v6"/><path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M2.5 4a1 1 0 0 1 1-1h6L12 6h8.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1z"/><path stroke="white" strokeLinejoin="round" strokeWidth="1.5" d="M21.5 11h-19"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.5 8v6"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.5 8v6"/><path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M2.5 4a1 1 0 0 1 1-1h6L12 6h8.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1z"/><path stroke="white" strokeLinejoin="round" strokeWidth="1.5" d="M21.5 11h-19"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.5 8v6"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.5 8v6"/>
      </svg>
    );
  }
);

IconWenJian.displayName = 'IconWenJian';

export default IconWenJian;
