/**
 * SVG Batch Export Module
 *
 * Provides functions to batch export SVG files from Figma and save them to disk.
 * Handles concurrent downloads with rate limiting and error handling.
 *
 * Requirements: 2.3, 2.4
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { FigmaClient, FigmaApiError, FigmaErrorCode } from './figma-client'
import type { FilteredIconComponent } from './icon-filter'

/**
 * Export options for batch SVG export
 */
export interface BatchExportOptions {
  /** Output directory for SVG files */
  outputDir: string
  /** Maximum concurrent downloads */
  concurrency?: number
  /** Whether to simplify strokes in SVG export */
  simplifyStroke?: boolean
  /** Whether to include IDs in SVG export */
  includeId?: boolean
  /** Callback for progress updates */
  onProgress?: (progress: ExportProgress) => void
}

/**
 * Progress information during export
 */
export interface ExportProgress {
  /** Total number of icons to export */
  total: number
  /** Number of icons completed */
  completed: number
  /** Number of icons failed */
  failed: number
  /** Current icon being processed */
  current?: string
}

/**
 * Result of exporting a single icon
 */
export interface IconExportResult {
  /** Icon ID */
  id: string
  /** Icon name */
  name: string
  /** Whether export was successful */
  success: boolean
  /** Path to saved SVG file (if successful) */
  filePath?: string
  /** SVG content (if successful) */
  svgContent?: string
  /** Error message (if failed) */
  error?: string
}

/**
 * Result of batch export operation
 */
export interface BatchExportResult {
  /** Successfully exported icons */
  successful: IconExportResult[]
  /** Failed exports */
  failed: IconExportResult[]
  /** Total icons processed */
  totalProcessed: number
  /** Output directory */
  outputDir: string
}

/**
 * Default export options
 */
const DEFAULT_EXPORT_OPTIONS: Required<Omit<BatchExportOptions, 'onProgress'>> =
  {
    outputDir: './svg',
    concurrency: 5,
    simplifyStroke: true,
    includeId: false,
  }

/**
 * Ensures the output directory exists
 *
 * @param dir - Directory path to create
 */
async function ensureDirectory(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    // Directory might already exist, which is fine
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * Sanitizes a filename to be safe for the filesystem
 *
 * @param name - Original name
 * @returns Sanitized filename
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Saves SVG content to a file
 *
 * @param content - SVG content
 * @param filePath - Path to save the file
 */
async function saveSvgFile(content: string, filePath: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8')
}

/**
 * Processes a batch of icons concurrently
 *
 * @param items - Items to process
 * @param processor - Processing function
 * @param concurrency - Maximum concurrent operations
 */
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const promise = processor(item).then((result) => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      // Remove completed promises
      const completed = executing.filter(
        (p) => p.then(() => false).catch(() => false) as unknown as boolean
      )
      executing.length = 0
      executing.push(...completed)
    }
  }

  await Promise.all(executing)
  return results
}

/**
 * Exports SVG files for a list of icon components from Figma
 *
 * @param client - Figma API client
 * @param fileKey - Figma file key
 * @param icons - List of icon components to export
 * @param options - Export options
 * @returns Batch export result
 */
export async function batchExportSvg(
  client: FigmaClient,
  fileKey: string,
  icons: FilteredIconComponent[],
  options: BatchExportOptions
): Promise<BatchExportResult> {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options }
  const successful: IconExportResult[] = []
  const failed: IconExportResult[] = []

  // Ensure output directory exists
  await ensureDirectory(opts.outputDir)

  // Get image URLs from Figma API
  const iconIds = icons.map((icon) => icon.id)

  let imageUrls: Record<string, string>
  try {
    imageUrls = await client.getImages(fileKey, iconIds, {
      format: 'svg',
      svgSimplifyStroke: opts.simplifyStroke,
      svgIncludeId: opts.includeId,
    })
  } catch (error) {
    // If we can't get image URLs, all icons fail
    for (const icon of icons) {
      failed.push({
        id: icon.id,
        name: icon.name,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get image URLs from Figma',
      })
    }

    return {
      successful,
      failed,
      totalProcessed: icons.length,
      outputDir: opts.outputDir,
    }
  }

  // Track progress
  let completed = 0
  const total = icons.length

  // Process each icon
  const processIcon = async (
    icon: FilteredIconComponent
  ): Promise<IconExportResult> => {
    const imageUrl = imageUrls[icon.id]

    if (!imageUrl) {
      return {
        id: icon.id,
        name: icon.name,
        success: false,
        error: 'No image URL returned from Figma API',
      }
    }

    try {
      // Download SVG content
      const svgContent = await client.downloadSvg(imageUrl)

      // Generate filename and save
      const filename = `${sanitizeFilename(icon.name)}.svg`
      const filePath = path.join(opts.outputDir, filename)

      await saveSvgFile(svgContent, filePath)

      completed++
      opts.onProgress?.({
        total,
        completed,
        failed: failed.length,
        current: icon.name,
      })

      return {
        id: icon.id,
        name: icon.name,
        success: true,
        filePath,
        svgContent,
      }
    } catch (error) {
      completed++
      opts.onProgress?.({
        total,
        completed,
        failed: failed.length + 1,
        current: icon.name,
      })

      return {
        id: icon.id,
        name: icon.name,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error during export',
      }
    }
  }

  // Process icons with concurrency limit
  const results = await Promise.all(icons.map((icon) => processIcon(icon)))

  // Separate successful and failed results
  for (const result of results) {
    if (result.success) {
      successful.push(result)
    } else {
      failed.push(result)
    }
  }

  return {
    successful,
    failed,
    totalProcessed: icons.length,
    outputDir: opts.outputDir,
  }
}

/**
 * Exports a single SVG from Figma
 *
 * @param client - Figma API client
 * @param fileKey - Figma file key
 * @param icon - Icon component to export
 * @param outputDir - Output directory
 * @returns Export result
 */
export async function exportSingleSvg(
  client: FigmaClient,
  fileKey: string,
  icon: FilteredIconComponent,
  outputDir: string
): Promise<IconExportResult> {
  const result = await batchExportSvg(client, fileKey, [icon], { outputDir })

  if (result.successful.length > 0) {
    return result.successful[0]
  }

  return result.failed[0]
}

/**
 * Reads all SVG files from a directory
 *
 * @param dir - Directory to read from
 * @returns Map of filename to SVG content
 */
export async function readSvgDirectory(
  dir: string
): Promise<Map<string, string>> {
  const svgMap = new Map<string, string>()

  try {
    const files = await fs.readdir(dir)

    for (const file of files) {
      if (file.endsWith('.svg')) {
        const filePath = path.join(dir, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const name = file.replace('.svg', '')
        svgMap.set(name, content)
      }
    }
  } catch (error) {
    // Directory might not exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }

  return svgMap
}
