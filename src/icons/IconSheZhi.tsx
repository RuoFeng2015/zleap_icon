import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconSheZhiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconSheZhi icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconSheZhi = forwardRef<SVGSVGElement, IconSheZhiProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-111.556-437.5h793v822h-793z"/><path stroke="#0D131A" d="M20.75 5h-3m-4-2v4m0-2h-11m4 7h-4m8-2v4m11-2h-11m10 7h-3m-4-2v4m0-2h-11"/>
      </svg>
    );
  }
);

IconSheZhi.displayName = 'IconSheZhi';

export default IconSheZhi;
