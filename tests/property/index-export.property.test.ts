/**
 * Property-Based Tests for Index Export Completeness
 *
 * Feature: figma-icon-automation
 * Property 7: Index Export Completeness
 *
 * Validates: Requirements 4.5
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateIndexFile,
  generateComponentName,
} from '../../src/component-generator'
import type { ComponentTemplate } from '../../src/types'

/**
 * Generates a valid ComponentTemplate for testing
 */
const componentTemplateArbitrary = fc
  .array(fc.stringMatching(/^[a-z][a-z0-9]*$/), { minLength: 1, maxLength: 3 })
  .map((nameParts) => {
    const name = nameParts.join('-')
    const componentName = generateComponentName(name)
    return {
      componentName,
      fileName: `${componentName}.tsx`,
      content: `export const ${componentName} = () => null;`,
      types: `export { ${componentName}, type ${componentName}Props } from './${componentName}';`,
    } as ComponentTemplate
  })

/**
 * Generates an array of unique ComponentTemplates
 */
const componentTemplatesArbitrary = fc
  .array(componentTemplateArbitrary, { minLength: 1, maxLength: 20 })
  .map((templates) => {
    // Ensure unique component names
    const seen = new Set<string>()
    return templates.filter((t) => {
      if (seen.has(t.componentName)) return false
      seen.add(t.componentName)
      return true
    })
  })
  .filter((templates) => templates.length > 0)

describe('Property 7: Index Export Completeness', () => {
  /**
   * Feature: figma-icon-automation, Property 7: Index Export Completeness
   * Validates: Requirements 4.5
   *
   * For any set of generated icon components, the index.ts file SHALL export
   * every component and its corresponding Props type, with no missing or duplicate exports.
   */

  it('index file should export every component', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // Every component should be exported
        for (const template of templates) {
          expect(result.content).toContain(`export { ${template.componentName}`)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('index file should export Props type for every component', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // Every component's Props type should be exported
        for (const template of templates) {
          expect(result.content).toContain(
            `type ${template.componentName}Props`
          )
        }
      }),
      { numRuns: 100 }
    )
  })

  it('index file should have no duplicate exports', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // Count occurrences of each export statement (use word boundary to avoid partial matches)
        for (const template of templates) {
          const exportPattern = new RegExp(
            `export \\{ ${template.componentName},`,
            'g'
          )
          const matches = result.content.match(exportPattern) || []
          expect(matches.length).toBe(1)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('index file should include allIcons object with all components', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // Should contain allIcons export
        expect(result.content).toContain('export const allIcons')

        // allIcons should contain all component names
        for (const template of templates) {
          expect(result.allIconsExport).toContain(template.componentName)
        }
      }),
      { numRuns: 100 }
    )
  })

  it('index file should include IconName type', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // Should contain IconName type
        expect(result.content).toContain('export type IconName')
        expect(result.iconNameType).toContain('keyof typeof allIcons')
      }),
      { numRuns: 100 }
    )
  })

  it('componentNames array should match all input components', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // componentNames should have same length as input
        expect(result.componentNames.length).toBe(templates.length)

        // All input component names should be in the result
        const inputNames = new Set(templates.map((t) => t.componentName))
        const resultNames = new Set(result.componentNames)
        expect(resultNames).toEqual(inputNames)
      }),
      { numRuns: 100 }
    )
  })

  it('exports should be sorted alphabetically', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // componentNames should be sorted using localeCompare (same as implementation)
        const sorted = [...result.componentNames].sort((a, b) =>
          a.localeCompare(b)
        )
        expect(result.componentNames).toEqual(sorted)
      }),
      { numRuns: 100 }
    )
  })

  it('index file should use correct import paths', () => {
    fc.assert(
      fc.property(componentTemplatesArbitrary, (templates) => {
        const result = generateIndexFile(templates)

        // Each export should reference the correct path
        for (const template of templates) {
          expect(result.content).toContain(
            `from './icons/${template.componentName}'`
          )
        }
      }),
      { numRuns: 100 }
    )
  })
})
