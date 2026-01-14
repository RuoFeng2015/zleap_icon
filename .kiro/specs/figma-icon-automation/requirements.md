# Requirements Document

## Introduction

本项目旨在建立一套自动化流程，让设计师通过 Figma 上传图标后，能够自动将 SVG 转换为 React 组件代码并发布到 NPM。整个流程包含三个核心部分：Figma 插件、GitHub Actions 工作流、以及 React 图标组件库模板。

## Glossary

- **Figma_Plugin**: Figma 插件，用于触发图标同步流程并与 GitHub 交互
- **Icon_Sync_Service**: 图标同步服务，负责从 Figma API 获取 SVG 数据
- **SVG_Transformer**: SVG 转换器，负责优化 SVG 并转换为 React 组件
- **Component_Generator**: React 组件生成器，生成标准化的图标组件代码
- **NPM_Publisher**: NPM 发布服务，负责版本管理和包发布
- **GitHub_Actions_Workflow**: GitHub Actions 工作流，协调整个自动化流程
- **Icon_Library**: 最终生成的 React 图标组件库
- **Preview_Site**: 图标预览网站，部署在 GitHub Pages 上，用于浏览和复制图标代码
- **Changelog_Generator**: 变更日志生成器，自动生成版本更新记录
- **Icon_Sprite**: SVG Sprite 图标集合，用于优化加载性能

## Requirements

### Requirement 1: Figma 插件开发

**User Story:** 作为设计师，我希望在 Figma 中通过插件一键触发图标同步，以便快速将设计好的图标发布给开发团队使用。

#### Acceptance Criteria

1. WHEN 设计师打开 Figma_Plugin THEN Figma_Plugin SHALL 显示配置界面，包含 GitHub 仓库地址和 Token 输入框
2. WHEN 设计师点击同步按钮 THEN Figma_Plugin SHALL 获取当前 Figma 文件中所有图标组件的信息
3. WHEN Figma_Plugin 获取到图标信息 THEN Figma_Plugin SHALL 通过 GitHub API 触发 GitHub Actions 工作流
4. WHEN 同步请求发送成功 THEN Figma_Plugin SHALL 显示成功提示并提供 PR 链接
5. IF 同步请求失败 THEN Figma_Plugin SHALL 显示错误信息并提供重试选项
6. WHEN 设计师输入版本号和更新说明 THEN Figma_Plugin SHALL 将这些信息传递给 GitHub Actions

### Requirement 2: Figma API 图标获取

**User Story:** 作为系统，我需要从 Figma 文件中自动获取所有图标的 SVG 代码，以便进行后续的转换处理。

#### Acceptance Criteria

1. WHEN GitHub_Actions_Workflow 被触发 THEN Icon_Sync_Service SHALL 使用 Figma API 获取指定文件的所有组件
2. WHEN Icon_Sync_Service 获取组件列表 THEN Icon_Sync_Service SHALL 筛选出所有图标类型的组件
3. WHEN Icon_Sync_Service 识别到图标组件 THEN Icon_Sync_Service SHALL 调用 Figma API 导出每个图标的 SVG 代码
4. WHEN 导出 SVG 成功 THEN Icon_Sync_Service SHALL 将 SVG 代码保存到临时目录
5. IF Figma API 调用失败 THEN Icon_Sync_Service SHALL 记录错误日志并终止流程
6. WHEN 所有图标导出完成 THEN Icon_Sync_Service SHALL 生成图标清单文件，包含图标名称和元数据

### Requirement 3: SVG 优化与转换

**User Story:** 作为系统，我需要将原始 SVG 代码优化并转换为标准化格式，以便生成高质量的 React 组件。

#### Acceptance Criteria

1. WHEN SVG_Transformer 接收到 SVG 文件 THEN SVG_Transformer SHALL 使用 SVGO 优化 SVG 代码
2. WHEN SVG_Transformer 优化 SVG THEN SVG_Transformer SHALL 移除不必要的属性和元数据
3. WHEN SVG_Transformer 处理 SVG THEN SVG_Transformer SHALL 将固定颜色值替换为 currentColor
4. WHEN SVG_Transformer 处理 SVG THEN SVG_Transformer SHALL 移除固定的 width 和 height 属性
5. WHEN SVG_Transformer 完成优化 THEN SVG_Transformer SHALL 输出符合 React JSX 语法的 SVG 代码
6. FOR ALL 有效的 SVG 输入，优化后再解析 SHALL 产生等效的 SVG 结构（round-trip property）

### Requirement 4: React 组件生成

