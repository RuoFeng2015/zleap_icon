#!/usr/bin/env npx tsx
/**
 * Generate Outputs Script
 *
 * Generates multiple output formats from icon SVG files:
 * - SVG Sprite file with symbol elements
 * - JSON metadata file
 *
 * Requirements: 11.1, 11.2, 11.3
 *
 * Usage:
 *   npx tsx scripts/generate-outputs.ts
 *
 * Environment Variables:
 *   SVG_DIR - Directory containing SVG files (default: ./svg)
 *   SPRITE_PATH - Output path for SVG sprite (default: ./sprite/icons.svg)
 *   JSON_PATH - Output path for JSON metadata (default: ./icons.json)
 *   VERSION - Version string for metadata (default: 1.0.0)
 *   MANIFEST_PATH - Path to existing manifest file (optional)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { pinyin } from 'pinyin-pro'
import {
  generateSprite,
  generateJsonMetadata,
  serializeJsonMetadata,
} from '../src/multi-format-output'
import { toPascalCase } from '../src/component-generator'
import type { IconMetadata, IconManifest } from '../src/types'

/**
 * 将中文转换为拼音
 */
function chineseToPinyin(text: string): string {
  return pinyin(text, {
    toneType: 'none',
    type: 'array',
  }).join('-')
}

/**
 * 从文件名提取图标名称（支持中文转拼音）
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
 * Script configuration from environment variables
 */
interface ScriptConfig {
  svgDir: string
  spritePath: string
  jsonPath: string
  version: string
  manifestPath?: string
}

/**
 * Loads configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  return {
    svgDir: process.env.SVG_DIR || './svg',
    spritePath: process.env.SPRITE_PATH || './sprite/icons.svg',
    jsonPath: process.env.JSON_PATH || './icons.json',
    version: process.env.VERSION || '1.0.0',
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
 * Loads an existing manifest file if available
 */
async function loadManifest(
  manifestPath: string,
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
  svgPath: string,
): Promise<IconMetadata | null> {
  try {
    const fileName = path.basename(svgPath)
    const originalName = fileName.replace(/\.svg$/i, '')
    const name = getIconNameFromFile(fileName) // 使用拼音转换
    const svgContent = await fs.readFile(svgPath, 'utf-8')

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
  } catch (error) {
    console.error(
      `   ❌ Error reading ${path.basename(svgPath)}:`,
      error instanceof Error ? error.message : error,
    )
    return null
  }
}

/**
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('📦 Generate Output Files')
  console.log('========================\n')

  // Load configuration
  const config = loadConfig()
  console.log(`📂 SVG Directory: ${config.svgDir}`)
  console.log(`📄 Sprite Path: ${config.spritePath}`)
  console.log(`📄 JSON Path: ${config.jsonPath}`)
  console.log(`🏷️  Version: ${config.version}`)
  console.log('')

  // Try to load existing manifest
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
    console.log('⚠️  No icons to process.')
    process.exit(0)
  }

  // Generate SVG Sprite
  console.log('🎨 Generating SVG Sprite...')
  const sprite = generateSprite(icons)

  // Ensure sprite directory exists
  const spriteDir = path.dirname(config.spritePath)
  await ensureDirectory(spriteDir)

  await fs.writeFile(config.spritePath, sprite.content, 'utf-8')
  console.log(`   ✅ Sprite saved to ${config.spritePath}`)
  console.log(`   📊 Contains ${sprite.symbols.length} symbols\n`)

  // Generate JSON Metadata
  console.log('📝 Generating JSON Metadata...')
  const jsonMetadata = generateJsonMetadata(icons, config.version)
  const jsonContent = serializeJsonMetadata(jsonMetadata)

  await fs.writeFile(config.jsonPath, jsonContent, 'utf-8')
  console.log(`   ✅ JSON saved to ${config.jsonPath}`)
  console.log(`   📊 Contains ${jsonMetadata.totalCount} icon entries\n`)

  // Summary
  console.log('🎉 Output Generation Complete!')
  console.log('==============================')
  console.log(`   Icons processed: ${icons.length}`)
  console.log(`   SVG Sprite: ${config.spritePath}`)
  console.log(`   JSON Metadata: ${config.jsonPath}`)
  console.log(`   Version: ${config.version}`)
}

// Run the script
main()
