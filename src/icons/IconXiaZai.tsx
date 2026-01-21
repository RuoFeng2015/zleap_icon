import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconXiaZaiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconXiaZai icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXiaZai = forwardRef<SVGSVGElement, IconXiaZaiProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-111.556-537.875h793v822h-793z"/><path stroke="#0D131A" d="M3 12.004V21h18v-9"/><path stroke="#0D131A" d="M16.5 11.5 12 16l-4.5-4.5M11.996 3v13"/>
      </svg>
    );
  }
);

IconXiaZai.displayName = 'IconXiaZai';

export default IconXiaZai;
