# 图标颜色说明

## 当前状态

目前图标库支持两种类型的图标：

### 1. 单色图标（使用 currentColor）

- 这些图标在 SVG 中使用 `fill="currentColor"` 或 `stroke="currentColor"`
- 颜色会继承父元素的文本颜色
- 可以通过 CSS 的 `color` 属性动态改变颜色
- 适合需要根据主题或上下文改变颜色的场景

**示例图标**：

- arrow-right
- check
- close-circle

### 2. 彩色图标（保留原始颜色）

- 这些图标在 Figma 中设计时包含具体的颜色值
- 导出后会保留原始的颜色信息
- 颜色固定，不会随上下文改变
- 适合品牌图标、插画风格的图标

**示例图标**：

- 企业版
- 成员管理
- 搜索助手
- 问答助手
- 下载助手
- 系统配置
- 运营管理

## Figma 导出限制

### 问题

Figma 的 `exportAsync` API 在导出 SVG 时有一些限制：

- 如果图标使用了渐变、阴影等复杂效果，可能会被简化
- 某些颜色可能会被转换为 `currentColor`
- 导出选项有限，无法完全控制颜色保留

### 当前解决方案

1. **插件配置**：
   - 使用 `contentsOnly: false` 包含容器
   - 不使用 `svgSimplifyStroke` 避免简化
   - 移除 `svgIdAttribute` 减少不必要的属性

2. **SVG 转换配置**：
   - 禁用 SVGO 的 `convertColors` 插件
   - 保留原始的 `fill` 和 `stroke` 属性
   - 只进行基本的优化（移除尺寸、清理代码）

## 如何在 Figma 中设计彩色图标

为了确保图标导出时保留颜色，请遵循以下最佳实践：

### 1. 使用实色填充

```
✅ 正确：直接使用颜色值（如 #FF5733）
❌ 错误：使用样式变量或主题颜色
```

### 2. 避免复杂效果

```
✅ 支持：纯色填充、描边
⚠️  可能有问题：渐变、阴影、模糊
❌ 不支持：混合模式、特殊效果
```

### 3. 扁平化图层

```
✅ 正确：将复杂图层扁平化为单个形状
❌ 错误：使用多层嵌套和组合
```

### 4. 使用 Frame 或 Component

```
✅ 正确：将图标放在 Frame 或 Component 中
❌ 错误：直接使用 Group
```

## 在代码中使用图标

### React 组件

```tsx
import { IconQiYeBan, IconArrowRight } from '@your-org/icons'

// 彩色图标 - 使用原始颜色
<IconQiYeBan size={48} />

// 单色图标 - 可以改变颜色
<IconArrowRight size={24} color="#FF5733" />
<IconArrowRight size={24} style={{ color: 'blue' }} />
```

### 直接使用 SVG

```html
<!-- 彩色图标 -->
<img src="svg/企业版.svg" alt="企业版" />

<!-- 单色图标 - 通过 CSS 改变颜色 -->
<svg style="color: red;">
  <use href="sprite/icons.svg#arrow-right" />
</svg>
```

## 预览网站的颜色控制

文档预览网站（https://ruofeng2015.github.io/zleap_icon/）提供了颜色选择器：

- **Current Color**：使用图标的原始颜色（彩色图标显示彩色，单色图标显示黑色）
- **其他颜色**：只对单色图标生效，彩色图标不受影响

## 故障排除

### 问题：导出的图标全是黑色

**原因**：Figma 中的图标可能使用了样式变量或主题颜色

**解决方案**：

1. 在 Figma 中选中图标
2. 检查填充颜色是否使用了变量
3. 将变量替换为具体的颜色值
4. 重新导出图标

### 问题：图标颜色不正确

**原因**：可能使用了不支持的效果或混合模式

**解决方案**：

1. 简化图标设计，移除复杂效果
2. 使用"扁平化选择"功能
3. 确保所有图层都使用实色填充

### 问题：渐变颜色丢失

**原因**：Figma 导出 SVG 时可能简化渐变

**解决方案**：

1. 尝试将渐变转换为多个纯色图层
2. 或者接受单色版本
3. 如果必须使用渐变，考虑手动编辑导出的 SVG

## 未来改进

可能的改进方向：

1. **支持更多导出选项**
   - 研究 Figma API 的其他导出方式
   - 可能需要使用 REST API 而不是插件 API

2. **颜色配置**
   - 允许用户选择是否保留颜色
   - 提供颜色替换功能

3. **自动检测**
   - 自动检测图标是单色还是彩色
   - 根据类型应用不同的处理策略

4. **颜色主题**
   - 支持为单色图标定义多个颜色主题
   - 生成不同颜色版本的图标

## 参考资料

- [Figma Plugin API - exportAsync](https://www.figma.com/plugin-docs/api/nodes/#exportasync)
- [SVG currentColor](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color)
- [SVGO 配置](https://github.com/svg/svgo)
