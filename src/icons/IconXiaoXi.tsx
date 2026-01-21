import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconXiaoXiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconXiaoXi icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXiaoXi = forwardRef<SVGSVGElement, IconXiaoXiProps>(
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
        <path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 3h20v15h-7.5L12 20.5 9.5 18H2z"/><path stroke="#0D131A" strokeLinecap="round" strokeWidth="1.5" d="M11.5 10.5h1.001"/><path stroke="#0D131A" strokeLinecap="round" strokeWidth="1.5" d="M16.5 10.5h1"/><path stroke="#0D131A" strokeLinecap="round" strokeWidth="1.5" d="M6.5 10.5h1"/>
      </svg>
    );
  }
);

IconXiaoXi.displayName = 'IconXiaoXi';

export default IconXiaoXi;
