# 速率限制和冲突解决方案

## 问题描述

在上传图标到 GitHub 时，可能会遇到以下问题：

1. **409 Conflict 错误**：SHA 不匹配

   ```json
   {
     "message": "is at 247678595a7da53f2657dbe37ebbc1208ec1334a but expected 5bbe650efe50a420386051a3f0b78543a3a08e0b",
     "status": "409"
   }
   ```

2. **全量覆盖后旧图标仍显示**：文档网站显示旧图标

## 解决方案

### 1. 改进的 SHA 冲突处理

#### 问题原因

- 文件在获取 SHA 和上传之间被修改
- GitHub API 的最终一致性导致 SHA 不同步
- 并发上传导致竞态条件

#### 解决策略

实现了**三层 SHA 获取策略 + 多次重试**：

```javascript
// 策略 1: 从新分支获取 SHA
const branchFileCheck = await fetch(
  `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branchName}`,
)

// 策略 2: 如果新分支没有，从 main 分支获取
if (!fileSha) {
  const mainFileCheck = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}?ref=main`,
  )
}

// 策略 3: 如果仍然冲突，重试最多 3 次
if (updateResponse.status === 409) {
  for (let retryCount = 0; retryCount < 3; retryCount++) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // 重新获取 SHA 并重试上传
  }
}
```

#### 改进点

1. **增加重试次数**：从 1 次增加到 3 次
2. **增加等待时间**：从 1 秒增加到 1.5 秒
3. **更详细的日志**：显示每次重试的 SHA 值
4. **智能退出**：成功或非 409 错误时立即退出循环

### 2. 全量覆盖模式的完整实现

#### 问题原因

全量覆盖模式只删除了 SVG 文件，但没有更新 `docs/public/icons.json`，导致：

- 文档网站仍然从旧的 `icons.json` 加载图标列表
- 显示已删除的图标（404 错误）
- 不显示新上传的图标

#### 解决方案

在全量覆盖模式下，执行以下步骤：

```
1. 删除 svg 目录下的所有旧 SVG 文件
2. 删除旧的 docs/public/icons.json 文件  ← 新增
3. 上传新的 SVG 文件
4. 生成并上传新的 icons.json 文件      ← 新增
5. 创建 Pull Request
```

#### 实现细节

**删除旧的 icons.json**：

```javascript
if (syncRequest.syncMode === 'replace') {
  // 删除 SVG 文件...

  // 删除旧的 icons.json
  const iconsJsonResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents/docs/public/icons.json?ref=${branchName}`,
  )

  if (iconsJsonResponse.status === 200) {
    const iconsJsonData = await iconsJsonResponse.json()
    await fetch(
      `https://api.github.com/repos/${repo}/contents/docs/public/icons.json`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          message: 'Delete old icons.json',
          sha: iconsJsonData.sha,
          branch: branchName,
        }),
      },
    )
  }
}
```

**生成新的 icons.json**：

```javascript
// 生成 icons.json 内容
const iconsJsonContent = {
  version: syncRequest.version,
  generatedAt: new Date().toISOString(),
  totalCount: uploadedCount,
  icons: syncRequest.icons.map((icon) => ({
    name: generateComponentName(icon.name),
    originalName: icon.name,
    svgPath: `svg/${sanitizeFilename(icon.name)}.svg`,
    componentPath: `src/icons/${generateComponentName(icon.name)}.tsx`,
    size: {
      width: icon.width || 24,
      height: icon.height || 24,
    },
  })),
}

// 上传到 GitHub
const jsonBase64 = btoa(
  unescape(encodeURIComponent(JSON.stringify(iconsJsonContent, null, 2))),
)
await fetch(
  `https://api.github.com/repos/${repo}/contents/docs/public/icons.json`,
  {
    method: 'PUT',
    body: JSON.stringify({
      message: `Update icons.json for v${syncRequest.version}`,
      content: jsonBase64,
      branch: branchName,
    }),
  },
)
```

## 最佳实践

### 避免 409 冲突

1. **使用批量上传**：每批 3 个文件，减少并发
2. **增加批次间隔**：批次之间等待 1 秒
3. **启用重试机制**：自动重试最多 3 次
4. **监控日志**：查看控制台了解失败原因

### 全量覆盖模式

1. **确认选择**：确保选中了所有要保留的图标
2. **检查预览**：在插件中查看图标列表
3. **阅读警告**：仔细阅读确认对话框
4. **等待完成**：不要在上传过程中关闭插件

### 调试技巧

**查看控制台日志**：

```javascript
// 成功上传
✅ icon-name.svg 上传成功

