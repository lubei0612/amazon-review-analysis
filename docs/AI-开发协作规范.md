# 🤖 AI开发协作规范

> **版本**: v1.0  
> **更新日期**: 2025-11-07  
> **适用于**: 所有AI助手（Claude, ChatGPT, Copilot等）

---

## 📌 必读：开始工作前

**每次开始新任务时，请按顺序执行：**

1. ✅ **阅读本文档** （5分钟）
2. ✅ **阅读 `README.md` 的AI开发协作指南章节** （3分钟）
3. ✅ **查看相关的docs文档** （10分钟）
4. ✅ **理解当前任务的上下文** （5分钟）
5. ✅ **思考最优实现方案** （10分钟）
6. ✅ **开始编码**

**目的**：确保代码质量、一致性和可维护性

---

## 🎯 项目核心理解（必须掌握）

### 项目定位
**Amazon评论智能分析系统**

**一句话描述**：  
帮助Amazon卖家从几千条评论中，通过AI在1分钟内提炼出7个维度的深度消费者洞察。

### 核心价值链
```
用户痛点：分析评论太耗时（1周+）
      ↓
解决方案：AI自动分析（1分钟）
      ↓
用户价值：快速决策，优化产品
```

### 技术架构（简化版）
```
┌─────────────┐
│  用户界面    │ ← Chrome扩展 / Web端
└──────┬──────┘
       │
┌──────▼──────┐
│  后端API    │ ← Express.js (Node.js)
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌─▼──┐
│爬虫 │ │ AI  │ ← Apify + Gemini 2.5 Pro
└─────┘ └────┘
```

### 数据流
```
1. 用户输入ASIN
2. Apify爬取评论（2000+条）
3. Gemini并发分析7维度
4. 返回结构化报告
5. 前端可视化展示
```

---

## 🏗️ 架构设计原则

### 1. KISS原则（Keep It Simple, Stupid）
**核心思想**：简单优于复杂

**示例1：爬虫架构演变**
```javascript
// ❌ 过度设计（之前的版本）
class CrawlerFacade {
  constructor() {
    this.apify = new Apify()
    this.outscraper = new Outscraper()
    this.rapidapi = new RapidAPI()
    this.puppeteer = new Puppeteer()
    // 4层降级逻辑 = 334行代码
  }
}

// ✅ 简化后（当前版本）
class CrawlerFacade {
  constructor() {
    this.apify = new Apify()
    // 单一爬虫 = 171行代码
  }
}
```

**为什么？**
- Apify成功率99%+，其他爬虫不稳定
- 降级逻辑增加复杂度，降低可维护性
- 结果：代码减少48%，稳定性提升

### 2. 最优算法优先
**核心思想**：性能和可读性的平衡

**示例2：评论去重**
```javascript
// ❌ O(n²) - 嵌套循环
function removeDuplicates(reviews) {
  const result = []
  for (let i = 0; i < reviews.length; i++) {
    let isDuplicate = false
    for (let j = 0; j < result.length; j++) {
      if (reviews[i].id === result[j].id) {
        isDuplicate = true
        break
      }
    }
    if (!isDuplicate) result.push(reviews[i])
  }
  return result
}

// ✅ O(n) - 使用Set
function removeDuplicates(reviews) {
  const seen = new Set()
  return reviews.filter(review => {
    if (seen.has(review.id)) return false
    seen.add(review.id)
    return true
  })
}
```

### 3. DRY原则（Don't Repeat Yourself）
**核心思想**：避免重复代码

**示例3：分析服务**
```javascript
// ❌ 重复代码
async function analyzeConsumerProfile(reviews) {
  try {
    const prompt = getPrompt(reviews)
    const result = await gemini.analyze(prompt)
    return parseResult(result)
  } catch (error) {
    logger.error('分析失败', error)
    throw error
  }
}

async function analyzeUsageScenarios(reviews) {
  try {
    const prompt = getPrompt(reviews)
    const result = await gemini.analyze(prompt)
    return parseResult(result)
  } catch (error) {
    logger.error('分析失败', error)
    throw error
  }
}

// ✅ 提取公共逻辑
async function analyzeWithTemplate(reviews, promptGetter, parser) {
  try {
    const prompt = promptGetter(reviews)
    const result = await gemini.analyze(prompt)
    return parser(result)
  } catch (error) {
    logger.error('分析失败', error)
    throw error
  }
}
```

---

## 📋 开发流程（标准化）

