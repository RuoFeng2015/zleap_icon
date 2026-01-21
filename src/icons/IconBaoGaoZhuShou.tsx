import React, { forwardRef, useId } from 'react';
import type { SVGProps } from 'react';

export interface IconBaoGaoZhuShouProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconBaoGaoZhuShou icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconBaoGaoZhuShou = forwardRef<SVGSVGElement, IconBaoGaoZhuShouProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    const uniqueId = useId();
    
     // Replace gradient IDs with unique ones
    const svgContent = `<defs><linearGradient id="${uniqueId}a" x1="60" x2="60" y1="0" y2="120" gradientUnits="userSpaceOnUse"><stop stop-color="#1D6FF2"/><stop offset="1" stop-color="#1AC8FC"/></linearGradient><linearGradient id="${uniqueId}b" x1="58.5" x2="58.5" y1="29" y2="91" gradientUnits="userSpaceOnUse"><stop stop-color="#EBF9FF"/><stop offset="1" stop-color="#91E0FF"/></linearGradient><linearGradient id="${uniqueId}c" x1="67.289" x2="67.289" y1="38" y2="91" gradientUnits="userSpaceOnUse"><stop stop-color="#D2F2FF"/><stop offset="1" stop-color="#95D1FF"/></linearGradient><linearGradient id="${uniqueId}d" x1="67.289" x2="67.289" y1="38" y2="91" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="1" stop-color="#7FD6FF"/></linearGradient></defs><rect width="120" height="120" fill="url(#${uniqueId}a)" rx="30"/><path fill="url(#${uniqueId}b)" fill-opacity=".6" d="M38.18 29h40.64c3.41 0 6.18 2.764 6.18 6.167v49.666C85 88.236 82.23 91 78.82 91H38.18C34.77 91 32 88.236 32 84.833V35.167C32 31.764 34.77 29 38.18 29" opacity=".7"/><path fill="url(#${uniqueId}c)" stroke="url(#${uniqueId}d)" d="M83.636 38H48.364C45.404 38 43 40.363 43 43.272v42.456C43 88.638 45.404 91 48.364 91h35.272C86.596 91 89 88.637 89 85.728V43.272C89 40.362 86.596 38 83.636 38Z"/><rect width="23" height="4" x="53" y="47" fill="#61BDFA" rx="2"/><rect width="20" height="4" x="53" y="55" fill="#61BDFA" rx="2"/><rect width="15" height="4" x="53" y="63" fill="#61BDFA" rx="2"/>`;
    
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

IconBaoGaoZhuShou.displayName = 'IconBaoGaoZhuShou';

export default IconBaoGaoZhuShou;
