# GitHub API 422 错误解决方案

## 问题说明

当 Figma 插件上传图标到 GitHub 时，可能会遇到 `422 Unprocessable Content` 错误。

**错误示例：**

```
请求网址: https://api.github.com/repos/RuoFeng2015/zleap_icon/contents/svg/%E5%A2%9E%E5%8A%A0.svg
请求方法: PUT
状态代码: 422 Unprocessable Content
```

## 常见原因

### 1. 文件已存在但未提供 SHA

**原因：** 当更新已存在的文件时，GitHub API 要求提供文件的 SHA 值。

**解决方案：** 插件现在会自动检查文件是否存在，并获取 SHA 值。

### 2. 分支问题

**原因：**

- 新创建的分支上文件不存在
- 尝试从 main 分支获取 SHA，但文件只在新分支上

**解决方案：** 确保从正确的分支（新创建的分支）获取文件信息。

### 3. Base64 编码问题

**原因：** SVG 内容包含特殊字符（如中文），编码不正确。

**解决方案：** 使用 `TextEncoder` 正确处理 UTF-8 编码：

```javascript
const utf8Bytes = new TextEncoder().encode(icon.svg)
const binaryString = Array.from(utf8Bytes, (byte) =>
  String.fromCharCode(byte),
).join('')
const content = btoa(binaryString)
```

### 4. 文件路径问题

**原因：** 文件路径包含 URL 编码的字符（如 `%E5%A2%9E%E5%8A%A0`）。

**解决方案：** GitHub API 会自动处理 URL 编码，无需手动编码。

### 5. Token 权限不足

**原因：** GitHub token 没有写入权限。

**解决方案：** 确保 token 有 `repo` 权限。

## 已修复的问题

我已经更新了 Figma 插件代码，修复了以下问题：

### 修复 1：先检查文件是否存在

**之前的逻辑：**

```javascript
// 先尝试创建，如果失败再获取 SHA
let updateResponse = await fetch(...);
if (updateResponse.status === 422) {
  // 获取 SHA 并重试
}
```

**问题：** 这会导致不必要的 API 调用和错误。

**新逻辑：**

```javascript
// 先检查文件是否存在
let fileSha = null;
try {
  const fileCheckResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branchName}`,
    { headers }
  );
  if (fileCheckResponse.status === 200) {
    const fileData = await fileCheckResponse.json();
    fileSha = fileData.sha;
  }
} catch (e) {
  // 文件不存在，继续创建
}

// 如果文件存在，添加 sha
if (fileSha) {
  updateBody.sha = fileSha;
}

// 上传文件
const updateResponse = await fetch(...);
```

**优势：**

- 避免不必要的 422 错误
- 减少 API 调用次数
- 更清晰的错误处理

### 修复 2：更详细的错误日志

**新增日志：**

```javascript
console.error(`上传 ${fileName} 失败:`, {
  status: updateResponse.status,
  statusText: updateResponse.statusText,
  error: error,
  filePath: filePath,
  branch: branchName,
  hasSha: !!fileSha,
})
```

**帮助：** 可以在浏览器控制台查看详细的错误信息。

## 如何调试

### 1. 打开浏览器控制台

在 Figma 中：

1. 右键点击插件窗口
2. 选择 "Inspect"
3. 切换到 "Console" 标签

### 2. 查看错误日志

上传失败时，控制台会显示详细信息：

```javascript
上传 增加.svg 失败: {
  status: 422,
  statusText: "Unprocessable Content",
  error: { message: "sha is required" },
  filePath: "svg/增加.svg",
  branch: "icon-sync-1.0.1-1234567890",
  hasSha: false
}
```

### 3. 常见错误信息

| 错误信息            | 原因                   | 解决方案         |
| ------------------- | ---------------------- | ---------------- |
| `sha is required`   | 文件已存在但未提供 SHA | 插件会自动重试   |
| `Invalid request`   | 请求格式错误           | 检查 base64 编码 |
| `Not Found`         | 分支或文件不存在       | 检查分支名称     |
| `Validation Failed` | 内容验证失败           | 检查 SVG 内容    |

## 测试步骤

### 1. 更新插件代码

插件代码已经更新，重新加载插件：

1. 在 Figma 中，右键点击画布
2. Plugins → Development → Import plugin from manifest
3. 选择 `figma-plugin/manifest.json`

### 2. 测试上传

1. 选择一个图标（包括中文名称的图标）
2. 运行插件
3. 点击"同步图标到 GitHub"
4. 观察控制台输出

### 3. 验证结果

检查 GitHub 仓库：

- 新分支是否创建成功
- SVG 文件是否上传成功
- PR 是否创建成功

## 预防措施

### 1. 批量上传

插件已经实现了批量上传（每批 3 个文件），避免速率限制：

```javascript
const batchSize = 3
for (let i = 0; i < icons.length; i += batchSize) {
  const batch = icons.slice(i, i + batchSize)
  await Promise.all(batch.map(uploadIcon))
  await new Promise((resolve) => setTimeout(resolve, 500)) // 延迟 500ms
}
```

### 2. 错误重试

如果上传失败，插件会记录失败的文件，但继续上传其他文件。

### 3. 进度显示

插件会显示上传进度：

```
上传中: 5/10
```

## 常见问题

### Q: 为什么有些文件上传成功，有些失败？

A: 可能的原因：

1. 网络问题
2. 速率限制
3. 文件内容问题

**解决方案：** 查看控制台日志，找出失败的具体原因。

### Q: 如何重新上传失败的文件？

A:

1. 在 Figma 中重新选择失败的图标
2. 再次运行插件
3. 插件会自动处理已存在的文件

### Q: 422 错误会影响其他文件吗？

A: 不会。插件会继续上传其他文件，只记录失败的文件。

### Q: 如何查看详细的错误信息？

A:

1. 打开浏览器控制台（右键插件窗口 → Inspect）
2. 查看 Console 标签
3. 查找红色的错误信息

## 相关链接

- [GitHub API 文档](https://docs.github.com/en/rest/repos/contents)
- [Figma 插件开发文档](https://www.figma.com/plugin-docs/)
- [故障排除指南](./TROUBLESHOOTING.md)

## 需要帮助？

如果问题仍然存在：

1. 查看浏览器控制台的详细错误信息
2. 检查 GitHub token 权限
3. 在仓库中创建 Issue，附上错误日志

---

**更新日期：** 2026-01-19
**版本：** 1.0.0
