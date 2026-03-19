# Icon Local Test Playground

这个目录是图标库本地联调专用测试工程，用来快速验证：

1. 组件渲染与 Raw SVG 渲染是否一致
2. `color / size / className / style` 等组件参数是否生效
3. 某个具体图标在业务项目中的渲染问题是否可复现

## 目录

- 工程路径：`playground/icon-local-test`
- 关键页面：`src/App.tsx`
- 样式文件：`src/index.css`

## 一次性准备

在仓库根目录执行：

```bash
npm ci
npm run generate-components
npm run generate-outputs
npm run build
```

说明：

- `generate-components` 生成 `src/icons/*` 与 `src/index.ts`
- `generate-outputs` 生成 `sprite/icons.svg` 与 `icons.json`
- `build` 生成发布用 `dist/*`

## 启动本地测试页

```bash
cd playground/icon-local-test
npm install
npm install ../../
npm run dev
```

说明：

- `npm install ../../` 会把当前仓库作为本地包引入（通常是符号链接）
- 这样你改完主仓库代码后，测试页会读取到最新内容

## 常用验证流程

1. 在测试页顶部控件中选择图标（任意 `Icon*`）
2. 调整 `size / color / opacity / rotate / className`
3. 对比左侧 `Component Render` 与右侧 `Raw SVG Render`
4. 如果不一致，打开 DevTools 对比两边 `fill/stroke/viewBox`

## 典型问题排查

### 1) 组件颜色不生效

排查方向：

- 图标是否属于多色图标（多色图标通常不建议整体染色）
- `stroke="black"` / `fill="#000"` 是否已被生成器转为 `currentColor`
- 是否被业务侧 CSS 覆盖（`color`、`fill`、`stroke`）

### 2) `Failed to resolve import "@zleap-ai/icons/..."` 报错

先确认主仓库产物存在：

```bash
cd ../../
npm run generate-components
npm run generate-outputs
npm run build
```

然后回到 playground 重新安装本地包：

```bash
cd playground/icon-local-test
npm install ../../
```

### 3) 修改后页面没有更新

```bash
rm -rf node_modules/.vite
npm run dev
```

## 推荐提交顺序

当你确认修复有效后，建议按下面顺序整理提交：

1. 先提交核心逻辑改动（`src/*`）
2. 再提交生成产物（`src/icons/*`, `src/index.ts`, `icons.json`, `sprite/icons.svg`, `dist/*`）
3. 最后提交测试页变更（`playground/icon-local-test/*`）
