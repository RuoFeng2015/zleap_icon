import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconShengChengProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconShengCheng icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconShengCheng = forwardRef<SVGSVGElement, IconShengChengProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-200.111-36h793v822h-793z"/><path stroke="#0D131A" d="M12 16V8m9 5.5v-3m-18 3v-3M7 3H4a1 1 0 0 0-1 1v3m14-4h3a1 1 0 0 1 1 1v3m-4 14h3a1 1 0 0 0 1-1v-3M7 21H4a1 1 0 0 1-1-1v-3M13.5 3h-3m5.5 9H8m5.5 9h-3"/>
      </svg>
    );
  }
);

IconShengCheng.displayName = 'IconShengCheng';

export default IconShengCheng;
