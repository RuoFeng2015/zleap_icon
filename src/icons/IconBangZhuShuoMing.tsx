import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconBangZhuShuoMingProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconBangZhuShuoMing icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconBangZhuShuoMing = forwardRef<SVGSVGElement, IconBangZhuShuoMingProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-465.778-337.125h793v822h-793z"/><path stroke="#0D131A" d="M12 22a9.97 9.97 0 0 0 7.071-2.929A9.97 9.97 0 0 0 22 12a9.97 9.97 0 0 0-2.929-7.071A9.97 9.97 0 0 0 12 2a9.97 9.97 0 0 0-7.071 2.929A9.97 9.97 0 0 0 2 12a9.97 9.97 0 0 0 2.929 7.071A9.97 9.97 0 0 0 12 22Z"/><path stroke="#0D131A" d="M12 14.312v-2a3 3 0 1 0-3-3"/><path fill="#0D131A" d="M12 18.812a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5"/>
      </svg>
    );
  }
);

IconBangZhuShuoMing.displayName = 'IconBangZhuShuoMing';

export default IconBangZhuShuoMing;
