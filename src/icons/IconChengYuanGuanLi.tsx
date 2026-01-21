import React, { forwardRef, useId } from 'react';
import type { SVGProps } from 'react';

export interface IconChengYuanGuanLiProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconChengYuanGuanLi icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconChengYuanGuanLi = forwardRef<SVGSVGElement, IconChengYuanGuanLiProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    const uniqueId = useId();
    
    // Replace gradient IDs with unique ones
    const svgContent = `<rect width="120" height="120" fill="url(#${uniqueId}a)" rx="30"/><path fill="url(#${uniqueId}b)" stroke="url(#${uniqueId}c)" d="M60.4 58c6.35 0 11.5-5.15 11.5-11.5S66.75 35 60.4 35s-11.5 5.15-11.5 11.5S54.05 58 60.4 58Z"/><path fill="url(#${uniqueId}d)" d="M35.79 58c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8" opacity=".8"/><path fill="url(#${uniqueId}e)" d="M85 58c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8" opacity=".8"/><path fill="url(#${uniqueId}f)" stroke="url(#${uniqueId}g)" d="M79.67 74.3s0 .04.01.07c.51 2.69.35 7.95-3.68 7.95H44.65c-3.3 0-3.76-3.46-3.75-5.79s.43-4.16 1.72-6.16c1.1-1.71 2.54-3.22 4.2-4.48 3.54-2.7 8.02-4.19 12.56-4.38.34-.01.68-.02 1.02-.02 8.36 0 17.66 4.56 19.28 12.81z"/><path fill="url(#${uniqueId}h)" d="M39.26 68.2c1.33-2.06 3.15-3.91 5.23-5.5.06-.05.12-.08.18-.13-2.68-1.37-5.9-2.08-8.88-2.08-.28 0-.55 0-.83.02-3.68.16-7.31 1.37-10.17 3.55-1.34 1.02-2.51 2.24-3.4 3.62-1.04 1.62-1.38 3.1-1.39 4.99s.37 4.69 3.04 4.69h13.88c-.01-.28-.02-.56-.02-.85.02-3.28.73-5.77 2.36-8.31" opacity=".8"/><path fill="url(#${uniqueId}i)" d="m100.62 70.92-.01-.06C99.3 64.18 91.76 60.49 85 60.49c-.28 0-.55 0-.83.02-2.72.12-5.64.81-8.01 2.04 3.57 2.64 6.5 6.29 7.43 10.92l.04.19c.1.53.32 1.97.25 3.7h13.77c3.27 0 3.4-4.26 2.98-6.44z" opacity=".8"/><defs><linearGradient id="${uniqueId}a" x1="60" x2="60" y1="5.031" y2="119.458" gradientUnits="userSpaceOnUse"><stop stopColor="#7E73F4"/><stop offset="1" stopColor="#44C5F5"/></linearGradient><linearGradient id="${uniqueId}b" x1="60.4" x2="60.4" y1="35" y2="58" gradientUnits="userSpaceOnUse"><stop offset=".127" stopColor="white"/><stop offset="1" stopColor="#BAC9FF" stopOpacity=".6"/></linearGradient><linearGradient id="${uniqueId}c" x1="60.4" x2="60.4" y1="35" y2="58" gradientUnits="userSpaceOnUse"><stop offset=".197" stopColor="white"/><stop offset="1" stopColor="#859FFF"/></linearGradient><linearGradient id="${uniqueId}d" x1="35.457" x2="35.457" y1="42" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#D0DAFF"/></linearGradient><linearGradient id="${uniqueId}e" x1="84.667" x2="84.667" y1="42" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#D0DAFF"/></linearGradient><linearGradient id="${uniqueId}f" x1="60.393" x2="60.393" y1="61.49" y2="82.32" gradientUnits="userSpaceOnUse"><stop offset=".127" stopColor="white"/><stop offset="1" stopColor="#BAC9FF" stopOpacity=".6"/></linearGradient><linearGradient id="${uniqueId}g" x1="60.393" x2="60.393" y1="61.49" y2="82.32" gradientUnits="userSpaceOnUse"><stop offset=".197" stopColor="white"/><stop offset="1" stopColor="#859FFF"/></linearGradient><linearGradient id="${uniqueId}h" x1="31.821" x2="31.821" y1="60.49" y2="77.36" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#D0DAFF"/></linearGradient><linearGradient id="${uniqueId}i" x1="87.968" x2="87.968" y1="60.49" y2="77.36" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#D0DAFF"/></linearGradient></defs>`;
    
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
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);

IconChengYuanGuanLi.displayName = 'IconChengYuanGuanLi';

export default IconChengYuanGuanLi;
