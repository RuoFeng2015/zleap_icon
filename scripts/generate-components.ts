#!/usr/bin/env npx tsx
/**
 * Generate Components Script
 *
 * Generates React components from SVG files and creates the index.ts export file.
 * This script reads SVG files, transforms them, and generates TypeScript React components.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.5
 *
 * Usage:
 *   npx tsx scripts/generate-components.ts
 *
 * Environment Variables:
 *   SVG_DIR - Directory containing SVG files (default: ./svg)
 *   OUTPUT_DIR - Output directory for components (default: ./src/icons)
 *   INDEX_PATH - Path for the index.ts file (default: ./src/index.ts)
 *   MANIFEST_PATH - Path to the manifest file (optional, for metadata)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { pinyin } from 'pinyin-pro'
import {
  generateComponent,
  generateIndexFile,
  toPascalCase,
} from '../src/component-generator'
import type { ComponentTemplate } from '../src/types'
import { transformSvg, defaultTransformOptions } from '../src/svg-transformer'
import type { IconMetadata } from '../src/types'

/**
 * 将中文转换为拼音
 */
function chineseToPinyin(text: string): string {
  // 使用 pinyin-pro 转换中文为拼音
  return pinyin(text, {
    toneType: 'none', // 不带声调
    type: 'array', // 返回数组
  }).join('-')
}

/**
 * Script configuration from environment variables
 */
interface ScriptConfig {
  svgDir: string
  outputDir: string
  indexPath: string
  manifestPath?: string
}

/**
 * Loads configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  return {
    svgDir: process.env.SVG_DIR || './svg',
    outputDir: process.env.OUTPUT_DIR || './src/icons',
    indexPath: process.env.INDEX_PATH || './src/index.ts',
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
 * Extracts icon name from SVG filename and converts Chinese to pinyin
 */
function getIconNameFromFile(fileName: string): string {
  const nameWithoutExt = fileName.replace(/\.svg$/i, '')

  // 检测是否包含中文字符
  const hasChinese = /[\u4e00-\u9fa5]/.test(nameWithoutExt)

  if (hasChinese) {
    // 转换中文为拼音
    const pinyinName = chineseToPinyin(nameWithoutExt)
    return pinyinName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  }

  return nameWithoutExt
}

/**
 * Creates IconMetadata from an SVG file
 */
function createMetadataFromFile(
  fileName: string,
  svgContent: string,
): IconMetadata {
  const originalName = fileName.replace(/\.svg$/i, '')
  const name = getIconNameFromFile(fileName)

  // Try to extract dimensions from SVG
  const widthMatch = svgContent.match(/width=["'](\d+)["']/)
  const heightMatch = svgContent.match(/height=["'](\d+)["']/)
  const viewBoxMatch = svgContent.match(
    /viewBox=["'][\d\s]+\s+[\d\s]+\s+(\d+)\s+(\d+)["']/,
  )

  let width = 24
  let height = 24

  if (widthMatch && heightMatch) {
    width = parseInt(widthMatch[1], 10)
    height = parseInt(heightMatch[1], 10)
  } else if (viewBoxMatch) {
    width = parseInt(viewBoxMatch[1], 10)
    height = parseInt(viewBoxMatch[2], 10)
  }

  return {
    id: name,
    name,
    originalName, // 保留原始中文名称
    normalizedName: `Icon${toPascalCase(name)}`,
    width,
    height,
    svgContent,
  }
}

/**
 * Generates a component from an SVG file
 */
async function generateComponentFromFile(
  svgPath: string,
): Promise<{ template: ComponentTemplate; metadata: IconMetadata } | null> {
  try {
    const fileName = path.basename(svgPath)
    const svgContent = await fs.readFile(svgPath, 'utf-8')

    // Transform SVG to JSX
    const transformed = transformSvg(svgContent, defaultTransformOptions)

    // Create metadata
    const metadata = createMetadataFromFile(fileName, svgContent)

    // Generate component - pass raw SVG content for gradient icons
    const template = generateComponent(metadata, transformed.jsxContent, transformed.svgContent)

    return { template, metadata }
  } catch (error) {
    console.error(
      `   ❌ Error processing ${path.basename(svgPath)}:`,
      error instanceof Error ? error.message : error,
    )
    return null
  }
}

/**
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('⚛️  Generate React Components')
  console.log('=============================\n')

  // Load configuration
  const config = loadConfig()
  console.log(`📂 SVG Directory: ${config.svgDir}`)
  console.log(`📂 Output Directory: ${config.outputDir}`)
  console.log(`📄 Index Path: ${config.indexPath}`)
  console.log('')

  // Get SVG files
  const svgFiles = await getSvgFiles(config.svgDir)

  if (svgFiles.length === 0) {
    console.log('⚠️  No SVG files found in the SVG directory.')
    process.exit(0)
  }

  console.log(`📁 Found ${svgFiles.length} SVG file(s)\n`)

  // Ensure output directory exists
  await ensureDirectory(config.outputDir)

  // Generate components
  console.log('🔄 Generating components...\n')

  const components: ComponentTemplate[] = []
  let successCount = 0
  let failCount = 0

  for (const file of svgFiles) {
    const svgPath = path.join(config.svgDir, file)
    const result = await generateComponentFromFile(svgPath)

    if (result) {
      components.push(result.template)

      // Write component file
      const componentPath = path.join(
        config.outputDir,
        result.template.fileName,
      )
      await fs.writeFile(componentPath, result.template.content, 'utf-8')

      console.log(`   ✅ ${result.template.componentName}`)
      successCount++
    } else {
      failCount++
    }
  }

  // Generate index file
  if (components.length > 0) {
    console.log('\n📝 Generating index file...')

    const indexResult = generateIndexFile(components)

    // Ensure index directory exists
    const indexDir = path.dirname(config.indexPath)
    await ensureDirectory(indexDir)

    await fs.writeFile(config.indexPath, indexResult.content, 'utf-8')
    console.log(`   ✅ ${config.indexPath}`)
    console.log(
      `   📦 Exported ${indexResult.componentNames.length} components`,
    )
  }

  // Summary
  console.log('\n🎉 Component Generation Complete!')
  console.log('==================================')
  console.log(`   Components generated: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  console.log(`   Output directory: ${config.outputDir}`)
  console.log(`   Index file: ${config.indexPath}`)

  if (failCount > 0) {
    process.exit(1)
  }
}

// Run the script
main()
