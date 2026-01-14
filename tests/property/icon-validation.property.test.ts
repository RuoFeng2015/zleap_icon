/**
 * Property-Based Tests for Icon Validation Rules
 *
 * Feature: figma-icon-automation
 * Property 12: Icon Validation Rules
 *
 * Validates: Requirements 12.1, 12.2, 12.4
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  validateIconSize,
  validateIconName,
  detectForbiddenElements,
  validateIcon,
  defaultValidationRules,
} from '../../src/icon-validator'
import type { IconMetadata } from '../../src/types'

/**
 * Generates a valid icon metadata object with allowed sizes
 */
const validIconMetadataArbitrary = fc
  .record({
    id: fc.uuid(),
    name: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
    originalName: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
    normalizedName: fc.stringMatching(/^[A-Z][a-zA-Z0-9]{2,20}$/),
    size: fc.constantFrom(16, 20, 24, 32),
  })
  .map(({ id, name, originalName, normalizedName, size }) => ({
    id,
    name,
    originalName,
    normalizedName,
    width: size,
    height: size,
    svgContent: `<svg viewBox="0 0 ${size} ${size}"><path d="M0 0"/></svg>`,
  }))

/**
 * Generates an icon metadata object with invalid sizes
 */
const invalidSizeIconArbitrary = fc
  .record({
    id: fc.uuid(),
    name: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
    originalName: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
    normalizedName: fc.stringMatching(/^[A-Z][a-zA-Z0-9]{2,20}$/),
    width: fc
      .integer({ min: 1, max: 100 })
      .filter((n) => ![16, 20, 24, 32].includes(n)),
    height: fc
      .integer({ min: 1, max: 100 })
      .filter((n) => ![16, 20, 24, 32].includes(n)),
  })
  .map(({ id, name, originalName, normalizedName, width, height }) => ({
    id,
    name,
    originalName,
    normalizedName,
    width,
    height,
    svgContent: `<svg viewBox="0 0 ${width} ${height}"><path d="M0 0"/></svg>`,
  }))

/**
 * Generates an icon with invalid naming (starts with number or has invalid chars)
 */
const invalidNameIconArbitrary = fc
  .record({
    id: fc.uuid(),
    invalidName: fc.oneof(
      fc.stringMatching(/^[0-9][a-z0-9-]{2,10}$/), // starts with number
      fc.stringMatching(/^[a-z][a-z0-9]*__[a-z0-9]+$/), // double underscore
      fc.stringMatching(/^[a-z][a-z0-9]*--[a-z0-9]+$/), // double hyphen
      fc.stringMatching(/^[A-Z][a-zA-Z0-9]{2,10}$/) // starts with uppercase
    ),
    normalizedName: fc.stringMatching(/^[A-Z][a-zA-Z0-9]{2,20}$/),
    size: fc.constantFrom(16, 20, 24, 32),
  })
  .map(({ id, invalidName, normalizedName, size }) => ({
    id,
    name: invalidName,
    originalName: invalidName,
    normalizedName,
    width: size,
    height: size,
    svgContent: `<svg viewBox="0 0 ${size} ${size}"><path d="M0 0"/></svg>`,
  }))

/**
 * Generates an icon with forbidden SVG elements
 */
const forbiddenElementsArbitrary = fc.constantFrom(
  'image',
  'foreignObject',
  'script',
  'style',
  'iframe'
)

const iconWithForbiddenElementArbitrary = fc
  .record({
    id: fc.uuid(),
    name: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
    originalName: fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/),
    normalizedName: fc.stringMatching(/^[A-Z][a-zA-Z0-9]{2,20}$/),
    size: fc.constantFrom(16, 20, 24, 32),
    forbiddenElement: forbiddenElementsArbitrary,
  })
  .map(
    ({ id, name, originalName, normalizedName, size, forbiddenElement }) => ({
      id,
      name,
      originalName,
      normalizedName,
      width: size,
      height: size,
      svgContent: `<svg viewBox="0 0 ${size} ${size}"><${forbiddenElement}/><path d="M0 0"/></svg>`,
      forbiddenElement,
    })
  )

