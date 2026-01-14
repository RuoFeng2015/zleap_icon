/**
 * Icon Validator Module
 *
 * Handles icon validation including size, naming, and SVG feature detection.
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

import type {
  IconMetadata,
  ValidationRules,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types'

/**
 * Default validation rules for icons
 */
export const defaultValidationRules: ValidationRules = {
  allowedSizes: [16, 20, 24, 32],
  namingPattern: /^[a-z][a-z0-9-]*$/,
  maxFileSize: 10240, // 10KB
  requiredAttributes: ['viewBox'],
  forbiddenElements: ['image', 'foreignObject', 'script', 'style', 'iframe'],
}

/**
 * Validates icon dimensions against allowed sizes
 *
 * @param icon - Icon metadata to validate
 * @param allowedSizes - Array of allowed sizes in pixels
 * @returns Array of validation errors (empty if valid)
 *
 * Requirements: 12.1
 */
export function validateIconSize(
  icon: IconMetadata,
  allowedSizes: number[] = defaultValidationRules.allowedSizes
): ValidationError[] {
  const errors: ValidationError[] = []

  const widthValid = allowedSizes.includes(icon.width)
  const heightValid = allowedSizes.includes(icon.height)

  if (!widthValid || !heightValid) {
    errors.push({
      iconName: icon.name,
      rule: 'size',
      message: `Icon size ${icon.width}x${
        icon.height
      } not in allowed sizes: ${allowedSizes.join(', ')}`,
      severity: 'error',
    })
  }

  // Check if icon is square (width === height)
  if (icon.width !== icon.height) {
    errors.push({
      iconName: icon.name,
      rule: 'size',
      message: `Icon is not square: ${icon.width}x${icon.height}`,
      severity: 'warning',
    })
  }

  return errors
}

/**
 * Validates icon naming against the naming pattern
 *
 * @param icon - Icon metadata to validate
 * @param namingPattern - Regex pattern for valid names
 * @returns Array of validation errors/warnings (empty if valid)
 *
 * Requirements: 12.2
 */
export function validateIconName(
  icon: IconMetadata,
  namingPattern: RegExp = defaultValidationRules.namingPattern
): ValidationWarning[] {
  const warnings: ValidationWarning[] = []

  if (!namingPattern.test(icon.originalName)) {
    warnings.push({
      iconName: icon.name,
      rule: 'naming',
      message: `Icon name "${
        icon.originalName
      }" doesn't match naming convention: ${namingPattern.toString()}`,
      severity: 'warning',
    })
  }

  // Check for common naming issues
  if (icon.originalName.includes('__')) {
    warnings.push({
      iconName: icon.name,
      rule: 'naming',
      message: `Icon name "${icon.originalName}" contains double underscores`,
      severity: 'warning',
    })
  }

  if (icon.originalName.includes('--')) {
    warnings.push({
      iconName: icon.name,
      rule: 'naming',
      message: `Icon name "${icon.originalName}" contains double hyphens`,
      severity: 'warning',
    })
  }

  if (/^\d/.test(icon.originalName)) {
    warnings.push({
      iconName: icon.name,
      rule: 'naming',
      message: `Icon name "${icon.originalName}" starts with a number`,
      severity: 'warning',
    })
  }

  return warnings
}

/**
 * Detects forbidden SVG elements in the icon content
 *
 * @param icon - Icon metadata with SVG content
 * @param forbiddenElements - Array of forbidden element names
 * @returns Array of validation errors (empty if no forbidden elements found)
 *
 * Requirements: 12.4
 */
export function detectForbiddenElements(
  icon: IconMetadata,
  forbiddenElements: string[] = defaultValidationRules.forbiddenElements
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!icon.svgContent) {
    return errors
  }

  const foundForbidden: string[] = []

  for (const element of forbiddenElements) {
    // Match both opening tags and self-closing tags
    const regex = new RegExp(`<${element}[\\s/>]`, 'i')
    if (regex.test(icon.svgContent)) {
      foundForbidden.push(element)
    }
  }

  if (foundForbidden.length > 0) {
    errors.push({
      iconName: icon.name,
      rule: 'forbidden-elements',
      message: `Icon contains forbidden elements: ${foundForbidden.join(', ')}`,
      severity: 'error',
    })
  }

  return errors
}