**User Story:** 作为系统，我需要将优化后的 SVG 转换为标准化的 React 组件，以便开发者可以直接在项目中使用。

#### Acceptance Criteria

1. WHEN Component_Generator 接收到优化后的 SVG THEN Component_Generator SHALL 生成 TypeScript React 函数组件
2. WHEN Component_Generator 生成组件 THEN Component_Generator SHALL 为组件添加 size、color、className 等标准 props
3. WHEN Component_Generator 生成组件 THEN Component_Generator SHALL 使用 PascalCase 命名组件（如 IconArrowRight）
4. WHEN Component_Generator 生成组件 THEN Component_Generator SHALL 为每个组件生成对应的类型定义
5. WHEN Component_Generator 完成所有组件生成 THEN Component_Generator SHALL 生成统一的 index.ts 导出文件
6. WHEN Component_Generator 生成组件 THEN Component_Generator SHALL 确保组件支持 SVG 原生属性透传

### Requirement 5: GitHub Actions 工作流

**User Story:** 作为系统管理员，我希望通过 GitHub Actions 自动化整个图标同步和发布流程，以便减少人工干预。

#### Acceptance Criteria

1. WHEN Figma_Plugin 触发 repository_dispatch 事件 THEN GitHub_Actions_Workflow SHALL 自动启动
2. WHEN GitHub_Actions_Workflow 启动 THEN GitHub_Actions_Workflow SHALL 依次执行：获取图标、优化 SVG、生成组件
3. WHEN 组件生成完成 THEN GitHub_Actions_Workflow SHALL 创建新分支并提交代码变更
4. WHEN 代码提交完成 THEN GitHub_Actions_Workflow SHALL 自动创建 Pull Request
5. WHEN Pull Request 被合并到主分支 THEN GitHub_Actions_Workflow SHALL 自动触发 NPM 发布流程
6. IF 任何步骤失败 THEN GitHub_Actions_Workflow SHALL 发送通知并记录详细错误日志

### Requirement 6: NPM 包发布

**User Story:** 作为开发者，我希望图标库能够自动发布到 NPM，以便我可以通过 npm install 直接安装使用。

#### Acceptance Criteria

1. WHEN NPM_Publisher 被触发 THEN NPM_Publisher SHALL 读取 package.json 中的版本号
2. WHEN NPM_Publisher 准备发布 THEN NPM_Publisher SHALL 执行 TypeScript 编译生成 ES Module 和 CommonJS 格式
3. WHEN NPM_Publisher 编译完成 THEN NPM_Publisher SHALL 生成类型定义文件（.d.ts）
4. WHEN NPM_Publisher 准备发布 THEN NPM_Publisher SHALL 使用 NPM_TOKEN 进行身份验证
5. WHEN NPM_Publisher 发布成功 THEN NPM_Publisher SHALL 在 GitHub Release 中创建对应版本标签
6. IF NPM 发布失败 THEN NPM_Publisher SHALL 回滚版本号变更并通知管理员

### Requirement 7: 图标库使用体验

**User Story:** 作为前端开发者，我希望图标库易于使用且支持 Tree Shaking，以便优化项目打包体积。

#### Acceptance Criteria

1. WHEN 开发者导入单个图标 THEN Icon_Library SHALL 支持按需导入（如 import { IconArrowRight } from 'my-icons'）
2. WHEN 开发者使用图标组件 THEN Icon_Library SHALL 支持通过 size prop 设置图标尺寸
3. WHEN 开发者使用图标组件 THEN Icon_Library SHALL 支持通过 color prop 或 CSS 设置图标颜色
4. WHEN 开发者使用图标组件 THEN Icon_Library SHALL 支持传递任意 SVG 属性
5. WHEN 项目打包时 THEN Icon_Library SHALL 支持 Tree Shaking，只打包实际使用的图标
6. WHEN 开发者查看文档 THEN Icon_Library SHALL 提供所有图标的预览页面

### Requirement 8: 图标预览网站

**User Story:** 作为开发者，我希望有一个在线预览页面，以便快速浏览所有可用图标并复制使用代码。

#### Acceptance Criteria

1. WHEN 图标库更新发布 THEN Preview_Site SHALL 自动部署到 GitHub Pages
2. WHEN 用户访问预览页面 THEN Preview_Site SHALL 展示所有图标的网格视图
3. WHEN 用户搜索图标 THEN Preview_Site SHALL 支持按图标名称实时过滤
4. WHEN 用户点击图标 THEN Preview_Site SHALL 显示图标详情弹窗，包含图标名称和使用代码
5. WHEN 用户点击复制按钮 THEN Preview_Site SHALL 将 import 语句复制到剪贴板
6. WHEN 用户查看图标 THEN Preview_Site SHALL 支持切换不同尺寸和颜色预览
7. WHEN 用户查看图标 THEN Preview_Site SHALL 显示图标的 SVG 源码，支持一键复制

