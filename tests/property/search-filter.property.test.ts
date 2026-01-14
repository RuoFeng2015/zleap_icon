/**
 * Property-Based Tests for Search Filter Accuracy
 *
 * Feature: figma-icon-automation, Property 9: Search Filter Accuracy
 * Validates: Requirements 8.3
 *
 * For any search query string and icon list, the filter function SHALL return
 * only icons whose names contain the search query (case-insensitive),
 * with no false positives or false negatives.
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  filterIcons,
  iconMatchesQuery,
  type IconInfo,
} from '../../src/icon-search'

// Arbitrary for generating valid icon names
const iconNameArb = fc.stringOf(
  fc.constantFrom(
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'.split(
      ''
    )
  ),
  { minLength: 1, maxLength: 30 }
)

// Arbitrary for generating icon objects
const iconArb: fc.Arbitrary<IconInfo> = fc.record({
  name: iconNameArb.map((n) => `Icon${n.charAt(0).toUpperCase()}${n.slice(1)}`),
  originalName: iconNameArb,
  svgPath: fc.constant('svg/test.svg'),
  componentPath: fc.constant('src/icons/Test.tsx'),
  size: fc.constant({ width: 24, height: 24 }),
})

// Arbitrary for generating arrays of icons
const iconListArb = fc.array(iconArb, { minLength: 0, maxLength: 20 })

// Arbitrary for generating search queries
const searchQueryArb = fc.stringOf(
  fc.constantFrom(
    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_ '.split(
      ''
    )
  ),
  { minLength: 0, maxLength: 20 }
)

describe('Search Filter Accuracy - Property 9', () => {
  /**
   * Property: No false positives
   * All returned icons must match the search query
   */
  it('should return only icons that match the query (no false positives)', () => {
    fc.assert(
      fc.property(iconListArb, searchQueryArb, (icons, query) => {
        const results = filterIcons(icons, query)

        // Every result must match the query
        for (const icon of results) {
          expect(iconMatchesQuery(icon, query)).toBe(true)
        }
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property: No false negatives
   * All icons that match the query must be in the results
   */
  it('should include all icons that match the query (no false negatives)', () => {
    fc.assert(
      fc.property(iconListArb, searchQueryArb, (icons, query) => {
        const results = filterIcons(icons, query)
        const resultNames = new Set(results.map((i) => i.name))

        // Every icon that matches must be in results
        for (const icon of icons) {
          if (iconMatchesQuery(icon, query)) {
            expect(resultNames.has(icon.name)).toBe(true)
          }
        }
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Case insensitivity
   * Search should be case-insensitive
   */
  it('should filter case-insensitively', () => {
    fc.assert(
      fc.property(iconListArb, searchQueryArb, (icons, query) => {
        const lowerResults = filterIcons(icons, query.toLowerCase())
        const upperResults = filterIcons(icons, query.toUpperCase())
        const mixedResults = filterIcons(icons, query)

        // All case variations should return the same results
        expect(lowerResults.length).toBe(upperResults.length)
        expect(lowerResults.length).toBe(mixedResults.length)

        // Same icons should be returned
        const lowerNames = new Set(lowerResults.map((i) => i.name))
        const upperNames = new Set(upperResults.map((i) => i.name))

        for (const name of lowerNames) {
          expect(upperNames.has(name)).toBe(true)
        }
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Empty query returns all icons
   * An empty or whitespace-only query should return all icons
   */
  it('should return all icons for empty query', () => {
    fc.assert(
      fc.property(
        iconListArb,
        fc.constantFrom('', ' ', '  ', '\t', '\n'),
        (icons, emptyQuery) => {
          const results = filterIcons(icons, emptyQuery)
          expect(results.length).toBe(icons.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Result is subset of input
   * Filtered results should always be a subset of the original list
   */
  it('should return a subset of the original icons', () => {
    fc.assert(
      fc.property(iconListArb, searchQueryArb, (icons, query) => {
        const results = filterIcons(icons, query)

        // Results should not exceed original count
        expect(results.length).toBeLessThanOrEqual(icons.length)

        // Every result should be from the original list
        const originalNames = new Set(icons.map((i) => i.name))
        for (const result of results) {
          expect(originalNames.has(result.name)).toBe(true)
        }
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Substring matching
   * If query is a substring of icon name, icon should be included
   */
  it('should match substrings in icon names', () => {
    fc.assert(
      fc.property(iconArb, (icon) => {
        // Take a substring of the icon name
        const name = icon.name
        if (name.length < 2) return true

        const start = Math.floor(name.length / 4)
        const end = Math.floor((name.length * 3) / 4)
        const substring = name.slice(start, end)

        if (substring.length === 0) return true

        const results = filterIcons([icon], substring)
        expect(results.length).toBe(1)
        expect(results[0].name).toBe(icon.name)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Idempotence
   * Filtering twice with the same query should give the same result
   */
  it('should be idempotent', () => {
    fc.assert(
      fc.property(iconListArb, searchQueryArb, (icons, query) => {
        const firstFilter = filterIcons(icons, query)
        const secondFilter = filterIcons(firstFilter, query)

        expect(secondFilter.length).toBe(firstFilter.length)

        const firstNames = firstFilter.map((i) => i.name).sort()
        const secondNames = secondFilter.map((i) => i.name).sort()

        expect(secondNames).toEqual(firstNames)
      }),
      { numRuns: 100 }
    )
  })
})
