# 多色图标支持说明

## 概述

本图标库现在完全支持多色图标！多色图标会保留原始设计颜色，不会被 `color` 属性覆盖。

## 图标类型

### 单色图标（Single-color）

- ✅ 支持 `color` 属性
- ✅ 支持 `size` 属性
- 适合需要主题化的场景

```tsx
<IconArrowRight size={24} color='#1890ff' />
```

### 多色图标（Multicolor）

- ❌ 不支持 `color` 属性（保留原始颜色）
- ✅ 支持 `size` 属性
- 适合品牌图标、插画风格图标

```tsx
<IconChengYuanGuanLi size={48} />
```

## 自动检测

系统会自动检测图标是否为多色：

**检测条件：**

1. 包含 2 个或更多不同的 `fill` 颜色
2. 包含 2 个或更多不同的 `stroke` 颜色
3. 包含渐变（`linearGradient`, `radialGradient`）
4. 包含图案（`pattern`）

**示例：**

```xml
<!-- 单色图标 -->
<svg>
  <path fill="currentColor" d="..." />
</svg>

<!-- 多色图标 -->
<svg>
  <path fill="#6366F1" d="..." />
  <path fill="#8B5CF6" d="..." />
  <circle fill="#60A5FA" cx="..." cy="..." r="..." />
</svg>
```

## 使用方法

### React 组件

```tsx
// 单色图标 - 支持颜色配置
<IconArrowRight
  size={24}
  color="#1890ff"  // ✅ 有效
/>

// 多色图标 - 只支持大小配置
<IconChengYuanGuanLi
  size={48}
  color="red"  // ❌ 无效，会被忽略
/>
```

### 文档网站

在文档网站中：

- **单色图标**：颜色选择器有效
- **多色图标**：颜色选择器无效，保持原始颜色

## 技术实现

### 组件生成

```typescript
// 单色图标
export const IconArrowRight = forwardRef<SVGSVGElement, IconArrowRightProps>(
  ({ size = 24, color = 'currentColor', ...props }, ref) => {
    return (
      <svg
        width={size}
        height={size}
        fill={color}  // ← 应用 color
        {...props}
      >
        {/* ... */}
      </svg>
    );
  }
);

// 多色图标（标记为 multicolor）
/**
 * IconChengYuanGuanLi icon component (multicolor)
 */
export const IconChengYuanGuanLi = forwardRef<SVGSVGElement, IconChengYuanGuanLiProps>(
  ({ size = 24, color = 'currentColor', ...props }, ref) => {
    return (
      <svg
        width={size}
        height={size}
        // ← 不应用 color，保留原始颜色
        {...props}
      >
        {/* ... */}
      </svg>
    );
  }
);
```

### 检测逻辑

```typescript
function isMulticolorSvg(svgContent: string): boolean {
  // 检查多个 fill 颜色
  const fillMatches =
    svgContent.match(/fill="(?!none|currentColor)[^"]+"/g) || []
  const uniqueFills = new Set(fillMatches)

  // 检查多个 stroke 颜色
  const strokeMatches =
    svgContent.match(/stroke="(?!none|currentColor)[^"]+"/g) || []
  const uniqueStrokes = new Set(strokeMatches)

  // 检查渐变或图案
  const hasGradient =
    svgContent.includes('<linearGradient') ||
    svgContent.includes('<radialGradient') ||
    svgContent.includes('<pattern')

  return uniqueFills.size > 1 || uniqueStrokes.size > 1 || hasGradient
}
```

## 常见问题

### Q: 为什么列表中图标不显示，但弹窗中显示？

A: 可能的原因：

1. **SVG 加载失败** - 检查网络请求
2. **颜色被错误应用** - 多色图标被应用了单色逻辑

**解决方案：**

- 清除浏览器缓存
- 重新生成组件：`npm run generate-components`
- 检查浏览器控制台错误

### Q: 如何将单色图标转换为多色？

A: 在 Figma 中：

1. 选择图标
2. 使用多个颜色填充不同部分
3. 或添加渐变效果
4. 重新导出

### Q: 如何将多色图标转换为单色？

A: 在 Figma 中：

1. 选择图标
2. 将所有颜色改为单一颜色或 `currentColor`
3. 移除渐变和图案
4. 重新导出

## 最佳实践

### 设计阶段

**单色图标：**

- 使用黑色 (#000000) 或 `currentColor`
- 避免使用多个颜色
- 简单的线条和形状

**多色图标：**

- 使用 2-4 种颜色
- 使用渐变增强立体感
- 保持品牌色一致

### 使用阶段

**单色图标：**

```tsx
// 根据主题动态改变颜色
<IconArrowRight color={theme.primaryColor} />

// 继承父元素颜色
<div style={{ color: '#1890ff' }}>
  <IconArrowRight />
</div>
```

**多色图标：**

```tsx
// 只调整大小
<IconChengYuanGuanLi size={48} />

// 如需改变颜色，使用 CSS filter
<IconChengYuanGuanLi
  size={48}
  style={{ filter: 'grayscale(100%)' }}
/>
```

## 相关文档

- [图标颜色说明](./ICON-COLORS.md)
- [组件使用指南](./CONFIGURATION.md)
- [开发指南](./DEVELOPMENT.md)

---

**更新日期：** 2026-01-19
**版本：** 2.0.0
