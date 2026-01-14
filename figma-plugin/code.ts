/// <reference types="@figma/plugin-typings" />

/**
 * Figma Plugin Main Code
 *
 * This file runs in Figma's sandbox environment and handles:
 * - Plugin initialization
 * - Communication with the UI
 * - Figma document access
 * - Configuration storage
 */

// ============================================
// Types
// ============================================

interface PluginConfig {
  githubRepo: string
  githubToken: string
  figmaFileKey: string
  defaultBranch: string
}

interface IconInfo {
  id: string
  name: string
  width: number
  height: number
}

interface SyncRequest {
  version: string
  message: string
  fileKey: string
  timestamp: string
}

interface MessageToUI {
  type: 'config-loaded' | 'icons-loaded' | 'sync-result' | 'error'
  payload: unknown
}

interface MessageFromUI {
  type: 'save-config' | 'load-config' | 'get-icons' | 'trigger-sync'
  payload?: unknown
}

// ============================================
// Constants
// ============================================

const CONFIG_KEY = 'icon-sync-config'
const UI_WIDTH = 400
const UI_HEIGHT = 500

// ============================================
// Plugin Initialization
// ============================================

figma.showUI(__html__, {
  width: UI_WIDTH,
  height: UI_HEIGHT,
  title: 'Icon Sync to GitHub',
})

// ============================================
// Message Handlers
// ============================================

figma.ui.onmessage = async (msg: MessageFromUI) => {
  try {
    switch (msg.type) {
      case 'load-config':
        await handleLoadConfig()
        break
      case 'save-config':
        await handleSaveConfig(msg.payload as PluginConfig)
        break
      case 'get-icons':
        await handleGetIcons()
        break
      case 'trigger-sync':
        await handleTriggerSync(
          msg.payload as { version: string; message: string }
        )
        break
      default:
        console.warn('Unknown message type:', msg.type)
    }
  } catch (error) {
    sendToUI({
      type: 'error',
      payload: {
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
    })
  }
}

// ============================================
// Config Management
// ============================================

async function handleLoadConfig(): Promise<void> {
  const savedConfig = await figma.clientStorage.getAsync(CONFIG_KEY)
  const autoFileKey = getFileKey()

  const config: PluginConfig = savedConfig
    ? {
        githubRepo: savedConfig.githubRepo || '',
        githubToken: savedConfig.githubToken || '',
        figmaFileKey: savedConfig.figmaFileKey || autoFileKey,
        defaultBranch: savedConfig.defaultBranch || 'main',
      }
    : {
        githubRepo: '',
        githubToken: '',
        figmaFileKey: autoFileKey !== 'auto-detect-on-sync' ? autoFileKey : '',
        defaultBranch: 'main',
      }

  sendToUI({
    type: 'config-loaded',
    payload: config,
  })
}

async function handleSaveConfig(config: PluginConfig): Promise<void> {
  // Validate required fields
  if (!config.githubRepo || !config.githubToken) {
    throw new Error('GitHub repository and token are required')
  }

  // Extract org/repo from full URL if provided
  let repoPath = config.githubRepo.trim()

  // Handle full GitHub URLs
  const urlMatch = repoPath.match(
    /github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/.*)?$/
  )
  if (urlMatch) {
    repoPath = urlMatch[1]
  }

  // Remove trailing slashes
  repoPath = repoPath.replace(/\/+$/, '')

  // Validate repository format (org/repo)
  if (!/^[\w.-]+\/[\w.-]+$/.test(repoPath)) {
    throw new Error(
      'Repository must be in format "org/repo" or a valid GitHub URL'
    )
  }

  // Update config with normalized repo path
  config.githubRepo = repoPath

  // Store the config including token and file key
  const configToStore = {
    githubRepo: config.githubRepo,
    githubToken: config.githubToken,
    defaultBranch: config.defaultBranch || 'main',
    figmaFileKey: config.figmaFileKey || getFileKey(),
  }

  await figma.clientStorage.setAsync(CONFIG_KEY, configToStore)

  // Send back the full config to UI so it knows configuration is complete
  sendToUI({
    type: 'config-loaded',
    payload: {
      githubRepo: configToStore.githubRepo,
      githubToken: configToStore.githubToken,
      defaultBranch: configToStore.defaultBranch,
      figmaFileKey: configToStore.figmaFileKey,
    },
  })
}

// ============================================
// Icon Discovery
// ============================================

