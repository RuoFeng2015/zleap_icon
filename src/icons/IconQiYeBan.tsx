import React, { forwardRef, useId } from 'react';
import type { SVGProps } from 'react';

export interface IconQiYeBanProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconQiYeBan icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconQiYeBan = forwardRef<SVGSVGElement, IconQiYeBanProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    const uniqueId = useId();
    
     // Replace gradient IDs with unique ones
    const svgContent = `<defs><linearGradient id="${uniqueId}a" x1="60" x2="60" y1="-.13" y2="119.87" gradientUnits="userSpaceOnUse"><stop stop-color="#C873F5"/><stop offset="1" stop-color="#7B33BB"/></linearGradient><linearGradient id="${uniqueId}b" x1="61.5" x2="61.5" y1="29" y2="85" gradientUnits="userSpaceOnUse"><stop stop-color="#F0D8FF"/><stop offset="1" stop-color="#CD8FFF"/></linearGradient><linearGradient id="${uniqueId}c" x1="61.5" x2="61.5" y1="29" y2="85" gradientUnits="userSpaceOnUse"><stop stop-color="#F0D8FF"/><stop offset="1" stop-color="#CD8FFF"/></linearGradient><linearGradient id="${uniqueId}d" x1="61.5" x2="61.5" y1="29" y2="85" gradientUnits="userSpaceOnUse"><stop stop-color="#F9F2FF"/><stop offset="1" stop-color="#C275FF"/></linearGradient></defs><rect width="120" height="120" fill="url(#${uniqueId}a)" rx="30"/><path fill="url(#${uniqueId}b)" d="M82.05 51.09H40.805a2.71 2.71 0 0 0-2.704 2.705v18.251a2.705 2.705 0 0 0 2.704 2.706H82.05a2.703 2.703 0 0 0 2.698-2.706v-18.25a2.703 2.703 0 0 0-2.698-2.707m-9.848 19.215c-4.293 0-7.768-3.49-7.774-7.79 0-4.3 3.481-7.789 7.774-7.789s7.768 3.49 7.768 7.79-3.482 7.79-7.768 7.79"/><path fill="url(#${uniqueId}c)" d="M91.378 40.018H77.504C76.401 33.796 69.69 29 61.603 29s-14.798 4.802-15.901 11.018H31.628A5.633 5.633 0 0 0 26 45.658V79.36A5.633 5.633 0 0 0 31.628 85h59.744A5.633 5.633 0 0 0 97 79.36V45.658a5.633 5.633 0 0 0-5.628-5.64zm-29.775-5.66c4.93 0 8.7 2.452 9.897 5.66l-20 .08c1.196-3.209 5.172-5.74 10.103-5.74m29.975 43.375a3.307 3.307 0 0 1-3.303 3.309h-53.53a3.303 3.303 0 0 1-3.303-3.31v-29.08a3.307 3.307 0 0 1 3.303-3.31h53.53a3.303 3.303 0 0 1 3.303 3.31z"/><path stroke="url(#${uniqueId}d)" d="M77.504 40.018h13.874-.006m-13.868 0C76.401 33.796 69.69 29 61.603 29s-14.798 4.802-15.901 11.018H31.628A5.633 5.633 0 0 0 26 45.658V79.36A5.633 5.633 0 0 0 31.628 85h59.744A5.633 5.633 0 0 0 97 79.36V45.658a5.633 5.633 0 0 0-5.628-5.64m-13.868 0h13.868M82.05 51.09H40.805a2.71 2.71 0 0 0-2.704 2.706v18.251a2.705 2.705 0 0 0 2.704 2.706H82.05a2.703 2.703 0 0 0 2.698-2.706v-18.25a2.703 2.703 0 0 0-2.698-2.707Zm-9.848 19.216c-4.293 0-7.768-3.49-7.774-7.79 0-4.3 3.481-7.789 7.774-7.789s7.768 3.49 7.768 7.79-3.482 7.79-7.768 7.79ZM61.603 34.358c4.93 0 8.7 2.452 9.897 5.66l-20 .08c1.196-3.209 5.172-5.74 10.103-5.74Zm29.975 43.375a3.307 3.307 0 0 1-3.303 3.309h-53.53a3.303 3.303 0 0 1-3.303-3.31v-29.08a3.307 3.307 0 0 1 3.303-3.31h53.53a3.303 3.303 0 0 1 3.303 3.31z"/>`;
    
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        className={className}
        style={style}
        {...props}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);

IconQiYeBan.displayName = 'IconQiYeBan';

export default IconQiYeBan;
