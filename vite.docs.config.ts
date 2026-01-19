import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

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

      // 复制 SVG 文件到 public/svg
      const svgRootDir = resolve(rootDir, 'svg')
      const svgPublicDir = resolve(publicDir, 'svg')

      if (existsSync(svgRootDir)) {
        mkdirSync(svgPublicDir, { recursive: true })
        const svgFiles = readdirSync(svgRootDir).filter((f) =>
          f.endsWith('.svg'),
        )
        for (const file of svgFiles) {
          copyFileSync(resolve(svgRootDir, file), resolve(svgPublicDir, file))
        }
        console.log(`✅ Copied ${svgFiles.length} SVG files to public/svg/`)
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
