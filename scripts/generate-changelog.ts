#!/usr/bin/env npx tsx
/**
 * Generate Changelog Script
 *
 * Generates changelog entries by comparing current and previous icon manifests.
 * Creates or updates the CHANGELOG.md file with version history.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 *
 * Usage:
 *   npx tsx scripts/generate-changelog.ts
 *
 * Environment Variables:
 *   CURRENT_MANIFEST - Path to current manifest file (default: ./icons-manifest.json)
 *   PREVIOUS_MANIFEST - Path to previous manifest file (optional)
 *   CHANGELOG_PATH - Path to CHANGELOG.md file (default: ./CHANGELOG.md)
 *   VERSION - Version number for the release (required)
 *   MESSAGE - Update message from designer (default: "Icon library update")
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import {
  computeIconDiff,
  generateChangelog,
  prependToChangelog,
  createInitialChangelog,
  hasChanges,
} from '../src/changelog-generator'
import { suggestVersionBump } from '../src/version-manager'
import type { IconManifest } from '../src/types'

/**
 * Script configuration from environment variables
 */
interface ScriptConfig {
  currentManifestPath: string
  previousManifestPath?: string
  changelogPath: string
  version: string
  message: string
}

/**
 * Loads configuration from environment variables
 */
function loadConfig(): ScriptConfig {
  const version = process.env.VERSION

  if (!version) {
    throw new Error('VERSION environment variable is required')
  }

  return {
    currentManifestPath:
      process.env.CURRENT_MANIFEST || './icons.json', // 优先使用 icons.json
    previousManifestPath: process.env.PREVIOUS_MANIFEST,
    changelogPath: process.env.CHANGELOG_PATH || './CHANGELOG.md',
    version,
    message: process.env.MESSAGE || 'Icon library update',
  }
}

/**
 * Loads a manifest file and normalizes it to IconManifest type
 */
async function loadManifest(
  manifestPath: string
): Promise<IconManifest | null> {
  try {
    const content = await fs.readFile(manifestPath, 'utf-8')
    const data = JSON.parse(content)
    
    // 如果是 icons.json 格式 (包含 componentPath)，转换为 IconManifest 格式
    if (data.icons && data.icons.length > 0 && data.icons[0].componentPath) {
      return {
        version: data.version,
        generatedAt: data.generatedAt,
        totalCount: data.totalCount,
        icons: data.icons.map((icon: any) => ({
          id: icon.originalName, // 使用原始名称作为 ID
          name: icon.originalName,
          originalName: icon.originalName,
          normalizedName: icon.name,
          width: icon.size?.width || 24,
          height: icon.size?.height || 24
        }))
      }
    }
    
    return data as IconManifest
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
}

/**
 * Loads existing changelog content
 */
async function loadChangelog(changelogPath: string): Promise<string | null> {
  try {
    return await fs.readFile(changelogPath, 'utf-8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
}

/**
 * Creates an empty manifest for comparison
 */
function createEmptyManifest(): IconManifest {
  return {
    version: '0.0.0',
    generatedAt: new Date().toISOString(),
    totalCount: 0,
    icons: [],
  }
}

/**
 * Main script execution
 */
async function main(): Promise<void> {
  console.log('📝 Generate Changelog')
  console.log('=====================\n')

  // Load configuration
  let config: ScriptConfig
  try {
    config = loadConfig()
    console.log(`📄 Current Manifest: ${config.currentManifestPath}`)
    if (config.previousManifestPath) {
      console.log(`📄 Previous Manifest: ${config.previousManifestPath}`)
    }
    console.log(`📄 Changelog Path: ${config.changelogPath}`)
    console.log(`🏷️  Version: ${config.version}`)
    console.log(`💬 Message: ${config.message}`)
    console.log('')
  } catch (error) {
    console.error(
      '❌ Configuration Error:',
      error instanceof Error ? error.message : error
    )
    process.exit(1)
  }

  // Load current manifest
  console.log('📥 Loading current manifest...')
  const currentManifest = await loadManifest(config.currentManifestPath)

  if (!currentManifest) {
    console.error(
      `❌ Current manifest not found: ${config.currentManifestPath}`
    )
    process.exit(1)
  }

  console.log(`   ✅ Loaded ${currentManifest.totalCount} icons\n`)

  // Load previous manifest (or create empty one)
  let previousManifest: IconManifest

  if (config.previousManifestPath) {
    console.log('📥 Loading previous manifest...')
    const loaded = await loadManifest(config.previousManifestPath)
    if (loaded) {
      previousManifest = loaded
      console.log(`   ✅ Loaded ${previousManifest.totalCount} icons\n`)
    } else {
      console.log(
        '   ⚠️  Previous manifest not found, treating as initial release\n'
      )
      previousManifest = createEmptyManifest()
    }
  } else {
    console.log(
      'ℹ️  No previous manifest specified, treating as initial release\n'
    )
    previousManifest = createEmptyManifest()
  }

  // Compute diff
  console.log('🔄 Computing changes...')
  const diff = computeIconDiff(currentManifest, previousManifest)

  console.log(`   Added: ${diff.added.length}`)
  console.log(`   Modified: ${diff.modified.length}`)
  console.log(`   Removed: ${diff.removed.length}`)
  console.log('')

  // Show version suggestion
  const suggestion = suggestVersionBump(diff)
  console.log(
    `💡 Version Suggestion: ${suggestion.bumpType} (${suggestion.reason})`
  )
  console.log('')

  // Check if there are any changes
  if (!hasChanges(diff)) {
    console.log('ℹ️  No changes detected. Changelog will not be updated.')
    process.exit(0)
  }

  // Generate changelog entry
  console.log('📝 Generating changelog entry...')
  const changelogEntry = generateChangelog(currentManifest, previousManifest, {
    version: config.version,
    message: config.message,
  })

  // Load or create changelog
  let existingChangelog = await loadChangelog(config.changelogPath)

  if (!existingChangelog) {
    console.log('   Creating new CHANGELOG.md...')
    existingChangelog = createInitialChangelog('Icon Library')
  }

  // Prepend new entry
  const updatedChangelog = prependToChangelog(existingChangelog, changelogEntry)

  // Save changelog
  await fs.writeFile(config.changelogPath, updatedChangelog, 'utf-8')
  console.log(`   ✅ Changelog saved to ${config.changelogPath}\n`)

  // Print the generated entry
  console.log('📋 Generated Entry:')
  console.log('-------------------')
  console.log(changelogEntry)

  // Summary
  console.log('🎉 Changelog Generation Complete!')
  console.log('=================================')
  console.log(`   Version: ${config.version}`)
  console.log(`   Added: ${diff.added.length} icons`)
  console.log(`   Modified: ${diff.modified.length} icons`)
  console.log(`   Removed: ${diff.removed.length} icons`)
}

// Run the script
main()
