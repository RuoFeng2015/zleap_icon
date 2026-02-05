import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync, readFileSync } from 'fs'

// 读取 package.json 版本
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

// 在构建前准备静态资源
function prepareStaticAssets() {
  return {
    name: 'prepare-static-assets',
    buildStart() {
      const rootDir = resolve(__dirname)
      const docsDir = resolve(__dirname, 'docs')
      const publicDir = resolve(docsDir, 'public')

      console.log('📦 Preparing static assets...')

      // 创建 public 目录
      mkdirSync(publicDir, { recursive: true })

      // 复制 icons.json 到 public
      const iconsJsonRoot = resolve(rootDir, 'icons.json')
      if (existsSync(iconsJsonRoot)) {
        copyFileSync(iconsJsonRoot, resolve(publicDir, 'icons.json'))
        console.log('✅ Copied icons.json to public/')
      } else {
        console.warn('⚠️  icons.json not found in root')
      }

      // 从 icons.json 获取有效的 SVG 文件列表
      let validSvgFiles: Set<string> | null = null
      if (existsSync(iconsJsonRoot)) {
        try {
          const iconsData = JSON.parse(readFileSync(iconsJsonRoot, 'utf-8'))
          validSvgFiles = new Set(
            iconsData.icons.map((icon: { svgPath: string }) => 
              icon.svgPath.replace('svg/', '')
            )
          )
          console.log(`📋 icons.json 中列出了 ${validSvgFiles.size} 个图标`)
        } catch (e) {
          console.warn('⚠️  Failed to parse icons.json, copying all SVG files')
        }
      }

      // 只复制 icons.json 中列出的 SVG 文件
      const svgRootDir = resolve(rootDir, 'svg')
      const svgPublicDir = resolve(publicDir, 'svg')

      if (existsSync(svgRootDir)) {
        mkdirSync(svgPublicDir, { recursive: true })
        const allSvgFiles = readdirSync(svgRootDir).filter((f) =>
          f.endsWith('.svg'),
        )
        
        // 如果有有效列表，只复制列表中的文件；否则复制全部
        const filesToCopy = validSvgFiles 
          ? allSvgFiles.filter(f => validSvgFiles!.has(f))
          : allSvgFiles
        
        for (const file of filesToCopy) {
          copyFileSync(resolve(svgRootDir, file), resolve(svgPublicDir, file))
        }
        
        if (validSvgFiles && filesToCopy.length < allSvgFiles.length) {
          console.log(`✅ Copied ${filesToCopy.length}/${allSvgFiles.length} SVG files to public/svg/ (filtered by icons.json)`)
        } else {
          console.log(`✅ Copied ${filesToCopy.length} SVG files to public/svg/`)
        }
      } else {
        console.warn('⚠️  svg directory not found in root')
      }
    },
  }
}

export default defineConfig({
  root: 'docs',
  base: './',
  publicDir: 'public',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [prepareStaticAssets()],
  server: {
    port: 3000,
    open: true,
  },
})
