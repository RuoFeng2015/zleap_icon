import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconEdit03Props extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
}

/**
 * IconEdit03 icon component
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconEdit03 = forwardRef<SVGSVGElement, IconEdit03Props>(
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
        <path fill="currentColor" fillRule="evenodd" d="M13.879 3.707a3 3 0 0 1 4.242 0l2.172 2.172a3 3 0 0 1 0 4.242L9.707 20.707A1 1 0 0 1 9 21H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 .293-.707zm2.828 1.414a1 1 0 0 0-1.414 0L14.414 6 18 9.586l.879-.879a1 1 0 0 0 0-1.414zM16.586 11 13 7.414l-8 8V19h3.586z" clipRule="evenodd"/>
      </svg>
    );
  }
);

IconEdit03.displayName = 'IconEdit03';

export default IconEdit03;
