import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconTuiChuProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconTuiChu icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconTuiChu = forwardRef<SVGSVGElement, IconTuiChuProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-111.556-738.625h793v822h-793z"/><path stroke="#0D131A" d="M11.996 3H3v18h9m4.5-4.5L21 12l-4.5-4.5M8 11.996h13"/>
      </svg>
    );
  }
);

IconTuiChu.displayName = 'IconTuiChu';

export default IconTuiChu;
