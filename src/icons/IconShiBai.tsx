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
        className={className}
        style={style}
        {...props}
      >
        <path fill="#F5F5F5" d="M0 0h16v16H0z"/><path fill="white" d="M-554.333-337.125h793v822h-793z"/><path fill="#EF4444" stroke="#EF4444" d="M8 14.667c1.84 0 3.508-.747 4.714-1.953A6.65 6.65 0 0 0 14.667 8a6.64 6.64 0 0 0-1.953-4.714A6.65 6.65 0 0 0 8 1.333c-1.84 0-3.508.747-4.714 1.953A6.65 6.65 0 0 0 1.333 8c0 1.84.747 3.508 1.953 4.714A6.65 6.65 0 0 0 8 14.667Z"/><path stroke="white" d="m5.381 5.382 5.237 5.237m-5.237.001 5.237-5.238"/>
      </svg>
    );
  }
);

IconShiBai.displayName = 'IconShiBai';

export default IconShiBai;
