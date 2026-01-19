# GitHub Actions 使用 CLI 导出图标

本文档说明如何在 GitHub Actions 中使用 `@figma-export/cli` 自动从 Figma 导出图标。

## 📋 概述

我们有两个主要的 GitHub Actions workflows：

1. **Sync Icons from Figma** (`.github/workflows/sync-icons.yml`)
   - 从 Figma 导出图标（使用 CLI）
   - 生成组件和构建产物
   - 创建 PR

2. **Build Icons** (`.github/workflows/build-icons.yml`)
   - 在 PR 分支上构建
   - 自动合并 PR 到 main

## 🔧 配置 GitHub Secrets

在你的 GitHub 仓库中配置以下 secrets：

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 添加以下 secrets：

| Secret Name   | 说明                        | 示例           |
| ------------- | --------------------------- | -------------- |
| `FIGMA_TOKEN` | Figma Personal Access Token | `figd_xxx...`  |
| `FILE_ID`     | Figma 文件 ID               | `abc123def456` |
| `PAGE_NAME`   | 图标所在的页面名称（可选）  | `Icons`        |

### 如何获取这些值？

#### FIGMA_TOKEN

1. 访问 https://www.figma.com/settings
2. 滚动到 "Personal access tokens"
3. 点击 "Create new token"
4. 复制生成的 token

#### FILE_ID

从 Figma URL 中提取：

```
https://www.figma.com/design/abc123def456/your-project-name
                               ^^^^^^^^^^^
                               这就是 FILE_ID
```

详细教程：[HOW-TO-GET-FILE-ID.md](./HOW-TO-GET-FILE-ID.md)

#### PAGE_NAME

在 Figma 文件中，图标所在的页面名称（左侧边栏）。如果不设置，将导出所有页面的图标。

## 🚀 使用方法

### 方式 1：手动触发（推荐）

1. 进入 GitHub 仓库的 **Actions** 标签
2. 选择 **"Sync Icons from Figma"** workflow
3. 点击 **"Run workflow"** 按钮
4. 可选：输入版本号和更新说明
5. 点击 **"Run workflow"** 确认

**工作流程：**

```
手动触发
  ↓
从 Figma 导出图标 (CLI)
  ↓
验证、转换、生成组件
  ↓
构建包
  ↓
创建 PR
  ↓
触发 Build Workflow
  ↓
自动合并到 main
  ↓
部署文档站点
```

### 方式 2：定时自动更新

编辑 `.github/workflows/sync-icons.yml`，取消注释 schedule 部分：

```yaml
on:
  # ... 其他触发器 ...

  # 定时触发
  schedule:
    - cron: '0 2 * * *' # 每天凌晨 2 点
```

### 方式 3：通过 Figma 插件触发（保留兼容性）

Figma 插件仍然可以触发 workflow，但现在会使用 CLI 方式导出。

## 📊 工作流详解

### Sync Icons Workflow

**触发条件：**

- 手动触发 (`workflow_dispatch`)
- 插件触发 (`repository_dispatch`)
- 定时触发 (`schedule`) - 可选

**步骤：**

1. **Checkout repository** - 检出代码
2. **Setup Node.js** - 设置 Node.js 环境
3. **Install dependencies** - 安装依赖
4. **Fetch icons from Figma (CLI)** - 使用 CLI 从 Figma 导出
   ```bash
   npm run fetch-icons-cli
   ```
5. **Validate icons** - 验证图标规范
6. **Transform SVGs** - 转换 SVG
7. **Generate React components** - 生成 React 组件
8. **Generate sprite and metadata** - 生成 sprite 和 metadata
9. **Get version and message** - 确定版本号和更新说明
10. **Update changelog** - 更新 changelog
11. **Update version** - 更新 package.json 版本
12. **Build packages** - 构建包
13. **Create Pull Request** - 创建 PR
14. **Trigger Build Workflow** - 触发构建工作流

### Build Icons Workflow

**触发条件：**

- `repository_dispatch` (由 Sync workflow 触发)
- 手动触发
- PR 合并到 main
- push 到 main 分支的 svg 目录

**步骤：**

1. 检出对应的分支
2. 安装依赖
3. 验证、转换、生成组件
4. 构建包
5. 提交更改
6. 评论 PR
7. **自动合并 PR 到 main**

