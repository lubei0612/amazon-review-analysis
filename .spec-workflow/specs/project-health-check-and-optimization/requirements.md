# Requirements Document - 项目整体健康检查与优化

## Introduction

本需求文档定义了对**即贸Amazon评论分析系统**进行全面健康检查、代码管理、文件清理和文档整理的要求。目标是确保项目结构清晰、代码管理规范、文档组织有序，并能够顺利运行。

### 背景
项目当前存在以下问题：
- ✅ 代码已实现核心功能（三层爬虫、AI分析、Web端、Chrome扩展）
- ⚠️ 文件结构混乱：根目录有大量临时文件和旧文档
- ⚠️ bat文件冗余：包括旧的和新的共37个bat文件
- ⚠️ 文档分散：分布在根目录、docs/、chrome-extension/等多个位置
- ⚠️ 代码未托管：尚未推送到GitHub进行版本管理
- ⚠️ 环境配置：需要确认所有依赖都已安装且配置正确

### 价值
- ✅ 提高项目可维护性和可读性
- ✅ 便于团队协作和代码审查
- ✅ 降低新成员上手难度
- ✅ 确保项目可以在任何环境快速部署
- ✅ 建立规范的版本管理流程

## Alignment with Product Vision

本优化方案支持项目的长期发展目标：

### 1. 可维护性
- **项目目标**: 建立易于维护和扩展的代码库
- **本方案**: 清理冗余文件、规范目录结构、建立清晰的文档体系

### 2. 协作效率
- **项目目标**: 支持多人协作开发
- **本方案**: 使用GitHub进行版本控制，建立标准的工作流程

### 3. 交付质量
- **项目目标**: 确保系统稳定可靠
- **本方案**: 运行全面的健康检查，验证所有功能模块

### 4. 开发体验
- **项目目标**: 提供流畅的开发和部署体验
- **本方案**: 简化启动脚本，提供清晰的快速开始指南

## Requirements

### Requirement 1: 项目依赖完整性检查

**User Story:** 作为开发人员，我希望验证项目的所有依赖都已正确安装，以便能够顺利运行项目。

#### Acceptance Criteria

1. WHEN 运行依赖检查 THEN 系统 SHALL 验证所有package.json中的依赖已安装
2. WHEN 检测到缺失依赖 THEN 系统 SHALL 列出所有缺失的包并提供安装命令
3. WHEN 检查Node.js版本 THEN 系统 SHALL 验证版本≥18.0.0
4. IF Web端存在 THEN 系统 SHALL 同时检查web/目录的依赖
5. WHEN 依赖检查完成 THEN 系统 SHALL 生成依赖状态报告

### Requirement 2: 环境配置验证

**User Story:** 作为系统管理员，我希望验证所有必要的环境变量都已配置，以便系统能够正常启动。

#### Acceptance Criteria

1. WHEN 检查.env文件 THEN 系统 SHALL 验证文件存在且格式正确
2. WHEN 验证API密钥 THEN 系统 SHALL 检查RAPIDAPI_KEY、GEMINI_API_KEY等关键配置
3. IF 配置缺失 THEN 系统 SHALL 提供详细的配置指引和示例
4. WHEN 配置检查完成 THEN 系统 SHALL 显示哪些爬虫可用（Outscraper/RapidAPI/Puppeteer）
5. WHEN 存在安全风险 THEN 系统 SHALL 警告（如密钥硬编码、提交到Git等）

### Requirement 3: 核心功能健康检查

**User Story:** 作为质量工程师，我希望验证系统的核心功能模块都能正常工作，以便确保系统可用。

#### Acceptance Criteria

1. WHEN 运行健康检查 THEN 系统 SHALL 测试所有爬虫模块的初始化
2. WHEN 测试API端点 THEN 系统 SHALL 验证/api/health等关键接口响应正常
3. WHEN 测试数据库连接 THEN 系统 SHALL 验证MySQL和Redis连接（如已配置）
4. WHEN 测试AI服务 THEN 系统 SHALL 验证Gemini API可访问性（如已配置）
5. WHEN 健康检查完成 THEN 系统 SHALL 生成详细的健康报告（通过/失败/跳过）

### Requirement 4: bat文件清理与整合

**User Story:** 作为项目维护者，我希望清理冗余的bat文件，只保留必要的启动脚本，以便简化项目结构。

#### Acceptance Criteria