/**
 * Validates a single icon against all validation rules
 *
 * @param icon - Icon metadata to validate
 * @param rules - Validation rules to apply
 * @returns ValidationResult with errors and warnings
 *
 * Requirements: 12.1, 12.2, 12.4
 */
export function validateIcon(
  icon: IconMetadata,
  rules: ValidationRules = defaultValidationRules
): ValidationResult {
  const allErrors: ValidationError[] = []
  const allWarnings: ValidationWarning[] = []

  // Validate size
  const sizeResults = validateIconSize(icon, rules.allowedSizes)
  for (const result of sizeResults) {
    if (result.severity === 'error') {
      allErrors.push(result)
    } else {
      allWarnings.push(result)
    }
  }

  // Validate naming
  const nameResults = validateIconName(icon, rules.namingPattern)
  for (const result of nameResults) {
    if (result.severity === 'error') {
      allErrors.push(result)
    } else {
      allWarnings.push(result)
    }
  }

  // Detect forbidden elements
  const forbiddenResults = detectForbiddenElements(
    icon,
    rules.forbiddenElements
  )
  allErrors.push(...forbiddenResults)

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  }
}

/**
 * Validates multiple icons against validation rules
 *
 * @param icons - Array of icon metadata to validate
 * @param rules - Validation rules to apply
 * @returns Map of icon names to their validation results
 *
 * Requirements: 12.1, 12.2, 12.4
 */
export function validateIcons(
  icons: IconMetadata[],
  rules: ValidationRules = defaultValidationRules
): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>()

  for (const icon of icons) {
    results.set(icon.name, validateIcon(icon, rules))
  }

  return results
}

/**
 * Summary of validation results
 */
export interface ValidationSummary {
  /** Total number of icons validated */
  totalIcons: number
  /** Number of valid icons */
  validIcons: number
  /** Number of invalid icons */
  invalidIcons: number
  /** Total number of errors */
  totalErrors: number
  /** Total number of warnings */
  totalWarnings: number
  /** All errors grouped by rule */
  errorsByRule: Map<string, ValidationError[]>
  /** All warnings grouped by rule */
  warningsByRule: Map<string, ValidationWarning[]>
}

/**
 * Generates a summary of validation results
 *
 * @param results - Map of icon names to validation results
 * @returns ValidationSummary with aggregated statistics
 *
 * Requirements: 12.3, 12.5
 */
export function generateValidationSummary(
  results: Map<string, ValidationResult>
): ValidationSummary {
  let validIcons = 0
  let invalidIcons = 0
  let totalErrors = 0
  let totalWarnings = 0
  const errorsByRule = new Map<string, ValidationError[]>()
  const warningsByRule = new Map<string, ValidationWarning[]>()

  for (const result of results.values()) {
    if (result.isValid) {
      validIcons++
    } else {
      invalidIcons++
    }

    totalErrors += result.errors.length
    totalWarnings += result.warnings.length

    // Group errors by rule
    for (const error of result.errors) {
      const existing = errorsByRule.get(error.rule) || []
      existing.push(error)
      errorsByRule.set(error.rule, existing)
    }

    // Group warnings by rule
    for (const warning of result.warnings) {
      const existing = warningsByRule.get(warning.rule) || []
      existing.push(warning)
      warningsByRule.set(warning.rule, existing)
    }
  }

  return {
    totalIcons: results.size,
    validIcons,
    invalidIcons,
    totalErrors,
    totalWarnings,
    errorsByRule,
    warningsByRule,
  }
}

