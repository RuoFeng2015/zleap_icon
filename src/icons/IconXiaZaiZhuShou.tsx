import React, { forwardRef, useId } from 'react';
import type { SVGProps } from 'react';

export interface IconXiaZaiZhuShouProps extends SVGProps<SVGSVGElement> {
  /** Icon size (width and height) */
  size?: number | string;
  /** Icon color (not applicable for multicolor icons) */
  color?: string;
}

/**
 * IconXiaZaiZhuShou icon component (multicolor)
 *
 * @param props - Component props including size, color, and SVG attributes
 * @param ref - Forwarded ref to the SVG element
 */
export const IconXiaZaiZhuShou = forwardRef<SVGSVGElement, IconXiaZaiZhuShouProps>(
  ({ size = 24, color = 'currentColor', className, style, ...props }, ref) => {
    const uniqueId = useId();
    
     // Replace gradient IDs with unique ones
    const svgContent = `<rect width="120" height="120" fill="url(#${uniqueId}a)" rx="30"/><path fill="#2F323D" d="M66.71 53.206a1.59 1.59 0 0 0-2.36-.244l-3.248 2.948v-9.3c0-.89-.717-1.61-1.6-1.61-.882 0-1.598.72-1.598 1.61v9.332l-3.242-2.974a1.6 1.6 0 0 0-2.367.232c-.498.676-.338 1.641.276 2.208l5.5 5.046a2.07 2.07 0 0 0 2.794.006l5.557-5.046c.62-.566.78-1.525.288-2.201z" opacity=".7"/><path fill="#2F323D" d="M68.343 68H51.657C50.742 68 50 67.328 50 66.5s.742-1.5 1.657-1.5h16.686c.915 0 1.657.672 1.657 1.5s-.742 1.5-1.657 1.5" opacity=".7"/><path fill="url(#${uniqueId}b)" d="M76 26a6 6 0 0 1 6 6v57.456a6 6 0 0 1-6 6H43a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6zm-31.13 5.87a2 2 0 0 0-2 2v46.87a2 2 0 0 0 2 2h29.26a2 2 0 0 0 2-2V33.87a2 2 0 0 0-2-2z"/><path fill="#CECECE" d="M76 95.456v.5zM43 26v-.5zm1.87 5.87v-.5h-.001zm-2 2-.5-.001zm0 46.87h-.5zm2 2-.001.5zm29.26 0v.5h.001zm2-2h.5zm0-46.87h.5v-.001zm-2-2 .001-.5zM76 26v.5a5.5 5.5 0 0 1 5.5 5.5h1a6.5 6.5 0 0 0-6.5-6.5zm6 6h-.5v57.456h1V32zm0 57.456h-.5a5.5 5.5 0 0 1-5.5 5.5v1a6.5 6.5 0 0 0 6.5-6.5zm-6 6v-.5H43v1h33zm-33 0v-.5a5.5 5.5 0 0 1-5.5-5.5h-1a6.5 6.5 0 0 0 6.5 6.5zm-6-6h.5V32h-1v57.456zM37 32h.5a5.5 5.5 0 0 1 5.5-5.5v-1a6.5 6.5 0 0 0-6.5 6.5zm6-6v.5h33v-1H43zm1.87 5.87-.001-.5a2.5 2.5 0 0 0-2.5 2.499h1a1.5 1.5 0 0 1 1.5-1.5zm-2 2h-.5v46.87h1V33.87zm0 46.87h-.5a2.5 2.5 0 0 0 2.499 2.5v-1a1.5 1.5 0 0 1-1.5-1.5zm2 2v.5h29.26v-1H44.87zm29.26 0 .001.5a2.5 2.5 0 0 0 2.5-2.5h-1a1.5 1.5 0 0 1-1.5 1.5zm2-2h.5V33.87h-1v46.87zm0-46.87.5-.001a2.5 2.5 0 0 0-2.499-2.5v1a1.5 1.5 0 0 1 1.5 1.5zm-2-2v-.5H44.87v1h29.26z"/><defs><linearGradient id="${uniqueId}a" x1="59.25" x2="60.76" y1="119.1" y2="-.16" gradientUnits="userSpaceOnUse"><stop stop-color="#D4D4D2"/><stop offset="1" stop-color="#E6E6E5"/></linearGradient><linearGradient id="${uniqueId}b" x1="59.5" x2="59.5" y1="26" y2="95.456" gradientUnits="userSpaceOnUse"><stop stop-color="#979797"/><stop offset="1" stop-color="#1C1C1C"/></linearGradient></defs>`;
    
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

IconXiaZaiZhuShou.displayName = 'IconXiaZaiZhuShou';

export default IconXiaZaiZhuShou;
