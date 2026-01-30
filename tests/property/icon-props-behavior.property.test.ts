/**
 * Property-Based Tests for Icon Component Props Behavior
 *
 * Feature: figma-icon-automation
 * Property 8: Icon Component Props Behavior
 *
 * Validates: Requirements 7.2, 7.3, 7.4
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { IconArrowRight } from '../../src/icons/IconArrowRight.tsx'
import { IconCheck } from '../../src/icons/IconCheck.tsx'
import { IconCloseCircle } from '../../src/icons/IconCloseCircle.tsx'

// Available icon components for testing
const iconComponents = [
  { name: 'IconArrowRight', Component: IconArrowRight },
  { name: 'IconCheck', Component: IconCheck },
  { name: 'IconCloseCircle', Component: IconCloseCircle },
]

/**
 * Arbitrary for valid size values (number or string)
 */
const sizeArbitrary = fc.oneof(
  fc.integer({ min: 8, max: 128 }),
  fc.constantFrom('16', '24', '32', '48', '64', '1em', '2rem', '100%')
)

/**
 * Arbitrary for valid color values
 */
const colorArbitrary = fc.oneof(
  fc.constantFrom(
    'currentColor',
    'red',
    'blue',
    'green',
    '#000',
    '#fff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    'rgb(255, 0, 0)',
    'rgba(0, 0, 255, 0.5)'
  ),
  fc.stringMatching(/^[0-9a-f]{6}$/).map((hex) => `#${hex}`)
)

/**
 * Arbitrary for valid className values
 */
const classNameArbitrary = fc.oneof(
  fc.constant(undefined),
  fc
    .stringMatching(/^[a-z][a-z0-9-]*$/)
    .filter((s) => s.length > 0 && s.length <= 30)
)

/**
 * Arbitrary for valid data attributes (HTML-safe values only)
 */
const dataAttributeArbitrary = fc.record({
  key: fc
    .stringMatching(/^[a-z][a-z0-9]*$/)
    .filter((s) => s.length > 0 && s.length <= 20),
  value: fc
    .stringMatching(/^[a-zA-Z0-9_-]+$/)
    .filter((s) => s.length > 0 && s.length <= 30),
})

/**
 * Arbitrary for aria attributes (HTML-safe values only)
 */
const ariaLabelArbitrary = fc.oneof(
  fc.constant(undefined),
  fc
    .stringMatching(/^[a-zA-Z0-9 _-]+$/)
    .filter((s) => s.length > 0 && s.length <= 30)
)

/**
 * Helper to check if HTML contains an attribute with specific value
 */
function hasAttribute(html: string, attr: string, value: string): boolean {
  return html.includes(`${attr}="${value}"`)
}

/**
 * Helper to check if HTML contains a style with specific color
 * Icons may pass color via:
 * 1. fill={color} attribute (for fill-based icons)
 * 2. style={{ color }} (for stroke-based icons using currentColor)
 */
function hasColor(html: string, color: string): boolean {
  // Check for fill attribute with color value
  const hasFillAttr = html.includes(`fill="${color}"`)
  // Check for color in style attribute (React inline style format)
  const hasStyleColor = html.includes(`color:${color}`) || html.includes(`color: ${color}`)
  return hasFillAttr || hasStyleColor
}

