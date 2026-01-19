# 如何获取 Figma FILE_ID

## 方法 1：从 Figma URL 中提取（最简单）

### 步骤 1：打开你的 Figma 文件

在浏览器中打开你的 Figma 图标文件。

### 步骤 2：查看浏览器地址栏

你会看到类似这样的 URL：

```
https://www.figma.com/file/abc123XYZ456/我的图标库
```

或者：

```
https://www.figma.com/design/abc123XYZ456/我的图标库?node-id=0-1
```

### 步骤 3：提取 FILE_ID

FILE_ID 就是 `/file/` 或 `/design/` 后面的那串字符，直到下一个 `/` 或 `?` 之前。

**示例 1：**

```
URL: https://www.figma.com/file/abc123XYZ456/我的图标库
FILE_ID: abc123XYZ456
```

**示例 2：**

```
URL: https://www.figma.com/design/RuoFeng2015abc123/zleap-icon?node-id=0-1
FILE_ID: RuoFeng2015abc123
```

**示例 3（你的实际 URL）：**

```
URL: https://www.figma.com/design/RuoFeng2015abc123/zleap-icon
FILE_ID: RuoFeng2015abc123
```

## 方法 2：从 Figma 插件中获取

### 步骤 1：打开 Figma 插件

在你的 Figma 文件中，打开 zleap-icon 插件。

### 步骤 2：查看插件界面

插件界面会显示当前文件的信息，包括 File Key（就是 FILE_ID）。

## 方法 3：使用 Figma API 测试

如果你不确定 FILE_ID 是否正确，可以用这个命令测试：

```bash
# 替换 YOUR_TOKEN 和 YOUR_FILE_ID
curl -H "X-Figma-Token: YOUR_TOKEN" \
  "https://api.figma.com/v1/files/YOUR_FILE_ID"
```

如果返回 JSON 数据（包含文件信息），说明 FILE_ID 正确。
如果返回 404 错误，说明 FILE_ID 不正确或你没有访问权限。

## 配置 FILE_ID

### 本地开发

#### 方式 1：使用环境变量

```bash
# macOS/Linux
export FILE_ID="abc123XYZ456"

# Windows PowerShell
$env:FILE_ID="abc123XYZ456"

# Windows CMD
set FILE_ID=abc123XYZ456
```

#### 方式 2：创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
FIGMA_TOKEN=your_figma_token_here
FILE_ID=abc123XYZ456
PAGE_NAME=Icons
```

**注意**：`.env` 文件不要提交到 Git！确保它在 `.gitignore` 中。

### GitHub Actions

#### 步骤 1：进入仓库设置

1. 打开你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Secrets and variables** → **Actions**

#### 步骤 2：添加 Secret

1. 点击 **New repository secret**
2. Name: `FILE_ID`
3. Secret: 粘贴你的 FILE_ID（如 `abc123XYZ456`）
4. 点击 **Add secret**

#### 步骤 3：在 Workflow 中使用

在 `.github/workflows/*.yml` 文件中：

```yaml
- name: Fetch icons from Figma
  run: npm run fetch-icons-cli
  env:
    FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
    FILE_ID: ${{ secrets.FILE_ID }}
    PAGE_NAME: ${{ secrets.PAGE_NAME }}
```

## 完整示例

### 示例 1：你的 Figma 文件

假设你的 Figma URL 是：

```
https://www.figma.com/design/RuoFeng2015abc123/zleap-icon
```

那么：

- **FILE_ID**: `RuoFeng2015abc123`

### 示例 2：配置和使用

```bash
# 1. 设置环境变量
export FIGMA_TOKEN="figd_xxxxxxxxxxxxxxxxxxxx"
export FILE_ID="RuoFeng2015abc123"
export PAGE_NAME="图标"

# 2. 测试连接
curl -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/$FILE_ID" | jq '.name'

# 应该返回: "zleap-icon"

# 3. 导出图标
npm run fetch-icons-cli
```

## 常见问题

### Q: FILE_ID 包含特殊字符吗？

A: FILE_ID 通常只包含字母、数字，可能包含连字符 `-`。不包含空格或其他特殊字符。

### Q: FILE_ID 会变化吗？

A: 不会。每个 Figma 文件的 FILE_ID 是固定的，除非你创建了新文件。

### Q: 如何知道我的 FILE_ID 是否正确？

A: 使用 curl 命令测试（见上面的"方法 3"），或者直接运行 `npm run fetch-icons-cli` 看是否成功。

### Q: 我有多个 Figma 文件，怎么办？

A: 每个文件都有自己的 FILE_ID。你需要为每个文件分别配置。如果要从多个文件导出，可以：

1. 创建多个配置文件
2. 或者在脚本中循环处理多个 FILE_ID

### Q: FILE_ID 和 File Key 是一样的吗？

A: 是的，它们是同一个东西，只是叫法不同。

## 快速检查清单

- [ ] 我已经打开了 Figma 文件
- [ ] 我已经从 URL 中复制了 FILE_ID
- [ ] FILE_ID 只包含字母、数字和连字符
- [ ] 我已经在本地或 GitHub 中配置了 FILE_ID
- [ ] 我已经测试了 FILE_ID 是否正确

## 下一步

配置好 FILE_ID 后，继续阅读：

- [FIGMA-CLI-SETUP.md](../FIGMA-CLI-SETUP.md) - 快速开始指南
- [FIGMA-EXPORT-CLI.md](FIGMA-EXPORT-CLI.md) - 详细使用指南

## 需要帮助？

如果你仍然不确定如何获取 FILE_ID，可以：

1. 截图你的 Figma URL 发给我
2. 或者在 GitHub Issues 中提问
