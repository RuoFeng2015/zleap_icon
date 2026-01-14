#!/usr/bin/env npx tsx
/**
 * Transform SVG Script
 *
 * Optimizes SVG files using SVGO and converts them to JSX-compatible format.
 * This script processes all SVG files in the input directory and outputs
 * optimized versions.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 *
 * Usage:
 *   npx tsx scripts/transform-svg.ts
 *
 * Environment Variables:
 *   INPUT_DIR - Input directory containing SVG files (default: ./svg)
 *   OUTPUT_DIR - Output directory for optimized SVGs (default: ./svg-optimized)
 *   MANIFEST_PATH - Path to the manifest file to update (optional)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import {
  transformSvg,
  defaultTransformOptions,
  type TransformResult,
} from '../src/svg-transformer'

/**
 * Script configuration from environment variables
 */
interface ScriptConfig {
  inputDir: string
  outputDir: string
  manifestPath?: string
}

/**
 * Result of transforming a single file
 */
interface FileTransformResult {
  fileName: string
  success: boolean
  originalSize?: number
  optimizedSize?: number
  savings?: number
  savingsPercent?: number
  error?: string
}

/**
 * Loads configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  return {
    inputDir: process.env.INPUT_DIR || './svg',
    outputDir: process.env.OUTPUT_DIR || './svg',
    manifestPath: process.env.MANIFEST_PATH,
  }
}

/**
 * Ensures a directory exists
 */
async function ensureDirectory(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
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
 * Transforms a single SVG file
 */
async function transformFile(
  inputPath: string,
  outputPath: string
): Promise<FileTransformResult> {
  const fileName = path.basename(inputPath)

  try {
    // Read input file
    const inputContent = await fs.readFile(inputPath, 'utf-8')

    // Transform SVG
    const result: TransformResult = transformSvg(
      inputContent,
      defaultTransformOptions
    )

    // Write output file (use jsxContent for JSX-compatible output)
    await fs.writeFile(outputPath, result.jsxContent, 'utf-8')

    const savings = result.originalSize - result.optimizedSize
    const savingsPercent =
      result.originalSize > 0
        ? Math.round((savings / result.originalSize) * 100)
        : 0

    return {
      fileName,
      success: true,
      originalSize: result.originalSize,
      optimizedSize: result.optimizedSize,
      savings,
      savingsPercent,
    }
  } catch (error) {
    return {
      fileName,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Formats bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('🔧 Transform SVG Files')
  console.log('======================\n')

  // Load configuration
  const config = loadConfig()
  console.log(`📂 Input Directory: ${config.inputDir}`)
  console.log(`📂 Output Directory: ${config.outputDir}`)
  if (config.manifestPath) {
    console.log(`📋 Manifest Path: ${config.manifestPath}`)
  }
  console.log('')

  // Get SVG files
  const svgFiles = await getSvgFiles(config.inputDir)

  if (svgFiles.length === 0) {
    console.log('⚠️  No SVG files found in the input directory.')
    process.exit(0)
  }

  console.log(`📁 Found ${svgFiles.length} SVG file(s)\n`)

  // Ensure output directory exists
  await ensureDirectory(config.outputDir)

  // Transform files
  console.log('🔄 Transforming SVG files...\n')

  const results: FileTransformResult[] = []
  let totalOriginalSize = 0
  let totalOptimizedSize = 0

  for (const file of svgFiles) {
    const inputPath = path.join(config.inputDir, file)
    const outputPath = path.join(config.outputDir, file)

    const result = await transformFile(inputPath, outputPath)
    results.push(result)

    if (result.success) {
      totalOriginalSize += result.originalSize || 0
      totalOptimizedSize += result.optimizedSize || 0

      console.log(
        `   ✅ ${result.fileName}: ${formatBytes(
          result.originalSize || 0
        )} → ${formatBytes(result.optimizedSize || 0)} (-${
          result.savingsPercent
        }%)`
      )
    } else {
      console.log(`   ❌ ${result.fileName}: ${result.error}`)
    }
  }

  // Summary
  const successCount = results.filter((r) => r.success).length
  const failCount = results.filter((r) => !r.success).length
  const totalSavings = totalOriginalSize - totalOptimizedSize
  const totalSavingsPercent =
    totalOriginalSize > 0
      ? Math.round((totalSavings / totalOriginalSize) * 100)
      : 0

  console.log('\n🎉 Transform Complete!')
  console.log('======================')
  console.log(`   Files processed: ${results.length}`)
  console.log(`   Successful: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  console.log(`   Total original size: ${formatBytes(totalOriginalSize)}`)
  console.log(`   Total optimized size: ${formatBytes(totalOptimizedSize)}`)
  console.log(
    `   Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`
  )

  if (failCount > 0) {
    process.exit(1)
  }
}

// Run the script
main()