describe('Property 12: Icon Validation Rules', () => {
  /**
   * Feature: figma-icon-automation, Property 12: Icon Validation Rules
   * Validates: Requirements 12.1, 12.2, 12.4
   */

  describe('Size Validation (Requirement 12.1)', () => {
    it('should accept icons with allowed sizes (16, 20, 24, 32)', () => {
      fc.assert(
        fc.property(validIconMetadataArbitrary, (icon) => {
          const errors = validateIconSize(icon)
          const sizeErrors = errors.filter((e) => e.severity === 'error')
          expect(sizeErrors).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should reject icons with sizes outside allowed values', () => {
      fc.assert(
        fc.property(invalidSizeIconArbitrary, (icon) => {
          const errors = validateIconSize(icon)
          const sizeErrors = errors.filter((e) => e.severity === 'error')
          expect(sizeErrors.length).toBeGreaterThan(0)
          expect(sizeErrors[0].rule).toBe('size')
        }),
        { numRuns: 100 }
      )
    })

    it('should include allowed sizes in error message', () => {
      fc.assert(
        fc.property(invalidSizeIconArbitrary, (icon) => {
          const errors = validateIconSize(icon)
          const sizeErrors = errors.filter((e) => e.severity === 'error')
          if (sizeErrors.length > 0) {
            expect(sizeErrors[0].message).toContain('16')
            expect(sizeErrors[0].message).toContain('24')
            expect(sizeErrors[0].message).toContain('32')
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Name Validation (Requirement 12.2)', () => {
    it('should accept icons with valid naming pattern', () => {
      fc.assert(
        fc.property(validIconMetadataArbitrary, (icon) => {
          const warnings = validateIconName(icon)
          // Valid names should not have naming pattern warnings
          const patternWarnings = warnings.filter((w) =>
            w.message.includes("doesn't match naming convention")
          )
          expect(patternWarnings).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should warn about icons with invalid naming patterns', () => {
      fc.assert(
        fc.property(invalidNameIconArbitrary, (icon) => {
          const warnings = validateIconName(icon)
          // Should have at least one warning about naming
          expect(warnings.length).toBeGreaterThan(0)
          expect(warnings.some((w) => w.rule === 'naming')).toBe(true)
        }),
        { numRuns: 100 }
      )
    })

    it('should include icon name in warning message', () => {
      fc.assert(
        fc.property(invalidNameIconArbitrary, (icon) => {
          const warnings = validateIconName(icon)
          if (warnings.length > 0) {
            expect(warnings[0].message).toContain(icon.originalName)
          }
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Forbidden Elements Detection (Requirement 12.4)', () => {
    it('should detect forbidden SVG elements', () => {
      fc.assert(
        fc.property(
          iconWithForbiddenElementArbitrary,
          ({ forbiddenElement, ...icon }) => {
            const errors = detectForbiddenElements(icon)
            expect(errors.length).toBeGreaterThan(0)
            expect(errors[0].rule).toBe('forbidden-elements')
            expect(errors[0].message).toContain(forbiddenElement)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not flag icons without forbidden elements', () => {
      fc.assert(
        fc.property(validIconMetadataArbitrary, (icon) => {
          const errors = detectForbiddenElements(icon)
          expect(errors).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should handle icons without SVG content', () => {
      fc.assert(
        fc.property(validIconMetadataArbitrary, (icon) => {
          const iconWithoutContent = { ...icon, svgContent: undefined }
          const errors = detectForbiddenElements(iconWithoutContent)
          expect(errors).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Combined Validation', () => {
    it('should mark valid icons as valid', () => {
      fc.assert(
        fc.property(validIconMetadataArbitrary, (icon) => {
          const result = validateIcon(icon)
          expect(result.isValid).toBe(true)
          expect(result.errors).toHaveLength(0)
        }),
        { numRuns: 100 }
      )
    })

    it('should mark icons with forbidden elements as invalid', () => {
      fc.assert(
        fc.property(
          iconWithForbiddenElementArbitrary,
          ({ forbiddenElement, ...icon }) => {
            const result = validateIcon(icon)
            expect(result.isValid).toBe(false)
            expect(result.errors.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should mark icons with invalid sizes as invalid', () => {
      fc.assert(
        fc.property(invalidSizeIconArbitrary, (icon) => {
          const result = validateIcon(icon)
          expect(result.isValid).toBe(false)
          expect(result.errors.some((e) => e.rule === 'size')).toBe(true)
        }),
        { numRuns: 100 }
      )
    })
  })
})