### Requirement 9: 配置与安全

**User Story:** 作为系统管理员，我希望系统配置安全且易于管理，以便保护敏感信息并方便维护。

#### Acceptance Criteria

1. WHEN 配置 GitHub Actions THEN GitHub_Actions_Workflow SHALL 使用 GitHub Secrets 存储敏感信息
2. WHEN 存储 Token THEN GitHub_Actions_Workflow SHALL 分别存储 FIGMA_TOKEN、GITHUB_TOKEN、NPM_TOKEN
3. WHEN Figma_Plugin 存储配置 THEN Figma_Plugin SHALL 将配置信息安全存储在 Figma 客户端存储中
4. WHEN 系统运行时 THEN GitHub_Actions_Workflow SHALL 不在日志中暴露任何敏感信息
5. IF Token 无效或过期 THEN GitHub_Actions_Workflow SHALL 提供清晰的错误提示

### Requirement 10: 自动生成 Changelog

**User Story:** 作为开发者，我希望每次发布都有清晰的变更日志，以便了解版本更新内容。

#### Acceptance Criteria

1. WHEN NPM 包发布成功 THEN Changelog_Generator SHALL 自动更新 CHANGELOG.md 文件
2. WHEN Changelog_Generator 生成日志 THEN Changelog_Generator SHALL 按版本号分组记录变更
3. WHEN Changelog_Generator 记录变更 THEN Changelog_Generator SHALL 分类显示：新增图标、修改图标、删除图标
4. WHEN Changelog_Generator 生成日志 THEN Changelog_Generator SHALL 包含发布日期和版本号
5. WHEN Changelog_Generator 生成日志 THEN Changelog_Generator SHALL 包含设计师填写的更新说明

### Requirement 11: 多格式输出支持

**User Story:** 作为开发者，我希望图标库支持多种使用方式，以便在不同场景下灵活使用。

#### Acceptance Criteria

1. WHEN Component_Generator 生成组件 THEN Component_Generator SHALL 同时生成 React 组件和原始 SVG 文件
2. WHEN Component_Generator 生成输出 THEN Component_Generator SHALL 生成 SVG Sprite 文件用于传统项目
3. WHEN Component_Generator 生成输出 THEN Component_Generator SHALL 生成 JSON 格式的图标元数据文件
4. WHEN 开发者使用 SVG Sprite THEN Icon_Library SHALL 提供 use 标签的使用示例
5. WHEN 开发者需要图标数据 THEN Icon_Library SHALL 提供包含所有图标名称和路径的 JSON 文件

### Requirement 12: 图标规范校验

**User Story:** 作为设计师，我希望系统能自动检查图标是否符合设计规范，以便保持图标库的一致性。

#### Acceptance Criteria

1. WHEN Icon_Sync_Service 获取图标 THEN Icon_Sync_Service SHALL 检查图标尺寸是否符合规范（如 24x24）
2. WHEN Icon_Sync_Service 检查图标 THEN Icon_Sync_Service SHALL 验证图标命名是否符合命名规范
3. IF 图标不符合规范 THEN Icon_Sync_Service SHALL 在 PR 中标注警告信息
4. WHEN Icon_Sync_Service 检查图标 THEN Icon_Sync_Service SHALL 检测图标是否包含不支持的 SVG 特性
5. WHEN 规范校验完成 THEN Icon_Sync_Service SHALL 生成校验报告，列出所有问题

### Requirement 13: 版本管理与回滚

**User Story:** 作为系统管理员，我希望能够管理图标库版本并在必要时回滚，以便处理发布问题。

#### Acceptance Criteria

1. WHEN NPM_Publisher 发布版本 THEN NPM_Publisher SHALL 遵循语义化版本规范（SemVer）
2. WHEN 有图标新增 THEN NPM_Publisher SHALL 建议 minor 版本升级
3. WHEN 有图标删除或破坏性变更 THEN NPM_Publisher SHALL 建议 major 版本升级
4. WHEN 仅有图标修改 THEN NPM_Publisher SHALL 建议 patch 版本升级
5. WHEN 需要回滚版本 THEN NPM_Publisher SHALL 支持通过 GitHub Actions 手动触发回滚
