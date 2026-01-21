import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFangDaProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconFangDa icon component (multicolor)
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
        className={className}
        style={style}
        {...props}
      >
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-208.666-437.5h793v822h-793z"/><path stroke="#0D131A" d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Zm0-11.5v6m-2.992-2.992L13.5 10.5m3.11 6.11 4.244 4.244"/>
      </svg>
    );
  }
);

IconFangDa.displayName = 'IconFangDa';

export default IconFangDa;
