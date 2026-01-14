# 开发指南

本文档说明如何在本地开发和贡献 Figma Icon Automation 项目。

## 目录

- [环境准备](#环境准备)
- [本地开发](#本地开发)
- [脚本说明](#脚本说明)
- [测试](#测试)
- [代码结构](#代码结构)
- [贡献指南](#贡献指南)

---

## 环境准备

### 系统要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本
- Git

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/your-org/icon-library.git
cd icon-library

# 安装依赖
npm install
```

### 环境变量

创建 `.env.local` 文件用于本地开发：

```bash
# Figma API（用于本地测试 fetch-icons 脚本）
FIGMA_TOKEN=your-figma-token
FIGMA_FILE_KEY=your-figma-file-key

# 版本信息（用于本地测试 changelog 生成）
VERSION=1.0.0
MESSAGE="Test update"
```

---

## 本地开发

### 开发工作流

```bash
# 1. 运行测试（确保现有功能正常）
npm test

# 2. 启动预览网站开发服务器
npm run dev:docs

# 3. 修改代码...

# 4. 运行测试验证修改
npm test

# 5. 构建验证
npm run build
```

### 常用命令

| 命令                    | 说明                     |
| ----------------------- | ------------------------ |
| `npm test`              | 运行所有测试             |
| `npm run test:watch`    | 监听模式运行测试         |
| `npm run test:coverage` | 运行测试并生成覆盖率报告 |
| `npm run build`         | 构建所有输出格式         |
| `npm run build:esm`     | 仅构建 ES Modules        |
| `npm run build:cjs`     | 仅构建 CommonJS          |
| `npm run build:types`   | 仅构建类型定义           |
| `npm run build:docs`    | 构建预览网站             |

---

## 脚本说明

### fetch-icons.ts

从 Figma API 获取图标 SVG。

```bash
# 需要设置环境变量
FIGMA_TOKEN=xxx FIGMA_FILE_KEY=xxx npm run fetch-icons
```

**输入**: Figma 文件 Key 和 Token
**输出**: `svg/` 目录下的 SVG 文件，`icons-manifest.json`

### validate-icons.ts

校验图标是否符合规范。

```bash
npm run validate-icons
```

**输入**: `svg/` 目录下的 SVG 文件
**输出**: `validation-report.md`，控制台输出校验结果

### transform-svg.ts

优化 SVG 文件。

```bash
npm run transform-svg
```

**输入**: `svg/` 目录下的原始 SVG
**输出**: 优化后的 SVG（覆盖原文件）

### generate-components.ts

生成 React 组件。

```bash
npm run generate-components
```

**输入**: `svg/` 目录下的 SVG 文件
**输出**: `src/icons/` 目录下的 React 组件，`src/index.ts`

### generate-outputs.ts

生成多格式输出。

```bash
npm run generate-outputs
```

**输入**: `svg/` 目录下的 SVG 文件
**输出**: `sprite/icons.svg`，`icons.json`

### generate-changelog.ts

生成变更日志。

```bash
VERSION=1.1.0 MESSAGE="Added new icons" npm run generate-changelog
```

**输入**: 当前和之前的 `icons-manifest.json`
**输出**: 更新 `CHANGELOG.md`

---

## 测试

### 测试结构

```
tests/
├── unit/              # 单元测试
├── property/          # 属性测试（Property-Based Testing）
│   ├── name-transformation.property.test.ts
│   ├── svg-optimization.property.test.ts
│   ├── component-structure.property.test.ts
│   └── ...
└── integration/       # 集成测试
    └── pipeline.test.ts
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定类型的测试
npm run test:unit
npm run test:property
npm run test:integration

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 属性测试

项目使用 [fast-check](https://github.com/dubzzz/fast-check) 进行属性测试。每个属性测试至少运行 100 次迭代。

示例：

```typescript
import fc from 'fast-check'
import { toPascalCase } from '../src/component-generator'

describe('Component Name Transformation', () => {
  it('should always produce valid PascalCase names', () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => /^[a-z]/.test(s)),
        (iconName) => {
          const result = toPascalCase(iconName)
          // 验证结果以大写字母开头
          expect(result[0]).toMatch(/[A-Z]/)
          // 验证只包含字母数字
          expect(result).toMatch(/^[A-Za-z0-9]+$/)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

---

## 代码结构

### 核心模块

```
src/
├── types.ts              # 共享类型定义
├── figma-client.ts       # Figma API 客户端
├── icon-filter.ts        # 图标组件筛选
├── svg-exporter.ts       # SVG 导出
├── svg-transformer.ts    # SVG 优化转换
├── component-generator.ts # React 组件生成
├── icon-validator.ts     # 图标规范校验
├── manifest-generator.ts # 清单生成
├── multi-format-output.ts # 多格式输出
├── changelog-generator.ts # Changelog 生成
├── version-manager.ts    # 版本管理
├── icon-search.ts        # 图标搜索（预览网站用）
├── index.ts              # 主导出文件
└── icons/                # 生成的图标组件
```

### 类型定义

```typescript
// src/types.ts

// 图标元数据
interface IconMetadata {
  id: string
  name: string
  originalName: string
  normalizedName: string
  width: number
  height: number
  svgContent?: string
}

// 图标清单
interface IconManifest {
  version: string
  generatedAt: string
  totalCount: number
  icons: IconMetadata[]
}

// 校验结果
interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// 组件模板
interface ComponentTemplate {
  componentName: string
  fileName: string
  content: string
  types: string
}
```

---

## 贡献指南

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

类型：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：

```
feat(generator): add support for custom icon prefix
fix(validator): handle empty SVG content
docs: update deployment guide
```

### Pull Request 流程

1. Fork 仓库
2. 创建功能分支：`git checkout -b feat/my-feature`
3. 提交更改：`git commit -m "feat: add my feature"`
4. 推送分支：`git push origin feat/my-feature`
5. 创建 Pull Request

### PR 检查清单

- [ ] 代码通过所有测试
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 遵循代码风格规范
- [ ] Commit 信息符合规范

### 添加新功能

1. **添加新的输出格式**

   - 在 `src/multi-format-output.ts` 添加生成函数
   - 在 `scripts/generate-outputs.ts` 调用
   - 添加对应的属性测试

2. **添加新的校验规则**

   - 在 `src/icon-validator.ts` 添加校验逻辑
   - 更新 `ValidationRules` 类型
   - 添加测试用例

3. **修改组件模板**
   - 修改 `src/component-generator.ts` 中的模板
   - 更新 `component-structure.property.test.ts` 测试
   - 重新生成示例组件验证

---

## 调试技巧

### 调试脚本

```bash
# 使用 Node.js 调试器
node --inspect-brk node_modules/.bin/tsx scripts/fetch-icons.ts

# 或使用 VS Code 调试配置
```

VS Code 调试配置 (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Script",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["tsx", "${file}"],
      "env": {
        "FIGMA_TOKEN": "your-token",
        "FIGMA_FILE_KEY": "your-file-key"
      }
    }
  ]
}
```

### 调试测试

```bash
# 运行单个测试文件
npm test -- tests/property/name-transformation.property.test.ts

# 运行匹配的测试
npm test -- -t "should produce valid PascalCase"
```

---

## 发布流程

### 手动发布（本地）

```bash
# 1. 确保测试通过
npm test

# 2. 构建
npm run build

# 3. 更新版本
npm version patch  # 或 minor / major

# 4. 发布
npm publish --access public

# 5. 推送标签
git push --tags
```

### 自动发布（推荐）

通过 Figma 插件触发或合并 PR 到 main 分支，GitHub Actions 会自动：

1. 运行测试
2. 构建所有格式
3. 发布到 NPM
4. 创建 GitHub Release
5. 部署预览网站