1. WHEN 分析bat文件 THEN 系统 SHALL 识别所有bat文件（共37个）并分类
2. WHEN 确定保留文件 THEN 系统 SHALL 仅保留核心启动脚本（≤8个）
3. WHEN 移除冗余文件 THEN 系统 SHALL 将旧文件移动到_archive/old-bat-files/
4. WHEN 清理完成 THEN 根目录 SHALL 只包含：
   - `快速启动.bat` - 一键启动后端
   - `启动Web前端.bat` - 启动Web界面
   - `停止所有服务.bat` - 停止所有服务
   - `快速测试-RapidAPI.bat` - 测试RapidAPI
   - `快速验证-系统状态.bat` - 系统健康检查
5. WHEN 用户查看根目录 THEN SHALL 看到清晰的文件结构

### Requirement 5: 文档整理与分类

**User Story:** 作为新加入的团队成员，我希望文档组织有序，以便快速了解项目和查找信息。

#### Acceptance Criteria

1. WHEN 分析文档分布 THEN 系统 SHALL 识别所有md文档（根目录、docs/、chrome-extension/等）
2. WHEN 整理文档 THEN 系统 SHALL 按以下结构组织：
   - `docs/` - 技术文档和设计文档
   - `docs/guides/` - 用户指南和快速开始
   - `docs/api/` - API文档
   - `docs/archive/` - 历史文档和变更记录
3. WHEN 移动文档 THEN 系统 SHALL 更新所有相关引用链接
4. WHEN 整理完成 THEN 根目录 SHALL 只保留：
   - `README.md` - 项目主文档
   - `QUICK-START.md` - 快速开始指南
   - `CHANGELOG.md` - 变更日志（新建）
5. WHEN 文档重组完成 THEN 系统 SHALL 在README中添加文档导航目录

### Requirement 6: GitHub代码托管

**User Story:** 作为项目负责人，我希望将项目代码托管到GitHub，以便进行版本管理和团队协作。

#### Acceptance Criteria

1. WHEN 初始化Git仓库 THEN 系统 SHALL 检查.git目录是否存在
2. IF Git未初始化 THEN 系统 SHALL 执行git init
3. WHEN 创建.gitignore THEN 系统 SHALL 包含：node_modules/, .env, *.log等
4. WHEN 创建GitHub仓库 THEN 系统 SHALL 使用GitHub MCP创建远程仓库
5. WHEN 首次提交 THEN 系统 SHALL 包含所有核心代码（排除敏感信息）
6. WHEN 推送到GitHub THEN 系统 SHALL 使用`main`分支作为默认分支
7. WHEN 代码托管完成 THEN 系统 SHALL 返回GitHub仓库URL

### Requirement 7: 项目结构规范化

**User Story:** 作为架构师，我希望项目遵循标准的目录结构，以便提高代码可读性。

#### Acceptance Criteria

1. WHEN 分析项目结构 THEN 系统 SHALL 识别不规范的目录和文件
2. WHEN 规范化目录 THEN 系统 SHALL 确保以下结构：
   ```
   maijiaplug/
   ├── src/              # 源代码
   ├── docs/             # 文档
   ├── chrome-extension/ # Chrome扩展
   ├── web/              # Web前端
   ├── tests/            # 测试文件（新建）
   ├── scripts/          # 工具脚本（新建）
   ├── _archive/         # 历史文件
   └── README.md         # 主文档
   ```
3. WHEN 移动测试文件 THEN 系统 SHALL 将test-*.js移动到tests/目录
4. WHEN 移动工具脚本 THEN 系统 SHALL 将bat文件移动到scripts/目录
5. WHEN 结构规范化完成 THEN 系统 SHALL 更新所有相关的导入路径

### Requirement 8: 自动化脚本创建

**User Story:** 作为开发人员，我希望有统一的脚本来执行常见任务，以便简化日常操作。

#### Acceptance Criteria

1. WHEN 创建健康检查脚本 THEN 系统 SHALL 创建`scripts/health-check.js`
2. WHEN 创建一键部署脚本 THEN 系统 SHALL 创建`scripts/deploy.bat`
3. WHEN 创建依赖安装脚本 THEN 系统 SHALL 创建`scripts/install-all.bat`
4. WHEN 创建数据库初始化脚本 THEN 系统 SHALL 创建`scripts/init-db.js`
5. WHEN 脚本创建完成 THEN 每个脚本 SHALL 包含详细的注释和使用说明

## Non-Functional Requirements

### Code Architecture and Modularity

- **单一职责原则**: 每个检查脚本专注于一个特定任务
- **模块化设计**: 健康检查、文件清理、文档整理应该是独立的模块
- **依赖管理**: 最小化新增依赖，优先使用项目已有的库
- **清晰接口**: 所有脚本应提供统一的命令行接口

### Performance

