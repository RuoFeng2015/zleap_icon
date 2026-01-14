#!/usr/bin/env npx tsx
/**
 * Validate Icons Script
 *
 * Validates icon files against design rules including:
 * - Size validation (allowed dimensions)
 * - Naming convention validation
 * - Forbidden SVG element detection
 *
 * Requirements: 12.1, 12.2, 12.4, 12.5
 *
 * Usage:
 *   npx tsx scripts/validate-icons.ts
 *
 * Environment Variables:
 *   SVG_DIR - Directory containing SVG files (default: ./svg)
 *   MANIFEST_PATH - Path to manifest file (optional)
 *   REPORT_PATH - Output path for validation report (default: ./validation-report.md)
 *   ALLOWED_SIZES - Comma-separated list of allowed sizes (default: 16,20,24,32)
 *   STRICT - If "true", exit with error on any validation failure (default: false)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import {
  validateIcons,
  generateFullValidationReport,
  generateValidationSummary,
  defaultValidationRules,
} from '../src/icon-validator'
import type { ValidationRules } from '../src/types'
import { toPascalCase } from '../src/component-generator'
import type { IconMetadata, IconManifest } from '../src/types'

/**
 * Script configuration from environment variables
 */
interface ScriptConfig {
  svgDir: string
  manifestPath?: string
  reportPath: string
  allowedSizes: number[]
  strict: boolean
}

/**
 * Loads configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  const allowedSizesStr = process.env.ALLOWED_SIZES || '16,20,24,32'
  const allowedSizes = allowedSizesStr
    .split(',')
    .map((s) => parseInt(s.trim(), 10))

  return {
    svgDir: process.env.SVG_DIR || './svg',
    manifestPath: process.env.MANIFEST_PATH,
    reportPath: process.env.REPORT_PATH || './validation-report.md',
    allowedSizes,
    strict: process.env.STRICT === 'true',
  }
}

/**
 * Gets all SVG files from a directory
 */
