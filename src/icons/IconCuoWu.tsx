import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconCuoWuProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconCuoWu icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconCuoWu = forwardRef<SVGSVGElement, IconCuoWuProps>(
  ({ size = 24, color, className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ ...(color ? { color } : {}), ...style }}
        {...props}
      >
        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="m12 2.5-11 19h22z" clipRule="evenodd"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 17.5v.5"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m12 9.5.004 5"/><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="m12 2.5-11 19h22z" clipRule="evenodd"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 17.5v.5"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m12 9.5.004 5"/><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="m12 2.5-11 19h22z" clipRule="evenodd"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 17.5v.5"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m12 9.5.004 5"/>
      </svg>
    );
  }
);

IconCuoWu.displayName = 'IconCuoWu';

export default IconCuoWu;
