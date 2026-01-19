import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

// 复制文件到 dist 目录的插件
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const rootDir = resolve(__dirname)
      const docsDir = resolve(__dirname, 'docs')
      const distDir = resolve(__dirname, 'docs/dist')

      console.log('📦 Copying assets to dist...')

      // 优先从 docs/ 目录复制 icons.json
      const iconsJsonDocs = resolve(docsDir, 'icons.json')
      const iconsJsonRoot = resolve(rootDir, 'icons.json')
      const iconsJsonSrc = existsSync(iconsJsonDocs)
        ? iconsJsonDocs
        : iconsJsonRoot

      if (existsSync(iconsJsonSrc)) {
        copyFileSync(iconsJsonSrc, resolve(distDir, 'icons.json'))
        console.log(
          `✅ Copied icons.json from ${existsSync(iconsJsonDocs) ? 'docs/' : 'root'}`,
        )
      } else {
        console.warn('⚠️  icons.json not found')
      }

      // 优先从 docs/svg 复制 SVG 文件
      const svgDocsDir = resolve(docsDir, 'svg')
      const svgRootDir = resolve(rootDir, 'svg')
      const svgSrcDir = existsSync(svgDocsDir) ? svgDocsDir : svgRootDir
      const svgDistDir = resolve(distDir, 'svg')

      if (existsSync(svgSrcDir)) {
        mkdirSync(svgDistDir, { recursive: true })
        const svgFiles = readdirSync(svgSrcDir).filter((f) =>
          f.endsWith('.svg'),
        )
        for (const file of svgFiles) {
          copyFileSync(resolve(svgSrcDir, file), resolve(svgDistDir, file))
        }
        console.log(
          `✅ Copied ${svgFiles.length} SVG files from ${existsSync(svgDocsDir) ? 'docs/svg' : 'root/svg'}`,
        )
      } else {
        console.warn('⚠️  svg directory not found')
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
