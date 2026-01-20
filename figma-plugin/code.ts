/// <reference types="@figma/plugin-typings" />

/**
 * Figma Plugin Main Code - zleap-icon
 *
 * 支持选区同步：只同步选中区域内的图标
 * 直接导出 SVG 内容，避免 Figma API 限速问题
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

interface IconWithSvg extends IconInfo {
  svg: string
}

interface SyncRequest {
  version: string
  message: string
  timestamp: string
  icons: IconWithSvg[] // 包含 SVG 内容的图标列表
  syncMode?: string // 同步模式：'incremental' 或 'replace'
}

interface MessageToUI {
  type:
    | 'config-loaded'
    | 'icons-loaded'
    | 'sync-result'
    | 'error'
    | 'selection-changed'
    | 'export-progress'
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
const UI_HEIGHT = 550

// ============================================
// SVG Cleanup Utilities
// ============================================

/**
 * 清理 Figma 导出的 SVG 中的问题元素
 * - 移除超大背景路径（设计稿背景泄漏）
 * - 移除空的 clipPath 定义
 * - 移除不必要的白色/灰色背景矩形
 */
function cleanSvgContent(svgString: string): string {
  let svg = svgString

  // 移除超大尺寸的背景路径 (如 d="M0 0h120v120H0z" 且 fill="#F5F5F5")
  // 这些通常是 Figma 画板的背景
  svg = svg.replace(
    /<path\s+fill="(#F5F5F5|#f5f5f5|white|#fff|#ffffff)"\s+d="M0\s+0h\d+v\d+H0z"\s*\/>/gi,
    ''
  )

  // 移除超大负偏移的背景路径 (如 d="M-878-463H562V561H-878z")
  svg = svg.replace(
    /<path\s+fill="(white|#fff|#ffffff)"\s+d="M-?\d+-?\d+H-?\d+V-?\d+H-?\d+z"\s*\/>/gi,
    ''
  )

  // 移除空的 clipPath 定义
  svg = svg.replace(/<clipPath\s+id="[^"]*"\s*\/>/gi, '')
  svg = svg.replace(/<clipPath\s+id="[^"]*"\s*><\/clipPath>/gi, '')

  // 移除引用空 clipPath 的 g 元素的 clipPath 属性
  // 但保留 g 元素本身和其内容
  svg = svg.replace(/\s+clipPath="url\(#[^)]*\)"/gi, (match) => {
    // 检查该 clipPath 是否为空（已被上面的规则移除）
    // 简单起见，移除所有对空 clipPath 的引用
    return ''
  })

  // 清理多余的空白
  svg = svg.replace(/>\s+</g, '><')
  svg = svg.replace(/\s{2,}/g, ' ')

  return svg.trim()
}

// ============================================
// State
// ============================================

let currentIcons: IconInfo[] = []

// ============================================
// Plugin Initialization
// ============================================

figma.showUI(__html__, {
  width: UI_WIDTH,
  height: UI_HEIGHT,
  title: 'zleap-icon 图标同步',
})

// ============================================
// Selection Change Handler
// ============================================

figma.on('selectionchange', () => {
  updateIconsFromSelection()
})

/**
 * 根据当前选区更新图标列表
 */
function updateIconsFromSelection(): void {
  const selection = figma.currentPage.selection

  if (selection.length === 0) {
    // 没有选中任何内容，显示当前页面所有图标
    currentIcons = findIconsInNodes([figma.currentPage])
  } else {
    // 在选中的节点中查找图标
    currentIcons = findIconsInNodes(selection)
  }

  sendToUI({
    type: 'selection-changed',
    payload: {
      icons: currentIcons,
      totalCount: currentIcons.length,
      hasSelection: selection.length > 0,
      selectionName:
        selection.length === 1
          ? selection[0].name
          : selection.length > 1
          ? `${selection.length} 个选中项`
          : '整个页面',
    },
  })
}

/**
 * 在指定节点中查找图标
 */
function findIconsInNodes(
  nodes: readonly SceneNode[] | readonly PageNode[],
): IconInfo[] {
  const icons: IconInfo[] = []

  for (const node of nodes) {
    traverseNode(node, icons)
  }

  // 按名称排序
  icons.sort((a, b) => a.name.localeCompare(b.name))
  return icons
}

/**
 * 递归遍历节点查找图标
 */
function traverseNode(node: SceneNode | PageNode, icons: IconInfo[]): void {
  // 检查是否是图标（COMPONENT 或 FRAME 类型，合适的尺寸）
  if (isIconNode(node)) {
    icons.push({
      id: node.id,
      name: node.name,
      width: Math.round((node as FrameNode).width),
      height: Math.round((node as FrameNode).height),
    })
  }

  // 递归处理子节点
  if ('children' in node) {
    for (const child of node.children) {
      traverseNode(child as SceneNode, icons)
    }
  }
}

/**
 * 判断节点是否是图标
 */
