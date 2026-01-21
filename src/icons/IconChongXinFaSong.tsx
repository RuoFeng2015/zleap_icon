import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconChongXinFaSongProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconChongXinFaSong icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconChongXinFaSong = forwardRef<SVGSVGElement, IconChongXinFaSongProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><rect width="953" height="913" x="-433" y="-266" fill="white" rx="16"/><path stroke="#0D131A" d="M18.364 18.364a9 9 0 1 1 0-12.728C19.193 6.466 21 8.5 21 8.5"/><path stroke="#0D131A" d="M21 4v4.5h-4.5"/>
      </svg>
    );
  }
);

IconChongXinFaSong.displayName = 'IconChongXinFaSong';

export default IconChongXinFaSong;