### 阶段1：理解需求（20%时间）
```
1. 明确需求的核心目标
   - 用户想要什么？
   - 解决什么痛点？
   
2. 评估影响范围
   - 涉及哪些模块？
   - 是否影响API接口？
   - 是否需要数据库变更？
   
3. 设计初步方案
   - 最简单的实现方式是什么？
   - 是否有现成代码可复用？
   - 预估开发时间
```

### 阶段2：编码实现（50%时间）
```
1. 文件组织
   - 新功能放在合适的目录
   - 遵循现有文件结构
   
2. 编码规范
   - 命名清晰
   - 逻辑简洁
   - 适当注释
   
3. 错误处理
   - 捕获所有可能的异常
   - 提供友好的错误信息
   - 记录详细日志
```

### 阶段3：测试和优化（20%时间）
```
1. 功能测试
   - 正常情况
   - 边界情况
   - 异常情况
   
2. 性能检查
   - 是否有性能瓶颈？
   - 数据库查询是否优化？
   - API响应时间是否合理？
   
3. 代码审查（自查）
   - 使用本文档的检查清单
```

### 阶段4：文档和提交（10%时间）
```
1. 更新相关文档
   - README（如有必要）
   - API文档（如有变更）
   - 用户指南（如有新功能）
   
2. 编写清晰的commit message
   - 使用规范格式
   - 说明修改内容和原因
   
3. 创建总结文档（重大改动）
   - 放在docs/目录
   - 记录设计思路和注意事项
```

---

## 🔍 代码审查检查清单（详细版）

### 功能性检查
```
□ 功能是否完全符合需求？
□ 是否处理了所有边界情况？
  - 空数据
  - 超大数据
  - 特殊字符
  - 网络错误
  - API失败
□ 错误处理是否完善？
  - try-catch覆盖
  - 错误信息清晰
  - 不暴露敏感信息
□ 日志是否充分？
  - 关键步骤有日志
  - 日志层级正确
  - 包含必要上下文
```

### 性能检查
```
□ 算法时间复杂度是否最优？
  - 避免O(n²)以上
  - 使用Map/Set加速查找
□ 是否有不必要的重复计算？
  - 缓存计算结果
  - 复用已有数据
□ 数据库查询是否优化？
  - 使用索引
  - 避免N+1查询
  - 批量操作
□ API调用是否控制频率？
  - 防止超出配额
  - 实现重试机制
  - 添加超时控制
```

### 代码质量检查
```
□ 代码是否简洁易读？
  - 单个函数<50行
  - 逻辑清晰
  - 无嵌套过深（<3层）
□ 命名是否清晰？
  - 变量名有意义
  - 函数名动词开头
  - 类名名词开头
□ 是否有重复代码？
  - 相似逻辑提取函数
  - 使用配置驱动
□ 注释是否必要且充分？
  - 复杂逻辑有注释
  - 避免无用注释
  - 公开API有文档注释
```

### 一致性检查
```
□ 是否遵循项目代码风格？
  - 缩进（2空格）
  - 引号（单引号）
  - 分号（必须）
□ 文件组织是否合理？
  - 放在正确目录
  - 命名符合规范
□ 是否更新了相关文档？
  - README
  - API文档
  - 注释
```

### 安全性检查
```
□ 是否有SQL注入风险？
□ 是否有XSS风险？
□ 敏感信息是否使用环境变量？
□ 用户输入是否验证？
□ API是否有权限控制？
```

---

## 📚 编码规范（强制）

### 命名规范

#### 变量和函数
```javascript
// ✅ 驼峰命名，含义清晰
const reviewCount = 100
const userProfile = { name: 'John' }
async function getReviewsByAsin(asin) { }
function calculateAverageRating(reviews) { }

// ❌ 避免
const rc = 100  // 太简短
const data = {}  // 太模糊
async function get(id) { }  // 不清楚获取什么
function calc(arr) { }  // 缩写不明确
```

#### 类和构造函数
```javascript
// ✅ 帕斯卡命名
class ApifyAmazonCrawler { }
class TaskService { }
class GeminiProvider { }

// ❌ 避免
class crawler { }  // 小写开头
class apify_crawler { }  // 下划线
```

#### 常量
```javascript
// ✅ 全大写+下划线
const MAX_REVIEWS = 2000
const API_TIMEOUT = 30000
const DEFAULT_LANGUAGE = 'en'

// ❌ 避免
const maxReviews = 2000  // 看起来像变量
```

