# 上传失败问题排查指南

## 常见错误类型

### 1. 409 Conflict

**错误信息：**

```
PUT https://api.github.com/repos/.../contents/svg/文件.svg 409 (Conflict)
```

**原因：**

- 文件已存在但 SHA 不匹配
- 并发上传导致的冲突
- GitHub API 缓存问题

**解决方案：**

插件现在会自动处理 409 错误：

1. 从新分支获取最新 SHA
2. 如果新分支没有，从 main 分支获取
3. 如果仍然冲突，等待 1 秒后重试

**手动解决：**

```bash
# 1. 删除冲突的文件
git rm svg/文件.svg
git commit -m "Remove conflicting file"
git push

# 2. 重新上传
```

### 2. 404 Not Found

**错误信息：**

```
GET https://api.github.com/repos/.../contents/svg/文件.svg 404 (Not Found)
```

**原因：**

- 文件在指定分支上不存在
- 文件路径错误
- 仓库或分支不存在

**解决方案：**

插件现在会：

1. 先检查新分支
2. 如果不存在，检查 main 分支
3. 如果都不存在，作为新文件创建

### 3. 422 Unprocessable Content

**错误信息：**

```
PUT https://api.github.com/repos/.../contents/svg/文件.svg 422 (Unprocessable Content)
```

**原因：**

- Base64 编码错误
- 文件内容无效
- 请求格式错误

**解决方案：**

插件使用改进的编码方法：

```javascript
const utf8Bytes = new TextEncoder().encode(icon.svg)
const binaryString = Array.from(utf8Bytes, (byte) =>
  String.fromCharCode(byte),
).join('')
const content = btoa(binaryString)
```

参考：[GitHub 422 错误解决方案](./GITHUB-422-ERROR.md)

### 4. 403 Forbidden

**错误信息：**

```
PUT https://api.github.com/repos/.../contents/svg/文件.svg 403 (Forbidden)
```

**原因：**

- Token 权限不足
- Token 已过期
- 仓库访问受限

**解决方案：**

1. **检查 Token 权限**
   - 访问 https://github.com/settings/tokens
   - 确保 token 有 `repo` 权限

2. **重新生成 Token**
   - 删除旧 token
   - 创建新 token
   - 在插件中更新

3. **检查仓库权限**
   - 确保你有仓库的写入权限

## 改进的上传策略

### 三层 SHA 获取策略

```javascript
// 策略 1: 从新分支获取
GET /contents/file.svg?ref=new-branch

// 策略 2: 从 main 分支获取
GET /contents/file.svg?ref=main

// 策略 3: 冲突时重试
等待 1 秒 → 重新获取 SHA → 重试上传
```

### 批量上传优化

- **批次大小**: 3 个文件/批
- **批次间隔**: 1 秒
- **失败重试**: 自动重试 409 错误
- **进度显示**: 实时显示成功/失败数量

### 详细日志

插件现在会输出详细日志：

```javascript
✅ 文件.svg 上传成功
❌ 文件.svg 上传失败: {
  status: 409,
  statusText: "Conflict",
  error: { message: "sha is required" },
  filePath: "svg/文件.svg",
  branch: "icon-sync-1.1.0-123456",
  hasSha: false
}
```

## 调试步骤

### 1. 打开浏览器控制台

在 Figma 中：

1. 右键点击插件窗口
2. 选择 "Inspect"
3. 切换到 "Console" 标签

### 2. 查看详细日志

上传过程中，控制台会显示：

```
文件 增加.svg 在分支 icon-sync-1.1.0-123456 上已存在，SHA: abc123...
✅ 增加.svg 上传成功

文件 编辑.svg 是新文件
✅ 编辑.svg 上传成功

文件 删除.svg 冲突，尝试获取最新 SHA...
❌ 删除.svg 上传失败: HTTP 409: Conflict

上传完成: 成功 38/40
失败的文件 (2): ["删除.svg", "修改.svg"]
```

### 3. 分析失败原因

