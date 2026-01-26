import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconChongXinFaSongProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconChongXinFaSong icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconChongXinFaSong = forwardRef<SVGSVGElement, IconChongXinFaSongProps>(
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
        <path fill="currentColor" d="M0 0h24v24H0z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364a9 9 0 1 1 0-12.728C19.193 6.466 21 8.5 21 8.5"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 4v4.5h-4.5"/>
      </svg>
    );
  }
);

IconChongXinFaSong.displayName = 'IconChongXinFaSong';

export default IconChongXinFaSong;
