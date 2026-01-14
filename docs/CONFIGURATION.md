# 配置指南

本文档详细说明 Figma Icon Automation 系统的所有配置项。

## 目录

- [GitHub Secrets 配置](#github-secrets-配置)
- [Figma 插件配置](#figma-插件配置)
- [图标规范配置](#图标规范配置)
- [构建配置](#构建配置)
- [NPM 包配置](#npm-包配置)

---

## GitHub Secrets 配置

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中配置以下 Secrets：

### 必需的 Secrets

| Secret 名称   | 说明                        | 获取方式                                       |
| ------------- | --------------------------- | ---------------------------------------------- |
| `FIGMA_TOKEN` | Figma Personal Access Token | Figma → Settings → Personal access tokens      |
| `NPM_TOKEN`   | NPM 发布 Token              | npmjs.com → Access Tokens → Generate New Token |

### 获取 Figma Token

1. 登录 [Figma](https://www.figma.com)
2. 点击右上角头像 → Settings
3. 滚动到 Personal access tokens 部分
4. 点击 "Generate new token"
5. 输入 Token 描述（如 "Icon Automation"）
6. 复制生成的 Token

> ⚠️ Token 只显示一次，请妥善保存

### 获取 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com)
2. 点击头像 → Access Tokens
3. 点击 "Generate New Token"
4. 选择 "Automation" 类型
5. 复制生成的 Token

### 配置到 GitHub

```bash
# 使用 GitHub CLI
gh secret set FIGMA_TOKEN --body "your-figma-token"
gh secret set NPM_TOKEN --body "your-npm-token"
```

或在 GitHub 网页界面：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 输入 Name 和 Value

---

## Figma 插件配置

### 插件配置项

在 Figma 插件中需要配置：

| 配置项            | 说明                                    | 示例                    |
| ----------------- | --------------------------------------- | ----------------------- |
| GitHub Repository | 仓库地址（owner/repo 格式）             | `your-org/icon-library` |
| GitHub Token      | Personal Access Token（需要 repo 权限） | `ghp_xxxx...`           |

### 获取 GitHub Personal Access Token

1. 访问 [GitHub Token Settings](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `repo` - 完整仓库访问权限
4. 生成并复制 Token

### 插件配置存储

插件配置安全存储在 Figma 客户端本地存储中：

```typescript
// 配置存储位置
figma.clientStorage.setAsync('config', {
  githubRepo: 'your-org/icon-library',
  githubToken: 'ghp_xxxx...',
})
```

---

## 图标规范配置

### 默认校验规则

在 `src/icon-validator.ts` 中定义：

```typescript
const DEFAULT_VALIDATION_RULES = {
  // 允许的图标尺寸
  allowedSizes: [16, 20, 24, 32],

  // 命名规范（小写字母开头，可包含小写字母、数字、连字符）
  namingPattern: /^[a-z][a-z0-9-]*$/,

  // 最大文件大小（字节）
  maxFileSize: 10240, // 10KB

  // 禁止的 SVG 元素
  forbiddenElements: ['image', 'foreignObject', 'script', 'style'],
}
```

### 自定义校验规则

修改 `scripts/validate-icons.ts`：

```typescript
import { validateIcons } from '../src/icon-validator'

const customRules = {
  allowedSizes: [24, 48], // 只允许 24 和 48
  namingPattern: /^icon-[a-z]+$/, // 必须以 icon- 开头
  maxFileSize: 5120, // 5KB
  forbiddenElements: ['image', 'foreignObject'],
}

validateIcons(icons, customRules)
```

---

## 构建配置

### TypeScript 配置

项目使用多个 tsconfig 文件：

#### tsconfig.json（基础配置）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  }
}
```

#### tsconfig.esm.json（ES Modules 输出）

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist/esm",
    "module": "ESNext"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts"]
}
```

#### tsconfig.cjs.json（CommonJS 输出）

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist/cjs",
    "module": "CommonJS"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts"]
}
```

### Vite 配置（预览网站）

`vite.docs.config.ts`:

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'docs',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: './', // 相对路径，适配 GitHub Pages
})
```

### Vitest 配置（测试）

`vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
```

---

## NPM 包配置

### package.json 关键配置

```json
{
  "name": "@your-org/icons",
  "version": "1.0.0",

  // 入口文件配置
  "main": "dist/cjs/index.js", // CommonJS 入口
  "module": "dist/esm/index.js", // ES Module 入口
  "types": "dist/types/index.d.ts", // 类型定义入口

  // 启用 Tree Shaking
  "sideEffects": false,

  // 条件导出
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./svg/*": "./svg/*",
    "./sprite": "./sprite/icons.svg"
  },

  // 发布包含的文件
  "files": ["dist", "svg", "sprite", "icons.json"],

  // peer 依赖
  "peerDependencies": {
    "react": ">=16.8.0"
  }
}
```

### 修改包名

1. 修改 `package.json` 中的 `name` 字段
2. 如果是 scoped 包（如 `@your-org/icons`），确保：
   - 在 NPM 上创建了对应的 organization
   - 发布时使用 `npm publish --access public`

### 版本管理

版本号遵循语义化版本规范（SemVer）：

- **Major (x.0.0)**: 有图标删除或破坏性变更
- **Minor (0.x.0)**: 有新图标添加
- **Patch (0.0.x)**: 仅有图标修改

---

## 环境变量

### 本地开发环境变量

创建 `.env.local` 文件（已在 .gitignore 中）：

```bash
# Figma API
FIGMA_TOKEN=your-figma-token
FIGMA_FILE_KEY=your-figma-file-key

# 版本信息（用于本地测试）
VERSION=1.0.0
MESSAGE="Test update"
```

### GitHub Actions 环境变量

在工作流中自动设置：

```yaml
env:
  FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
  FIGMA_FILE_KEY: ${{ github.event.client_payload.figma_file_key }}
  VERSION: ${{ github.event.client_payload.version }}
  MESSAGE: ${{ github.event.client_payload.message }}
```

---

## 常见配置问题

### Q: 如何修改图标前缀？

修改 `src/component-generator.ts` 中的 `ICON_PREFIX`：

```typescript
const ICON_PREFIX = 'Icon' // 改为你想要的前缀
```

### Q: 如何添加新的输出格式？

在 `src/multi-format-output.ts` 中添加新的生成函数，然后在 `scripts/generate-outputs.ts` 中调用。

### Q: 如何修改 SVGO 优化配置？

修改 `src/svg-transformer.ts` 中的 `svgoConfig`：

```typescript
const svgoConfig = {
  plugins: [
    'preset-default',
    // 添加或修改插件
  ],
}
```
