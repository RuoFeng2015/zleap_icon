import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconCheckProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconCheck icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconCheck = forwardRef<SVGSVGElement, IconCheckProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        className={className}
        style={style}
        {...props}
      >
        <path d="M20 6 9 17l-5-5"/>
      </svg>
    );
  }
);

IconCheck.displayName = 'IconCheck';

export default IconCheck;
