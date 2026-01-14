/**
 * Property-Based Tests for Icon Component Filtering
 *
 * Feature: figma-icon-automation
 * Property 1: Icon Component Filtering
 *
 * Validates: Requirements 2.2
 *
 * For any list of Figma components containing mixed types (frames, groups, components),
 * the Icon_Sync_Service filter function SHALL return only components that are of type
 * "COMPONENT" and match the icon naming convention.
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  filterIconComponents,
  filterIconComponent,
  matchesIconNamingConvention,
  isComponentType,
  hasValidIconDimensions,
  DEFAULT_FILTER_CONFIG,
  type IconFilterConfig,
} from '../../src/icon-filter'
import type { FigmaComponent, FigmaFileResponse } from '../../src/types'

/**
 * Generates a valid icon name (lowercase with hyphens)
 */
const validIconNameArbitrary = fc.stringMatching(/^[a-z][a-z0-9-]{1,20}$/)

/**
 * Generates an invalid icon name (starts with number, uppercase, or special chars)
 */
const invalidIconNameArbitrary = fc.oneof(
  fc.stringMatching(/^[0-9][a-z0-9-]{1,10}$/), // starts with number
  fc.stringMatching(/^[A-Z][a-zA-Z0-9]{1,10}$/), // starts with uppercase
  fc.stringMatching(/^[a-z][a-z0-9]*_[a-z0-9]+$/), // contains underscore
  fc.stringMatching(/^[a-z][a-z0-9]*\.[a-z0-9]+$/) // contains dot
)

/**
 * Generates valid icon dimensions (within default range 8-128)
 */
const validDimensionArbitrary = fc.integer({ min: 8, max: 128 })

/**
 * Generates invalid icon dimensions (outside default range)
 */
const invalidDimensionArbitrary = fc.oneof(
  fc.integer({ min: -100, max: 7 }),
  fc.integer({ min: 129, max: 500 })
)

/**
 * Generates a valid Figma COMPONENT with icon naming
 */
const validIconComponentArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
  })
  .map(({ id, name, width, height }) => ({
    id,
    name,
    type: 'COMPONENT' as const,
    absoluteBoundingBox: { width, height },
  }))

/**
 * Generates a non-COMPONENT Figma node (FRAME, GROUP, etc.)
 */
const nonComponentTypeArbitrary = fc.constantFrom(
  'FRAME',
  'GROUP',
  'RECTANGLE',
  'TEXT',
  'VECTOR',
  'INSTANCE',
  'ELLIPSE',
  'LINE'
)

const nonComponentNodeArbitrary = fc
  .record({
    id: fc.uuid(),
    name: validIconNameArbitrary,
    type: nonComponentTypeArbitrary,
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
  })
  .map(({ id, name, type, width, height }) => ({
    id,
    name,
    type,
    absoluteBoundingBox: { width, height },
  }))

/**
 * Generates a COMPONENT with invalid icon name
 */
const componentWithInvalidNameArbitrary = fc
  .record({
    id: fc.uuid(),
    name: invalidIconNameArbitrary,
    width: validDimensionArbitrary,
    height: validDimensionArbitrary,
  })
  .map(({ id, name, width, height }) => ({
    id,
    name,
    type: 'COMPONENT' as const,
    absoluteBoundingBox: { width, height },
  }))

/**
 * Generates a mixed list of Figma components (valid icons, invalid names, non-components)
 */
const mixedComponentsArbitrary = fc
  .record({
    validIcons: fc.array(validIconComponentArbitrary, {
      minLength: 0,
      maxLength: 5,
    }),
    invalidNames: fc.array(componentWithInvalidNameArbitrary, {
      minLength: 0,
      maxLength: 3,
    }),
    nonComponents: fc.array(nonComponentNodeArbitrary, {
      minLength: 0,
      maxLength: 3,
    }),
  })
  .filter(
    ({ validIcons, invalidNames, nonComponents }) =>
      validIcons.length + invalidNames.length + nonComponents.length > 0
  )

/**
 * Creates a FigmaFileResponse from a list of components
 */
function createFileResponse(
  components: Array<{
    id: string
    name: string
    type: string
    absoluteBoundingBox: { width: number; height: number }
  }>
): FigmaFileResponse {
  const componentsMap: Record<string, FigmaComponent> = {}

  for (const comp of components) {
    if (comp.type === 'COMPONENT') {
      componentsMap[comp.id] = comp as FigmaComponent
    }
  }

  return {
    document: { children: [] },
    components: componentsMap,
  }
}

