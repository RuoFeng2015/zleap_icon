# 🚀 快速开始：使用 @figma-export/cli

## 第一步：配置 Figma Token 和 File ID

### 1. 获取 Figma Personal Access Token

1. 访问 https://www.figma.com/settings
2. 滚动到 "Personal access tokens"
3. 点击 "Create new token"
4. 命名为 "Icon Export"
5. 复制生成的 token

### 2. 获取 Figma File ID

**从 URL 中提取 FILE_ID：**

```
https://www.figma.com/file/abc123def456/My-Icons
                              ^^^^^^^^^^^
                              这就是 FILE_ID
```

**或者：**

```
https://www.figma.com/design/abc123def456/My-Icons
                               ^^^^^^^^^^^
                               这就是 FILE_ID
```

**示例：**

- URL: `https://www.figma.com/design/RuoFeng2015abc/zleap-icon`
- FILE_ID: `RuoFeng2015abc`

📖 **详细教程**：[如何获取 FILE_ID](docs/HOW-TO-GET-FILE-ID.md)

### 3. 配置 GitHub Secrets

在你的 GitHub 仓库中：

1. 进入 Settings → Secrets and variables → Actions
2. 添加以下 secrets：
   - `FIGMA_TOKEN`: 你的 Figma token
   - `FILE_ID`: 你的 Figma 文件 ID
   - `PAGE_NAME`: 图标所在的页面名称（可选，如 "Icons"）

## 第二步：本地测试

### 1. 设置环境变量

```bash
export FIGMA_TOKEN="your_token_here"
export FILE_ID="your_file_id_here"
export PAGE_NAME="Icons"  # 可选
```

### 2. 运行导出

```bash
# 导出图标
npm run fetch-icons-cli

# 你应该看到类似的输出：
# 📥 Fetch Icons from Figma
# =========================
#
# 📂 Figma File ID: abc123def456
# 📄 Page Name: Icons
# 📂 Output Directory: ./svg
#
# 🔄 Running @figma-export/cli...
#
# ✅ Icons exported successfully!
# 📊 Exported 29 SVG file(s)
```

### 3. 检查导出的文件

```bash
ls -la svg/
# 你应该看到所有导出的 SVG 文件
```

### 4. 生成组件

```bash
# 转换 SVG
npm run transform-svg

# 生成 React 组件
npm run generate-components

# 生成输出文件
npm run generate-outputs

# 构建
npm run build
```

## 第三步：在 GitHub Actions 中使用

### 方式 1：手动触发

1. 进入 GitHub 仓库的 Actions 标签
2. 选择 "Sync Icons from Figma" workflow
3. 点击 "Run workflow"
4. 等待完成

### 方式 2：自动定时更新

创建 `.github/workflows/auto-sync-icons.yml`：

```yaml
name: Auto Sync Icons

on:
  schedule:
    # 每天凌晨 2 点自动更新
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Fetch icons
        run: npm run fetch-icons-cli
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FILE_ID: ${{ secrets.FILE_ID }}
          PAGE_NAME: ${{ secrets.PAGE_NAME }}

      - name: Generate components
        run: |
          npm run transform-svg
          npm run generate-components
          npm run generate-outputs

      - name: Build
        run: npm run build

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git commit -m "feat: 自动更新图标 [skip ci]" || exit 0
          git push
```

## 故障排除

### 问题：导出失败

```bash
# 检查环境变量
echo $FIGMA_TOKEN
echo $FILE_ID

# 测试 Figma API 连接
curl -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_ID"
```

### 问题：找不到图标

1. 确保图标在 Figma 中是 Component 或 Frame
2. 检查 PAGE_NAME 是否正确
3. 确保图标没有被隐藏

### 问题：颜色不对

编辑 `figma.config.js`，确保：

```javascript
svgo: {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertColors: false,  // 保留原始颜色
        },
      },
    },
  ],
},
```

## 对比：插件 vs CLI

| 使用场景         | 推荐方式   |
| ---------------- | ---------- |
| 快速更新少量图标 | Figma 插件 |
| 批量导出所有图标 | CLI        |
| 自动化定时更新   | CLI        |
| 避免编码问题     | CLI        |
| 选择性导出       | Figma 插件 |

## 下一步

1. ✅ 配置 GitHub Secrets
2. ✅ 本地测试导出
3. ✅ 在 GitHub Actions 中测试
4. ✅ 设置自动定时更新（可选）

## 需要帮助？

查看详细文档：

- [FIGMA-EXPORT-CLI.md](docs/FIGMA-EXPORT-CLI.md) - 完整使用指南
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - 故障排除
- [CONFIGURATION.md](docs/CONFIGURATION.md) - 配置说明