// 失败上传
❌ icon-name.svg 上传失败: {status: 409, error: "..."}

// 重试信息
重试 1: 获取到新 SHA: 2476785...
```

**检查上传统计**：

```
上传中: 10/15 (成功: 8, 失败: 2)
```

**失败文件列表**：

```javascript
失败的文件详情:
- icon-a.svg: SHA mismatch (状态: 409)
- icon-b.svg: Network error (状态: N/A)
```

## 故障排除

### 问题：大量 409 错误

**原因**：

- GitHub API 最终一致性延迟
- 网络延迟较高
- 并发上传过多

**解决方案**：

1. 减少批量大小（从 3 改为 2）
2. 增加批次间隔（从 1 秒改为 2 秒）
3. 检查网络连接
4. 重试上传

### 问题：icons.json 上传失败

**原因**：

- JSON 格式错误
- Base64 编码问题
- 文件权限问题

**解决方案**：

1. 检查控制台错误信息
2. 验证 JSON 格式
3. 确认 GitHub Token 权限
4. 手动上传 icons.json

### 问题：文档网站显示旧图标

**原因**：

- icons.json 未更新
- 浏览器缓存
- CDN 缓存

**解决方案**：

1. 确认 icons.json 已更新
2. 清除浏览器缓存（Ctrl+Shift+R）
3. 等待 CDN 缓存过期（通常 5-10 分钟）
4. 检查 GitHub Pages 部署状态

## 技术细节

### SHA 获取优先级

```
1. 新分支 (branchName)
   ↓ 如果不存在
2. 主分支 (main)
   ↓ 如果仍然冲突
3. 重试获取新分支 SHA (最多 3 次)
```

### 重试策略

```javascript
重试次数: 3
重试间隔: 1.5 秒
退出条件: 成功 || 非 409 错误
```

### 批量上传策略

```javascript
批量大小: 3 个文件/批
批次间隔: 1 秒
总体策略: 串行批次 + 并行文件
```

### icons.json 生成

```javascript
{
  version: "1.2.0",           // 从用户输入
  generatedAt: "2026-01-19...", // 当前时间
  totalCount: 15,             // 成功上传的数量
  icons: [                    // 图标列表
    {
      name: "IconArrowRight",           // 组件名
      originalName: "arrow-right",      // 原始名称
      svgPath: "svg/arrow-right.svg",   // SVG 路径
      componentPath: "src/icons/...",   // 组件路径
      size: { width: 24, height: 24 }   // 尺寸
    }
  ]
}
```

## 监控和日志

### 上传进度

```
正在删除旧图标...
找到 40 个旧图标文件，准备删除...
✅ 已删除 40 个旧图标
✅ 已删除旧的 icons.json

正在上传新图标...
上传中: 5/15 (成功: 4, 失败: 1)
✅ icon-a.svg 上传成功
❌ icon-b.svg 上传失败: SHA mismatch

正在生成 icons.json...
✅ icons.json 上传成功

正在创建 PR...
✅ PR 创建成功
```

### 错误日志

```javascript
console.error('❌ ${fileName} 上传失败:', {
  status: 409,
  statusText: 'Conflict',
  error: 'SHA mismatch',
  filePath: 'svg/icon.svg',
  branch: 'icon-sync-...',
  hasSha: true,
})
```

## 相关文档

- [同步模式说明](./SYNC-MODES.md)
- [上传失败排查指南](./UPLOAD-FAILURES.md)
- [GitHub 422 错误解决方案](./GITHUB-422-ERROR.md)

---

**更新日期：** 2026-01-19
**版本：** 2.1.0
