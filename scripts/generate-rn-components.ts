#!/usr/bin/env npx tsx

import * as fs from 'fs/promises'
import * as path from 'path'
import { pinyin } from 'pinyin-pro'
import { generateReactNativeComponent, generateReactNativeIndex } from '../src/rn-component-generator'
import type { IconMetadata, ComponentTemplate } from '../src/types'

interface ScriptConfig {
  svgDir: string
  outputDir: string
  indexPath: string
}

function chineseToPinyin(text: string): string {
  return pinyin(text, {
    toneType: 'none',
    type: 'array',
  }).join('-')
}

function getIconNameFromFile(fileName: string): string {
  const nameWithoutExt = fileName.replace(/\.svg$/i, '')
  const hasChinese = /[\u4e00-\u9fa5]/.test(nameWithoutExt)
  if (!hasChinese) return nameWithoutExt
  return chineseToPinyin(nameWithoutExt).toLowerCase().replace(/[^a-z0-9-]/g, '-')
}

function loadConfig(): ScriptConfig {
  return {
    svgDir: process.env.SVG_DIR || './svg',
    outputDir: process.env.RN_OUTPUT_DIR || './react-native/icons',
    indexPath: process.env.RN_INDEX_PATH || './react-native/index.ts',
  }
}

async function ensureDirectory(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

async function getSvgFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir)
    return files.filter((f) => f.toLowerCase().endsWith('.svg'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

function toPascalCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_\s]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

async function readIconMetadata(svgPath: string): Promise<IconMetadata> {
  const fileName = path.basename(svgPath)
  const originalName = fileName.replace(/\.svg$/i, '')
  const name = getIconNameFromFile(fileName)
  const normalizedName = `Icon${toPascalCase(name)}`
  const svgContent = await fs.readFile(svgPath, 'utf-8')

  return {
    id: name,
    name,
    originalName,
    normalizedName,
    width: 24,
    height: 24,
    svgContent,
  }
}

async function main(): Promise<void> {
  console.log('📱 Generate React Native Components')
  console.log('===================================\n')

  const config = loadConfig()
  console.log(`📂 SVG Directory: ${config.svgDir}`)
  console.log(`📂 RN Output Directory: ${config.outputDir}`)
  console.log(`📄 RN Index Path: ${config.indexPath}\n`)

  const files = await getSvgFiles(config.svgDir)
  if (files.length === 0) {
    console.log('⚠️  No SVG files found.')
    process.exit(0)
  }

  await ensureDirectory(config.outputDir)
  await ensureDirectory(path.dirname(config.indexPath))

  const components: ComponentTemplate[] = []
  for (const file of files) {
    const icon = await readIconMetadata(path.join(config.svgDir, file))
    const component = generateReactNativeComponent(icon)
    components.push(component)
    await fs.writeFile(path.join(config.outputDir, component.fileName), component.content, 'utf-8')
    console.log(`   ✅ ${component.componentName}`)
  }

  const indexContent = generateReactNativeIndex(components)
  await fs.writeFile(config.indexPath, indexContent, 'utf-8')

  console.log('\n🎉 React Native components generated successfully!')
  console.log(`   Components: ${components.length}`)
  console.log(`   Output: ${config.outputDir}`)
  console.log(`   Index: ${config.indexPath}`)
}

main()
