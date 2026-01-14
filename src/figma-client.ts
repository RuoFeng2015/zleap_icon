/**
 * Figma API Client
 *
 * Provides methods to interact with the Figma API for fetching files and exporting images.
 * Implements error handling and retry logic for robust API interactions.
 *
 * Requirements: 2.1, 2.5
 */

import type {
  FigmaFileResponse,
  FigmaComponent,
  FigmaNode,
  ErrorResponse,
} from './types'

/**
 * Figma API base URL
 */
const FIGMA_API_BASE = 'https://api.figma.com/v1'

/**
 * Default retry configuration
 * 针对 Figma API 限速优化：
 * - Starter/Pro 用户: Tier 1 限制 10次/分钟
 * - Organization 用户: Tier 1 限制 15次/分钟
 * - Enterprise 用户: Tier 1 限制 20次/分钟
 */
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 5,
  baseDelayMs: 2000,
  maxDelayMs: 60000, // 最长等待 60 秒
}

/**
 * Figma API error codes
 */
export enum FigmaErrorCode {
  INVALID_TOKEN = 'FIGMA_INVALID_TOKEN',
  RATE_LIMIT = 'FIGMA_RATE_LIMIT',
  FILE_NOT_FOUND = 'FIGMA_FILE_NOT_FOUND',
  NETWORK_ERROR = 'FIGMA_NETWORK_ERROR',
  UNKNOWN_ERROR = 'FIGMA_UNKNOWN_ERROR',
}

/**
 * Custom error class for Figma API errors
 */
export class FigmaApiError extends Error {
  constructor(
    public code: FigmaErrorCode,
    message: string,
    public recoverable: boolean = false,
    public suggestion?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'FigmaApiError'
  }

  toErrorResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      recoverable: this.recoverable,
      suggestion: this.suggestion,
      details: this.details,
    }
  }
}

/**
 * Retry configuration options
 */
export interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

/**
 * Image export options for Figma API
 */
export interface ImageExportOptions {
  format: 'svg' | 'png' | 'jpg' | 'pdf'
  scale?: number
  svgIncludeId?: boolean
  svgSimplifyStroke?: boolean
}

/**
 * Response from Figma images API
 */
export interface FigmaImagesResponse {
  err: string | null
  images: Record<string, string>
}

/**
 * Figma API Client class
 */
export class FigmaClient {
  private token: string
  private retryConfig: RetryConfig

  constructor(token: string, retryConfig: Partial<RetryConfig> = {}) {
    if (!token) {
      throw new FigmaApiError(
        FigmaErrorCode.INVALID_TOKEN,
        'Figma API token is required',
        false,
        'Please provide a valid Figma Personal Access Token'
      )
    }
    this.token = token
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
  }

