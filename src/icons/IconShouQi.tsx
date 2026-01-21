import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconShouQiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconShouQi icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconShouQi = forwardRef<SVGSVGElement, IconShouQiProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        style={style}
        {...props}
      >
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-200.111-537.875h793v822h-793z"/><path stroke="#4A4A4A" d="M4 5.25h16m-8 4.5h8m-8 4.5h8m-16 4.5h16"/><path fill="#4A4A4A" stroke="#4A4A4A" d="M4 9.5 8 12l-4 2.5z"/>
      </svg>
    );
  }
);

IconShouQi.displayName = 'IconShouQi';

export default IconShouQi;
