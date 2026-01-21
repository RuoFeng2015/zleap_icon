import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWenJianProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconWenJian icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWenJian = forwardRef<SVGSVGElement, IconWenJianProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-642.889-136.375h793v822h-793z"/><path stroke="#0D131A" d="M20 11.5V7l-4.5-5H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h6m5.5-7.5v7M13 18h7"/><path stroke="#0D131A" d="M15 2v5h5"/>
      </svg>
    );
  }
);

IconWenJian.displayName = 'IconWenJian';

export default IconWenJian;
