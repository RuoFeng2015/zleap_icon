// Vanilla JS Liquid Glass Effect - Paste into browser console
// Created by Shu Ding (https://github.com/shuding/liquid-glass) in 2025.

(function () {
  'use strict';

  // Check if liquid glass already exists and destroy it
  if (window.liquidGlass) {
    window.liquidGlass.destroy();
    console.log('Previous liquid glass effect removed.');
  }

  // Utility functions
  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function length(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function roundedRectSDF(x, y, width, height, radius) {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
  }

  function texture(x, y) {
    return { type: 't', x, y };
  }

  // Generate unique ID
  function generateId() {
    return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
  }

  // Main Shader class
  class Shader {
    constructor(options = {}) {
      this.width = options.width || 200; // Increased default size
      this.height = options.height || 200;
      this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
      this.canvasDPI = 1;
      this.id = generateId();
      this.offset = 10; // Viewport boundary offset

      this.mouse = { x: 0, y: 0 };
      this.mouseUsed = false;

      this.createElement();
      this.setupEventListeners();
      this.updateShader();
    }

    createElement() {
      // Create container
      this.container = document.createElement('div');
      this.container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${this.width}px;
        height: ${this.height}px;
        overflow: hidden;
        border-radius: 50%; /* Circle by default */
        box-shadow: 
          0 10px 40px rgba(0, 0, 0, 0.15), 
          0 -10px 25px inset rgba(255, 255, 255, 0.3),
          0 5px 15px inset rgba(0,0,0,0.05);
        cursor: grab;
        backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
        -webkit-backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
        z-index: 9999;
        pointer-events: auto;
        touch-action: none;
        background: rgba(255, 255, 255, 0.05); /* Slight tint */
      `;

      // Create SVG filter
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this.svg.setAttribute('width', '0');
      this.svg.setAttribute('height', '0');
      this.svg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
      `;

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', `${this.id}_filter`);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('colorInterpolationFilters', 'sRGB');
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('width', this.width.toString());
      filter.setAttribute('height', this.height.toString());

      this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
      this.feImage.setAttribute('id', `${this.id}_map`);
      this.feImage.setAttribute('width', this.width.toString());
      this.feImage.setAttribute('height', this.height.toString());
      // Important: prevent feImage from fading out
      this.feImage.setAttribute('preserveAspectRatio', 'none');

      this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
      this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
      this.feDisplacementMap.setAttribute('scale', '30'); // Displacement scale
      this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
      this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

      filter.appendChild(this.feImage);
      filter.appendChild(this.feDisplacementMap);
      defs.appendChild(filter);
      this.svg.appendChild(defs);

      // Create canvas for displacement map (hidden)
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width * this.canvasDPI;
      this.canvas.height = this.height * this.canvasDPI;
      this.canvas.style.display = 'none';

      this.context = this.canvas.getContext('2d');
      document.body.appendChild(this.container);
      document.body.appendChild(this.svg);
      document.body.appendChild(this.canvas);
    }

    constrainPosition(x, y) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate boundaries with offset
      const minX = this.offset;
      const minY = this.offset;
      const maxX = viewportWidth - this.width - this.offset;
      const maxY = viewportHeight - this.height - this.offset;

      return {
        x: Math.min(Math.max(x, minX), maxX),
        y: Math.min(Math.max(y, minY), maxY)
      };
    }

    setupEventListeners() {
      let isDragging = false;
      let startX, startY;
      let initialLeft, initialTop;

      const onMouseDown = (e) => {
        isDragging = true;
        this.container.style.cursor = 'grabbing';

        // Handle both mouse and touch events
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        startX = clientX;
        startY = clientY;

        const rect = this.container.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // Remove transform centering once we start moving manually
        this.container.style.transform = 'none';
        this.container.style.left = `${initialLeft}px`;
        this.container.style.top = `${initialTop}px`;

        e.preventDefault(); // Prevent text selection/scrolling
      };

      const onMouseMove = (e) => {
        if (!isDragging) {
          // Optional: Move with mouse when not dragging? No, keep it draggable.
          return;
        }

        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

        const dx = clientX - startX;
        const dy = clientY - startY;

        let newX = initialLeft + dx;
        let newY = initialTop + dy;

        // Constrain
        // const constrained = this.constrainPosition(newX, newY);
        // this.container.style.left = `${constrained.x}px`;
        // this.container.style.top = `${constrained.y}px`;

        // Simple move without constraint for smoothness
        this.container.style.left = `${newX}px`;
        this.container.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        this.container.style.cursor = 'grab';
      };

      this.container.addEventListener('mousedown', onMouseDown);
      this.container.addEventListener('touchstart', onMouseDown, { passive: false });

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onMouseMove, { passive: false });

      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onMouseUp);
    }

    updateShader() {
      const render = () => {
        const time = performance.now() / 1000;
        const w = this.width * this.canvasDPI;
        const h = this.height * this.canvasDPI;
        const ctx = this.context;

        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            // Normalized coordinates (0 to 1)
            const u = x / w;
            const v = y / h;

            // Calculate displacement
            // Simple liquid ripple effect
            const cx = 0.5;
            const cy = 0.5;
            const dx = u - cx;
            const dy = v - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Ripple
            const ripple = Math.sin(dist * 20 - time * 2) * 0.05;

            let r = 128 + ripple * 255;
            let g = 128 + ripple * 255;

            const index = (y * w + x) * 4;
            data[index] = r;     // R -> X displacement
            data[index + 1] = g; // G -> Y displacement
            data[index + 2] = 0; // B (unused)
            data[index + 3] = 255; // Alpha
          }
        }

        ctx.putImageData(imageData, 0, 0);

        // Update SVG feImage content
        const dataURL = this.canvas.toDataURL();
        this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataURL);

        requestAnimationFrame(render);
      };

      render();
    }

    destroy() {
      this.container.remove();
      this.svg.remove();
      this.canvas.remove();
      delete window.liquidGlass;
    }
  }

  // Initialize
  window.liquidGlass = new Shader({
    width: 250,
    height: 250
  });

  console.log('Liquid Glass effect initialized. Drag the circle to explore!');

})();
