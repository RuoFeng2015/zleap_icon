import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconYanZhengMaProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconYanZhengMa icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconYanZhengMa = forwardRef<SVGSVGElement, IconYanZhengMaProps>(
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
        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M3 4.628 12.004 2 21 4.628v5.389A13.16 13.16 0 0 1 12.001 22.5 13.16 13.16 0 0 1 3 10.014z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 11.5 11 15l6-6"/>
      </svg>
    );
  }
);

IconYanZhengMa.displayName = 'IconYanZhengMa';

export default IconYanZhengMa;
