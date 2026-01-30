import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconSheZhiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconSheZhi icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconSheZhi = forwardRef<SVGSVGElement, IconSheZhiProps>(
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
        <path fill="currentColor" d="M0 0h24v24H0z"/><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M9.142 21.586a10 10 0 0 1-4.348-2.652 3 3 0 0 0-2.59-4.919A10.04 10.04 0 0 1 2.457 9H2.5a3 3 0 0 0 2.692-4.325 10 10 0 0 1 4.134-2.313 3 3 0 0 0 5.348 0 10 10 0 0 1 4.134 2.313A3 3 0 0 0 21.542 9a10.04 10.04 0 0 1 .255 5.015 3 3 0 0 0-2.59 4.919 10 10 0 0 1-4.349 2.652 3.001 3.001 0 0 0-5.716 0Z"/><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/>
      </svg>
    );
  }
);

IconSheZhi.displayName = 'IconSheZhi';

export default IconSheZhi;
