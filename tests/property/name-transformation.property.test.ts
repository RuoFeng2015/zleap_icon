/**
 * Property-Based Tests for Component Name Transformation
 *
 * Feature: figma-icon-automation
 * Property 5: Component Name Transformation
 *
 * Validates: Requirements 4.3
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  toPascalCase,
  generateComponentName,
} from '../../src/component-generator'

/**
 * Generates valid icon name strings in various formats
 */
const iconNameArbitrary = fc.oneof(
  // kebab-case names
  fc
    .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
      minLength: 1,
      maxLength: 4,
    })
    .map((parts) => parts.join('-')),
  // snake_case names
  fc
    .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
      minLength: 1,
      maxLength: 4,
    })
    .map((parts) => parts.join('_')),
  // space separated names
  fc
    .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
      minLength: 1,
      maxLength: 4,
    })
    .map((parts) => parts.join(' ')),
  // camelCase names
  fc
    .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
      minLength: 1,
      maxLength: 4,
    })
    .map((parts) =>
      parts
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join('')
    ),
  // PascalCase names
  fc
    .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
      minLength: 1,
      maxLength: 4,
    })
    .map((parts) =>
      parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
    )
)

/**
 * Generates mixed format icon names
 */
const mixedFormatNameArbitrary = fc
  .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), { minLength: 1, maxLength: 4 })
  .chain((parts) =>
    fc.constantFrom('-', '_', ' ').map((sep) => parts.join(sep))
  )

describe('Property 5: Component Name Transformation', () => {
  /**
   * Feature: figma-icon-automation, Property 5: Component Name Transformation
   * Validates: Requirements 4.3
   *
   * For any icon name string, the Component_Generator SHALL produce a component name that:
   * - Starts with "Icon" prefix
   * - Is in PascalCase format
   * - Contains only alphanumeric characters
   * - Preserves the semantic meaning of the original name
   */

  it('toPascalCase should always produce a string starting with uppercase', () => {
    fc.assert(
      fc.property(iconNameArbitrary, (name) => {
        const result = toPascalCase(name)
        if (result.length > 0) {
          expect(result[0]).toMatch(/[A-Z]/)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('toPascalCase should only contain alphanumeric characters', () => {
    fc.assert(
      fc.property(iconNameArbitrary, (name) => {
        const result = toPascalCase(name)
        expect(result).toMatch(/^[A-Za-z0-9]*$/)
      }),
      { numRuns: 100 }
    )
  })

  it('toPascalCase should preserve alphanumeric content', () => {
    fc.assert(
      fc.property(iconNameArbitrary, (name) => {
        const result = toPascalCase(name)
        // Extract only alphanumeric characters from original
        const originalAlphaNum = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        // Result should contain the same alphanumeric content (case-insensitive)
        expect(result.toLowerCase()).toBe(originalAlphaNum)
      }),
      { numRuns: 100 }
    )
  })

  it('generateComponentName should always start with Icon prefix', () => {
    fc.assert(
      fc.property(iconNameArbitrary, (name) => {
        const result = generateComponentName(name)
        expect(result.startsWith('Icon')).toBe(true)
      }),
      { numRuns: 100 }
    )
  })

  it('generateComponentName should produce valid PascalCase after prefix', () => {
    fc.assert(
      fc.property(iconNameArbitrary, (name) => {
        const result = generateComponentName(name)
        // Remove "Icon" prefix and check the rest
        const afterPrefix = result.slice(4)
        if (afterPrefix.length > 0) {
          // First character after prefix should be uppercase
          expect(afterPrefix[0]).toMatch(/[A-Z]/)
          // Should only contain alphanumeric
          expect(afterPrefix).toMatch(/^[A-Za-z0-9]*$/)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('generateComponentName should handle mixed format names', () => {
    fc.assert(
      fc.property(mixedFormatNameArbitrary, (name) => {
        const result = generateComponentName(name)
        // Should start with Icon
        expect(result.startsWith('Icon')).toBe(true)
        // Should only contain alphanumeric
        expect(result).toMatch(/^[A-Za-z0-9]+$/)
        // Should preserve semantic content
        const originalAlphaNum = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        expect(result.toLowerCase()).toBe('icon' + originalAlphaNum)
      }),
      { numRuns: 100 }
    )
  })

  it('toPascalCase should be idempotent for already PascalCase input', () => {
    fc.assert(
      fc.property(
        fc
          .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), {
            minLength: 1,
            maxLength: 4,
          })
          .map((parts) =>
            parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
          ),
        (pascalName) => {
          const result = toPascalCase(pascalName)
          // Should produce the same result (case-insensitive comparison due to normalization)
          expect(result.toLowerCase()).toBe(pascalName.toLowerCase())
        }
      ),
      { numRuns: 100 }
    )
  })

  it('generateComponentName should handle custom prefix', () => {
    fc.assert(
      fc.property(
        iconNameArbitrary,
        fc.stringMatching(/^[A-Z][a-z]*$/),
        (name, prefix) => {
          const result = generateComponentName(name, prefix)
          expect(result.startsWith(prefix)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