- **检查速度**: 完整的健康检查应在30秒内完成
- **文件操作**: 文件移动和清理应使用批处理，避免逐个操作
- **并行执行**: 独立的检查任务应并行执行
- **资源占用**: 检查过程不应影响系统正常运行

### Security

- **敏感信息保护**: 确保.env文件被.gitignore排除
- **API密钥检查**: 扫描代码中是否存在硬编码的密钥
- **文件权限**: 确保敏感文件的访问权限正确
- **Git历史**: 确保不会将敏感信息提交到Git历史

### Reliability

- **错误处理**: 任何检查失败不应导致整个流程中断
- **回滚机制**: 文件移动和删除前应创建备份
- **日志记录**: 所有操作应详细记录到日志文件
- **幂等性**: 所有脚本可以重复执行而不产生副作用

### Usability

- **清晰的输出**: 使用表情符号和颜色区分不同类型的消息
- **进度反馈**: 长时间操作应显示进度条或百分比
- **错误指引**: 失败时应提供明确的解决方案
- **交互确认**: 危险操作（删除文件、推送代码）前应请求确认

### Maintainability

- **代码注释**: 所有新建脚本应有详细的注释
- **文档同步**: 代码变更时应同步更新相关文档
- **版本标记**: 每个主要变更应在CHANGELOG中记录
- **测试覆盖**: 关键功能应有自动化测试

## Success Metrics

项目优化成功的标准：

1. **依赖完整性**: 100%的依赖已安装且版本兼容
2. **环境配置**: 所有必需的环境变量已配置
3. **健康检查**: 至少80%的核心功能通过健康检查
4. **文件清理**: 根目录bat文件≤8个，旧文件已归档
5. **文档整理**: 文档按规范分类，README包含完整导航
6. **代码托管**: 代码已成功推送到GitHub，包含完整的.gitignore
7. **项目结构**: 符合标准的Node.js项目结构
8. **自动化脚本**: 至少4个核心脚本可用（启动、测试、检查、部署）

## Out of Scope

本优化方案**不包括**以下内容：

- ❌ 功能开发（不添加新功能）
- ❌ 性能优化（不优化代码性能）
- ❌ Bug修复（仅识别问题，不修复代码bug）
- ❌ 数据库迁移（不改变数据库结构）
- ❌ UI/UX改进（不修改界面）
- ❌ 第三方服务配置（不帮助注册API服务）
- ❌ 生产环境部署（仅关注开发环境）
- ❌ 安全审计（仅基本的安全检查）

## Dependencies

本优化依赖以下资源：

### 技术依赖
- Node.js 18+
- Git（用于版本控制）
- GitHub账号（lubei0612）
- 项目已有的依赖包

### 工具依赖
- GitHub MCP（用于创建和管理GitHub仓库）
- Spec-Workflow MCP（用于管理spec流程）
- 文件系统工具（读写、移动、删除文件）

### 权限依赖
- 文件系统读写权限
- GitHub API访问权限
- .env文件修改权限（用户手动）

## Risks and Mitigations

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 文件移动导致引用失效 | 高 | 移动前搜索所有引用，移动后验证 |
| Git提交了敏感信息 | 高 | 提交前严格检查.gitignore，扫描敏感内容 |
| 删除了重要文件 | 高 | 仅移动到_archive，不直接删除 |
| 依赖版本冲突 | 中 | 检查但不自动升级，仅报告 |
| GitHub创建仓库失败 | 中 | 提供手动创建的替代方案 |
| 脚本在不同环境不兼容 | 中 | 同时提供bat（Windows）和说明 |
| 文档链接更新不完整 | 低 | 使用相对路径，减少绝对路径依赖 |

## Implementation Strategy

建议的实施顺序：

### Phase 1: 评估与备份（优先级：最高）
1. 运行依赖检查
2. 运行环境配置验证
3. 创建完整的项目备份

### Phase 2: 清理与整理（优先级：高）
4. 清理bat文件
5. 整理文档结构
6. 规范化项目目录

### Phase 3: 自动化与脚本（优先级：中）
7. 创建健康检查脚本
8. 创建部署脚本
9. 更新README和文档

### Phase 4: 代码托管（优先级：高）
10. 初始化Git仓库
11. 创建GitHub远程仓库
12. 首次提交并推送

### Phase 5: 验证与交付（优先级：最高）
13. 运行完整的健康检查
14. 验证所有脚本可用
15. 生成优化报告

---

**文档版本**: v1.0  
**创建日期**: 2025-11-03  
**作者**: AI Assistant (Claude Sonnet 4.5)  
**审核状态**: 待审核

