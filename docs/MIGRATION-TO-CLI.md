# 迁移到 CLI 导出方式

## 📋 变更摘要

我们已经将 GitHub Actions workflows 从基于插件的导出方式迁移到使用 `@figma-export/cli` 的方式。这解决了图标数量不准确和编码问题。

## ✅ 已完成的更改

### 1. 更新 `.github/workflows/sync-icons.yml`

**主要变更：**

- ✅ 使用 `npm run fetch-icons-cli` 替代 `npm run fetch-icons`
- ✅ 添加手动触发支持 (`workflow_dispatch`)
- ✅ 添加定时触发支持（可选）
- ✅ 使用新的环境变量：`FILE_ID`, `PAGE_NAME`
- ✅ 在创建 PR 后自动触发 Build workflow
- ✅ 完整的构建流程：导出 → 验证 → 转换 → 生成组件 → 构建 → 创建 PR

**环境变量变更：**

| 旧变量           | 新变量      | 说明                       |
| ---------------- | ----------- | -------------------------- |
| `FIGMA_FILE_KEY` | `FILE_ID`   | Figma 文件 ID              |
| `NODE_IDS`       | ❌ 移除     | CLI 自动导出所有图标       |
| -                | `PAGE_NAME` | 新增：指定页面名称（可选） |

### 2. 保持 `.github/workflows/build-icons.yml` 不变

Build workflow 保持原样，负责：

- 在 PR 分支上构建
- 自动合并 PR 到 main

### 3. 新增文档

- ✅ `docs/GITHUB-ACTIONS-CLI.md` - GitHub Actions 使用 CLI 的完整指南
- ✅ `docs/MIGRATION-TO-CLI.md` - 本迁移文档
- ✅ 更新 `README.md` - 添加 CLI 方式说明

## 🔧 需要配置的 GitHub Secrets

在你的 GitHub 仓库中配置以下 secrets：

### 必需的 Secrets

| Secret Name   | 说明                        |
| ------------- | --------------------------- |
| `FIGMA_TOKEN` | Figma Personal Access Token |
| `FILE_ID`     | Figma 文件 ID               |

### 可选的 Secrets

| Secret Name | 说明                                   |
| ----------- | -------------------------------------- |
| `PAGE_NAME` | 指定要导出的页面，不设置则导出所有页面 |

### 配置步骤

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**
4. 添加上述 secrets

## 🚀 如何使用

### 方式 1：手动触发（推荐）

1. 进入 GitHub 仓库的 **Actions** 标签
2. 选择 **"Sync Icons from Figma"** workflow
3. 点击 **"Run workflow"** 按钮
4. 可选：输入版本号和更新说明
5. 点击 **"Run workflow"** 确认

**预期结果：**

```
✅ 从 Figma 导出所有图标
✅ 验证图标规范
✅ 转换 SVG
✅ 生成 React 组件
✅ 构建包
✅ 创建 PR
✅ 自动触发 Build workflow
✅ 自动合并到 main
✅ 部署文档站点
```

### 方式 2：定时自动更新（可选）

编辑 `.github/workflows/sync-icons.yml`，取消注释：

```yaml
on:
  # ... 其他触发器 ...

  # 定时触发
  schedule:
    - cron: '0 2 * * *' # 每天凌晨 2 点
```

提交后，GitHub Actions 将每天自动从 Figma 同步图标。

### 方式 3：Figma 插件（保留兼容性）

Figma 插件仍然可以使用，但现在会触发使用 CLI 的 workflow。

## 📊 对比：旧方式 vs 新方式

| 特性       | 旧方式（插件）       | 新方式（CLI）     |
| ---------- | -------------------- | ----------------- |
| 导出方式   | Figma API (NODE_IDS) | @figma-export/cli |
| 图标数量   | 可能遗漏             | 完整准确          |
| 编码问题   | 可能出现             | 更可靠            |
| 自动化     | 需要插件触发         | 支持手动/定时触发 |
| 选择性导出 | ✅ 支持              | ❌ 导出全部       |
| 触发方式   | 仅插件               | 插件/手动/定时    |

## 🎯 优势

### 1. 图标数量准确

- **旧方式**：可能遗漏部分图标
- **新方式**：导出完整的图标集

### 2. 更可靠的编码

- 使用 `@figma-export/cli` 官方工具
- 避免手动处理 base64 编码问题

### 3. 更灵活的触发方式

- 手动触发：随时更新
- 定时触发：自动同步
- 插件触发：保留兼容性

### 4. 完整的自动化流程

- 导出 → 验证 → 转换 → 生成 → 构建 → PR → 合并 → 部署
- 全程自动化，无需人工干预

## 🔍 验证迁移成功

### 1. 检查 GitHub Secrets

```bash
# 在 GitHub 仓库中
Settings → Secrets and variables → Actions

应该看到：
✅ FIGMA_TOKEN
✅ FILE_ID
✅ PAGE_NAME (可选)
```

### 2. 手动触发测试

1. 进入 Actions 标签
2. 选择 "Sync Icons from Figma"
3. 点击 "Run workflow"
4. 观察日志输出

**预期日志：**

```
📥 Fetch Icons from Figma
=========================

📂 Figma File ID: abc123def456
📄 Page Name: Icons
📂 Output Directory: ./svg

🔄 Running @figma-export/cli...

✅ Icons exported successfully!
📊 Exported 40 SVG file(s)
```

### 3. 检查 PR

- PR 应该包含所有图标
- 自动生成的组件应该正确
- Build workflow 应该自动触发
- PR 应该自动合并到 main

## 🐛 故障排除

### 问题 1：workflow 失败 - "FIGMA_TOKEN is required"

**解决：** 配置 GitHub Secrets（见上文）

### 问题 2：导出 0 个图标

**可能原因：**

- FILE_ID 不正确
- PAGE_NAME 不匹配

**解决：**

1. 检查 FILE_ID 是否正确
2. 尝试删除 PAGE_NAME secret，导出所有页面

### 问题 3：图标数量仍然不对

**解决：**

1. 检查 Figma 中图标是否可见
2. 确保图标是 Component 或 Frame 类型
3. 查看 workflow 日志中的详细输出

## 📚 相关文档

- [GitHub Actions CLI 使用指南](./GITHUB-ACTIONS-CLI.md)
- [CLI 快速开始](../FIGMA-CLI-SETUP.md)
- [如何获取 FILE_ID](./HOW-TO-GET-FILE-ID.md)
- [故障排除](./TROUBLESHOOTING.md)

## 🎉 下一步

1. ✅ 配置 GitHub Secrets
2. ✅ 手动触发测试
3. ✅ 验证图标数量
4. ✅ 检查 PR 自动合并
5. ✅ 验证文档站点更新
6. 🔄 （可选）启用定时自动更新

## 💡 提示

- **推荐使用 CLI 方式**进行批量更新和定时同步
- **保留插件方式**作为快速更新少量图标的备选方案
- **定期检查** GitHub Actions 日志，确保自动化流程正常运行
