# 使用 @figma-export/cli 导出图标

## 概述

我们现在支持两种方式从 Figma 导出图标：

1. **Figma 插件方式**（原有方式）- 在 Figma 中直接选择并上传
2. **@figma-export/cli 方式**（新方式）- 使用命令行工具批量导出

## 为什么使用 @figma-export/cli？

### 优势

- ✅ **更可靠** - 使用官方 Figma REST API
- ✅ **批量导出** - 一次性导出整个页面的所有图标
- ✅ **无编码问题** - 避免 base64 编码错误
- ✅ **完整导出** - 确保所有图标都被导出
- ✅ **自动化** - 可以在 CI/CD 中自动运行

### 劣势

- ⚠️ 需要配置 Figma Token 和 File ID
- ⚠️ 不支持选择性导出（导出整个页面）

## 配置

### 1. 获取 Figma Personal Access Token

1. 访问 [Figma Settings](https://www.figma.com/settings)
2. 滚动到 "Personal access tokens" 部分
3. 点击 "Create new token"
4. 给 token 命名（如 "Icon Export"）
5. 复制生成的 token

### 2. 获取 Figma File ID

从 Figma 文件 URL 中提取 File ID：

```
https://www.figma.com/file/FILE_ID/文件名
                              ^^^^^^^^
                              这就是 File ID
```

例如：

```
https://www.figma.com/file/abc123def456/My-Icons
                              ^^^^^^^^^^^
                              File ID: abc123def456
```

### 3. 配置环境变量

创建 `.env` 文件（不要提交到 Git）：

```bash
FIGMA_TOKEN=your_figma_token_here
FILE_ID=your_file_id_here
PAGE_NAME=图标页面名称（可选）
```

或者在命令行中设置：

```bash
export FIGMA_TOKEN=your_figma_token_here
export FILE_ID=your_file_id_here
export PAGE_NAME=图标页面名称（可选）
```

## 使用方法

### 本地导出

```bash
# 导出所有页面的图标
npm run fetch-icons-cli

# 导出特定页面的图标
PAGE_NAME="Icons" npm run fetch-icons-cli
```

### 在 GitHub Actions 中使用

在 `.github/workflows/sync-icons.yml` 中添加：

```yaml
- name: Fetch icons from Figma
  run: npm run fetch-icons-cli
  env:
    FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
    FILE_ID: ${{ secrets.FILE_ID }}
    PAGE_NAME: ${{ secrets.PAGE_NAME }} # 可选
```

## 配置文件

`figma.config.js` 文件控制导出行为：

```javascript
module.exports = {
  commands: [
    [
      'components',
      {
        fileId: process.env.FILE_ID,
        // 只导出特定页面
        onlyFromPages: process.env.PAGE_NAME
          ? [process.env.PAGE_NAME]
          : undefined,
        // 输出目录
        outputters: [
          require('@figma-export/output-components-as-svg')({
            output: './svg',
            // SVGO 配置
            svgo: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      convertColors: false, // 保留原始颜色
                    },
                  },
                },
                'removeDimensions',
                'removeXMLNS',
              ],
            },
          }),
        ],
      },
    ],
  ],
}
```

## 工作流程

### 完整的图标更新流程

1. **在 Figma 中设计图标**
   - 将图标组织在一个页面中
   - 确保每个图标都是 Component 或 Frame

2. **导出图标**

   ```bash
   npm run fetch-icons-cli
   ```

3. **转换和优化**

   ```bash
   npm run transform-svg
   ```

4. **生成组件**

   ```bash
   npm run generate-components
   npm run generate-outputs
   ```

5. **构建和测试**

   ```bash
   npm run build
   npm test
   ```

6. **提交更改**
   ```bash
   git add -A
   git commit -m "feat: 更新图标"
   git push
   ```

### 自动化流程（推荐）

在 GitHub Actions 中自动化整个流程：

```yaml
name: Update Icons from Figma

on:
  schedule:
    # 每天凌晨 2 点自动更新
    - cron: '0 2 * * *'
  workflow_dispatch: # 允许手动触发

jobs:
  update-icons:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Fetch icons from Figma
        run: npm run fetch-icons-cli
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FILE_ID: ${{ secrets.FILE_ID }}
          PAGE_NAME: ${{ secrets.PAGE_NAME }}

      - name: Transform and generate
        run: |
          npm run transform-svg
          npm run generate-components
          npm run generate-outputs

      - name: Build
        run: npm run build

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: 'feat: 自动更新图标'
          title: '🎨 自动更新图标'
          body: '从 Figma 自动导出并更新图标'
          branch: 'auto-update-icons'
```

## 故障排除

### 问题：导出失败，提示 "Invalid token"

**解决方案**：

1. 检查 FIGMA_TOKEN 是否正确
2. 确保 token 没有过期
3. 重新生成 token

### 问题：导出失败，提示 "File not found"

**解决方案**：

1. 检查 FILE_ID 是否正确
2. 确保你有该文件的访问权限
3. 确保文件没有被删除或移动

### 问题：导出的图标数量不对

**解决方案**：

1. 检查 PAGE_NAME 是否正确
2. 确保图标都是 Component 或 Frame 类型
3. 检查图标是否被隐藏或在其他页面

### 问题：图标颜色不正确

**解决方案**：

1. 检查 `figma.config.js` 中的 `convertColors` 设置
2. 确保设置为 `false` 以保留原始颜色
3. 在 Figma 中使用实色填充而不是样式变量

## 对比：插件 vs CLI

| 特性       | Figma 插件      | @figma-export/cli |
| ---------- | --------------- | ----------------- |
| 使用便捷性 | ⭐⭐⭐⭐⭐      | ⭐⭐⭐            |
| 可靠性     | ⭐⭐⭐          | ⭐⭐⭐⭐⭐        |
| 选择性导出 | ✅              | ❌                |
| 批量导出   | ⚠️ 有限制       | ✅                |
| 自动化     | ⚠️ 需要手动触发 | ✅                |
| 编码问题   | ⚠️ 可能出现     | ✅ 无问题         |

## 推荐使用场景

### 使用 Figma 插件

- 快速更新少量图标
- 需要选择性导出特定图标
- 设计师主导的工作流程

### 使用 @figma-export/cli

- 批量导出所有图标
- 自动化 CI/CD 流程
- 定期同步图标
- 避免编码问题

## 参考资料

- [@figma-export/cli 文档](https://github.com/marcomontalbano/figma-export)
- [@iconify/tools 文档](https://iconify.design/docs/libraries/tools/)
- [Figma API 文档](https://www.figma.com/developers/api)
