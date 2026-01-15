import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'

// 复制文件到 dist 目录的插件
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'docs/dist')

      // 复制 icons.json
      const iconsJsonSrc = resolve(__dirname, 'icons.json')
      if (existsSync(iconsJsonSrc)) {
        copyFileSync(iconsJsonSrc, resolve(distDir, 'icons.json'))
        console.log('✅ Copied icons.json')
      }

      // 复制 svg 目录
      const svgSrcDir = resolve(__dirname, 'svg')
      const svgDistDir = resolve(distDir, 'svg')
      if (existsSync(svgSrcDir)) {
        mkdirSync(svgDistDir, { recursive: true })
        const svgFiles = readdirSync(svgSrcDir).filter((f) =>
          f.endsWith('.svg')
        )
        for (const file of svgFiles) {
          copyFileSync(resolve(svgSrcDir, file), resolve(svgDistDir, file))
        }
        console.log(`✅ Copied ${svgFiles.length} SVG files`)
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
