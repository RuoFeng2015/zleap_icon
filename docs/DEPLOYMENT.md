# 部署指南

本文档详细说明如何部署 Figma Icon Automation 系统。

## 目录

- [前置要求](#前置要求)
- [第一步：Fork 或创建仓库](#第一步fork-或创建仓库)
- [第二步：配置 GitHub Secrets](#第二步配置-github-secrets)
- [第三步：安装 Figma 插件](#第三步安装-figma-插件)
- [第四步：配置 GitHub Pages](#第四步配置-github-pages)
- [第五步：验证部署](#第五步验证部署)
- [故障排除](#故障排除)

---

## 前置要求

在开始部署之前，请确保你有：

- [ ] GitHub 账号（用于托管代码和运行 Actions）
- [ ] Figma 账号（用于设计图标和使用插件）
- [ ] NPM 账号（用于发布包）
- [ ] Node.js 18+ 和 npm（用于本地开发）

---

## 第一步：Fork 或创建仓库

### 方式一：Fork 现有仓库

1. 点击仓库页面右上角的 "Fork" 按钮
2. 选择你的账号或组织
3. 等待 Fork 完成

### 方式二：从模板创建

```bash
# 克隆仓库
git clone https://github.com/your-org/icon-library.git my-icons
cd my-icons

# 移除原有 git 历史
rm -rf .git
git init

# 修改 package.json 中的包名
# 将 "@your-org/icons" 改为你的包名

# 提交初始代码
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
gh repo create my-org/my-icons --public --source=. --push
```

### 修改包名

编辑 `package.json`：

```json
{
  "name": "@my-org/my-icons", // 修改为你的包名
  "description": "My icon library"
}
```

---

## 第二步：配置 GitHub Secrets

### 2.1 获取 Figma Token

1. 登录 [Figma](https://www.figma.com)
2. 点击右上角头像 → **Settings**
3. 滚动到 **Personal access tokens**
4. 点击 **Generate new token**
5. 输入描述（如 "Icon Automation"）
6. 复制 Token（只显示一次！）

### 2.2 获取 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com)
2. 点击头像 → **Access Tokens**
3. 点击 **Generate New Token**
4. 选择 **Automation** 类型
5. 复制 Token

### 2.3 配置到 GitHub

**方式一：使用 GitHub CLI**

```bash
# 安装 GitHub CLI（如果没有）
brew install gh  # macOS
# 或访问 https://cli.github.com/

# 登录
gh auth login

# 设置 Secrets
gh secret set FIGMA_TOKEN --body "figd_xxxxx"
gh secret set NPM_TOKEN --body "npm_xxxxx"
```

**方式二：通过网页界面**

1. 进入仓库页面
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加 `FIGMA_TOKEN` 和 `NPM_TOKEN`

![GitHub Secrets 配置](https://docs.github.com/assets/cb-28266/images/help/repository/actions-secret-new.png)

---

## 第三步：安装 Figma 插件

### 3.1 构建插件

```bash
cd figma-plugin
npm install
npm run build
```

### 3.2 在 Figma 中加载插件

1. 打开 Figma 桌面应用
2. 点击菜单 **Plugins** → **Development** → **Import plugin from manifest...**
3. 选择 `figma-plugin/manifest.json` 文件
4. 插件将出现在 Plugins 菜单中

### 3.3 配置插件

1. 在 Figma 中打开包含图标的文件
2. 运行插件：**Plugins** → **Development** → **Icon Sync**
3. 在配置界面输入：
   - **GitHub Repository**: `your-org/icon-library`
   - **GitHub Token**: 你的 GitHub Personal Access Token
4. 点击 **Save Configuration**

### 获取 GitHub Personal Access Token

1. 访问 [GitHub Token Settings](https://github.com/settings/tokens)
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 生成并复制 Token

---

## 第四步：配置 GitHub Pages

### 4.1 启用 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. 在 **Source** 下选择 **GitHub Actions**
3. 保存设置

### 4.2 验证工作流权限

1. 进入 **Settings** → **Actions** → **General**
2. 在 **Workflow permissions** 下选择 **Read and write permissions**
3. 勾选 **Allow GitHub Actions to create and approve pull requests**
4. 保存

---

## 第五步：验证部署

### 5.1 测试图标同步

1. 在 Figma 中打开图标文件
2. 运行 Icon Sync 插件
3. 输入版本号（如 `1.0.0`）和更新说明
4. 点击 **Sync Icons**
5. 检查 GitHub 仓库是否创建了新的 Pull Request

### 5.2 测试 NPM 发布

1. 合并上一步创建的 PR
2. 检查 **Actions** 页面，确认 `Publish to NPM` 工作流运行成功
3. 在 npmjs.com 搜索你的包名，确认已发布

### 5.3 测试预览网站

1. 合并 PR 后，检查 `Deploy Preview Site` 工作流
2. 访问 `https://your-org.github.io/icon-library/`
3. 确认图标预览页面正常显示

---

## 完整部署检查清单

- [ ] GitHub 仓库已创建
- [ ] `FIGMA_TOKEN` Secret 已配置
- [ ] `NPM_TOKEN` Secret 已配置
- [ ] Figma 插件已安装并配置
- [ ] GitHub Pages 已启用
- [ ] 工作流权限已配置
- [ ] 首次图标同步成功
- [ ] NPM 包发布成功
- [ ] 预览网站可访问

---

## 故障排除

### 问题：Figma API 调用失败

**错误信息**: `403 Forbidden` 或 `Invalid token`

**解决方案**:

1. 检查 `FIGMA_TOKEN` 是否正确配置
2. 确认 Token 没有过期
3. 重新生成 Figma Token

### 问题：NPM 发布失败

**错误信息**: `403 Forbidden` 或 `You must be logged in`

**解决方案**:

1. 检查 `NPM_TOKEN` 是否正确
2. 确认 Token 类型是 "Automation"
3. 如果是 scoped 包，确认组织存在且你有发布权限
4. 检查包名是否已被占用

### 问题：GitHub Actions 权限不足

**错误信息**: `Resource not accessible by integration`

**解决方案**:

1. 进入 Settings → Actions → General
2. 设置 Workflow permissions 为 "Read and write permissions"
3. 勾选 "Allow GitHub Actions to create and approve pull requests"

### 问题：GitHub Pages 部署失败

**错误信息**: `Branch "gh-pages" is not allowed to deploy`

**解决方案**:

1. 进入 Settings → Pages
2. 将 Source 改为 "GitHub Actions"
3. 重新运行部署工作流

### 问题：Figma 插件无法触发工作流

**错误信息**: `Not Found` 或 `Bad credentials`

**解决方案**:

1. 检查 GitHub Token 是否有 `repo` 权限
2. 确认仓库地址格式正确（`owner/repo`）
3. 确认仓库存在且你有访问权限

### 问题：图标校验失败

**错误信息**: `Icon size not in allowed sizes`

**解决方案**:

1. 检查 Figma 中图标的尺寸是否为 16/20/24/32
2. 确保图标是正方形
3. 如需其他尺寸，修改 `src/icon-validator.ts` 中的 `allowedSizes`

---

## 生产环境建议

### 安全性

1. **定期轮换 Token**: 每 90 天更新一次 Figma 和 NPM Token
2. **最小权限原则**: GitHub Token 只授予必要的 `repo` 权限
3. **审查 PR**: 在合并自动创建的 PR 前进行代码审查

### 监控

1. **启用 Actions 通知**: 在 GitHub 设置中启用工作流失败通知
2. **检查发布日志**: 定期检查 NPM 发布是否成功
3. **监控包下载量**: 在 npmjs.com 查看包的使用情况

### 备份

1. **保存 Token**: 将 Token 安全存储在密码管理器中
2. **导出 Figma 文件**: 定期备份 Figma 图标文件
3. **Git 标签**: 每次发布都会自动创建 Git 标签，可用于回滚

---

## 下一步

部署完成后，你可以：

1. 📖 阅读 [配置指南](./CONFIGURATION.md) 了解更多配置选项
2. 🎨 在 Figma 中设计新图标并同步
3. 📦 在项目中安装并使用图标库
4. 🌐 分享预览网站给团队成员
