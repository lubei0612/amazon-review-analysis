# RapidAPI 配置指南

## 🚀 快速开始

由于Outscraper API返回空数据，建议切换到RapidAPI作为备用爬虫。

## 📋 步骤1: 注册并获取API Key

### 1.1 注册RapidAPI账号
访问 https://rapidapi.com/auth/sign-up

### 1.2 搜索Amazon Reviews API
推荐以下几个API（选择一个）：

#### 选项1: Real-Time Amazon Data API (推荐)
- 🔗 https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
- ✅ 免费额度: 100 requests/month
- 💰 付费: $9.99/月起 (1000 requests)
- ⭐ 评分: 4.8/5

#### 选项2: Amazon Data Scraper
- 🔗 https://rapidapi.com/restyler/api/amazon-data-scraper127
- ✅ 免费额度: 50 requests/month
- 💰 付费: $4.99/月起 (500 requests)

#### 选项3: Amazon Product Reviews
- 🔗 https://rapidapi.com/apidojo/api/amazon-product-reviews-and-specifications
- ✅ 免费额度: 500 requests/month
- 💰 付费: $9.99/月起

### 1.3 Subscribe并获取API Key
1. 点击 "Subscribe to Test"
2. 选择免费计划 (Basic/Free)
3. 在 "Code Snippets" 部分找到 `X-RapidAPI-Key`
4. 复制API Key (格式类似: `abc123xyz456...`)

## 📋 步骤2: 配置项目

### 2.1 编辑 `.env` 文件
```bash
# Amazon评论爬虫配置
OUTSCRAPER_API_KEY=your_outscraper_key  # 保留，作为主爬虫
RAPIDAPI_KEY=your_rapidapi_key_here     # ✅ 添加这行

# AI分析引擎
GEMINI_API_KEY=your_gemini_key

# 环境配置
NODE_ENV=development
PORT=3001
```

### 2.2 更新RapidAPI配置
打开 `src/crawler/RapidAPICrawler.js`，确认以下配置：

```javascript
class RapidAPICrawler {
  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY
    this.baseURL = 'https://real-time-amazon-data.p.rapidapi.com'  // 修改为你选择的API
    this.apiHost = 'real-time-amazon-data.p.rapidapi.com'  // 修改为你选择的API host
  }
}
```

## 📋 步骤3: 测试RapidAPI

### 3.1 运行测试脚本
```bash
node test-rapidapi.js
```

### 3.2 预期输出
```
🧪 测试RapidAPI爬虫...
✅ RapidAPI Key已配置
📋 测试ASIN: B08N5WRWNW
📡 发送请求...
✅ 成功获取 10 条评论
📝 第一条评论:
   评分: 5 ⭐
   标题: Great product
   ...
```

## 📋 步骤4: 启动项目

### 4.1 重启后端服务
```bash
npm start
```

### 4.2 验证爬虫状态
查看启动日志：
```
[INFO] ✅ CrawlerFacade已初始化
[INFO]    主爬虫: Outscraper (可用)
[INFO]    备用爬虫: RapidAPI (可用)  ✅ 成功！
```

## 🔧 故障排除

### 问题1: RapidAPI返回401 Unauthorized
**原因**: API Key无效或未配置
**解决**: 
- 检查`.env`中的`RAPIDAPI_KEY`是否正确
- 确保已subscribe到API
- 检查API Key是否包含正确的权限

### 问题2: RapidAPI返回429 Too Many Requests
**原因**: 超过免费额度
**解决**:
- 升级到付费计划
- 等待quota重置（通常每月1号）
- 切换到另一个RapidAPI

### 问题3: RapidAPI返回空数据
**原因**: API endpoint不正确
**解决**:
- 检查`baseURL`和`apiHost`是否匹配你选择的API
- 参考RapidAPI文档调整endpoint
- 查看API的Code Snippets示例

## 📊 爬虫切换逻辑

项目使用`CrawlerFacade`自动管理爬虫切换：

```
┌─────────────────────────────────────┐
│      CrawlerFacade                  │
│                                     │
│  1️⃣ 尝试 Outscraper (主爬虫)         │
│     ↓ 如果失败                       │
│  2️⃣ fallback到 RapidAPI (备用)      │
│     ↓ 如果还失败                     │
│  3️⃣ 抛出错误                        │
└─────────────────────────────────────┘
```

### 强制使用RapidAPI
如果想跳过Outscraper直接使用RapidAPI：

在 `.env` 中注释掉Outscraper:
```bash
# OUTSCRAPER_API_KEY=xxx  # 禁用Outscraper
RAPIDAPI_KEY=your_key     # 启用RapidAPI
```

## 💰 成本对比

| 服务 | 免费额度 | 付费价格 | 评论单价 |
|------|---------|---------|---------|
| Outscraper | 500条 | $2/1000条 | $0.002/条 |
| RapidAPI (Real-Time Amazon) | 100 requests | $9.99/月 (1000 requests) | ~$0.01/request |
| RapidAPI (Amazon Data Scraper) | 50 requests | $4.99/月 (500 requests) | ~$0.01/request |

**建议**: 
- 开发测试: 使用RapidAPI免费额度
- 生产环境: 使用Outscraper（成本更低）
- 备用方案: RapidAPI作为fallback

## 🔗 相关链接

- RapidAPI市场: https://rapidapi.com/search/amazon
- RapidAPI文档: https://docs.rapidapi.com/
- 项目RapidAPI爬虫: `src/crawler/RapidAPICrawler.js`
- 爬虫门面: `src/crawler/CrawlerFacade.js`

---

**更新时间**: 2025-10-25
**状态**: 可用 ✅


