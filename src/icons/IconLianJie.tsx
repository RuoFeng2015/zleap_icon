import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconLianJieProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (controls the main color, preserves white/light decorations) */
  color?: string;
}

/**
 * IconLianJie icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconLianJie = forwardRef<SVGSVGElement, IconLianJieProps>(
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
        <path stroke="currentColor" strokeWidth="1.5" d="M6 4.964V3.5A1.5 1.5 0 0 1 7.5 2h13A1.5 1.5 0 0 1 22 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-1.491"/><path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M17.5 5h-14A1.5 1.5 0 0 0 2 6.5v14A1.5 1.5 0 0 0 3.5 22h14a1.5 1.5 0 0 0 1.5-1.5v-14A1.5 1.5 0 0 0 17.5 5Z"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.22 11.555 11.866 8.8c.726-.726 1.918-.71 2.664.036s.762 1.938.036 2.664l-.955 1.012"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.733 14.374a89 89 0 0 1-.783.764c-.726.726-.745 2.02 0 2.765.746.746 1.939.762 2.664.036l2.582-2.344"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.331 14.164a1.93 1.93 0 0 1-.565-1.237 1.83 1.83 0 0 1 .53-1.427"/><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.16 12.93c.746.746.762 1.939.036 2.665"/>
      </svg>
    );
  }
);

IconLianJie.displayName = 'IconLianJie';

export default IconLianJie;