describe('Property 8: Icon Component Props Behavior', () => {
  /**
   * Feature: figma-icon-automation, Property 8: Icon Component Props Behavior
   * Validates: Requirements 7.2, 7.3, 7.4
   *
   * For any icon component instance:
   * - Setting size prop SHALL update both width and height of the SVG
   * - Setting color prop SHALL update the fill/stroke color
   * - Passing arbitrary SVG attributes SHALL forward them to the SVG element
   */

  describe('Size prop behavior (Requirement 7.2)', () => {
    it('setting size prop should update both width and height of the SVG', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          sizeArbitrary,
          ({ Component }, size) => {
            const element = React.createElement(Component, { size })
            const html = renderToStaticMarkup(element)

            const expectedSize = String(size)

            // Width should match size
            expect(hasAttribute(html, 'width', expectedSize)).toBe(true)
            // Height should match size
            expect(hasAttribute(html, 'height', expectedSize)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('default size should be 24 when not specified', () => {
      fc.assert(
        fc.property(fc.constantFrom(...iconComponents), ({ Component }) => {
          const element = React.createElement(Component, {})
          const html = renderToStaticMarkup(element)

          // Default width should be 24
          expect(hasAttribute(html, 'width', '24')).toBe(true)
          // Default height should be 24
          expect(hasAttribute(html, 'height', '24')).toBe(true)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Color prop behavior (Requirement 7.3)', () => {
    it('setting color prop should update the style color of the SVG', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          colorArbitrary,
          ({ Component }, color) => {
            const element = React.createElement(Component, { color })
            const html = renderToStaticMarkup(element)

            // Color should be in style attribute (our icons use style={{ color }})
            expect(hasColor(html, color)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('default color should be currentColor when not specified', () => {
      fc.assert(
        fc.property(fc.constantFrom(...iconComponents), ({ Component }) => {
          const element = React.createElement(Component, {})
          const html = renderToStaticMarkup(element)

          // Default color in style should be currentColor
          expect(hasColor(html, 'currentColor')).toBe(true)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Arbitrary SVG attributes forwarding (Requirement 7.4)', () => {
    it('passing className should forward it to the SVG element', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          classNameArbitrary.filter(
            (c) => c !== undefined
          ) as fc.Arbitrary<string>,
          ({ Component }, className) => {
            const element = React.createElement(Component, { className })
            const html = renderToStaticMarkup(element)

            // className should be present in the SVG
            expect(hasAttribute(html, 'class', className)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('passing data attributes should forward them to the SVG element', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          dataAttributeArbitrary,
          ({ Component }, { key, value }) => {
            const dataAttr = `data-${key}`
            const props = { [dataAttr]: value }
            const element = React.createElement(Component, props)
            const html = renderToStaticMarkup(element)

            // data attribute should be present in the SVG
            expect(hasAttribute(html, dataAttr, value)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('passing aria-label should forward it to the SVG element', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          ariaLabelArbitrary.filter(
            (a) => a !== undefined
          ) as fc.Arbitrary<string>,
          ({ Component }, ariaLabel) => {
            const element = React.createElement(Component, {
              'aria-label': ariaLabel,
            })
            const html = renderToStaticMarkup(element)

            // aria-label should be present in the SVG
            expect(hasAttribute(html, 'aria-label', ariaLabel)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('passing role attribute should forward it to the SVG element', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          fc.constantFrom('img', 'presentation', 'graphics-symbol'),
          ({ Component }, role) => {
            const element = React.createElement(Component, { role })
            const html = renderToStaticMarkup(element)

            // role should be present in the SVG
            expect(hasAttribute(html, 'role', role)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('passing style object should forward it to the SVG element', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          fc.record({
            opacity: fc.double({ min: 0, max: 1, noNaN: true }),
          }),
          ({ Component }, style) => {
            const element = React.createElement(Component, { style })
            const html = renderToStaticMarkup(element)

            // style should be present in the SVG (React converts to inline style string)
            expect(html).toContain('style=')
            expect(html).toContain('opacity')
          }
        ),
        { numRuns: 100 }
      )
    })

    it('passing id attribute should forward it to the SVG element', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          fc
            .stringMatching(/^[a-z][a-z0-9-]*$/)
            .filter((s) => s.length > 0 && s.length <= 30),
          ({ Component }, id) => {
            const element = React.createElement(Component, { id })
            const html = renderToStaticMarkup(element)

            // id should be present in the SVG
            expect(hasAttribute(html, 'id', id)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Combined props behavior', () => {
    it('all props should work together correctly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...iconComponents),
          sizeArbitrary,
          colorArbitrary,
          classNameArbitrary.filter(
            (c) => c !== undefined
          ) as fc.Arbitrary<string>,
          ({ Component }, size, color, className) => {
            const element = React.createElement(Component, {
              size,
              color,
              className,
            })
            const html = renderToStaticMarkup(element)

            const expectedSize = String(size)

            // All props should be applied
            expect(hasAttribute(html, 'width', expectedSize)).toBe(true)
            expect(hasAttribute(html, 'height', expectedSize)).toBe(true)
            expect(hasColor(html, color)).toBe(true)
            expect(hasAttribute(html, 'class', className)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
