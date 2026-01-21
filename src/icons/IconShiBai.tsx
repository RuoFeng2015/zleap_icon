import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconShiBaiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconShiBai icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconShiBai = forwardRef<SVGSVGElement, IconShiBaiProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={className}
        style={{ color, ...style }}
        {...props}
      >
        <path fill="#EF4444" stroke="#EF4444" strokeLinejoin="round" d="M8 14.667c1.84 0 3.508-.747 4.714-1.953A6.65 6.65 0 0 0 14.667 8a6.64 6.64 0 0 0-1.953-4.714A6.65 6.65 0 0 0 8 1.333c-1.84 0-3.508.747-4.714 1.953A6.65 6.65 0 0 0 1.333 8c0 1.84.747 3.508 1.953 4.714A6.65 6.65 0 0 0 8 14.667Z"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" d="m5.381 5.382 5.237 5.237"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" d="m5.381 10.62 5.237-5.238"/>
      </svg>
    );
  }
);

IconShiBai.displayName = 'IconShiBai';

export default IconShiBai;