查看失败文件的详细信息：

```javascript
失败的文件详情:
- 删除.svg: HTTP 409: Conflict (状态: 409)
- 修改.svg: sha is required (状态: 422)
```

### 4. 手动重试

如果部分文件失败：

1. **在 Figma 中重新选择失败的图标**
2. **再次运行插件**
3. **插件会自动处理已存在的文件**

## 最佳实践

### 1. 分批上传

不要一次上传太多图标：

```
✅ 推荐: 10-20 个图标/次
⚠️ 注意: 20-50 个图标/次
❌ 避免: 50+ 个图标/次
```

### 2. 检查网络

确保网络连接稳定：

```bash
# 测试 GitHub API 连接
curl -I https://api.github.com

# 测试仓库访问
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/YOUR_REPO
```

### 3. 避免并发上传

不要同时运行多个插件实例上传到同一个仓库。

### 4. 定期清理分支

删除旧的 icon-sync 分支：

```bash
# 列出所有 icon-sync 分支
git branch -r | grep icon-sync

# 删除旧分支
git push origin --delete icon-sync-old-branch
```

## 常见问题

### Q: 为什么有些文件总是上传失败？

A: 可能的原因：

1. **文件名问题**
   - 包含特殊字符
   - 文件名过长
   - 编码问题

2. **文件内容问题**
   - SVG 格式无效
   - 包含不支持的元素
   - 文件过大

3. **网络问题**
   - 连接不稳定
   - 超时
   - 速率限制

**解决方案：**

- 检查文件名是否合法
- 验证 SVG 内容
- 重试上传

### Q: 上传失败后如何重试？

A: 两种方法：

**方法 1: 使用插件重试**

1. 在 Figma 中重新选择失败的图标
2. 运行插件
3. 插件会自动处理

**方法 2: 手动上传**

1. 导出 SVG 文件
2. 手动提交到 GitHub
3. 创建 PR

### Q: 如何查看哪些文件上传失败？

A: 查看控制台日志：

```javascript
// 在控制台运行
console.log('失败的文件:', failedFiles)
```

或查看插件显示的摘要：

```
上传中: 40/40 (成功: 38, 失败: 2)
```

### Q: 部分文件失败是否会影响 PR？

A: 不会。插件会：

1. 显示失败文件列表
2. 询问是否继续创建 PR
3. 只包含成功上传的文件

你可以：

- 选择继续（创建包含部分文件的 PR）
- 选择取消（修复问题后重新上传）

## 技术细节

### 上传流程

```
1. 创建新分支
   ↓
2. 批量上传文件
   ├─ 检查新分支 SHA
   ├─ 检查 main 分支 SHA
   ├─ 上传文件
   └─ 处理冲突（重试）
   ↓
3. 显示结果
   ├─ 成功: X 个
   ├─ 失败: Y 个
   └─ 询问是否继续
   ↓
4. 创建 PR
```

### 错误处理

```javascript
try {
  // 策略 1: 从新分支获取 SHA
  const sha = await getFileSha(branchName)

  if (!sha) {
    // 策略 2: 从 main 分支获取 SHA
    const mainSha = await getFileSha('main')
  }

  // 上传文件
  const response = await uploadFile(sha)

  if (response.status === 409) {
    // 策略 3: 冲突重试
    await sleep(1000)
    const newSha = await getFileSha(branchName)
    await uploadFile(newSha)
  }
} catch (error) {
  // 记录失败
  failedFiles.push({ fileName, error })
}
```

## 相关文档

- [GitHub 422 错误解决方案](./GITHUB-422-ERROR.md)
- [故障排除指南](./TROUBLESHOOTING.md)
- [Figma 插件使用指南](../figma-plugin/README.md)

## 需要帮助？

如果问题仍然存在：

1. 导出控制台日志
2. 记录失败的文件名和错误信息
3. 在仓库中创建 Issue

---

**更新日期：** 2026-01-19
**版本：** 2.0.0
