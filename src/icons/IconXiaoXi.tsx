import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconXiaoXiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconXiaoXi icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXiaoXi = forwardRef<SVGSVGElement, IconXiaoXiProps>(
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
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.23" d="M20.197 12A8.197 8.197 0 0 1 12 20.198H3.803V12a8.197 8.197 0 0 1 16.394 0"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.23" d="M7.901 9.54h7.378"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.23" d="M7.901 12.82h7.378"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.23" d="M7.901 16.099H12"/>
      </svg>
    );
  }
);

IconXiaoXi.displayName = 'IconXiaoXi';

export default IconXiaoXi;
