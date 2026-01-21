import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFanHuiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconFanHui icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconFanHui = forwardRef<SVGSVGElement, IconFanHuiProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-465.778-236.75h793v822h-793z"/><path stroke="#4A4A4A" d="m15.5 18-6-6 6-6"/>
      </svg>
    );
  }
);

IconFanHui.displayName = 'IconFanHui';

export default IconFanHui;
