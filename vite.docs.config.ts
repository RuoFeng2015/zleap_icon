import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

// 复制文件到 dist 目录的插件
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const rootDir = resolve(__dirname)
      const distDir = resolve(__dirname, 'docs/dist')

      console.log('📦 Copying assets to dist...')

      // 复制 icons.json（从根目录）
      const iconsJsonSrc = resolve(rootDir, 'icons.json')
      if (existsSync(iconsJsonSrc)) {
        copyFileSync(iconsJsonSrc, resolve(distDir, 'icons.json'))
        console.log('✅ Copied icons.json from root')
      } else {
        console.warn('⚠️  icons.json not found in root')
      }

      // 复制 svg 目录（从根目录）
      const svgSrcDir = resolve(rootDir, 'svg')
      const svgDistDir = resolve(distDir, 'svg')
      if (existsSync(svgSrcDir)) {
        mkdirSync(svgDistDir, { recursive: true })
        const svgFiles = readdirSync(svgSrcDir).filter((f) =>
          f.endsWith('.svg'),
        )
        for (const file of svgFiles) {
          copyFileSync(resolve(svgSrcDir, file), resolve(svgDistDir, file))
        }
        console.log(`✅ Copied ${svgFiles.length} SVG files from root/svg`)
      } else {
        console.warn('⚠️  svg directory not found in root')
      }
    },
  }
}

export default defineConfig({
  root: 'docs',
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [copyAssetsPlugin()],
  server: {
    port: 3000,
    open: true,
  },
})
