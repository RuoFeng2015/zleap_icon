# 故障排除指南

## 文档网站图标加载问题（已解决）

### 问题描述

部署到 GitHub Pages 的文档网站显示 "Failed to load icons"，所有图标文件返回 404 错误。

### 根本原因

1. **文件路径不匹配**：`icons.json` 中的 `svgPath` 使用拼音转换后的文件名（如 `svg/qi-ye-ban.svg`），但实际 SVG 文件保留了中文名称（如 `svg/企业版.svg`）
2. **构建流程问题**：Vite 构建时没有正确复制静态资源到 `dist` 目录

### 解决方案

#### 1. 修复文件路径匹配

修改 `src/multi-format-output.ts` 中的 `createIconJsonEntry` 函数：

```typescript
// 修改前：使用拼音转换的文件名
const svgFileName = toSymbolId(icon.normalizedName) + '.svg'

// 修改后：使用原始文件名（保留中文）
const svgFileName = icon.originalName + '.svg'
```

这样 `icons.json` 中的路径就会匹配实际的 SVG 文件名。

#### 2. 优化 Vite 构建配置

修改 `vite.docs.config.ts` 使用 Vite 的 `publicDir` 功能：

```typescript
// 在构建开始前将图标复制到 docs/public/
function prepareStaticAssets() {
  return {
    name: 'prepare-static-assets',
    buildStart() {
      // 复制 icons.json 和 SVG 文件到 public/
      // Vite 会自动将 public/ 目录的内容复制到 dist/
    },
  }
}

export default defineConfig({
  root: 'docs',
  base: './',
  publicDir: 'public', // 使用 Vite 的 publicDir 功能
  plugins: [prepareStaticAssets()],
})
```

#### 3. 简化 GitHub Actions 工作流

移除手动复制步骤，让 Vite 自动处理：

```yaml
# 移除这个步骤
- name: Copy icons to docs before build
  run: |
    cp icons.json docs/
    mkdir -p docs/svg
    cp -r svg/*.svg docs/svg/

# 直接构建即可
- name: Build preview site
  run: npm run build:docs
```

### 验证方法

#### 本地测试

```bash
# 1. 重新生成输出文件
npm run generate-outputs

# 2. 构建文档网站
npm run build:docs

# 3. 检查文件是否存在
ls -la docs/dist/icons.json
ls -la docs/dist/svg/

# 4. 启动本地服务器测试
cd docs/dist
python3 -m http.server 8080
# 访问 http://localhost:8080
```

#### 检查点

- ✅ `docs/dist/icons.json` 存在
- ✅ `docs/dist/svg/` 目录包含所有 SVG 文件
- ✅ `icons.json` 中的 `svgPath` 与实际文件名匹配
- ✅ 网站能正常加载和显示所有图标
- ✅ 浏览器控制台没有 404 错误

### 相关文件

- `src/multi-format-output.ts` - JSON 元数据生成
- `vite.docs.config.ts` - Vite 构建配置
- `.github/workflows/deploy-docs.yml` - GitHub Actions 部署流程
- `docs/main.js` - 前端图标加载逻辑

### 技术要点

#### 中文文件名处理

- SVG 文件保留原始中文名称
- 浏览器会自动进行 URL 编码（如 `企业版.svg` → `%E4%BC%81%E4%B8%9A%E7%89%88.svg`）
- React 组件名使用拼音转换（如 `IconQiYeBan`）
- `icons.json` 同时保存 `name`（组件名）和 `originalName`（原始名称）

#### Vite publicDir 功能

- `publicDir` 中的文件会被原样复制到 `dist/` 根目录
- 在 `buildStart` 钩子中准备静态资源
- 避免在 `closeBundle` 中复制（可能导致时序问题）

## 其他常见问题

### 图标未同步到仓库

**症状**：Figma 插件显示同步成功，但 GitHub 仓库没有更新

**解决方案**：

1. 检查 GitHub Personal Access Token 权限
2. 确认仓库名称格式正确（`owner/repo`）
3. 查看 GitHub Actions 日志

### 图标尺寸验证失败

**症状**：上传图标时提示尺寸不符合规范

**解决方案**：
已禁用尺寸验证，接受任意尺寸的图标。如需启用，修改 `scripts/validate-icons.ts`。

### 中文图标名称转换问题

**症状**：中文图标名称没有正确转换为拼音

**解决方案**：
确保安装了 `pinyin-pro` 依赖：

```bash
npm install pinyin-pro
```

### 批量上传失败

**症状**：上传大量图标时部分失败

**解决方案**：
插件已实现批量上传（每批 3 个文件），如仍有问题：

1. 减少每批上传数量
2. 增加批次间延迟时间
3. 检查 GitHub API 速率限制

## 获取帮助

如遇到其他问题，请：

1. 查看 GitHub Actions 日志
2. 检查浏览器控制台错误
3. 在 GitHub Issues 中提问
