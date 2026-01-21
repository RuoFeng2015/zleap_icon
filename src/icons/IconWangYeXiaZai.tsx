import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWangYeXiaZaiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconWangYeXiaZai icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWangYeXiaZai = forwardRef<SVGSVGElement, IconWangYeXiaZaiProps>(
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
        style={style}
        {...props}
      >
        <path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.5 20h-10A1.5 1.5 0 0 1 2 18.5v-13A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5V12"/><path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 18 2.5 2.5L22 18"/><path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.5v6"/><path stroke="#0D131A" strokeWidth="1.5" d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5V10H2z"/><path fill="#0D131A" d="M4 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0"/><path fill="#0D131A" d="M7 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0"/>
      </svg>
    );
  }
);

IconWangYeXiaZai.displayName = 'IconWangYeXiaZai';

export default IconWangYeXiaZai;
