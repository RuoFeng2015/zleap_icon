import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFrame1261156242Props extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconFrame1261156242 icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconFrame1261156242 = forwardRef<SVGSVGElement, IconFrame1261156242Props>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 58 63"
        fill={color}
        className={className}
        style={style}
        {...props}
      >
        <path d="M6.18 0h40.64C50.23 0 53 2.764 53 6.167v49.666C53 59.236 50.23 62 46.82 62H6.18C2.77 62 0 59.236 0 55.833V6.167C0 2.764 2.77 0 6.18 0" opacity=".7"/><path stroke="currentColor" d="M51.636 9H16.364C13.404 9 11 11.363 11 14.272v42.456C11 59.638 13.404 62 16.364 62h35.272C54.596 62 57 59.637 57 56.728V14.272C57 11.362 54.596 9 51.636 9Z"/><rect width="23" height="4" x="21" y="18" rx="2"/><rect width="20" height="4" x="21" y="26" rx="2"/><rect width="15" height="4" x="21" y="34" rx="2"/>
      </svg>
    );
  }
);

IconFrame1261156242.displayName = 'IconFrame1261156242';

export default IconFrame1261156242;