describe('Property 1: Icon Component Filtering', () => {
  /**
   * Feature: figma-icon-automation, Property 1: Icon Component Filtering
   * Validates: Requirements 2.2
   */

  describe('Type Filtering', () => {
    it('should only return components of type COMPONENT', () => {
      fc.assert(
        fc.property(
          mixedComponentsArbitrary,
          ({ validIcons, invalidNames, nonComponents }) => {
            const allComponents = [
              ...validIcons,
              ...invalidNames,
              ...nonComponents,
            ]
            const fileResponse = createFileResponse(allComponents)

            const result = filterIconComponents(fileResponse)

            // All returned icons should be of type COMPONENT
            for (const icon of result.icons) {
              expect(icon.original.type).toBe('COMPONENT')
            }

            // Non-COMPONENT types should not be in the result
            // (they won't even be in the components map)
            const nonComponentIds = new Set(nonComponents.map((c) => c.id))
            for (const icon of result.icons) {
              expect(nonComponentIds.has(icon.id)).toBe(false)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly identify COMPONENT type', () => {
      fc.assert(
        fc.property(validIconComponentArbitrary, (component) => {
          expect(isComponentType(component)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should reject non-COMPONENT types', () => {
      fc.assert(
        fc.property(nonComponentNodeArbitrary, (node) => {
          expect(isComponentType(node)).toBe(false)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Naming Convention Filtering', () => {
    it('should only return components matching icon naming convention', () => {
      fc.assert(
        fc.property(
          mixedComponentsArbitrary,
          ({ validIcons, invalidNames }) => {
            // Only include COMPONENT types in the file response
            const allComponents = [...validIcons, ...invalidNames]
            const fileResponse = createFileResponse(allComponents)

            const result = filterIconComponents(fileResponse)

            // All returned icons should match the naming convention
            for (const icon of result.icons) {
              expect(matchesIconNamingConvention(icon.name)).toBe(true)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should accept valid icon names', () => {
      fc.assert(
        fc.property(validIconNameArbitrary, (name) => {
          expect(matchesIconNamingConvention(name)).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should reject invalid icon names', () => {
      fc.assert(
        fc.property(invalidIconNameArbitrary, (name) => {
          expect(matchesIconNamingConvention(name)).toBe(false)
        }),
        { numRuns: 100 }
      )
    })

    it('should skip components with invalid names', () => {
      fc.assert(
        fc.property(componentWithInvalidNameArbitrary, (component) => {
          const fileResponse = createFileResponse([component])
          const result = filterIconComponents(fileResponse)

          expect(result.icons).toHaveLength(0)
          expect(result.skipped).toHaveLength(1)
          expect(result.skipped[0].reason).toContain('naming convention')
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Combined Filtering (Type AND Naming)', () => {
    it('should return exactly the valid icon components', () => {
      fc.assert(
        fc.property(
          mixedComponentsArbitrary,
          ({ validIcons, invalidNames, nonComponents }) => {
            const allComponents = [
              ...validIcons,
              ...invalidNames,
              ...nonComponents,
            ]
            const fileResponse = createFileResponse(allComponents)

            const result = filterIconComponents(fileResponse)

            // The number of returned icons should equal the number of valid icons
            expect(result.icons.length).toBe(validIcons.length)

            // Each valid icon should be in the result
            const resultIds = new Set(result.icons.map((i) => i.id))
            for (const validIcon of validIcons) {
              expect(resultIds.has(validIcon.id)).toBe(true)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should track all processed components', () => {
      fc.assert(
        fc.property(
          mixedComponentsArbitrary,
          ({ validIcons, invalidNames }) => {
            // Only COMPONENT types are in the components map
            const allComponents = [...validIcons, ...invalidNames]
            const fileResponse = createFileResponse(allComponents)

            const result = filterIconComponents(fileResponse)

            // Total processed should equal icons + skipped
            expect(result.totalProcessed).toBe(
              result.icons.length + result.skipped.length
            )
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should provide reasons for skipped components', () => {
      fc.assert(
        fc.property(
          mixedComponentsArbitrary,
          ({ validIcons, invalidNames }) => {
            const allComponents = [...validIcons, ...invalidNames]
            const fileResponse = createFileResponse(allComponents)

            const result = filterIconComponents(fileResponse)

            // Each skipped component should have a reason
            for (const skipped of result.skipped) {
              expect(skipped.reason).toBeTruthy()
              expect(typeof skipped.reason).toBe('string')
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Dimension Filtering', () => {
    it('should accept components with valid dimensions', () => {
      fc.assert(
        fc.property(
          validDimensionArbitrary,
          validDimensionArbitrary,
          (width, height) => {
            expect(hasValidIconDimensions(width, height)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should reject components with invalid dimensions', () => {
      fc.assert(
        fc.property(
          invalidDimensionArbitrary,
          invalidDimensionArbitrary,
          (width, height) => {
            // At least one dimension is invalid
            const result = hasValidIconDimensions(width, height)
            // If both are in invalid range, should be false
            if ((width < 8 || width > 128) && (height < 8 || height > 128)) {
              expect(result).toBe(false)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty component list', () => {
      const fileResponse: FigmaFileResponse = {
        document: { children: [] },
        components: {},
      }

      const result = filterIconComponents(fileResponse)

      expect(result.icons).toHaveLength(0)
      expect(result.skipped).toHaveLength(0)
      expect(result.totalProcessed).toBe(0)
    })

    it('should handle file response with only valid icons', () => {
      fc.assert(
        fc.property(
          fc.array(validIconComponentArbitrary, {
            minLength: 1,
            maxLength: 10,
          }),
          (validIcons) => {
            const fileResponse = createFileResponse(validIcons)
            const result = filterIconComponents(fileResponse)

            expect(result.icons.length).toBe(validIcons.length)
            expect(result.skipped).toHaveLength(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should handle file response with only invalid components', () => {
      fc.assert(
        fc.property(
          fc.array(componentWithInvalidNameArbitrary, {
            minLength: 1,
            maxLength: 10,
          }),
          (invalidComponents) => {
            const fileResponse = createFileResponse(invalidComponents)
            const result = filterIconComponents(fileResponse)

            expect(result.icons).toHaveLength(0)
            expect(result.skipped.length).toBe(invalidComponents.length)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