async function getSvgFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir)
    return files.filter((file) => file.toLowerCase().endsWith('.svg'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

/**
 * Loads an existing manifest file if available
 */
async function loadManifest(
  manifestPath: string
): Promise<IconManifest | null> {
  try {
    const content = await fs.readFile(manifestPath, 'utf-8')
    return JSON.parse(content) as IconManifest
  } catch {
    return null
  }
}

/**
 * Creates IconMetadata from an SVG file
 */
async function createMetadataFromFile(
  svgPath: string
): Promise<IconMetadata | null> {
  try {
    const fileName = path.basename(svgPath)
    const name = fileName.replace(/\.svg$/i, '')
    const svgContent = await fs.readFile(svgPath, 'utf-8')

    // Try to extract dimensions from SVG
    const widthMatch = svgContent.match(/width=["'](\d+)["']/)
    const heightMatch = svgContent.match(/height=["'](\d+)["']/)
    const viewBoxMatch = svgContent.match(
      /viewBox=["'][\d\s.]+\s+[\d\s.]+\s+([\d.]+)\s+([\d.]+)["']/
    )

    let width = 24
    let height = 24

    if (widthMatch && heightMatch) {
      width = parseInt(widthMatch[1], 10)
      height = parseInt(heightMatch[1], 10)
    } else if (viewBoxMatch) {
      width = Math.round(parseFloat(viewBoxMatch[1]))
      height = Math.round(parseFloat(viewBoxMatch[2]))
    }

    return {
      id: name,
      name,
      originalName: name,
      normalizedName: `Icon${toPascalCase(name)}`,
      width,
      height,
      svgContent,
    }
  } catch (error) {
    console.error(
      `   ❌ Error reading ${path.basename(svgPath)}:`,
      error instanceof Error ? error.message : error
    )
    return null
  }
}

/**
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('🔍 Validate Icons')
  console.log('=================\n')

  // Load configuration
  const config = loadConfig()
  console.log(`📂 SVG Directory: ${config.svgDir}`)
  console.log(`📄 Report Path: ${config.reportPath}`)
  console.log(`📏 Allowed Sizes: ${config.allowedSizes.join(', ')}`)
  console.log(`🔒 Strict Mode: ${config.strict}`)
  console.log('')

  // Load icons
  let icons: IconMetadata[] = []

  if (config.manifestPath) {
    console.log(`📋 Loading manifest from ${config.manifestPath}...`)
    const manifest = await loadManifest(config.manifestPath)
    if (manifest) {
      icons = manifest.icons
      console.log(`   ✅ Loaded ${icons.length} icons from manifest\n`)
    } else {
      console.log('   ⚠️  Manifest not found, reading SVG files directly\n')
    }
  }

  // If no manifest or empty, read SVG files directly
  if (icons.length === 0) {
    console.log('📁 Reading SVG files...')
    const svgFiles = await getSvgFiles(config.svgDir)

    if (svgFiles.length === 0) {
      console.log('⚠️  No SVG files found in the SVG directory.')
      process.exit(0)
    }

    console.log(`   Found ${svgFiles.length} SVG file(s)\n`)

    for (const file of svgFiles) {
      const svgPath = path.join(config.svgDir, file)
      const metadata = await createMetadataFromFile(svgPath)
      if (metadata) {
        icons.push(metadata)
      }
    }

    console.log(`   ✅ Loaded ${icons.length} icons\n`)
  }

  if (icons.length === 0) {
    console.log('⚠️  No icons to validate.')
    process.exit(0)
  }

  // Configure validation rules
  const rules: ValidationRules = {
    ...defaultValidationRules,
    allowedSizes: config.allowedSizes,
  }

  // Validate icons
  console.log('🔄 Validating icons...\n')
  const results = validateIcons(icons, rules)
  const summary = generateValidationSummary(results)

  // Print summary to console
  console.log('📊 Validation Summary')
  console.log('---------------------')
  console.log(`   Total icons: ${summary.totalIcons}`)
  console.log(`   Valid: ${summary.validIcons}`)
  console.log(`   Invalid: ${summary.invalidIcons}`)
  console.log(`   Errors: ${summary.totalErrors}`)
  console.log(`   Warnings: ${summary.totalWarnings}`)
  console.log('')

  // Print errors
  if (summary.totalErrors > 0) {
    console.log('❌ Errors:')
    for (const [rule, errors] of summary.errorsByRule) {
      console.log(`   ${rule}:`)
      for (const error of errors.slice(0, 5)) {
        console.log(`     - ${error.iconName}: ${error.message}`)
      }
      if (errors.length > 5) {
        console.log(`     ... and ${errors.length - 5} more`)
      }
    }
    console.log('')
  }

  // Print warnings
  if (summary.totalWarnings > 0) {
    console.log('⚠️  Warnings:')
    for (const [rule, warnings] of summary.warningsByRule) {
      console.log(`   ${rule}:`)
      for (const warning of warnings.slice(0, 5)) {
        console.log(`     - ${warning.iconName}: ${warning.message}`)
      }
      if (warnings.length > 5) {
        console.log(`     ... and ${warnings.length - 5} more`)
      }
    }
    console.log('')
  }

  // Generate and save report
  console.log('📝 Generating validation report...')
  const report = generateFullValidationReport(results)
  await fs.writeFile(config.reportPath, report, 'utf-8')
  console.log(`   ✅ Report saved to ${config.reportPath}\n`)

  // Final status
  if (summary.invalidIcons === 0) {
    console.log('🎉 All icons passed validation!')
  } else {
    console.log(`⚠️  ${summary.invalidIcons} icon(s) failed validation.`)
    console.log(`   See ${config.reportPath} for details.`)

    if (config.strict) {
      console.log('\n❌ Exiting with error (strict mode enabled)')
      process.exit(1)
    }
  }
}

// Run the script
main()
