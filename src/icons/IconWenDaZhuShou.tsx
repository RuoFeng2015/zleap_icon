import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconWenDaZhuShouProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconWenDaZhuShou icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconWenDaZhuShou = forwardRef<SVGSVGElement, IconWenDaZhuShouProps>(
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
        <path fill="#F5F5F5" d="M0 0h24v24H0z"/><path fill="white" d="M-192-656h793v822h-793z"/><path fill="#4A4A4A" stroke="#4A4A4A" d="M5 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path stroke="white" d="M17 3v18"/><path stroke="#4A4A4A" d="M3 7h4m-4 5h4m-4 5h4m6.5-15h6m-6 20h6"/>
      </svg>
    );
  }
);

IconWenDaZhuShou.displayName = 'IconWenDaZhuShou';

export default IconWenDaZhuShou;
