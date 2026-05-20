import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconShouQiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconShouQi icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconShouQi = forwardRef<SVGSVGElement, IconShouQiProps>(
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
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" d="M6.667 13.333h4v4"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" d="M17.333 10.667h-4v-4"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" d="M13.333 10.667 18 6"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" d="m6 18 4.667-4.667"/>
      </svg>
    );
  }
);

IconShouQi.displayName = 'IconShouQi';

export default IconShouQi;
