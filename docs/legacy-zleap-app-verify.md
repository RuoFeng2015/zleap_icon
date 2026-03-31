# zleap_app Legacy 验证清单

目标：确保 Legacy 导出保留项目原有 SVG，同时 Raw 导出可单独使用。

## 1. 生成两份代码

1. 打开图标预览页。
2. 点击 `Copy All RN Legacy`，保存为临时文件 `legacy-output.tsx`。
3. 点击 `Copy All RN Raw`，保存为临时文件 `raw-output.tsx`。

期望：
- `legacy-output.tsx` 包含 `preserveProjectSvg` 对应回退逻辑：`ensureProjectIconImportMap`。
- `raw-output.tsx` 不包含 `ensureProjectIconImportMap`。

## 2. 在 zleap_app 验证 Legacy 回退

将 `legacy-output.tsx` 临时替换到 `src/components/icon/zleap-icon.tsx` 后，检查：

1. `Icon name="clear"` 显示与项目旧版一致（来自 `src/assets/icons/clear.svg`）。
2. `Icon name="invite"` 显示与项目旧版一致（来自 `src/assets/icons/invite.svg`）。
3. `Icon name="send"` 显示与项目旧版一致（来自 `src/assets/icons/send.svg`）。

建议验证页面：
- `src/components/search-bar/index.tsx`
- `src/pages/user/components/UserInfo.tsx`
- `src/features/chat/components/InputArea.tsx`

## 3. 在 zleap_app 验证 Raw 导入

不改 `Icon name` 体系，新增一个临时页面/片段直接导入 Raw 组件：

1. 选择一个组件（例如 `IconSearch`）直接渲染。
2. 再渲染一个 Legacy 的 `Icon name="search"`。
3. 比较两者都可显示，且互不影响。

## 4. 回归检查

1. `yarn ios` 或 `yarn android` 可启动。
2. 登录页、搜索栏、聊天输入框图标正常。
3. 未出现 `Unmapped icon name` 警告（或仅在预期测试键出现）。

## 5. 常见问题

1. 构建报 `Cannot find module './iconMap'`：
- 检查 alias 配置中的 `projectIconMapImport` 是否与业务项目路径一致。

2. Legacy 图标空白：
- 检查对应 name 是否存在于业务项目 `src/components/icon/iconMap.ts`。

3. Raw 正常但 Legacy 异常：
- 说明回退导入路径有问题，优先检查 `projectIconMapImport`。
