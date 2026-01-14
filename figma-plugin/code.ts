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
  const fileKey = getFileKey()

  const config: PluginConfig = savedConfig
    ? {
        ...savedConfig,
        figmaFileKey: fileKey,
      }
    : {
        githubRepo: '',
        githubToken: '',
        figmaFileKey: fileKey,
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

  // Validate repository format (org/repo)
  if (!/^[\w.-]+\/[\w.-]+$/.test(config.githubRepo)) {
    throw new Error('Repository must be in format "org/repo"')
  }

  // Don't store the file key as it's auto-detected
  const configToStore = {
    githubRepo: config.githubRepo,
    githubToken: config.githubToken,
    defaultBranch: config.defaultBranch || 'main',
  }

  await figma.clientStorage.setAsync(CONFIG_KEY, configToStore)

  sendToUI({
    type: 'config-loaded',
    payload: {
      ...configToStore,
      figmaFileKey: getFileKey(),
    },
  })
}

// ============================================
// Icon Discovery
// ============================================

async function handleGetIcons(): Promise<void> {
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
 * Icons are identified by:
 * - Components with "icon" in the name (case-insensitive)
 * - Components starting with "ic-" or "ic_"
 * - Components in frames/pages named "Icons" or "icons"
 */
function findIconComponents(): IconInfo[] {
  const icons: IconInfo[] = []
  const components = figma.root.findAllWithCriteria({
    types: ['COMPONENT'],
  })

  for (const component of components) {
    if (isIconComponent(component)) {
      icons.push({
        id: component.id,
        name: component.name,
        width: Math.round(component.width),
        height: Math.round(component.height),
      })
    }
  }

  // Sort icons alphabetically by name
  icons.sort((a, b) => a.name.localeCompare(b.name))

  return icons
}

/**
 * Determine if a component is an icon based on naming conventions
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

  const syncRequest: SyncRequest = {
    version: params.version,
    message: params.message,
    fileKey: getFileKey(),
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
  // In Figma, the file key is part of the document URL
  // Format: https://www.figma.com/file/{fileKey}/{fileName}
  // We can get it from figma.fileKey if available
  return figma.fileKey || 'unknown'
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
