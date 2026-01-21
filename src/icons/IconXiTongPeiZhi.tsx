import React, { forwardRef } from 'react';
import type { SVGProps } from 'react';

export interface IconXiTongPeiZhiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconXiTongPeiZhi icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXiTongPeiZhi = forwardRef<SVGSVGElement, IconXiTongPeiZhiProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className={className}
        style={style}
        {...props}
      >
        <rect width="120" height="120" fill="url(#a)" rx="30"/><path fill="url(#b)" fillOpacity=".6" d="M60 99c20.987 0 38-17.013 38-38S80.987 23 60 23 22 40.013 22 61s17.013 38 38 38" opacity=".8"/><path fill="url(#c)" stroke="url(#d)" d="M60 68.1c14.257 0 25.893 7.812 28.008 17.814C81.143 93.633 71.14 98.5 60 98.5s-21.144-4.867-28.009-12.586C34.106 75.912 45.743 68.1 60 68.1Zm-.5-32.6c7.749 0 14 6.06 14 13.5s-6.251 13.5-14 13.5-14-6.06-14-13.5 6.251-13.5 14-13.5Z"/><defs><linearGradient id="a" x1="60" x2="60" y1="120" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#74ABDC"/><stop offset="1" stopColor="#52D8E1"/></linearGradient><linearGradient id="b" x1="60" x2="60" y1="23" y2="99" gradientUnits="userSpaceOnUse"><stop stopColor="#BFF6FF"/><stop offset="1" stopColor="#C6EBFF"/></linearGradient><linearGradient id="c" x1="60" x2="60" y1="35" y2="99" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#94E8FF"/></linearGradient><linearGradient id="d" x1="60" x2="60" y1="35" y2="99" gradientUnits="userSpaceOnUse"><stop offset=".096" stopColor="white"/><stop offset="1" stopColor="#A1FAFF"/></linearGradient></defs>
      </svg>
    );
  }
);

IconXiTongPeiZhi.displayName = 'IconXiTongPeiZhi';

export default IconXiTongPeiZhi;
