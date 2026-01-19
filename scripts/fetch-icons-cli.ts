#!/usr/bin/env npx tsx
/**
 * Fetch Icons using @figma-export/cli
 *
 * 使用 @figma-export/cli 从 Figma 导出图标
 * 这个方法比直接使用 Figma API 更可靠
 *
 * Usage:
 *   npx tsx scripts/fetch-icons-cli.ts
 *
 * Environment Variables:
 *   FIGMA_TOKEN - Figma Personal Access Token (required)
 *   FILE_ID - Figma 文件 ID (required)
 *   PAGE_NAME - 要导出的页面名称 (optional)
 */

import { execSync } from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Script configuration
 */
interface ScriptConfig {
  figmaToken: string
  fileId: string
  pageName?: string
  outputDir: string
}

/**
 * Load configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  const figmaToken = process.env.FIGMA_TOKEN
  const fileId = process.env.FILE_ID

  if (!figmaToken) {
    throw new Error('FIGMA_TOKEN environment variable is required')
  }

  if (!fileId) {
    throw new Error('FILE_ID environment variable is required')
  }

  return {
    figmaToken,
    fileId,
    pageName: process.env.PAGE_NAME,
    outputDir: process.env.OUTPUT_DIR || './svg',
  }
}

/**
 * Ensure output directory exists
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
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('📥 Fetch Icons from Figma')
  console.log('=========================\n')

  // Load configuration
  const config = loadConfig()
  console.log(`📂 Figma File ID: ${config.fileId}`)
  if (config.pageName) {
    console.log(`📄 Page Name: ${config.pageName}`)
  }
  console.log(`📂 Output Directory: ${config.outputDir}`)
  console.log('')

  // Ensure output directory exists
  await ensureDirectory(config.outputDir)

  // Set environment variables for figma-export
  process.env.FIGMA_TOKEN = config.figmaToken
  process.env.FILE_ID = config.fileId
  if (config.pageName) {
    process.env.PAGE_NAME = config.pageName
  }

  try {
    console.log('🔄 Running @figma-export/cli...\n')

    // Run figma-export using the config file
    execSync('npx figma-export use-config figma.config.js', {
      stdio: 'inherit',
      env: process.env,
    })

    console.log('\n✅ Icons exported successfully!')

    // Count exported files
    const files = await fs.readdir(config.outputDir)
    const svgFiles = files.filter((f) => f.endsWith('.svg'))
    console.log(`📊 Exported ${svgFiles.length} SVG file(s)`)

    // List exported files
    if (svgFiles.length > 0) {
      console.log('\n📝 Exported files:')
      for (const file of svgFiles.sort()) {
        console.log(`   - ${file}`)
      }
    }
  } catch (error) {
    console.error('\n❌ Export failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