function isIconNode(node: SceneNode | PageNode): boolean {
  if (node.type !== 'COMPONENT' && node.type !== 'FRAME') {
    return false
  }

  const frameNode = node as FrameNode
  const width = Math.round(frameNode.width)
  const height = Math.round(frameNode.height)

  // 尺寸在 8-256 之间
  if (width < 8 || width > 256 || height < 8 || height > 256) {
    return false
  }

  // 宽高比在 0.5-2 之间（大致正方形）
  const aspectRatio = width / height
  if (aspectRatio < 0.5 || aspectRatio > 2) {
    return false
  }

  // 对于 FRAME，检查是否包含矢量内容
  if (node.type === 'FRAME') {
    const hasVectorContent = frameNode.findOne(
      (child) =>
        child.type === 'VECTOR' ||
        child.type === 'BOOLEAN_OPERATION' ||
        child.type === 'LINE' ||
        child.type === 'ELLIPSE' ||
        child.type === 'RECTANGLE' ||
        child.type === 'POLYGON' ||
        child.type === 'STAR' ||
        child.type === 'GROUP',
    )
    if (!hasVectorContent) {
      return false
    }
  }

  return true
}

// ============================================
// SVG Export
// ============================================

/**
 * 导出图标为 SVG
 */
async function exportIconsToSvg(icons: IconInfo[]): Promise<IconWithSvg[]> {
  const results: IconWithSvg[] = []
  const total = icons.length

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i]
    // 使用异步版本获取节点
    const node = (await figma.getNodeByIdAsync(icon.id)) as SceneNode

    if (!node) {
      console.warn(`节点 ${icon.id} 不存在，跳过`)
      continue
    }

    try {
      // 使用 Figma 内置的 exportAsync 导出 SVG
      const svgData = await (node as FrameNode).exportAsync({
        format: 'SVG',
        svgIdAttribute: false,
        // 只导出内容，不包含容器背景
        contentsOnly: true,
      })

      // 将 Uint8Array 转换为字符串
      let svgString = String.fromCharCode.apply(null, Array.from(svgData))
      
      // 清理 SVG 中的问题元素
      svgString = cleanSvgContent(svgString)

      results.push({
        ...icon,
        svg: svgString,
      })

      // 发送进度更新
      sendToUI({
        type: 'export-progress',
        payload: {
          current: i + 1,
          total: total,
          currentName: icon.name,
        },
      })
    } catch (error) {
      console.error(`导出图标 ${icon.name} 失败:`, error)
    }
  }

  return results
}

// ============================================
// Message Handlers
// ============================================

figma.ui.onmessage = async (msg: MessageFromUI) => {
  try {
    switch (msg.type) {
      case 'load-config':
        await handleLoadConfig()
        // 初始化时也更新图标列表
        updateIconsFromSelection()
        break
      case 'save-config':
        await handleSaveConfig(msg.payload as PluginConfig)
        break
      case 'get-icons':
        await handleGetIcons()
        break
      case 'trigger-sync':
        await handleTriggerSync(
          msg.payload as { version: string; message: string },
        )
        break
      default:
        console.warn('Unknown message type:', msg.type)
    }
  } catch (error) {
    sendToUI({
      type: 'error',
      payload: {
        message: error instanceof Error ? error.message : '发生未知错误',
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
  if (!config.githubRepo || !config.githubToken) {
    throw new Error('请填写 GitHub 仓库地址和 Token')
  }

  // 从完整 URL 提取 org/repo
  let repoPath = config.githubRepo.trim()
  const urlMatch = repoPath.match(
    /github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/.*)?$/,
  )
  if (urlMatch) {
    repoPath = urlMatch[1]
  }
  repoPath = repoPath.replace(/\/+$/, '')

  if (!/^[\w.-]+\/[\w.-]+$/.test(repoPath)) {
    throw new Error(
      '仓库地址格式错误，请使用 "用户名/仓库名" 格式或完整的 GitHub URL',
    )
  }

  config.githubRepo = repoPath

  const configToStore = {
    githubRepo: config.githubRepo,
    githubToken: config.githubToken,
    defaultBranch: config.defaultBranch || 'main',
    figmaFileKey: config.figmaFileKey || getFileKey(),
  }

  await figma.clientStorage.setAsync(CONFIG_KEY, configToStore)

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
  // 加载所有页面（新版 Figma 需要）
  await figma.loadAllPagesAsync()

  // 更新图标列表
  updateIconsFromSelection()

  sendToUI({
    type: 'icons-loaded',
    payload: {
      icons: currentIcons,
      totalCount: currentIcons.length,
    },
  })
}

// ============================================
// Sync Trigger
// ============================================

async function handleTriggerSync(params: {
  version: string
  message: string
  syncMode?: string
}): Promise<void> {
  const savedConfig = await figma.clientStorage.getAsync(CONFIG_KEY)

  if (!savedConfig || !savedConfig.githubRepo || !savedConfig.githubToken) {
    throw new Error('插件未配置，请先填写 GitHub 仓库地址和 Token')
  }

  if (currentIcons.length === 0) {
    throw new Error('没有找到可同步的图标，请选择包含图标的区域')
  }

  // 直接在插件中导出 SVG
  sendToUI({
    type: 'export-progress',
    payload: {
      current: 0,
      total: currentIcons.length,
      currentName: '准备导出...',
    },
  })

  const iconsWithSvg = await exportIconsToSvg(currentIcons)

  if (iconsWithSvg.length === 0) {
    throw new Error('导出 SVG 失败，没有成功导出任何图标')
  }

  const syncRequest: SyncRequest = {
    version: params.version,
    message: params.message,
    timestamp: new Date().toISOString(),
    icons: iconsWithSvg,
    syncMode: params.syncMode || 'incremental',
  }

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
  if (figma.fileKey) {
    return figma.fileKey
  }
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
