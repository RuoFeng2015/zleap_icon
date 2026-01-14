/**
 * Property-Based Tests for Generated Component Structure
 *
 * Feature: figma-icon-automation
 * Property 6: Generated Component Structure
 *
 * Validates: Requirements 4.1, 4.2, 4.4, 4.6
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateComponent,
  generateComponentName,
} from '../../src/component-generator'
import type { IconMetadata } from '../../src/types'

/**
 * Generates valid icon metadata for testing
 */
const iconMetadataArbitrary = fc
  .record({
    id: fc.uuid(),
    nameParts: fc.array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
      minLength: 1,
      maxLength: 3,
    }),
    width: fc.constantFrom(16, 20, 24, 32),
    height: fc.constantFrom(16, 20, 24, 32),
  })
  .map(({ id, nameParts, width, height }) => {
    const name = nameParts.join('-')
    return {
      id,
      name,
      originalName: name,
      normalizedName: generateComponentName(name),
      width,
      height,
    } as IconMetadata
  })

/**
 * Generates valid JSX SVG content for testing
 */
const jsxContentArbitrary = fc
  .record({
    viewBox: fc.tuple(
      fc.constant(0),
      fc.constant(0),
      fc.constantFrom(16, 20, 24, 32),
      fc.constantFrom(16, 20, 24, 32)
    ),
    hasPath: fc.boolean(),
    hasCircle: fc.boolean(),
  })
  .map(({ viewBox, hasPath, hasCircle }) => {
    const elements: string[] = []

    if (hasPath) {
      elements.push('<path d="M10 10 L20 20" strokeWidth="2"/>')
    }
    if (hasCircle) {
      elements.push('<circle cx="12" cy="12" r="5"/>')
    }
    if (elements.length === 0) {
      elements.push('<path d="M0 0 L24 24"/>')
    }

    const vb = viewBox.join(' ')
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="currentColor">${elements.join(
      ''
    )}</svg>`
  })

describe('Property 6: Generated Component Structure', () => {
  /**
   * Feature: figma-icon-automation, Property 6: Generated Component Structure
   * Validates: Requirements 4.1, 4.2, 4.4, 4.6
   *
   * For any generated React component:
   * - It SHALL be a valid TypeScript function component
   * - It SHALL accept size, color, and className props
   * - It SHALL forward ref to the SVG element
   * - It SHALL spread additional props to the SVG element
   * - It SHALL have corresponding type definitions exported
   */

  it('generated component should be a valid TypeScript function component', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // Should contain React import
        expect(result.content).toContain(
          "import React, { forwardRef } from 'react'"
        )
        // Should contain SVGProps import
        expect(result.content).toContain(
          "import type { SVGProps } from 'react'"
        )
        // Should export the component
        expect(result.content).toContain(`export const ${result.componentName}`)
        // Should have displayName
        expect(result.content).toContain(`${result.componentName}.displayName`)
        // Should have default export
        expect(result.content).toContain(
          `export default ${result.componentName}`
        )
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should accept size, color, and className props', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // Props interface should extend SVGProps
        expect(result.content).toContain('extends SVGProps<SVGSVGElement>')
        // Should have size prop
        expect(result.content).toContain('size?: number | string')
        // Should have color prop
        expect(result.content).toContain('color?: string')
        // Should destructure className
        expect(result.content).toContain('className')
        // Should use size for width and height
        expect(result.content).toContain('width={size}')
        expect(result.content).toContain('height={size}')
        // Should use color for fill
        expect(result.content).toContain('fill={color}')
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should forward ref to SVG element', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // Should use forwardRef
        expect(result.content).toContain('forwardRef<SVGSVGElement')
        // Should pass ref to svg element
        expect(result.content).toContain('ref={ref}')
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should spread additional props to SVG element', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // Should destructure ...props
        expect(result.content).toContain('...props')
        // Should spread props to svg element
        expect(result.content).toContain('{...props}')
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should have corresponding type definitions', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)
        const propsName = `${result.componentName}Props`

        // Should define props interface
        expect(result.content).toContain(`export interface ${propsName}`)
        // Types export should include component and props
        expect(result.types).toContain(`export { ${result.componentName}`)
        expect(result.types).toContain(`type ${propsName}`)
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should have correct file name', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // File name should match component name with .tsx extension
        expect(result.fileName).toBe(`${result.componentName}.tsx`)
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should preserve viewBox from original SVG', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // Extract viewBox from original JSX
        const viewBoxMatch = jsx.match(/viewBox="([^"]+)"/)
        if (viewBoxMatch) {
          // Generated component should contain the same viewBox
          expect(result.content).toContain(`viewBox="${viewBoxMatch[1]}"`)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('generated component should have default values for size and color', () => {
    fc.assert(
      fc.property(iconMetadataArbitrary, jsxContentArbitrary, (icon, jsx) => {
        const result = generateComponent(icon, jsx)

        // Should have default size of 24
        expect(result.content).toContain('size = 24')
        // Should have default color of currentColor
        expect(result.content).toContain("color = 'currentColor'")
      }),
      { numRuns: 100 }
    )
  })
})
