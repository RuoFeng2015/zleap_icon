import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconCloseCircleProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconCloseCircle icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconCloseCircle = forwardRef<SVGSVGElement, IconCloseCircleProps>(
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
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6m0-6 6 6"/>
      </svg>
    );
  }
);

IconCloseCircle.displayName = 'IconCloseCircle';

export default IconCloseCircle;
