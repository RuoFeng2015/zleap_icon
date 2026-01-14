# Implementation Plan: Figma Icon Automation

## Overview

本实现计划将 Figma 图标自动化系统分为多个阶段：项目初始化、核心处理模块、GitHub Actions 工作流、Figma 插件、预览网站。每个阶段包含具体的编码任务和测试任务。

## Tasks

- [x] 1. 项目初始化与基础配置

  - [x] 1.1 创建项目目录结构和基础配置文件
    - 创建 package.json、tsconfig.json、.gitignore
    - 配置 TypeScript 编译选项（ESM + CJS 双输出）
    - 配置 Vitest 测试框架
    - 安装核心依赖：react、svgo、fast-check、vitest、tsx
    - _Requirements: 6.2, 6.3_
  - [x] 1.2 创建共享类型定义文件
    - 定义 IconMetadata、IconManifest、ValidationResult 等核心类型
    - 定义 PluginConfig、SyncRequest 等接口
    - _Requirements: 4.4_

- [x] 2. SVG 转换模块实现

  - [x] 2.1 实现 SVGO 配置和 SVG 优化函数
    - 配置 SVGO 插件：移除尺寸、替换颜色、转换属性名
    - 实现 optimizeSvg 函数
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 2.2 实现 SVG 到 JSX 转换函数
    - 实现属性名转换（kebab-case → camelCase）
    - 实现 convertToJsx 函数
    - _Requirements: 3.5_
  - [x] 2.3 编写 SVG 优化属性测试
    - **Property 3: SVG Optimization Invariants**
    - **Property 4: SVG Structure Round-Trip**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

- [x] 3. React 组件生成模块实现

  - [x] 3.1 实现图标名称转换函数
    - 实现 toPascalCase 函数
    - 处理各种命名格式（kebab-case、snake_case、空格分隔）
    - _Requirements: 4.3_
  - [x] 3.2 编写名称转换属性测试
    - **Property 5: Component Name Transformation**
    - **Validates: Requirements 4.3**
  - [x] 3.3 实现 React 组件模板生成器
    - 生成 TypeScript 函数组件代码
    - 包含 size、color、className props
    - 支持 forwardRef 和属性透传
    - _Requirements: 4.1, 4.2, 4.6_
  - [x] 3.4 编写组件结构属性测试
    - **Property 6: Generated Component Structure**
    - **Validates: Requirements 4.1, 4.2, 4.4, 4.6**
  - [x] 3.5 实现 index.ts 导出文件生成器
    - 生成所有组件的导出语句
    - 生成 allIcons 对象和 IconName 类型
    - _Requirements: 4.5_
  - [x] 3.6 编写导出完整性属性测试
    - **Property 7: Index Export Completeness**
    - **Validates: Requirements 4.5**

- [x] 4. Checkpoint - 核心转换模块测试

  - 确保所有 SVG 转换和组件生成测试通过
  - 如有问题请询问用户

- [x] 5. 图标校验模块实现

  - [x] 5.1 实现图标尺寸校验函数
    - 检查图标是否符合允许的尺寸（16、20、24、32）
    - _Requirements: 12.1_
  - [x] 5.2 实现图标命名校验函数
    - 使用正则表达式验证命名规范
    - _Requirements: 12.2_
  - [x] 5.3 实现 SVG 特性检测函数
    - 检测不支持的 SVG 元素（如 image、foreignObject）
    - _Requirements: 12.4_
  - [x] 5.4 编写校验规则属性测试
    - **Property 12: Icon Validation Rules**
    - **Validates: Requirements 12.1, 12.2, 12.4**
  - [x] 5.5 实现校验报告生成器
    - 汇总所有校验结果
    - 生成 Markdown 格式报告
    - _Requirements: 12.3, 12.5_

- [x] 6. Figma API 集成模块实现

  - [x] 6.1 实现 Figma API 客户端
    - 封装 getFile、getImages API 调用
    - 实现错误处理和重试逻辑
    - _Requirements: 2.1, 2.5_
  - [x] 6.2 实现图标组件筛选函数
    - 从 Figma 文件中筛选图标类型组件
    - _Requirements: 2.2_
  - [x] 6.3 编写图标筛选属性测试
    - **Property 1: Icon Component Filtering**
    - **Validates: Requirements 2.2**
  - [x] 6.4 实现 SVG 批量导出函数
    - 调用 Figma API 批量导出 SVG
    - 下载并保存 SVG 文件
    - _Requirements: 2.3, 2.4_
  - [x] 6.5 实现图标清单生成函数
    - 生成包含所有图标元数据的 IconManifest
    - _Requirements: 2.6_
  - [x] 6.6 编写清单完整性属性测试
    - **Property 2: Icon Manifest Completeness**
    - **Validates: Requirements 2.6**

- [x] 7. Checkpoint - Figma 集成模块测试

  - 确保 Figma API 集成和校验模块测试通过
  - 如有问题请询问用户

- [x] 8. 多格式输出模块实现

  - [x] 8.1 实现 SVG Sprite 生成器
    - 生成包含所有图标的 SVG sprite 文件
    - 使用 symbol 元素封装每个图标
    - _Requirements: 11.2_
  - [x] 8.2 实现 JSON 元数据生成器
    - 生成 icons.json 文件
    - 包含图标名称、路径、尺寸信息
    - _Requirements: 11.3, 11.5_
  - [x] 8.3 编写多格式输出属性测试
    - **Property 11: Multi-Format Output Consistency**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.5**

