# Figma Icon Automation

一套完整的 Figma 图标自动化工作流系统，实现从 Figma 设计到 NPM 发布的全自动化流程。

## 功能特性

- 🎨 **Figma 插件** - 设计师一键触发图标同步
- 🔄 **自动化工作流** - GitHub Actions 自动处理图标转换和发布
- ⚛️ **React 组件** - 自动生成 TypeScript React 图标组件
- 📦 **多格式输出** - 支持 React 组件、SVG 文件、SVG Sprite、JSON 元数据
- 🌐 **预览网站** - 自动部署到 GitHub Pages 的图标预览站点
- ✅ **规范校验** - 自动检查图标尺寸、命名和 SVG 特性
- 📝 **自动 Changelog** - 自动生成版本变更日志

## 快速开始

### 安装

```bash
npm install @zleap-ai/icons
# 或
yarn add @zleap-ai/icons
# 或
pnpm add @zleap-ai/icons
```

### 使用方式

#### 1. 导入单个图标（推荐，支持 Tree Shaking）

```tsx
import { IconArrowRight, IconCheck } from '@zleap-ai/icons'

function App() {
  return (
    <div>
      <IconArrowRight size={24} color='#333' />
      <IconCheck size={20} color='green' />
    </div>
  )
}
```

#### 2. 使用 Props

所有图标组件支持以下 Props：

| Prop        | 类型               | 默认值           | 说明                 |
| ----------- | ------------------ | ---------------- | -------------------- |
| `size`      | `number \| string` | `24`             | 图标尺寸（宽高相同） |
| `color`     | `string`           | `'currentColor'` | 图标颜色             |
| `className` | `string`           | -                | CSS 类名             |
| `style`     | `CSSProperties`    | -                | 内联样式             |
| `...props`  | `SVGProps`         | -                | 其他 SVG 原生属性    |

```tsx
<IconArrowRight
  size={32}
  color='#1890ff'
  className='my-icon'
  onClick={() => console.log('clicked')}
  aria-label='向右箭头'
/>
```

#### 3. 使用 SVG Sprite

```html
<!-- 引入 sprite 文件 -->
<script>
  fetch('node_modules/@zleap-ai/icons/sprite/icons.svg')
    .then((r) => r.text())
    .then((svg) => document.body.insertAdjacentHTML('afterbegin', svg))
</script>

<!-- 使用图标 -->
<svg width="24" height="24">
  <use href="#arrow-right"></use>
</svg>
```

#### 4. 使用原始 SVG 文件

```tsx
import arrowRightSvg from '@zleap-ai/icons/svg/arrow-right.svg'

// 或直接引用路径
;<img src='node_modules/@zleap-ai/icons/svg/arrow-right.svg' alt='arrow' />
```

#### 5. 获取图标元数据

```tsx
import iconsData from '@zleap-ai/icons/icons.json'

console.log(iconsData.icons) // 所有图标信息
console.log(iconsData.version) // 当前版本
```

## 项目结构

```
icon-library/
├── .github/workflows/       # GitHub Actions 工作流
│   ├── sync-icons.yml       # 图标同步工作流
│   ├── publish.yml          # NPM 发布工作流
│   └── deploy-docs.yml      # 预览网站部署
├── src/
│   ├── icons/               # 生成的 React 图标组件
│   ├── index.ts             # 主导出文件
│   └── types.ts             # 类型定义
├── svg/                     # 原始 SVG 文件
├── sprite/
│   └── icons.svg            # SVG Sprite 文件
├── dist/                    # 编译输出
│   ├── esm/                 # ES Modules
│   ├── cjs/                 # CommonJS
│   └── types/               # 类型定义
├── docs/                    # 预览网站源码
├── scripts/                 # 处理脚本
├── figma-plugin/            # Figma 插件源码
├── icons.json               # 图标元数据
└── CHANGELOG.md             # 变更日志
```

## 文档

| 文档                                   | 说明                                           |
| -------------------------------------- | ---------------------------------------------- |
| [配置指南](./docs/CONFIGURATION.md)    | GitHub Secrets、Figma 插件、图标规范、构建配置 |
| [部署指南](./docs/DEPLOYMENT.md)       | 完整的部署流程和故障排除                       |
| [Figma 插件](./figma-plugin/README.md) | 插件安装、配置和使用方法                       |
| [开发指南](./docs/DEVELOPMENT.md)      | 本地开发、测试和贡献指南                       |
| [本地联调 Playground](./playground/icon-local-test/README.md) | 图标组件与 Raw SVG 对比调试、样式调参、问题复现 |

## 工作流程

```
设计师在 Figma 更新图标
        ↓
点击 Figma 插件同步按钮
        ↓
触发 GitHub Actions (sync-icons.yml)
        ↓
从 Figma API 获取 SVG → 优化 SVG → 生成 React 组件
        ↓
自动创建 Pull Request
        ↓
合并 PR 后自动发布到 NPM (publish.yml)
        ↓
自动部署预览网站 (deploy-docs.yml)
```

## 许可证

MIT License
