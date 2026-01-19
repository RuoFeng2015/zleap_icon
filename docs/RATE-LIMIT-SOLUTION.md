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

## 最新更新 (2026-01-19)

### 修复：icons.json 双重上传

**问题**：全量覆盖后，文档网站仍显示旧图标

**原因**：

- Figma 插件上传 `icons.json` 到 `docs/public/icons.json`
- GitHub Actions 从根目录的 `icons.json` 读取
- GitHub Actions 检测到根目录没有 `icons.json`，重新生成
- 重新生成的 `icons.json` 覆盖了插件上传的版本

**解决方案**：

- 插件现在同时上传到两个位置：
  1. `icons.json`（根目录）- 供 GitHub Actions 使用
  2. `docs/public/icons.json` - 供文档网站使用
- 确保两个文件内容完全一致

**验证方法**：

1. 使用全量覆盖模式上传图标
2. 等待 PR 合并和部署
3. 访问文档网站
4. 确认只显示新上传的图标
5. 检查图标数量是否正确

---

**更新日期：** 2026-01-19
**版本：** 2.3.0

## 最新更新 (2026-01-19 v2.3.0)

### 修复：GitHub Actions 重新生成 icons.json 问题

**问题**：全量覆盖后，文档网站仍显示所有旧图标

**根本原因**：

1. Figma 插件正确删除了旧 SVG 文件 ✅
2. Figma 插件正确上传了新 SVG 文件 ✅
3. Figma 插件正确生成并上传了 `icons.json` ✅
4. **问题**：GitHub Actions 工作流检测到 SVG 文件存在，自动运行 `npm run generate-outputs` 重新生成 `icons.json`
5. 重新生成的 `icons.json` 从 main 分支的 `svg` 目录读取，包含了所有文件（包括旧文件）

**为什么会这样**：

- PR 合并到 main 时，Git 只合并变更的文件
- 如果 PR 中删除了文件 A，但 main 分支上文件 A 仍然存在（因为是在不同的提交中添加的）
- 合并后，main 分支上文件 A 仍然存在
- GitHub Actions 从 main 分支读取所有 SVG 文件，生成包含所有图标的 `icons.json`

**解决方案**：

修改 `.github/workflows/deploy-docs.yml`，添加检测逻辑：

```yaml
- name: Generate icons if needed
  run: |
    # 检查 icons.json 是否在最近的提交中被更新（来自 Figma 插件）
    ICONS_JSON_UPDATED=$(git log -1 --name-only --pretty=format: | grep -c "^icons.json$" || echo "0")

    if [ "$ICONS_JSON_UPDATED" -gt 0 ]; then
      echo "✅ icons.json 由 Figma 插件更新，直接使用"
      # 不重新生成，使用插件上传的版本
    else
      echo "重新生成 icons.json..."
      npm run generate-outputs
    fi
```

**关键改进**：

1. **检测提交历史**：查看 `icons.json` 是否在最近的提交中被修改
2. **优先使用插件版本**：如果插件上传了 `icons.json`，直接使用，不重新生成
3. **保持向后兼容**：如果 `icons.json` 不存在或过时，仍然自动生成

**验证方法**：

1. 使用全量覆盖模式上传 5 个新图标
2. 等待 PR 合并
3. 检查 GitHub Actions 日志，应该看到：
   ```
   ✅ icons.json 由 Figma 插件更新，直接使用
   ```
4. 访问文档网站
5. 确认只显示 5 个新图标，不显示旧图标

---

**更新日期：** 2026-01-19
**版本：** 2.3.0