#### 文件名
```javascript
// ✅ 帕斯卡命名（类）或驼峰命名（工具）
ApifyAmazonCrawler.js
TaskService.js
logger.js
dataHelper.js

// ❌ 避免
apify-amazon-crawler.js  // 短横线
task_service.js  // 下划线
```

### 代码结构

#### 模块导入顺序
```javascript
// 1. Node.js内置模块
const fs = require('fs')
const path = require('path')

// 2. 第三方依赖
const axios = require('axios')
const express = require('express')

// 3. 项目内部模块
const logger = require('../utils/logger')
const config = require('../config')

// 4. 相对路径模块
const TaskService = require('./TaskService')
```

#### 函数组织
```javascript
class ExampleService {
  // 1. 构造函数
  constructor() { }
  
  // 2. 公开方法（按重要性排序）
  async mainMethod() { }
  async secondaryMethod() { }
  
  // 3. 私有方法（下划线开头）
  async _helperMethod() { }
  _validateData(data) { }
  
  // 4. 静态方法
  static utilityMethod() { }
}
```

### 错误处理规范

```javascript
// ✅ 推荐的错误处理
async function processTask(taskId) {
  try {
    // 1. 参数验证
    if (!taskId) {
      throw new Error('taskId不能为空')
    }
    
    // 2. 业务逻辑
    const task = await getTask(taskId)
    if (!task) {
      throw new Error(`任务不存在: ${taskId}`)
    }
    
    const result = await executeTask(task)
    
    // 3. 记录成功日志
    logger.info('任务完成', { taskId, result })
    
    return result
    
  } catch (error) {
    // 4. 详细错误日志
    logger.error('任务处理失败', {
      taskId,
      error: error.message,
      stack: error.stack
    })
    
    // 5. 抛出友好错误
    throw new Error(`任务处理失败: ${error.message}`)
  }
}

// ❌ 不推荐
async function processTask(taskId) {
  try {
    return await getTask(taskId)
  } catch (e) {
    console.log(e)  // 不好的日志
    return null  // 吞掉错误
  }
}
```

### 日志规范

```javascript
// ✅ 结构化日志
logger.info('任务开始', {
  taskId: 'task-123',
  asin: 'B08N5WRWNW',
  maxReviews: 500
})

logger.error('API调用失败', {
  api: 'Apify',
  asin: 'B08N5WRWNW',
  error: error.message,
  retryCount: 3
})

// ❌ 避免
console.log('start')
logger.info('error: ' + error)
logger.error(JSON.stringify(data))
```

---

## 🎯 常见开发场景（详细示例）

### 场景1: 添加新的AI分析维度

**需求**：添加"情感趋势分析"维度

**步骤**：

#### 1. 设计Prompt（src/ai/PromptTemplates.js）
```javascript
/**
 * 情感趋势分析Prompt
 * 分析评论的情感变化趋势
 */
static getSentimentTrendPrompt(reviews) {
  // 按时间排序评论
  const sortedReviews = reviews
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 200)  // 最多200条
  
  const reviewText = sortedReviews
    .map(r => `[${r.date}] ${r.rating}星: ${r.text}`)
    .join('\n\n')
  
  return `
分析以下Amazon评论的情感趋势：

${reviewText}

请提供JSON格式的分析结果：
{
  "overallTrend": "上升/下降/稳定",
  "monthlyData": [
    {
      "month": "2023-01",
      "averageRating": 4.2,
      "sentiment": "积极/中立/消极",
      "keyTopics": ["topic1", "topic2"]
    }
  ],
  "insights": "趋势分析洞察..."
}
`
}
```

#### 2. 添加分析方法（src/ai/AnalysisService.js）
```javascript
/**
 * 分析情感趋势
 */
async analyzeSentimentTrend(reviews, systemPrompt) {
  try {
    logger.info('🔍 开始分析情感趋势', { count: reviews.length })
    
    const prompt = PromptTemplates.getSentimentTrendPrompt(reviews)
    const result = await this.gemini.analyze(prompt, systemPrompt)
    
    // 验证结果
    if (!result.overallTrend) {
      throw new Error('情感趋势数据缺失')
    }
    
    logger.info('✅ 情感趋势分析完成')
    return result
    
  } catch (error) {
    logger.error('❌ 情感趋势分析失败', { error: error.message })
    throw error
  }
}
```

