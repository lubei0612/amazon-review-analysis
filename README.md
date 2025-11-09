# Amazon Review Analysis System
# Amazon评论智能分析系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

**AI-powered Amazon review analysis tool for consumer insights**

**基于AI的Amazon评论分析工具，快速获取消费者洞察**

[English](#english) | [中文](#中文)

</div>

---

## 🤖 AI Development Guidelines

### 项目协作规范（重要！AI开发必读）

**文档管理原则**:
- ✅ **所有文档统一放在 `docs/` 目录**
- ✅ **口头汇报为主，文档为辅**
- ✅ **文档只记录成功的案例和验证过的方案**
- ⚠️ **不要让开发者去读文档**（文档内容往往与现实不符，现实有很多因素）
- ⚠️ **AI助手应主动口头汇报重点，而非让用户翻阅文档**

**核心开发理念**:
1. **KISS原则**: Keep It Simple, Stupid - 永远选择最简单的方案
2. **最优算法**: 每个步骤都要使用最优的算法和实现
3. **代码一致性**: 保持代码风格、命名规范、架构模式的一致性
4. **务实主义**: 文档记录成功案例，口头交流解决问题

**当前系统状态**（已验证成功）:
- ✅ 爬虫: **仅使用Apify**（稳定可靠，已删除Outscraper、RapidAPI、Puppeteer）
- ✅ AI分析: **Gemini 2.5 Pro**（深度准确，成本可控）
- ✅ Web端: **Vue 3 + Element Plus + ECharts**（界面美观，渲染流畅）
- ✅ 部署: **Docker + Docker Compose**（一键部署，简单高效）

---

## English

### 🌟 Features

- **🤖 AI Analysis**: Powered by Gemini 2.5 Pro for deep consumer insights
- **🌍 Multi-Site Crawling**: Smart detection + concurrent crawling across 12 global Amazon sites (US 🇺🇸, CA 🇨🇦, UK 🇬🇧, DE 🇩🇪, FR 🇫🇷, IT 🇮🇹, ES 🇪🇸, JP 🇯🇵, IN 🇮🇳, AU 🇦🇺, MX 🇲🇽, CN 🇨🇳)
- **📊 Rich Reports**: 7 analysis dimensions with visual charts
- **🔌 Chrome Extension**: One-click analysis directly on Amazon product pages
- **🌐 Web Dashboard**: Comprehensive reporting interface
- **🐳 Docker Ready**: Easy deployment with Docker Compose
- **☁️ Cloud Deployable**: Optimized for Tencent Cloud

### 📋 Analysis Dimensions

1. **Consumer Profile** - Demographics and behavioral insights
2. **Usage Scenarios** - How customers use the product
3. **Star Rating Impact** - What affects ratings at different levels
4. **Product Experience** - Strengths and weaknesses analysis
5. **Purchase Motivation** - Why customers buy
6. **Unmet Needs** - Improvement opportunities

### 🚀 Quick Start

#### Docker Deployment (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/your-repo/amazon-review-analysis.git
cd amazon-review-analysis

# 2. Configure environment variables
cp env.example .env
# Edit .env and add your API keys

# 3. Start services
docker-compose up -d

# 4. Access
# Backend API: http://localhost:3001
# Web Frontend: http://localhost:3002
```

#### Local Development

```bash
# 1. Install dependencies
npm install
cd web && npm install && cd ..

# 2. Configure .env file
cp env.example .env

# 3. Start backend
npm start

# 4. Start frontend (new terminal)
cd web && npm run dev
```

### 📦 Project Structure

```
amazon-review-analysis/
├── server.js              # Backend entry point
├── src/
│   ├── ai/               # AI analysis service
│   ├── crawler/          # Review scraping
│   └── services/         # Business logic
├── web/                  # Frontend Vue.js app
├── chrome-extension/     # Chrome extension
├── docs/                 # Documentation
├── Dockerfile            # Backend Docker config
├── docker-compose.yml    # Docker orchestration
└── DEPLOY-TENCENT-CLOUD.md  # Deployment guide
```

### 🔑 Environment Variables

```env
# AI Service (Required)
GEMINI_API_KEY=your_gemini_key
GEMINI_BASE_URL=https://aihubmix.com/v1

# Crawler Service (Required)
# Get your token at: https://apify.com/
APIFY_API_TOKEN=your_apify_token

# Server Config
PORT=3001
NODE_ENV=production
```

### 📚 Documentation

- [Quick Deploy Guide](QUICK-DEPLOY.md) - 5-minute deployment
- [Tencent Cloud Deployment](DEPLOY-TENCENT-CLOUD.md) - Detailed deployment guide
- [API Documentation](docs/03-后端API设计文档.md) - API reference
- [Chrome Extension Guide](chrome-extension/README.md) - Extension usage

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is licensed under the MIT License.

---

## 中文

### 🌟 功能特性

- **🤖 AI智能分析**：基于Gemini 2.5 Pro，深度挖掘消费者洞察
- **🌍 全球多站点爬取**：智能预检测 + 并发爬取全球12个Amazon站点（🇺🇸 美国、🇨🇦 加拿大、🇬🇧 英国、🇩🇪 德国、🇫🇷 法国、🇮🇹 意大利、🇪🇸 西班牙、🇯🇵 日本、🇮🇳 印度、🇦🇺 澳大利亚、🇲🇽 墨西哥、🇨🇳 中国）
- **📊 丰富报告**：7大分析维度，可视化图表展示
- **🔌 Chrome扩展**：Amazon商品页一键分析
- **🌐 Web报告**：完整的报告查看界面
- **🐳 Docker部署**：容器化部署，开箱即用
- **☁️ 云端就绪**：针对腾讯云优化

### 📋 分析维度

1. **消费者画像** - 人口统计与行为洞察
2. **使用场景** - 客户如何使用产品
3. **星级影响度** - 不同评分的影响因素
4. **产品体验** - 优势与劣势分析
5. **购买动机** - 购买原因分析
6. **未满足需求** - 改进机会发现

### 🚀 快速开始

#### Docker部署（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/your-repo/amazon-review-analysis.git
cd amazon-review-analysis

# 2. 配置环境变量
cp env.example .env
# 编辑 .env 文件，填写API密钥

# 3. 启动服务
docker-compose up -d

# 4. 访问
# 后端API: http://localhost:3001
# Web前端: http://localhost:3002
```

#### 本地开发

```bash
# 1. 安装依赖
npm install
cd web && npm install && cd ..

# 2. 配置.env文件
cp env.example .env

# 3. 启动后端
npm start

# 4. 启动前端（新终端）
cd web && npm run dev
```

### 📦 项目结构

```
amazon-review-analysis/
├── server.js              # 后端入口
├── src/
│   ├── ai/               # AI分析服务
│   ├── crawler/          # 评论爬虫
│   └── services/         # 业务逻辑
├── web/                  # 前端Vue.js应用
├── chrome-extension/     # Chrome浏览器扩展
├── docs/                 # 文档
├── Dockerfile            # 后端Docker配置
├── docker-compose.yml    # Docker编排
└── DEPLOY-TENCENT-CLOUD.md  # 部署指南
```

### 🔑 环境变量配置

```env
# AI服务（必填）
GEMINI_API_KEY=你的gemini密钥
GEMINI_BASE_URL=https://aihubmix.com/v1

# 爬虫服务（必填）
APIFY_API_TOKEN=你的apify令牌

# 服务器配置
PORT=3001
NODE_ENV=production
```

### 📚 文档

- [快速部署指南](QUICK-DEPLOY.md) - 5分钟部署
- [腾讯云部署](DEPLOY-TENCENT-CLOUD.md) - 详细部署指南
- [API文档](docs/03-后端API设计文档.md) - API参考
- [Chrome扩展指南](chrome-extension/README.md) - 扩展使用说明

### 🛠️ 技术栈

- **后端**: Node.js, Express
- **前端**: Vue 3, Element Plus, Vite
- **AI**: Gemini 2.5 Pro (via AiHubMix)
- **爬虫**: Apify（唯一爬虫，稳定可靠）
- **部署**: Docker, Docker Compose, Nginx

---

## 🤖 AI开发协作指南

> **重要**: 本项目采用AI辅助开发，请AI助手在开始工作前仔细阅读本章节

### 📖 项目核心理解

#### 项目定位
**Amazon评论智能分析系统** - 帮助卖家快速获取消费者洞察的AI工具

**核心价值**：
- 从几千条评论中提炼关键信息
- 7维度深度分析（消费者画像、使用场景、星级影响、产品体验、购买动机、未满足需求）
- 节省人工分析时间（从1周缩短到1分钟）

#### 技术架构
```
用户 → Chrome扩展 / Web端
       ↓
    后端API (Express)
       ↓
    爬虫 (Apify唯一) → AI分析 (Gemini 2.5 Pro)
       ↓
    返回7维度分析报告
```

#### 爬虫策略（2025-11-07更新）
**只使用Apify**：
- ✅ 稳定可靠（99%+成功率）
- ✅ 支持大规模爬取（2000+条评论）
- ✅ 多排序策略混合（recent + helpful + top）
- ❌ 已移除Outscraper、RapidAPI、Puppeteer（不稳定）

**重要**：不要尝试添加其他爬虫或降级逻辑，保持架构简洁。

---

### 🎯 开发规范和习惯

#### 代码质量原则
1. **KISS原则（Keep It Simple, Stupid）**
   - 优先选择简单直接的方案
   - 避免过度设计和不必要的抽象
   - 示例：单一爬虫优于多爬虫降级

2. **最优算法优先**
   - 每个功能实现前先思考最优方案
   - 考虑时间复杂度和空间复杂度
   - 权衡性能、可读性、可维护性

3. **代码一致性**
   - 遵循项目现有代码风格
   - 使用统一的命名规范
   - 保持文件结构的逻辑性

#### 命名规范
```javascript
// ✅ 好的命名
const reviewCount = 100
async function getReviews(asin) { }
class ApifyAmazonCrawler { }

// ❌ 避免的命名
const rc = 100
async function get(id) { }
class Crawler { }
```

#### 文件组织
```
src/
├── ai/              # AI相关（Gemini Provider, 分析服务, Prompt模板）
├── crawler/         # 爬虫相关（只有Apify和Facade）
├── services/        # 业务逻辑（TaskService等）
└── models/          # 数据模型（如果需要）
```

#### 错误处理
```javascript
// ✅ 好的错误处理
try {
  const reviews = await crawler.getReviews(asin)
  if (reviews.length === 0) {
    throw new Error('未找到评论数据，请检查ASIN是否正确')
  }
  return reviews
} catch (error) {
  logger.error(`爬取失败: ${error.message}`)
  throw new Error(`评论爬取失败: ${error.message}`)
}

// ❌ 避免的错误处理
try {
  return await crawler.getReviews(asin)
} catch (e) {
  console.log(e)
}
```

---

### 📋 开发流程

#### 1. 接到新需求时
```
1. 阅读本README的AI开发协作指南 ✅
2. 查看相关文档（docs/目录）
3. 理解需求的核心目标
4. 思考最优实现方案
5. 检查是否有现有代码可复用
6. 开始开发
```

#### 2. 开发过程中
```
1. 保持代码简洁（KISS原则）
2. 使用最优算法
3. 添加必要的注释和日志
4. 遵循项目命名规范
5. 考虑边界情况和错误处理
```

#### 3. 完成开发后
```
1. 自我代码审查（检查是否符合规范）
2. 测试功能是否正常
3. 更新相关文档
4. 创建清晰的commit message
5. 如有重大改动，创建总结文档到docs/
```

---

### 🔍 代码审查检查清单

每次开发完成后，请检查：

**功能性**：
- [ ] 功能是否按预期工作
- [ ] 是否处理了边界情况
- [ ] 错误处理是否完善
- [ ] 日志输出是否清晰

**性能**：
- [ ] 是否使用了最优算法
- [ ] 是否有不必要的循环或重复计算
- [ ] 数据库查询是否优化（如适用）
- [ ] API调用是否控制频率

**代码质量**：
- [ ] 代码是否简洁易读
- [ ] 命名是否清晰
- [ ] 是否有重复代码（DRY原则）
- [ ] 注释是否充分且必要

**一致性**：
- [ ] 是否遵循项目现有代码风格
- [ ] 文件组织是否合理
- [ ] 是否更新了相关文档

---

### 📚 重要文档索引

开发前必读：
1. **`docs/README.md`** - 项目总览和快速开始
2. **`docs/01-项目技术方案总体设计.md`** - 架构设计
3. **`docs/03-后端API设计文档.md`** - API规范
4. **`docs/爬虫简化完成-2025-11-07.md`** - 爬虫架构说明

开发时参考：
1. **`src/ai/PromptTemplates.js`** - AI分析Prompt模板
2. **`src/crawler/CrawlerFacade.js`** - 爬虫使用示例
3. **`src/services/TaskService.js`** - 业务逻辑示例

---

### 🎯 常见开发场景

#### 场景1: 添加新的AI分析维度
```javascript
// 1. 在 src/ai/PromptTemplates.js 添加新的prompt
static getNewDimensionPrompt(reviews) {
  return `分析以下评论的XXX维度...`
}

// 2. 在 src/ai/AnalysisService.js 添加分析方法
async analyzeNewDimension(reviews, systemPrompt) {
  const prompt = PromptTemplates.getNewDimensionPrompt(reviews)
  return await this.gemini.analyze(prompt, systemPrompt)
}

// 3. 在 analyze() 方法中添加并发调用
const results = await Promise.allSettled([
  // ... 现有维度
  this.analyzeNewDimension(reviews, systemPrompt)
])

// 4. 更新返回数据结构和文档
```

#### 场景2: 修改爬虫逻辑
```javascript
// ⚠️ 注意：只修改 ApifyAmazonCrawler.js
// 不要尝试添加新的爬虫或降级逻辑

// 示例：调整爬取策略
async getReviews(asin, maxReviews = Infinity) {
  // 1. 保持原有的多排序策略
  // 2. 优化参数传递
  // 3. 增强错误处理
  // 4. 添加详细日志
}
```

#### 场景3: Web端添加新功能
```javascript
// 1. 在 web/src/components/ 创建新组件
// 2. 遵循现有组件的代码风格
// 3. 使用Element Plus UI组件
// 4. 确保响应式设计
// 5. 添加必要的props验证
```

---

### ⚠️ 禁止事项

**绝对不要做的事**：
1. ❌ 添加Outscraper、RapidAPI、Puppeteer爬虫
2. ❌ 添加多层爬虫降级逻辑
3. ❌ 使用`console.log`（使用`logger`）
4. ❌ 硬编码敏感信息（使用环境变量）
5. ❌ 提交未测试的代码
6. ❌ 删除或修改`.gitignore`中的规则
7. ❌ 修改核心架构而不讨论

**需要谨慎的事**：
- ⚠️ 修改API接口（可能影响Chrome扩展）
- ⚠️ 修改数据结构（可能影响前端）
- ⚠️ 添加新的依赖包（考虑必要性）
- ⚠️ 修改环境变量（更新文档）

---

### 💡 最佳实践示例

#### 优秀的Commit Message
```bash
✅ feat: 添加竞品分析模块

- 实现多产品对比功能
- 添加雷达图可视化
- 优化API响应速度（从3s降到1s）
- 更新相关文档

✅ fix: 修复消费者画像空数据显示问题

- 检测空数据并显示友好提示
- 添加边界情况处理
- 增强日志输出

✅ refactor: 简化爬虫架构，只保留Apify

- 删除Outscraper、RapidAPI、Puppeteer
- 减少代码复杂度48%
- 提升系统稳定性
```

#### 优秀的日志
```javascript
// ✅ 清晰的日志层级
logger.info('🚀 开始分析任务', { taskId, asin })
logger.debug('AI分析参数', { model, temperature, maxTokens })
logger.warn('⚠️ 评论数量较少', { count: reviews.length })
logger.error('❌ AI分析失败', { error: error.message, asin })

// ❌ 不好的日志
console.log('start')
logger.info(reviews)
```

---

### 🔄 版本管理

#### 语义化版本（Semantic Versioning）
```
MAJOR.MINOR.PATCH

1.0.0 → 2.0.0  (破坏性更改，如API重构)
1.0.0 → 1.1.0  (新功能，向后兼容)
1.0.0 → 1.0.1  (Bug修复)
```

#### 当前版本记录
- **v1.0.0** (2025-10-27): 系统首次发布
- **v2.0.0** (2025-11-02): 全量分析+深度消费者画像
- **v2.2.0** (2025-11-03): 修复消费者画像显示
- **v2.3.0** (2025-11-07): 简化爬虫架构+Web端完善

---

### 📞 寻求帮助

当遇到问题时：
1. 先查看项目文档（`docs/`目录）
2. 查看相关代码的注释和日志
3. 搜索GitHub Issues
4. 如果是AI助手，请明确说明遇到的问题和已尝试的方案

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以上开发规范。

提交PR前请确保：
- [ ] 代码通过所有测试
- [ ] 遵循项目代码规范
- [ ] 更新了相关文档
- [ ] Commit message清晰明确

---

## 📄 许可证

本项目采用MIT许可证。

---

<div align="center">

**Made with ❤️ by JiMao Team**

[Documentation](docs/) | [Issues](https://github.com/your-repo/issues) | [Releases](https://github.com/your-repo/releases)

</div>

