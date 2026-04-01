import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconFrameProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (for multicolor icons, original fills/strokes are preserved) */
  color?: string;
}

/**
 * IconFrame icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconFrame = forwardRef<SVGSVGElement, IconFrameProps>(
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
        style={style}
        {...props}
      >
        <path fill="#D9D9D9" d="M-220.438-216H112.5v856.636h-332.938z"/><path stroke="#0D131A" strokeLinejoin="round" strokeWidth="1.5" d="M12 22a9.97 9.97 0 0 0 7.071-2.929A9.97 9.97 0 0 0 22 12a9.97 9.97 0 0 0-2.929-7.071A9.97 9.97 0 0 0 12 2a9.97 9.97 0 0 0-7.071 2.929A9.97 9.97 0 0 0 2 12a9.97 9.97 0 0 0 2.929 7.071A9.97 9.97 0 0 0 12 22Z"/><path stroke="#0D131A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14.313v-2a3 3 0 1 0-3-3"/><path fill="#0D131A" fillRule="evenodd" d="M12 18.813a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" clipRule="evenodd"/>
      </svg>
    );
  }
);

IconFrame.displayName = 'IconFrame';

export default IconFrame;
