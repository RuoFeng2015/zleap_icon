# 🚀 快速开始：CLI 方式更新图标

## 第一步：配置 GitHub Secrets（一次性）

1. 进入你的 GitHub 仓库 Settings
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"** 添加以下 secrets：

| Secret Name   | 说明                                   |
| ------------- | -------------------------------------- |
| `FIGMA_TOKEN` | 你的 Figma Personal Access Token       |
| `FILE_ID`     | 你的 Figma 文件 ID                     |
| `PAGE_NAME`   | `Icons` (可选，如果你的图标在特定页面) |

### 如何获取这些值？

- **FIGMA_TOKEN**: 访问 https://www.figma.com/settings → Personal access tokens → Create new token
- **FILE_ID**: 从 Figma URL 中提取，例如 `https://www.figma.com/design/abc123/project` 中的 `abc123`
- **PAGE_NAME**: Figma 文件中图标所在的页面名称

## 第二步：手动触发更新

1. 进入 **Actions** 标签
2. 在左侧选择 **"Sync Icons from Figma"** workflow
3. 点击右上角的 **"Run workflow"** 按钮
4. 可选：输入版本号（如 `1.0.2`）和更新说明
5. 点击绿色的 **"Run workflow"** 按钮确认

## 第三步：等待自动完成

整个流程大约需要 3-5 分钟：

```
✅ 从 Figma 导出图标
  ↓
✅ 验证图标规范
  ↓
✅ 转换 SVG
  ↓
✅ 生成 React 组件
  ↓
✅ 构建包
  ↓
✅ 创建 Pull Request
  ↓
✅ 自动触发构建
  ↓
✅ 自动合并到 main
  ↓
✅ 部署文档站点
```

## 第四步：验证结果

1. 查看 **Pull requests** 标签，应该看到自动创建并合并的 PR
2. 访问文档站点，确认图标显示正常
3. 检查图标数量是否正确

## 🎯 预期结果

- **自动化**：全程自动，无需人工干预
- **时间**：3-5 分钟完成
- **完整性**：导出所有图标

## 🐛 如果遇到问题

### 问题 1：workflow 失败

**检查：** GitHub Secrets 是否正确配置

### 问题 2：图标数量不对

**检查：**

1. Figma 中图标是否可见
2. PAGE_NAME 是否正确（或删除此 secret 导出所有页面）

### 问题 3：PR 未自动合并

**检查：** Build workflow 的日志，看是否有错误

## 📚 详细文档

- [GitHub Actions CLI 使用指南](./docs/GITHUB-ACTIONS-CLI.md)
- [迁移说明](./docs/MIGRATION-TO-CLI.md)
- [故障排除](./docs/TROUBLESHOOTING.md)

## 💡 提示

- 每次在 Figma 中更新图标后，只需手动触发 workflow 即可
- 也可以启用定时自动更新（每天自动同步）
- Figma 插件仍然可以使用，但推荐使用 CLI 方式

---

**需要帮助？** 查看 [完整文档](./docs/GITHUB-ACTIONS-CLI.md) 或在仓库中创建 Issue。