  /**
   * Makes an authenticated request to the Figma API with retry logic
   * Properly handles Retry-After header for rate limiting
   */
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    let lastError: Error | null = null
    let delay = this.retryConfig.baseDelayMs

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'X-Figma-Token': this.token,
            ...options.headers,
          },
        })

        if (response.ok) {
          return (await response.json()) as T
        }

        // Handle rate limiting with Retry-After header
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          if (retryAfter) {
            // Retry-After is in seconds, convert to ms and add buffer
            const waitTime = (parseInt(retryAfter, 10) + 1) * 1000
            console.log(`⏳ 限速中，等待 ${retryAfter} 秒后重试...`)
            await this.sleep(waitTime)
            // Don't count this as an attempt since we're respecting the server's request
            attempt--
            continue
          }
        }

        // Handle specific HTTP errors
        const errorBody = await response.text()
        const error = this.handleHttpError(response.status, errorBody)

        // Don't retry non-recoverable errors
        if (!error.recoverable) {
          throw error
        }

        lastError = error
      } catch (error) {
        if (error instanceof FigmaApiError && !error.recoverable) {
          throw error
        }

        lastError =
          error instanceof Error
            ? error
            : new FigmaApiError(
                FigmaErrorCode.UNKNOWN_ERROR,
                'Unknown error occurred',
                true
              )
      }

      // Wait before retrying (exponential backoff)
      if (attempt < this.retryConfig.maxRetries) {
        console.log(
          `⏳ 重试中 (${attempt + 1}/${this.retryConfig.maxRetries})，等待 ${
            Math.min(delay, this.retryConfig.maxDelayMs) / 1000
          } 秒...`
        )
        await this.sleep(Math.min(delay, this.retryConfig.maxDelayMs))
        delay *= 2
      }
    }

    throw (
      lastError ||
      new FigmaApiError(
        FigmaErrorCode.UNKNOWN_ERROR,
        'Request failed after retries',
        false
      )
    )
  }

  /**
   * Handles HTTP error responses and converts them to FigmaApiError
   */
  private handleHttpError(status: number, body: string): FigmaApiError {
    switch (status) {
      case 401:
      case 403:
        return new FigmaApiError(
          FigmaErrorCode.INVALID_TOKEN,
          'Invalid or expired Figma API token',
          false,
          'Please check your Figma Personal Access Token and ensure it has the required permissions'
        )

      case 404:
        return new FigmaApiError(
          FigmaErrorCode.FILE_NOT_FOUND,
          'Figma file not found',
          false,
          'Please verify the file key and ensure you have access to the file',
          { responseBody: body }
        )

      case 429:
        return new FigmaApiError(
          FigmaErrorCode.RATE_LIMIT,
          'Figma API rate limit exceeded',
          true,
          'The request will be retried automatically with exponential backoff'
        )

      default:
        return new FigmaApiError(
          FigmaErrorCode.UNKNOWN_ERROR,
          `Figma API error: HTTP ${status}`,
          status >= 500, // Server errors are recoverable
          status >= 500
            ? 'Server error, retrying...'
            : 'Please check the request parameters',
          { status, responseBody: body }
        )
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Gets a Figma file by its key
   *
   * @param fileKey - The Figma file key
   * @returns The file data including document structure and components
   */
  async getFile(fileKey: string): Promise<FigmaFileResponse> {
    if (!fileKey) {
      throw new FigmaApiError(
        FigmaErrorCode.FILE_NOT_FOUND,
        'File key is required',
        false,
        'Please provide a valid Figma file key'
      )
    }

    const url = `${FIGMA_API_BASE}/files/${fileKey}`
    return this.fetchWithRetry<FigmaFileResponse>(url)
  }

  /**
   * Exports images for specified node IDs
   *
   * @param fileKey - The Figma file key
   * @param nodeIds - Array of node IDs to export
   * @param options - Export options (format, scale, etc.)
   * @returns Map of node IDs to image URLs
   */
  async getImages(
    fileKey: string,
    nodeIds: string[],
    options: ImageExportOptions = { format: 'svg' }
  ): Promise<Record<string, string>> {
    if (!fileKey) {
      throw new FigmaApiError(
        FigmaErrorCode.FILE_NOT_FOUND,
        'File key is required',
        false,
        'Please provide a valid Figma file key'
      )
    }

    if (!nodeIds || nodeIds.length === 0) {
      return {}
    }

    const params = new URLSearchParams({
      ids: nodeIds.join(','),
      format: options.format,
    })

    if (options.scale !== undefined) {
      params.set('scale', options.scale.toString())
    }

    if (options.format === 'svg') {
      if (options.svgIncludeId !== undefined) {
        params.set('svg_include_id', options.svgIncludeId.toString())
      }
      if (options.svgSimplifyStroke !== undefined) {
        params.set('svg_simplify_stroke', options.svgSimplifyStroke.toString())
      }
    }

    const url = `${FIGMA_API_BASE}/images/${fileKey}?${params.toString()}`
    const response = await this.fetchWithRetry<FigmaImagesResponse>(url)

    if (response.err) {
      throw new FigmaApiError(
        FigmaErrorCode.UNKNOWN_ERROR,
        `Failed to export images: ${response.err}`,
        false,
        'Please check the node IDs and try again'
      )
    }

    return response.images
  }

  /**
   * Downloads SVG content from a URL
   *
   * @param url - The URL to download from
   * @returns The SVG content as a string
   */
  async downloadSvg(url: string): Promise<string> {
    let lastError: Error | null = null
    let delay = this.retryConfig.baseDelayMs

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(url)

        if (response.ok) {
          return await response.text()
        }

        if (response.status >= 500) {
          lastError = new FigmaApiError(
            FigmaErrorCode.NETWORK_ERROR,
            `Failed to download SVG: HTTP ${response.status}`,
            true
          )
        } else {
          throw new FigmaApiError(
            FigmaErrorCode.NETWORK_ERROR,
            `Failed to download SVG: HTTP ${response.status}`,
            false
          )
        }
      } catch (error) {
        if (error instanceof FigmaApiError && !error.recoverable) {
          throw error
        }

        lastError =
          error instanceof Error
            ? error
            : new FigmaApiError(
                FigmaErrorCode.NETWORK_ERROR,
                'Network error while downloading SVG',
                true
              )
      }

      if (attempt < this.retryConfig.maxRetries) {
        await this.sleep(Math.min(delay, this.retryConfig.maxDelayMs))
        delay *= 2
      }
    }

    throw (
      lastError ||
      new FigmaApiError(
        FigmaErrorCode.NETWORK_ERROR,
        'Failed to download SVG after retries',
        false
      )
    )
  }
}

/**
 * Creates a new Figma client instance
 *
 * @param token - Figma Personal Access Token
 * @param retryConfig - Optional retry configuration
 * @returns A new FigmaClient instance
 */
export function createFigmaClient(
  token: string,
  retryConfig?: Partial<RetryConfig>
): FigmaClient {
  return new FigmaClient(token, retryConfig)
}