## 🔍 对比：插件 vs CLI

| 特性           | Figma 插件   | @figma-export/cli |
| -------------- | ------------ | ----------------- |
| 导出方式       | 手动选择图标 | 自动导出所有图标  |
| 图标数量       | 可能遗漏     | 准确完整          |
| 编码问题       | 可能出现     | 更可靠            |
| 自动化         | 需要手动触发 | 支持定时自动更新  |
| 选择性导出     | ✅ 支持      | ❌ 导出全部       |
| GitHub Actions | ✅ 支持      | ✅ 支持           |

**推荐使用场景：**

- **CLI 方式**：批量更新、定时同步、确保完整性
- **插件方式**：快速更新少量图标、选择性导出

## 🐛 故障排除

### 问题 1：导出失败 - "FIGMA_TOKEN is required"

**原因：** GitHub Secrets 未配置

**解决：**

1. 检查 Settings → Secrets and variables → Actions
2. 确保 `FIGMA_TOKEN` 已添加
3. 重新运行 workflow

### 问题 2：导出 0 个图标

**原因：** FILE_ID 或 PAGE_NAME 不正确

**解决：**

1. 检查 FILE_ID 是否正确
2. 检查 PAGE_NAME 是否与 Figma 中的页面名称完全匹配
3. 如果不确定，删除 PAGE_NAME secret，导出所有页面

### 问题 3：图标数量不对

**原因：** 可能的原因：

- 图标在 Figma 中被隐藏
- 图标不是 Component 或 Frame 类型
- PAGE_NAME 设置错误

**解决：**

1. 在 Figma 中检查图标是否可见
2. 确保图标是 Component 或 Frame
3. 尝试不设置 PAGE_NAME，导出所有页面
4. 查看 workflow 日志中的导出数量

### 问题 4：PR 未自动合并

**原因：** Build workflow 可能失败

**解决：**

1. 查看 Build workflow 的日志
2. 检查是否有构建错误
3. 手动合并 PR

### 问题 5：颜色不对

**原因：** Figma 导出时使用了 `currentColor`

**解决：**

1. 检查 `figma.config.js` 中的 SVGO 配置
2. 确保 `convertColors: false`
3. 参考 [ICON-COLORS.md](./ICON-COLORS.md)

## 📝 查看日志

1. 进入 **Actions** 标签
2. 选择对应的 workflow run
3. 点击具体的 job
4. 展开步骤查看详细日志

**关键日志：**

```
📥 Fetch Icons from Figma
=========================

📂 Figma File ID: abc123def456
📄 Page Name: Icons
📂 Output Directory: ./svg

🔄 Running @figma-export/cli...

✅ Icons exported successfully!
📊 Exported 40 SVG file(s)

📝 Exported files:
   - arrow-right.svg
   - check.svg
   - ...
```

## 🎯 最佳实践

1. **使用 CLI 方式进行批量更新**
   - 更可靠，图标数量准确
   - 支持自动化

2. **设置定时更新（可选）**
   - 每天自动同步 Figma 的最新图标
   - 无需手动触发

3. **使用语义化版本号**
   - 新增图标：增加 minor 版本 (1.0.0 → 1.1.0)
   - 修复图标：增加 patch 版本 (1.0.0 → 1.0.1)
   - 破坏性变更：增加 major 版本 (1.0.0 → 2.0.0)

4. **检查 PR 内容**
   - 虽然会自动合并，但建议快速检查 PR 内容
   - 确保图标正确导出

5. **保留插件方式作为备选**
   - 快速更新少量图标时使用插件
   - CLI 方式作为主要更新方式

## 📚 相关文档

- [FIGMA-CLI-SETUP.md](../FIGMA-CLI-SETUP.md) - CLI 快速开始
- [FIGMA-EXPORT-CLI.md](./FIGMA-EXPORT-CLI.md) - CLI 完整指南
- [HOW-TO-GET-FILE-ID.md](./HOW-TO-GET-FILE-ID.md) - 获取 FILE_ID
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 故障排除
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署文档

## 🆘 需要帮助？

如果遇到问题：

1. 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 检查 GitHub Actions 日志
3. 在仓库中创建 Issue
