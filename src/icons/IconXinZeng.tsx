import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconXinZengProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconXinZeng icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXinZeng = forwardRef<SVGSVGElement, IconXinZengProps>(
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
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12.03 5-.018 14"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14"/>
      </svg>
    );
  }
);

IconXinZeng.displayName = 'IconXinZeng';

export default IconXinZeng;