/**
 * Generates a Markdown validation report
 *
 * @param results - Map of icon names to validation results
 * @param title - Optional report title
 * @returns Markdown formatted validation report
 *
 * Requirements: 12.3, 12.5
 */
export function generateValidationReport(
  results: Map<string, ValidationResult>,
  title: string = 'Icon Validation Report'
): string {
  const summary = generateValidationSummary(results)
  const lines: string[] = []

  // Header
  lines.push(`# ${title}`)
  lines.push('')
  lines.push(`Generated at: ${new Date().toISOString()}`)
  lines.push('')

  // Summary section
  lines.push('## Summary')
  lines.push('')
  lines.push(`| Metric | Count |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Total Icons | ${summary.totalIcons} |`)
  lines.push(`| Valid Icons | ${summary.validIcons} |`)
  lines.push(`| Invalid Icons | ${summary.invalidIcons} |`)
  lines.push(`| Total Errors | ${summary.totalErrors} |`)
  lines.push(`| Total Warnings | ${summary.totalWarnings} |`)
  lines.push('')

  // Status badge
  if (summary.invalidIcons === 0) {
    lines.push('✅ **All icons passed validation**')
  } else {
    lines.push(`⚠️ **${summary.invalidIcons} icon(s) failed validation**`)
  }
  lines.push('')

  return lines.join('\n')
}

/**
 * Generates the errors section of the validation report
 *
 * @param summary - Validation summary
 * @returns Markdown formatted errors section
 */
function generateErrorsSection(summary: ValidationSummary): string {
  const lines: string[] = []

  if (summary.totalErrors === 0) {
    return ''
  }

  lines.push('## Errors')
  lines.push('')

  for (const [rule, errors] of summary.errorsByRule) {
    lines.push(
      `### ${rule} (${errors.length} error${errors.length > 1 ? 's' : ''})`
    )
    lines.push('')
    lines.push('| Icon | Message |')
    lines.push('|------|---------|')
    for (const error of errors) {
      lines.push(`| ${error.iconName} | ${error.message} |`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generates the warnings section of the validation report
 *
 * @param summary - Validation summary
 * @returns Markdown formatted warnings section
 */
function generateWarningsSection(summary: ValidationSummary): string {
  const lines: string[] = []

  if (summary.totalWarnings === 0) {
    return ''
  }

  lines.push('## Warnings')
  lines.push('')

  for (const [rule, warnings] of summary.warningsByRule) {
    lines.push(
      `### ${rule} (${warnings.length} warning${
        warnings.length > 1 ? 's' : ''
      })`
    )
    lines.push('')
    lines.push('| Icon | Message |')
    lines.push('|------|---------|')
    for (const warning of warnings) {
      lines.push(`| ${warning.iconName} | ${warning.message} |`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generates a complete Markdown validation report with all sections
 *
 * @param results - Map of icon names to validation results
 * @param title - Optional report title
 * @returns Complete Markdown formatted validation report
 *
 * Requirements: 12.3, 12.5
 */
export function generateFullValidationReport(
  results: Map<string, ValidationResult>,
  title: string = 'Icon Validation Report'
): string {
  const summary = generateValidationSummary(results)
  const sections: string[] = []

  // Base report with summary
  sections.push(generateValidationReport(results, title))

  // Errors section
  const errorsSection = generateErrorsSection(summary)
  if (errorsSection) {
    sections.push(errorsSection)
  }

  // Warnings section
  const warningsSection = generateWarningsSection(summary)
  if (warningsSection) {
    sections.push(warningsSection)
  }

  // Valid icons section
  if (summary.validIcons > 0) {
    sections.push('## Valid Icons')
    sections.push('')
    const validIconNames: string[] = []
    for (const [name, result] of results) {
      if (result.isValid) {
        validIconNames.push(name)
      }
    }
    sections.push(validIconNames.map((name) => `- ✅ ${name}`).join('\n'))
    sections.push('')
  }

  return sections.join('\n')
}
