import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconArrowRightProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconArrowRight icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconArrowRight = forwardRef<SVGSVGElement, IconArrowRightProps>(
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
        <path d="M5 12h14m-7-7 7 7-7 7"/>
      </svg>
    );
  }
);

IconArrowRight.displayName = 'IconArrowRight';

export default IconArrowRight;
