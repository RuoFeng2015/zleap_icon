import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconZhengQueProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (controls the main color, preserves white/light decorations) */
  color?: string;
}

/**
 * IconZhengQue icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconZhengQue = forwardRef<SVGSVGElement, IconZhengQueProps>(
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
        <path fill="currentColor" d="M0 0h24v24H0z"/><path fill="white" d="M-414.054-161.92h1269.19V129h-1269.19z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m5 12 5 5L20 7"/>
      </svg>
    );
  }
);

IconZhengQue.displayName = 'IconZhengQue';

export default IconZhengQue;
