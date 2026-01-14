#!/usr/bin/env npx tsx
/**
 * Fetch Icons Script
 *
 * Fetches icons from Figma API and exports them as SVG files.
 * This script integrates the Figma client, icon filter, SVG exporter,
 * and manifest generator modules.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.6
 *
 * Usage:
 *   npx tsx scripts/fetch-icons.ts
 *
 * Environment Variables:
 *   FIGMA_TOKEN - Figma Personal Access Token (required)
 *   FIGMA_FILE_KEY - Figma file key to fetch icons from (required)
 *   OUTPUT_DIR - Output directory for SVG files (default: ./svg)
 *   MANIFEST_PATH - Path to save the manifest file (default: ./icons-manifest.json)
 *   VERSION - Version string for the manifest (default: 1.0.0)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { createFigmaClient, FigmaApiError } from '../src/figma-client'
import {
  filterIconComponents,
  DEFAULT_FILTER_CONFIG,
  type IconFilterConfig,
} from '../src/icon-filter'
import { batchExportSvg, type ExportProgress } from '../src/svg-exporter'
import {
  generateManifestFromExports,
  serializeManifest,
} from '../src/manifest-generator'

/**
 * Script configuration from environment variables
 */
interface ScriptConfig {
  figmaToken: string
  figmaFileKey: string
  outputDir: string
  manifestPath: string
  version: string
}

/**
 * Loads configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  const figmaToken = process.env.FIGMA_TOKEN
  const figmaFileKey = process.env.FIGMA_FILE_KEY

  if (!figmaToken) {
    throw new Error('FIGMA_TOKEN environment variable is required')
  }

  if (!figmaFileKey) {
    throw new Error('FIGMA_FILE_KEY environment variable is required')
  }

  return {
    figmaToken,
    figmaFileKey,
    outputDir: process.env.OUTPUT_DIR || './svg',
    manifestPath: process.env.MANIFEST_PATH || './icons-manifest.json',
    version: process.env.VERSION || '1.0.0',
  }
}

/**
 * Progress callback for export operation
 */
function onProgress(progress: ExportProgress): void {
  const percent = Math.round((progress.completed / progress.total) * 100)
  process.stdout.write(
    `\rExporting icons: ${progress.completed}/${
      progress.total
    } (${percent}%) - ${progress.current || ''}`
  )
}

/**
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('🎨 Fetch Icons from Figma')
  console.log('========================\n')

  // Load configuration
  let config: ScriptConfig
  try {
    config = loadConfig()
    console.log(`📁 File Key: ${config.figmaFileKey}`)
    console.log(`📂 Output Directory: ${config.outputDir}`)
    console.log(`📋 Manifest Path: ${config.manifestPath}`)
    console.log(`🏷️  Version: ${config.version}\n`)
  } catch (error) {
    console.error(
      '❌ Configuration Error:',
      error instanceof Error ? error.message : error
    )
    process.exit(1)
  }

  // Create Figma client
  const client = createFigmaClient(config.figmaToken)

  try {
    // Step 1: Fetch Figma file
    console.log('📥 Fetching Figma file...')
    const fileResponse = await client.getFile(config.figmaFileKey)
    console.log('✅ Figma file fetched successfully\n')

    // Step 2: Filter icon components
    console.log('🔍 Filtering icon components...')
    const filterConfig: IconFilterConfig = {
      ...DEFAULT_FILTER_CONFIG,
      // Allow more flexible naming for icons
      namePattern: /^[a-z][a-z0-9-_]*$/i,
    }
    const filterResult = filterIconComponents(fileResponse, filterConfig)

    console.log(`   Total components processed: ${filterResult.totalProcessed}`)
    console.log(`   Icons found: ${filterResult.icons.length}`)
    console.log(`   Skipped: ${filterResult.skipped.length}`)

    if (filterResult.icons.length === 0) {
      console.log('\n⚠️  No icons found in the Figma file.')
      console.log(
        '   Make sure your icons are COMPONENT type and follow the naming convention.'
      )
      process.exit(0)
    }

    console.log('\n📋 Icons to export:')
    for (const icon of filterResult.icons.slice(0, 10)) {
      console.log(`   - ${icon.name} (${icon.width}x${icon.height})`)
    }
    if (filterResult.icons.length > 10) {
      console.log(`   ... and ${filterResult.icons.length - 10} more\n`)
    } else {
      console.log('')
    }

    // Step 3: Export SVGs
    console.log('📤 Exporting SVG files...')
    const exportResult = await batchExportSvg(
      client,
      config.figmaFileKey,
      filterResult.icons,
      {
        outputDir: config.outputDir,
        concurrency: 5,
        simplifyStroke: true,
        includeId: false,
        onProgress,
      }
    )
    console.log('\n')

    console.log(`✅ Export complete:`)
    console.log(`   Successful: ${exportResult.successful.length}`)
    console.log(`   Failed: ${exportResult.failed.length}`)

    if (exportResult.failed.length > 0) {
      console.log('\n⚠️  Failed exports:')
      for (const failed of exportResult.failed) {
        console.log(`   - ${failed.name}: ${failed.error}`)
      }
    }

    // Step 4: Generate manifest
    console.log('\n📝 Generating manifest...')
    const manifest = generateManifestFromExports(
      exportResult.successful,
      filterResult.icons,
      {
        version: config.version,
        includeSvgContent: true,
      }
    )

    // Save manifest
    const manifestJson = serializeManifest(manifest)
    await fs.writeFile(config.manifestPath, manifestJson, 'utf-8')
    console.log(`✅ Manifest saved to ${config.manifestPath}`)

    // Summary
    console.log('\n🎉 Fetch Icons Complete!')
    console.log('========================')
    console.log(`   Total icons: ${manifest.totalCount}`)
    console.log(`   Output directory: ${config.outputDir}`)
    console.log(`   Manifest: ${config.manifestPath}`)
  } catch (error) {
    if (error instanceof FigmaApiError) {
      console.error('\n❌ Figma API Error:', error.message)
      if (error.suggestion) {
        console.error('   Suggestion:', error.suggestion)
      }
    } else {
      console.error(
        '\n❌ Error:',
        error instanceof Error ? error.message : error
      )
    }
    process.exit(1)
  }
}

// Run the script
main()