async function handleGetIcons(): Promise<void> {
  // Load all pages first (required for findAllWithCriteria in newer Figma versions)
  await figma.loadAllPagesAsync()

  const icons = findIconComponents()

  sendToUI({
    type: 'icons-loaded',
    payload: {
      icons,
      totalCount: icons.length,
    },
  })
}

/**
 * Find all icon components in the current Figma file
 * Supports:
 * - COMPONENT type nodes
 * - FRAME type nodes (imported SVGs are often frames)
 * - Filters by reasonable icon sizes
 */
function findIconComponents(): IconInfo[] {
  const icons: IconInfo[] = []

  // Find both components and frames (SVGs are imported as frames)
  const nodes = figma.root.findAllWithCriteria({
    types: ['COMPONENT', 'FRAME'],
  })

  for (const node of nodes) {
    const width = Math.round(node.width)
    const height = Math.round(node.height)

    // Filter by reasonable icon size (between 8 and 256 pixels)
    if (width >= 8 && width <= 256 && height >= 8 && height <= 256) {
      // Check aspect ratio - icons are usually square or close to it
      const aspectRatio = width / height
      if (aspectRatio >= 0.5 && aspectRatio <= 2) {
        // For frames, check if they contain vector content (likely SVG)
        if (node.type === 'FRAME') {
          const hasVectorContent = node.findOne(
            (child) =>
              child.type === 'VECTOR' ||
              child.type === 'BOOLEAN_OPERATION' ||
              child.type === 'LINE' ||
              child.type === 'ELLIPSE' ||
              child.type === 'RECTANGLE' ||
              child.type === 'POLYGON' ||
              child.type === 'STAR' ||
              child.type === 'GROUP'
          )
          if (!hasVectorContent) continue
        }

        icons.push({
          id: node.id,
          name: node.name,
          width,
          height,
        })
      }
    }
  }

  // Sort icons alphabetically by name
  icons.sort((a, b) => a.name.localeCompare(b.name))

  return icons
}

/**
 * Determine if a component is an icon based on naming conventions
 * (Kept for reference but not used in current implementation)
 */
function isIconComponent(component: ComponentNode): boolean {
  const name = component.name.toLowerCase()

  // Check component name patterns
  if (
    name.includes('icon') ||
    name.startsWith('ic-') ||
    name.startsWith('ic_') ||
    name.startsWith('ic/')
  ) {
    return true
  }

  // Check if component is inside an "icons" frame or page
  let parent = component.parent
  while (parent) {
    if (parent.type === 'FRAME' || parent.type === 'PAGE') {
      const parentName = parent.name.toLowerCase()
      if (parentName === 'icons' || parentName.includes('icon')) {
        return true
      }
    }
    parent = parent.parent
  }

  return false
}

// ============================================
// Sync Trigger
// ============================================

async function handleTriggerSync(params: {
  version: string
  message: string
}): Promise<void> {
  const savedConfig = await figma.clientStorage.getAsync(CONFIG_KEY)

  if (!savedConfig || !savedConfig.githubRepo || !savedConfig.githubToken) {
    throw new Error(
      'Plugin not configured. Please enter GitHub repository and token.'
    )
  }

  if (
    !savedConfig.figmaFileKey ||
    savedConfig.figmaFileKey === 'auto-detect-on-sync'
  ) {
    throw new Error('Figma File Key is required. Please enter it in Settings.')
  }

  const syncRequest: SyncRequest = {
    version: params.version,
    message: params.message,
    fileKey: savedConfig.figmaFileKey,
    timestamp: new Date().toISOString(),
  }

  // The actual GitHub API call will be made from the UI
  // because Figma's sandbox has limited network access
  sendToUI({
    type: 'sync-result',
    payload: {
      action: 'trigger-github',
      config: {
        githubRepo: savedConfig.githubRepo,
        githubToken: savedConfig.githubToken,
      },
      syncRequest,
    },
  })
}

// ============================================
// Utility Functions
// ============================================

function getFileKey(): string {
  // Extract file key from the current document
  // figma.fileKey is available in Figma desktop app
  // It may be null in some contexts (e.g., when file is not saved)

  if (figma.fileKey) {
    return figma.fileKey
  }

  // Try to get from root name as fallback (not ideal but better than unknown)
  // The file key is typically in the URL: figma.com/file/{fileKey}/...
  return 'auto-detect-on-sync'
}

function sendToUI(message: MessageToUI): void {
  figma.ui.postMessage(message)
}

// ============================================
// Plugin Close Handler
// ============================================

figma.on('close', () => {
  // Cleanup if needed
})