- [x] 9. Changelog 生成模块实现

  - [x] 9.1 实现图标差异计算函数
    - 对比新旧 IconManifest
    - 识别新增、修改、删除的图标
    - _Requirements: 10.3_
  - [x] 9.2 实现 Changelog 条目生成器
    - 生成 Markdown 格式的变更日志条目
    - 包含版本号、日期、变更分类
    - _Requirements: 10.1, 10.2, 10.4, 10.5_
  - [x] 9.3 编写 Changelog 格式属性测试
    - **Property 10: Changelog Entry Format**
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.5**

- [x] 10. 版本管理模块实现

  - [x] 10.1 实现语义化版本建议函数
    - 根据图标变更类型建议版本升级
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  - [x] 10.2 编写版本建议属性测试
    - **Property 13: Semantic Version Suggestion**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4**

- [x] 11. Checkpoint - 输出模块测试

  - 确保多格式输出、Changelog、版本管理测试通过
  - 如有问题请询问用户

- [x] 12. GitHub Actions 工作流配置

  - [x] 12.1 创建图标同步工作流 (sync-icons.yml)
    - 配置 repository_dispatch 触发器
    - 定义环境变量和 secrets
    - 编排各处理步骤
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 9.1, 9.2_
  - [x] 12.2 创建 NPM 发布工作流 (publish.yml)
    - 配置 push 触发器（main 分支）
    - 执行构建和发布步骤
    - 创建 GitHub Release
    - _Requirements: 5.5, 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 12.3 创建 GitHub Pages 部署工作流
    - 构建预览网站
    - 部署到 GitHub Pages
    - _Requirements: 8.1_

- [x] 13. 脚本文件实现

  - [x] 13.1 创建 fetch-icons.ts 脚本
    - 整合 Figma API 调用和图标导出
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  - [x] 13.2 创建 transform-svg.ts 脚本
    - 整合 SVG 优化和转换
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 13.3 创建 generate-components.ts 脚本
    - 整合组件生成和 index 文件生成
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  - [x] 13.4 创建 generate-outputs.ts 脚本
    - 整合 Sprite、JSON 元数据生成
    - _Requirements: 11.1, 11.2, 11.3_
  - [x] 13.5 创建 validate-icons.ts 脚本
    - 整合图标校验逻辑
    - _Requirements: 12.1, 12.2, 12.4, 12.5_
  - [x] 13.6 创建 generate-changelog.ts 脚本
    - 整合 Changelog 生成逻辑
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. Checkpoint - 工作流和脚本测试

  - 本地测试所有脚本执行
  - 如有问题请询问用户

- [x] 15. 图标预览网站实现

  - [x] 15.1 创建预览网站基础结构
    - 使用 Vite 构建
    - 创建 HTML 入口和基础样式
    - _Requirements: 8.2_
  - [x] 15.2 实现图标网格展示组件
    - 展示所有图标的网格视图
    - _Requirements: 8.2_
  - [x] 15.3 实现搜索过滤功能
    - 按图标名称实时过滤
    - _Requirements: 8.3_
  - [x] 15.4 编写搜索过滤属性测试
    - **Property 9: Search Filter Accuracy**
    - **Validates: Requirements 8.3**
  - [x] 15.5 实现图标详情弹窗
    - 显示图标名称、使用代码、SVG 源码
    - _Requirements: 8.4, 8.7_
  - [x] 15.6 实现复制功能
    - 复制 import 语句到剪贴板
    - 复制 SVG 源码到剪贴板
    - _Requirements: 8.5_
  - [x] 15.7 实现尺寸和颜色预览切换
    - 支持切换不同尺寸预览
    - 支持切换不同颜色预览
    - _Requirements: 8.6_

- [x] 16. Figma 插件实现

  - [x] 16.1 创建 Figma 插件项目结构
    - 创建 manifest.json
    - 配置插件 UI 和代码入口
    - _Requirements: 1.1_
  - [x] 16.2 实现插件配置界面
    - GitHub 仓库地址输入
    - GitHub Token 输入
    - 配置保存和读取
    - _Requirements: 1.1, 9.3_
  - [x] 16.3 实现图标信息获取功能
    - 获取当前文件中的图标组件
    - _Requirements: 1.2_
  - [x] 16.4 实现 GitHub API 触发功能
    - 调用 repository_dispatch API
    - 传递版本号和更新说明
    - _Requirements: 1.3, 1.6_
  - [x] 16.5 实现同步结果反馈
    - 显示成功/失败状态
    - 提供 PR 链接
    - _Requirements: 1.4, 1.5_

- [x] 17. 图标组件 Props 测试

  - [x] 17.1 编写组件 Props 行为属性测试
    - **Property 8: Icon Component Props Behavior**
    - **Validates: Requirements 7.2, 7.3, 7.4**

- [x] 18. 最终集成测试

  - [x] 18.1 编写端到端集成测试
    - 模拟完整的图标同步流程
    - 验证所有输出产物
    - _Requirements: 全部_

- [x] 19. Final Checkpoint - 完整测试
  - 确保所有测试通过
  - 验证 GitHub Actions 工作流配置
  - 如有问题请询问用户

## Notes

- 每个 Checkpoint 用于验证阶段性成果
- 属性测试使用 fast-check 库，每个测试至少运行 100 次迭代
- 所有脚本使用 tsx 运行 TypeScript
- 所有测试任务均为必需，确保代码质量
