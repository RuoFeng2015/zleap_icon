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
 * - 移除画板背景（#F5F5F5 填充的全尺寸矩形）
 * - 移除超大白色背景路径
 * - 移除空的 clipPath 和引用
 * - 保留渐变定义和多色效果
 */
function cleanSvgContent(svgString: string): string {
  let svg = svgString
  const originalLength = svg.length

  // 打印原始 SVG 片段用于调试
  console.log(`[cleanSvgContent] 原始 SVG 前 200 字符: ${svg.substring(0, 200)}`)

  // 1. 移除 #F5F5F5 背景 - 处理 rect 和 path 元素
  // 使用正则匹配包含 fill="#F5F5F5" 的 rect 或 path（紧跟在 svg 标签后的第一个元素）
  const before1 = svg.length
  // 移除 fill="#F5F5F5" 的 rect 背景（整个画板背景）
  svg = svg.replace(/<rect[^>]*fill="#F5F5F5"[^>]*\/>/gi, '')
  svg = svg.replace(/<rect[^>]*fill="#F5F5F5"[^>]*>[^<]*<\/rect>/gi, '')
  // 移除 fill="#F5F5F5" 的 path 背景
  svg = svg.replace(/<path[^>]*fill="#F5F5F5"[^>]*\/>/gi, '')
  console.log(`[cleanSvgContent] Step 1: 移除 #F5F5F5 背景, 删除 ${before1 - svg.length} 字符`)

  // 2. 移除超大尺寸的 rect 背景（如 width="1440"）
  const before2 = svg.length
  // 匹配 width 超过 500 的 rect 元素
  svg = svg.replace(/<rect[^>]*width="(\d+)"[^>]*>/gi, (match, width) => {
    const w = parseInt(width, 10)
    if (w > 500) {
      console.log(`[cleanSvgContent] 删除大尺寸 rect: ${match.substring(0, 80)}...`)
      return ''
    }
    return match
  })
  console.log(`[cleanSvgContent] Step 2: 移除大尺寸 rect, 删除 ${before2 - svg.length} 字符`)

  // 3. 移除 white 背景 path（带有负坐标或 M0 开头）
  const before3 = svg.length
  svg = svg.replace(/<path[^>]*fill="white"[^>]*\/>/gi, (match) => {
    // 检查是否是大背景路径（d 包含负数坐标或 M0）
    if (match.includes('d="M-') || match.includes('d="M0')) {
      console.log(`[cleanSvgContent] 删除白色背景: ${match.substring(0, 80)}...`)
      return ''
    }
    return match
  })
  console.log(`[cleanSvgContent] Step 3: 移除 white 背景, 删除 ${before3 - svg.length} 字符`)

  // 4. 移除空的 clipPath 定义和 clip-path 属性
  svg = svg.replace(/<clipPath\s+id="[^"]*"\s*\/>/gi, '')
  svg = svg.replace(/<clipPath\s+id="[^"]*"\s*><\/clipPath>/gi, '')
  svg = svg.replace(/\s+clip-path="url\([^)]*\)"/gi, '') // 注意：属性名是 clip-path 不是 clipPath
  svg = svg.replace(/\s+clipPath="url\([^)]*\)"/gi, '')

  // 5. 简化空的 g 标签
  svg = svg.replace(/<g\s*>\s*<\/g>/gi, '')
  
  // 6. 解包只有单个属性的 g 标签
  svg = svg.replace(/<g\s*>([^]*?)<\/g>/g, '$1')

  // 7. 移除未使用的渐变定义
  const usedGradientIds = new Set<string>()
  const gradientRefs = svg.matchAll(/(?:fill|stroke)="url\(#([^)]+)\)"/g)
  for (const match of gradientRefs) {
    usedGradientIds.add(match[1])
  }
  
  svg = svg.replace(
    /<linearGradient\s+id="([^"]+)"[^>]*>[\s\S]*?<\/linearGradient>/g,
    (match, id) => usedGradientIds.has(id) ? match : ''
  )

  // 8. 清理多余的空白
  svg = svg.replace(/>\s+</g, '><')
  svg = svg.replace(/\s{2,}/g, ' ')

  console.log(`[cleanSvgContent] 总计: ${originalLength} -> ${svg.length}, 删除 ${originalLength - svg.length} 字符`)
  console.log(`[cleanSvgContent] 清理后 SVG 前 200 字符: ${svg.substring(0, 200)}`)
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
 * 注意：当一个节点被识别为图标后，不再递归其子节点
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
    // 已识别为图标，不再递归子节点（避免将子 Frame 也识别为独立图标）
    return
  }

  // 只有非图标节点才递归处理子节点
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
      // 注意：contentsOnly: false 保留 <defs> 中的渐变定义
      // 背景元素会通过 cleanSvgContent 函数移除
      const svgData = await (node as FrameNode).exportAsync({
        format: 'SVG',
        svgIdAttribute: false,
        contentsOnly: false, // 保留渐变定义
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
