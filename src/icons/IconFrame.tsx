import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFrameProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconFrame icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconFrame = forwardRef<SVGSVGElement, IconFrameProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ color, ...style }}
        {...props}
      >
        <path fill="#4A4A4A" fillRule="evenodd" stroke="#4A4A4A" strokeLinejoin="round" strokeWidth="1.5" d="m12 2.5-11 19h22z" clipRule="evenodd"/><path stroke="white" strokeLinecap="round" strokeWidth="1.5" d="M12 17.5v.5"/><path stroke="white" strokeLinecap="round" strokeWidth="1.5" d="m12 9.5.004 5"/>
      </svg>
    );
  }
);

IconFrame.displayName = 'IconFrame';

export default IconFrame;