#### 3. 集成到主分析流程（src/ai/AnalysisService.js）
```javascript
async analyze(reviews, options = {}) {
  // ... 现有代码
  
  // 添加情感趋势分析
  const results = await Promise.allSettled([
    this.analyzeConsumerProfile(reviews, systemPrompt),
    this.analyzeUsageScenarios(reviews, systemPrompt),
    this.analyzeStarRatingImpact(reviews, systemPrompt),
    this.analyzeProductExperience(reviews, systemPrompt),
    this.analyzePurchaseMotivation(reviews, systemPrompt),
    this.analyzeUnmetNeeds(reviews, systemPrompt),
    this.analyzeSentimentTrend(reviews, systemPrompt)  // ✅ 新增
  ])
  
  // 处理结果
  return {
    // ... 现有维度
    sentimentTrend: results[6].status === 'fulfilled' 
      ? results[6].value 
      : null
  }
}
```

#### 4. 更新API返回格式（文档）
更新 `docs/03-后端API设计文档.md`

#### 5. 前端适配（如需要）
在 `web/src/components/` 创建 `SentimentTrend.vue`

---

### 场景2: 优化API性能

**问题**：AI分析接口响应时间过长（>2分钟）

**优化步骤**：

#### 1. 性能分析
```javascript
// 添加性能监控
async function analyzeWithTiming(reviews) {
  const startTime = Date.now()
  
  logger.info('⏱️ 开始性能监控')
  
  // 爬取
  const t1 = Date.now()
  const reviews = await crawler.getReviews(asin)
  logger.info(`爬取耗时: ${Date.now() - t1}ms`)
  
  // AI分析
  const t2 = Date.now()
  const analysis = await analyzer.analyze(reviews)
  logger.info(`AI分析耗时: ${Date.now() - t2}ms`)
  
  logger.info(`总耗时: ${Date.now() - startTime}ms`)
  
  return { reviews, analysis }
}
```

#### 2. 识别瓶颈
```
发现问题：
- 爬取: 30秒 ✅
- AI分析: 90秒 ❌ (太慢)
  - 7个维度串行执行
```

#### 3. 优化方案
```javascript
// ❌ 串行执行（慢）
const consumerProfile = await analyzeConsumerProfile(reviews)
const usageScenarios = await analyzeUsageScenarios(reviews)
const starRating = await analyzeStarRatingImpact(reviews)
// ... 总计90秒

// ✅ 并发执行（快）
const results = await Promise.allSettled([
  analyzeConsumerProfile(reviews),
  analyzeUsageScenarios(reviews),
  analyzeStarRatingImpact(reviews),
  // ...
])
// 总计15秒（最慢的维度）

// 性能提升：6倍
```

#### 4. 进一步优化
```javascript
// 缓存机制
class AnalysisCache {
  constructor() {
    this.cache = new Map()
  }
  
  getCacheKey(asin, reviewCount) {
    return `${asin}:${reviewCount}`
  }
  
  get(asin, reviewCount) {
    const key = this.getCacheKey(asin, reviewCount)
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
      // 7天内有效
      return cached.data
    }
    
    return null
  }
  
  set(asin, reviewCount, data) {
    const key = this.getCacheKey(asin, reviewCount)
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
}
```

---

## ⚠️ 常见错误和避免方法

### 错误1: 忘记错误处理
```javascript
// ❌ 危险
async function getReviews(asin) {
  const response = await fetch(`/api/${asin}`)
  return response.json()
}

// ✅ 安全
async function getReviews(asin) {
  try {
    const response = await fetch(`/api/${asin}`)
    
    if (!response.ok) {
      throw new Error(`API返回错误: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data || !data.reviews) {
      throw new Error('返回数据格式错误')
    }
    
    return data
    
  } catch (error) {
    logger.error('获取评论失败', { asin, error: error.message })
    throw new Error(`获取评论失败: ${error.message}`)
  }
}
```

### 错误2: 硬编码配置
```javascript
// ❌ 硬编码
const API_KEY = 'sk-abc123'
const API_URL = 'https://api.example.com'

// ✅ 环境变量
const API_KEY = process.env.GEMINI_API_KEY
const API_URL = process.env.GEMINI_BASE_URL || 'https://aihubmix.com/v1'
```

### 错误3: 不合理的循环
```javascript
// ❌ 低效
for (let i = 0; i < reviews.length; i++) {
  for (let j = 0; j < keywords.length; j++) {
    if (reviews[i].text.includes(keywords[j])) {
      // O(n * m * k) - k是文本长度
    }
  }
}

