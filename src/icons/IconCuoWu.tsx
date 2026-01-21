import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconCuoWuProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconCuoWu icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconCuoWu = forwardRef<SVGSVGElement, IconCuoWuProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-554.333-236.75h793v822h-793z"/><path stroke="#0D131A" d="m12 2.5-11 19h22zm0 15v.5m0-8.5.004 5"/>
      </svg>
    );
  }
);

IconCuoWu.displayName = 'IconCuoWu';

export default IconCuoWu;
