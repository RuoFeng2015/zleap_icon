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
 * - 移除画板背景（#F5F5F5、#1E1E1E 等常见背景色填充的全尺寸矩形）
 * - 移除超大白色背景路径
 * - 移除覆盖整个 viewBox 的纯色背景路径
 * - 移除空的 clipPath 和引用
 * - 保留渐变定义和多色效果
 */
function cleanSvgContent(svgString: string): string {
  let svg = svgString
  const originalLength = svg.length

  // 打印原始 SVG 片段用于调试
  console.log(`[cleanSvgContent] 原始 SVG 前 200 字符: ${svg.substring(0, 200)}`)

  // 0. 先提取 viewBox 尺寸，用于后续判断背景路径
  const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/)
  const vbWidth = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 0
  const vbHeight = viewBoxMatch ? parseInt(viewBoxMatch[2], 10) : 0
  console.log(`[cleanSvgContent] ViewBox 尺寸: ${vbWidth} x ${vbHeight}`)

  // 1. 移除常见背景色填充的 rect 和 path 元素
  // 包括 #F5F5F5（浅灰）、#1E1E1E（Figma 深色主题背景）、#FFFFFF（白色）
  const before1 = svg.length
  const bgColors = ['#F5F5F5', '#1E1E1E', '#FFFFFF', '#ffffff', '#1e1e1e', '#f5f5f5']
  for (const color of bgColors) {
    svg = svg.replace(new RegExp(`<rect[^>]*fill="${color}"[^>]*\\/>`, 'gi'), '')
    svg = svg.replace(new RegExp(`<rect[^>]*fill="${color}"[^>]*>[^<]*<\\/rect>`, 'gi'), '')
    svg = svg.replace(new RegExp(`<path[^>]*fill="${color}"[^>]*\\/>`, 'gi'), '')
  }
  console.log(`[cleanSvgContent] Step 1: 移除常见背景色, 删除 ${before1 - svg.length} 字符`)

  // 2. 移除覆盖整个 viewBox 的背景路径（格式如 M0 0h24v24H0z）
  // 这种路径会创建一个与图标大小完全相同的背景矩形
  const before2 = svg.length
  if (vbWidth > 0 && vbHeight > 0) {
    // 匹配 d="M0 0h{width}v{height}H0z" 或类似变体
    const bgPathPattern = new RegExp(
      `<path[^>]*d="M0\\s*0\\s*[hH]${vbWidth}\\s*[vV]${vbHeight}\\s*[hH]0\\s*[zZ]?"[^>]*\\/>`,
      'gi'
    )
    svg = svg.replace(bgPathPattern, (match) => {
      console.log(`[cleanSvgContent] 删除 viewBox 背景路径: ${match.substring(0, 80)}...`)
      return ''
    })
    // 也处理 d 在其他位置的情况
    svg = svg.replace(
      new RegExp(`<path[^>]*d="M0\\s*0\\s*h${vbWidth}v${vbHeight}H0z?"[^>]*\\/>`, 'gi'),
      ''
    )
  }
  console.log(`[cleanSvgContent] Step 2: 移除 viewBox 背景路径, 删除 ${before2 - svg.length} 字符`)

  // 3. 移除超大尺寸的 rect 背景或白色背景 rect
  const before3 = svg.length
  // 匹配所有 rect 元素（包括自闭合 /> 和非自闭合 >）
  svg = svg.replace(/<rect[^>]*(?:\/>|>[^<]*<\/rect>)/gi, (match) => {
    // 检查是否是白色填充
    const isWhiteFill = /fill=["']white["']/i.test(match)
    // 检查是否有超大尺寸
    const widthMatch = match.match(/width=["']([^"']+)["']/)
    const width = widthMatch ? parseFloat(widthMatch[1]) : 0
    // 检查是否有负坐标（页面级背景特征）
    const hasNegativeCoord = /[xy]=["']-/.test(match)
    
    // 移除条件: 白色填充 + (超大尺寸 或 负坐标)
    if (isWhiteFill && (width > 100 || hasNegativeCoord)) {
      console.log(`[cleanSvgContent] 删除白色背景 rect: ${match.substring(0, 100)}...`)
      return ''
    }
    // 移除条件: 任何填充 + 超大尺寸 (> 500)
    if (width > 500) {
      console.log(`[cleanSvgContent] 删除大尺寸 rect: ${match.substring(0, 80)}...`)
      return ''
    }
    return match
  })
  console.log(`[cleanSvgContent] Step 3: 移除大尺寸/白色背景 rect, 删除 ${before3 - svg.length} 字符`)

  // 4. 移除 white 背景 path（带有负坐标、M0 开头、或超大尺寸）
  const before4 = svg.length
  svg = svg.replace(/<path[^>]*fill=["']white["'][^>]*\/>/gi, (match) => {
    // 提取 d 属性的值
    const dMatch = match.match(/d=["']([^"']+)["']/)
    const dValue = dMatch ? dMatch[1] : ''
    
    // 检查是否是大背景路径
    const isBackground = 
      // d 包含负数坐标（M后跟负数，如 M-162.854 或 M -100）
      /M\s*-?\d/.test(dValue) && dValue.includes('-') ||
      // d 以 M0 开头（全覆盖背景）
      /^M\s*0/.test(dValue) ||
      // 路径尺寸超大（h/v 命令后跟 3 位数以上的数字）
      /[hHvV]-?\d{3,}/.test(dValue) ||
      // 路径包含负数坐标
      /[Mm]\s*-\d/.test(dValue)
    
    if (isBackground) {
      console.log(`[cleanSvgContent] 删除白色背景: ${match.substring(0, 100)}...`)
      return ''
    }
    return match
  })
  console.log(`[cleanSvgContent] Step 4: 移除 white 背景, 删除 ${before4 - svg.length} 字符`)

  // 5. 移除空的 clipPath 定义和 clip-path 属性
  svg = svg.replace(/<clipPath\s+id="[^"]*"\s*\/>/gi, '')
  svg = svg.replace(/<clipPath\s+id="[^"]*"\s*><\/clipPath>/gi, '')
  svg = svg.replace(/\s+clip-path="url\([^)]*\)"/gi, '') // 注意：属性名是 clip-path 不是 clipPath
  svg = svg.replace(/\s+clipPath="url\([^)]*\)"/gi, '')

  // 6. 简化空的 g 标签
  svg = svg.replace(/<g\s*>\s*<\/g>/gi, '')
  
  // 7. 解包只有单个属性的 g 标签
  svg = svg.replace(/<g\s*>([^]*?)<\/g>/g, '$1')

  // 8. 移除未使用的渐变定义
  const usedGradientIds = new Set<string>()
  const gradientRefs = svg.matchAll(/(?:fill|stroke)="url\(#([^)]+)\)"/g)
  for (const match of gradientRefs) {
    usedGradientIds.add(match[1])
  }
  
  svg = svg.replace(
    /<linearGradient\s+id="([^"]+)"[^>]*>[\s\S]*?<\/linearGradient>/g,
    (match, id) => usedGradientIds.has(id) ? match : ''
  )

  // 9. 将驼峰命名的 SVG 属性转换回标准的连字符命名
  // Figma exportAsync 返回的 SVG 使用 JSX 风格的驼峰命名（如 stopColor）
  // 需要转换为标准 SVG 的连字符命名（如 stop-color）
  const jsxToSvgAttributes: Record<string, string> = {
    'stopColor': 'stop-color',
    'stopOpacity': 'stop-opacity',
    'strokeWidth': 'stroke-width',
    'strokeLinecap': 'stroke-linecap',
    'strokeLinejoin': 'stroke-linejoin',
    'strokeDasharray': 'stroke-dasharray',
    'strokeDashoffset': 'stroke-dashoffset',
    'strokeMiterlimit': 'stroke-miterlimit',
    'strokeOpacity': 'stroke-opacity',
    'fillRule': 'fill-rule',
    'fillOpacity': 'fill-opacity',
    'clipRule': 'clip-rule',
    'clipPath': 'clip-path',
    'fontFamily': 'font-family',
    'fontSize': 'font-size',
    'fontStyle': 'font-style',
    'fontWeight': 'font-weight',
    'textAnchor': 'text-anchor',
    'textDecoration': 'text-decoration',
    'dominantBaseline': 'dominant-baseline',
    'alignmentBaseline': 'alignment-baseline',
    'baselineShift': 'baseline-shift',
    'colorInterpolation': 'color-interpolation',
    'colorInterpolationFilters': 'color-interpolation-filters',
    'floodColor': 'flood-color',
    'floodOpacity': 'flood-opacity',
    'lightingColor': 'lighting-color',
    'markerStart': 'marker-start',
    'markerMid': 'marker-mid',
    'markerEnd': 'marker-end',
    'paintOrder': 'paint-order',
    'shapeRendering': 'shape-rendering',
    'vectorEffect': 'vector-effect',
    'pointerEvents': 'pointer-events',
  }

  for (const [jsxAttr, svgAttr] of Object.entries(jsxToSvgAttributes)) {
    // 使用全局替换，匹配属性名后跟 = 的情况
    const regex = new RegExp(`\\b${jsxAttr}=`, 'g')
    svg = svg.replace(regex, `${svgAttr}=`)
  }

  // 9. 清理多余的空白
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
    // 没有选中任何内容，不扫描整个页面（避免卡死）
    // 发送空列表，提示用户选择区域
    currentIcons = []
    sendToUI({
      type: 'selection-changed',
      payload: {
        icons: [],
        totalCount: 0,
        hasSelection: false,
        needsSelection: true, // 新增标志，提示 UI 需要用户选择
        selectionName: '未选择',
      },
    })
    return
  }

  // 在选中的节点中查找图标
  currentIcons = findIconsInNodes(selection)

  sendToUI({
    type: 'selection-changed',
    payload: {
      icons: currentIcons,
      totalCount: currentIcons.length,
      hasSelection: true,
      needsSelection: false,
      selectionName:
        selection.length === 1
          ? selection[0].name
          : `${selection.length} 个选中项`,
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
 * 导出图标为 SVG (并行优化版)
 */
async function exportIconsToSvg(icons: IconInfo[]): Promise<IconWithSvg[]> {
  const results: IconWithSvg[] = []
  const total = icons.length
  const BATCH_SIZE = 5 // 并行批次大小，避免同时请求过多

  // 发送初始进度
  sendToUI({
    type: 'export-progress',
    payload: {
      current: 0,
      total: total,
      currentName: '开始导出...',
    },
  })

  // 分批并行处理
  for (let batchStart = 0; batchStart < icons.length; batchStart += BATCH_SIZE) {
    const batch = icons.slice(batchStart, batchStart + BATCH_SIZE)
    
    const batchResults = await Promise.all(
      batch.map(async (icon, batchIndex) => {
        const globalIndex = batchStart + batchIndex
        
        try {
          // 使用异步版本获取节点
          const node = (await figma.getNodeByIdAsync(icon.id)) as SceneNode

          if (!node) {
            console.warn(`节点 ${icon.id} 不存在，跳过`)
            return null
          }

          // 使用 Figma 内置的 exportAsync 导出 SVG
          const svgData = await (node as FrameNode).exportAsync({
            format: 'SVG',
            svgIdAttribute: false,
            contentsOnly: false, // 保留渐变定义
          })

          // 将 Uint8Array 转换为字符串
          let svgString = String.fromCharCode.apply(null, Array.from(svgData))
          
          // 清理 SVG 中的问题元素
          svgString = cleanSvgContent(svgString)

          return {
            ...icon,
            svg: svgString,
          } as IconWithSvg
        } catch (error) {
          console.error(`导出图标 ${icon.name} 失败:`, error)
          return null
        }
      })
    )

    // 收集有效结果
    for (const result of batchResults) {
      if (result) {
        results.push(result)
      }
    }

    // 发送批次进度更新
    const currentProgress = Math.min(batchStart + BATCH_SIZE, total)
    sendToUI({
      type: 'export-progress',
      payload: {
        current: currentProgress,
        total: total,
        currentName: batch[batch.length - 1]?.name || '',
      },
    })
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
  console.log('[DEBUG] handleSaveConfig() called with:', {
    githubRepo: config.githubRepo,
    githubToken: config.githubToken ? '***已填写***' : '(空)',
    defaultBranch: config.defaultBranch
  })
  
  if (!config.githubRepo || !config.githubToken) {
    console.log('[DEBUG] Validation failed: missing required fields')
    throw new Error('请填写 GitHub 仓库地址和 Token')
  }

  // 从完整 URL 提取 org/repo
  let repoPath = config.githubRepo.trim()
  const urlMatch = repoPath.match(
    /github\.com[\/:]([^\/]+\/[^\/]+?)(?:\.git)?(?:\/.*)?$/,
  )
  if (urlMatch) {
    repoPath = urlMatch[1]
    console.log('[DEBUG] Extracted repo from URL:', repoPath)
  }
  repoPath = repoPath.replace(/\/+$/, '')

  if (!/^[\w.-]+\/[\w.-]+$/.test(repoPath)) {
    console.log('[DEBUG] Repo format validation failed:', repoPath)
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

  console.log('[DEBUG] Saving config to Figma clientStorage...')
  try {
    await figma.clientStorage.setAsync(CONFIG_KEY, configToStore)
    console.log('[DEBUG] Config saved successfully!')
  } catch (storageError) {
    console.error('[DEBUG] Failed to save config:', storageError)
    throw new Error('保存配置失败，请检查 Figma 权限: ' + (storageError instanceof Error ? storageError.message : String(storageError)))
  }

  console.log('[DEBUG] Sending config-loaded response to UI...')
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