// ✅ 优化
const keywordSet = new Set(keywords)
const regex = new RegExp(keywords.join('|'), 'gi')

reviews.forEach(review => {
  const matches = review.text.match(regex)
  // O(n * k) - 快很多
})
```

---

## 📊 性能基准

### 目标指标
```
爬取100条评论：    < 20秒
AI分析7维度：      < 20秒
API响应总时间：    < 45秒
前端页面加载：     < 2秒
```

### 优化优先级
1. **高优先级**：API响应时间
2. **中优先级**：前端渲染性能
3. **低优先级**：爬虫速度（已够快）

---

## 🔐 安全规范

### 环境变量管理
```javascript
// ✅ 正确
const config = {
  geminiKey: process.env.GEMINI_API_KEY,
  apifyToken: process.env.APIFY_API_TOKEN
}

// 启动时验证
if (!config.geminiKey) {
  throw new Error('GEMINI_API_KEY未配置')
}

// ❌ 错误
const GEMINI_KEY = 'sk-abc123'  // 泄露密钥
console.log(process.env.GEMINI_API_KEY)  // 打印密钥
```

### 输入验证
```javascript
// ✅ 验证ASIN
function validateAsin(asin) {
  if (!asin || typeof asin !== 'string') {
    throw new Error('ASIN必须是字符串')
  }
  
  if (!/^[A-Z0-9]{10}$/.test(asin)) {
    throw new Error('ASIN格式错误（应为10位字母数字）')
  }
  
  return asin.toUpperCase()
}

// 使用
const asin = validateAsin(req.params.asin)
```

---

## 📝 文档编写规范

### JSDoc注释
```javascript
/**
 * 分析Amazon产品评论
 * 
 * @param {string} asin - Amazon产品ASIN（10位字母数字）
 * @param {Object} options - 配置项
 * @param {number} [options.maxReviews=Infinity] - 最大评论数
 * @param {Function} [options.onProgress] - 进度回调
 * @returns {Promise<Object>} 分析结果
 * @throws {Error} ASIN格式错误或API调用失败
 * 
 * @example
 * const result = await analyzer.analyze('B08N5WRWNW', {
 *   maxReviews: 500,
 *   onProgress: (p) => console.log(p)
 * })
 */
async function analyze(asin, options = {}) {
  // ...
}
```

---

## 🎓 学习资源

### 项目内部文档
- `docs/01-项目技术方案总体设计.md` - 整体架构
- `docs/02-Web端详细设计方案.md` - 前端设计
- `docs/03-后端API设计文档.md` - API规范
- `docs/爬虫简化完成-2025-11-07.md` - 爬虫架构

### 外部参考
- [Node.js最佳实践](https://github.com/goldbergyoni/nodebestpractices)
- [JavaScript Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)
- [Vue.js风格指南](https://vuejs.org/style-guide/)

---

## 🆘 常见问题

### Q: 如何快速理解项目？
A: 按顺序阅读：
1. README.md
2. docs/01-项目技术方案总体设计.md
3. src/crawler/CrawlerFacade.js（爬虫入口）
4. src/ai/AnalysisService.js（AI分析入口）
5. web/src/views/ReportDetail.vue（前端入口）

### Q: 如何测试新功能？
A: 
```bash
# 1. 启动后端
npm start

# 2. 启动前端
cd web && npm run dev

# 3. 测试API
node tests/test-full-analysis.js

# 4. 手动测试
打开Chrome扩展，分析一个产品
```

### Q: 遇到问题怎么办？
A:
1. 查看日志：`logs/` 目录
2. 运行诊断：`node scripts/health-check.js`
3. 查看文档：`docs/` 目录
4. 搜索代码：`grep -r "关键词" src/`

---

## ✅ 总结清单

在开始开发前，确认：
- [ ] 已阅读本文档
- [ ] 已理解项目核心架构
- [ ] 已查看相关代码示例
- [ ] 已思考最优实现方案

在提交代码前，确认：
- [ ] 代码通过所有检查清单
- [ ] 功能已测试
- [ ] 文档已更新
- [ ] Commit message清晰

---

**最后的话**：

代码质量 > 开发速度

简单方案 > 复杂设计

一致性 > 个人偏好

**Happy Coding! 🚀**

---

**文档维护**：本文档应随项目演进持续更新  
**反馈渠道**：GitHub Issues或项目文档PR




