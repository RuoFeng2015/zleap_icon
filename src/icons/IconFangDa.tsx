import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFangDaProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconFangDa icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconFangDa = forwardRef<SVGSVGElement, IconFangDaProps>(
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
        <path stroke="#0D131A" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"/><path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 7.5v6"/><path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.508 10.508 13.5 10.5"/><path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m16.61 16.61 4.244 4.244"/>
      </svg>
    );
  }
);

IconFangDa.displayName = 'IconFangDa';

export default IconFangDa;
