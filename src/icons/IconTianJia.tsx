import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconTianJiaProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconTianJia icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconTianJia = forwardRef<SVGSVGElement, IconTianJiaProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-554.333-638.25h793v822h-793z"/><path stroke="#0D131A" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm0-14v8m-4-4h8"/>
      </svg>
    );
  }
);

IconTianJia.displayName = 'IconTianJia';

export default IconTianJia;
