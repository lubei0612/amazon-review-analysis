# 🎯 Amazon Review Analysis System
# Amazon 评论分析系统

<div align="center">

[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-success)](https://github.com/lubei0612/amazon-review-analysis)

**AI-Powered Amazon Product Review Analysis Tool**  
**基于AI的Amazon产品评论智能分析工具**

[快速开始](#-quick-start) • [功能特性](#-features) • [使用指南](#-usage) • [文档](#-documentation)

</div>

---

## 📋 简介 | Introduction

Amazon评论分析系统是一款智能化的产品评论分析工具，通过AI技术对Amazon产品评论进行深度分析，生成7个维度的专业分析报告。

**核心特性：**
- 🤖 **AI智能分析** - 采用Gemini 2.5 Pro，7维度并发分析
- 📊 **全量评论爬取** - 支持爬取产品的全部评论（最多1000条）
- 🎨 **消费者画像** - 性别比例、人群特征、使用场景、行为分析
- 🚀 **Chrome插件** - 一键在Amazon产品页面启动分析
- 📈 **可视化报告** - 直观的图表和数据展示

---

## ✨ Features | 功能特性

### 1. 🔍 智能爬取
- **三级降级策略**: Outscraper(主) → RapidAPI(备1) → Puppeteer(备2)
- **全量模式**: 支持爬取产品的所有可用评论
- **智能速率**: 自动控制请求频率，避免被封禁

### 2. 🤖 AI分析引擎
- **7维度并发分析**:
  1. 👥 消费者画像 - 性别、年龄、人群特征
  2. 🎯 使用场景 - 使用时刻、地点、场合
  3. ⭐ 星级影响度 - 评分分布与关键因素
  4. 💎 产品优势 - 用户好评要点
  5. ⚠️ 产品缺陷 - 用户差评问题
  6. 💰 购买动机 - 用户购买原因
  7. 🔍 未满足需求 - 改进建议

### 3. 🎨 消费者画像
- **性别比例识别** - 基于评论内容智能判断
- **人群特征分析** - 识别年龄段、角色、职业
- **使用时刻** - 特殊节日、人生大事、日常场景
- **使用地点** - 家庭、户外、公共场所
- **行为特征** - 送礼、拍照、日常使用等

### 4. 🌐 多端支持
- **Chrome Extension** - 浏览器插件（主要方式）
- **Web Interface** - 网页界面（演示/开发）
- **API Service** - RESTful API接口

---

## 🚀 Quick Start | 快速开始

### 📦 安装依赖

```bash
# 1. 克隆项目
git clone https://github.com/lubei0612/amazon-review-analysis.git
cd amazon-review-analysis

# 2. 安装依赖
npm install

# 3. 配置环境变量
copy env.example .env
# 编辑 .env 文件，填写 API 密钥
```

### ⚙️ 配置API密钥

编辑 `.env` 文件：

```env
# Gemini API Key (必填) - AI 分析引擎
GEMINI_API_KEY=your_gemini_api_key_here

# RapidAPI Key (必填) - 评论爬虫
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com
```

**获取API密钥：**
- **Gemini API**: https://aistudio.google.com/app/apikey
- **RapidAPI**: https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data

### 🎬 启动系统

#### 方式1：一键启动（推荐）⭐

```bash
# Windows 用户
START-BACKEND.bat

# 或使用主菜单
START.bat
```

#### 方式2：命令行启动

```bash
npm start
```

服务启动后访问：http://localhost:3001

---

## 📱 Usage | 使用方式

### 🔧 方式1：Chrome 插件（推荐）⭐

**最简单、最常用的方式**

1. **安装 Chrome 插件**
   ```
   - 打开 chrome://extensions/
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 chrome-extension 文件夹
   ```

2. **启动后端服务**
   ```bash
   双击: START-BACKEND.bat
   ```

3. **开始分析**
   ```
   - 访问任意 Amazon 产品页面
   - 点击 Chrome 插件图标
   - 点击"开始分析"
   - 等待分析完成
   ```

4. **查看结果**
   - 分析结果直接显示在产品页面
   - 或点击"查看完整报告"跳转到详细页面

---

### 🌐 方式2：Web 界面

**适合演示和开发**

1. **启动完整系统**
   ```bash
   START.bat
   选择 [2] 完整模式
   ```

2. **访问Web界面**
   ```
   http://localhost:3002
   ```

3. **输入ASIN分析**
   ```
   - 输入 Amazon 产品 ASIN (如: B07ZPKN6YR)
   - 点击"开始分析"
   - 等待结果
   ```

---

## 📂 Project Structure | 项目结构

```
amazon-review-analysis/
├── chrome-extension/        # Chrome 插件
│   ├── manifest.json       # 插件配置
│   ├── background.js       # 后台脚本
│   ├── content.js          # 内容脚本
│   ├── popup.html/js       # 弹窗界面
│   └── ui.html/css/js      # 注入UI
├── src/                    # 后端源码
│   ├── ai/                 # AI 分析模块
│   │   ├── GeminiProvider.js
│   │   ├── AnalysisService.js
│   │   └── PromptTemplates.js
│   ├── crawler/            # 爬虫模块
│   │   ├── CrawlerFacade.js
│   │   ├── RapidAPICrawler.js
│   │   ├── OutscraperCrawler.js
│   │   ├── PuppeteerCrawler.js
│   │   └── DataCleaner.js
│   └── services/           # 业务服务
│       └── TaskService.js
├── tests/                  # 测试脚本
│   ├── test-full-analysis.js
│   ├── test-gemini-api.js
│   └── test-rapid-api-only.js
├── docs/                   # 项目文档
│   ├── user-guides/        # 用户指南
│   ├── reports/            # 分析报告
│   ├── testing/            # 测试文档
│   └── guides/             # 开发指南
├── scripts/                # 工具脚本
│   └── health-check.js
├── web/                    # Web 前端
│   └── src/
├── server.js               # 后端服务器
├── START-BACKEND.bat       # 快速启动后端
├── START.bat               # 主启动菜单
├── STOP-ALL.bat            # 停止所有服务
├── RESTART-BACKEND.bat     # 重启后端
└── TEST-FULL-ANALYSIS.bat  # 测试全量分析
```

---

## 📖 Documentation | 文档

### 🚀 Quick Guides | 快速指南

| 文档 | 说明 |
|------|------|
| [使用指南](docs/user-guides/README-使用指南.md) | 完整使用教程 ⭐ |
| [快速开始](docs/user-guides/README-快速开始.md) | 5分钟上手指南 |
| [BAT文件指南](docs/user-guides/BAT-FILES-GUIDE.md) | 启动脚本说明 |
| [重启指南](docs/user-guides/如何正确重启后端.md) | 后端重启方法 |

### 🧪 Testing Guides | 测试指南

| 文档 | 说明 |
|------|------|
| [快速测试](docs/testing/QUICK-TEST-全量爬取.md) | 5分钟验证功能 |
| [全量爬取测试](docs/testing/全量爬取测试指南.md) | 详细测试流程 |
| [问题解决方案](docs/testing/问题解决方案-全量爬取与消费者画像.md) | 常见问题修复 |

### 📊 Reports | 分析报告

| 文档 | 说明 |
|------|------|
| [项目优化报告](docs/reports/PROJECT-OPTIMIZATION-REPORT.md) | 系统优化记录 |
| [Gemini验证报告](docs/reports/GEMINI-API-VERIFICATION-REPORT.md) | API测试结果 |
| [交付总结](docs/reports/交付总结-全量分析功能.md) | 功能交付文档 |

### 🛠️ Technical Docs | 技术文档

| 文档 | 说明 |
|------|------|
| [技术方案](docs/01-项目技术方案总体设计.md) | 系统架构设计 |
| [API文档](docs/03-后端API设计文档.md) | RESTful API |
| [爬虫方案](docs/04-第三方爬虫平台对接方案对比.md) | 爬虫选型 |

---

## 🛠️ Technology Stack | 技术栈

### Backend | 后端
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI Engine**: Gemini 2.5 Pro
- **Crawlers**: RapidAPI, Outscraper, Puppeteer

### Frontend | 前端
- **Framework**: Vue 3
- **Build Tool**: Vite
- **UI**: Element Plus

### Chrome Extension | 浏览器插件
- **Manifest**: V3
- **Content Script**: 页面注入
- **Background**: Service Worker

---

## 📊 Performance | 性能指标

### 爬取速度

| 评论数 | RapidAPI | 时间 |
|-------|----------|------|
| 100条 | ✅ | ~15秒 |
| 500条 | ✅ | ~75秒 |
| 1000条 | ✅ | ~150秒 |

### AI分析速度

| 评论数 | 分析时间 | 并发维度 |
|-------|----------|---------|
| 100条 | ~30-45秒 | 7个 |
| 500条 | ~60-90秒 | 7个 |

### API成本

**RapidAPI（免费套餐）:**
- 500次请求/月
- 100条评论 ≈ 10次请求 (2%)
- 1000条评论 ≈ 100次请求 (20%)

**Gemini API:**
- 基于token计费
- 100条评论 ≈ $0.04
- 1000条评论 ≈ $0.30

---

## 🧪 Testing | 测试

### 运行测试

```bash
# 测试全量分析功能
TEST-FULL-ANALYSIS.bat

# 或手动运行
node tests/test-full-analysis.js

# 测试 Gemini API
node tests/test-gemini-api.js

# 健康检查
node scripts/health-check.js
```

### 验收标准

- ✅ 能够爬取100+条评论
- ✅ AI分析7/7成功
- ✅ 消费者画像完整显示
- ✅ 性别比例精确到小数点后2位
- ✅ Chrome插件正常工作

---

## 🔧 Troubleshooting | 故障排查

### 常见问题

**Q1: 后端启动失败？**
```bash
# 检查端口占用
netstat -ano | findstr :3001

# 终止进程
taskkill /F /PID <PID号>

# 重新启动
RESTART-BACKEND.bat
```

**Q2: 爬取失败？**
- 检查 `.env` 文件中的 `RAPIDAPI_KEY`
- 确认 RapidAPI 配额未用尽
- 查看后端日志错误信息

**Q3: AI分析失败？**
- 检查 `GEMINI_API_KEY` 是否正确
- 确认API密钥有效且未过期
- 查看日志中的详细错误

**Q4: Chrome插件无响应？**
- 确认后端服务已启动
- 检查插件是否已配置API Key
- 重新加载插件（chrome://extensions/ → 刷新）

**详细排查指南：** [问题解决方案](docs/testing/问题解决方案-全量爬取与消费者画像.md)

---

## 🔄 Update Log | 更新日志

### v2.2 (2025-11-03) - Latest
- ✅ 修复消费者画像显示问题
- ✅ Chrome扩展数据结构兼容性
- ✅ 新增一键重启脚本
- ✅ 项目文档整理

### v2.1 (2025-11-03)
- ✅ 移除500条评论限制
- ✅ 实现真正的全量爬取
- ✅ 增强日志输出

### v2.0 (2025-11-02)
- ✅ 全量评论分析功能
- ✅ 深度消费者画像分析
- ✅ 性别比例识别
- ✅ 5个子维度分析

### v1.0 (2025-10-27)
- 🎉 系统首次发布
- ✅ 基础爬虫功能
- ✅ 6维度AI分析
- ✅ Chrome插件

---

## 📄 License | 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🤝 Contributing | 贡献

欢迎贡献代码、提出问题或建议！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📞 Support | 支持

- **GitHub Issues**: [提交问题](https://github.com/lubei0612/amazon-review-analysis/issues)
- **Documentation**: [完整文档](docs/)
- **Email**: lubei0612@github.com

---

## 🙏 Acknowledgments | 致谢

- **AI Engine**: Google Gemini 2.5 Pro
- **API Services**: RapidAPI, Outscraper
- **Frameworks**: Vue.js, Express.js, Puppeteer

---

<div align="center">

**Made with ❤️ by [lubei](https://github.com/lubei0612)**

⭐ **如果这个项目对你有帮助，请给个Star！** ⭐

[⬆ 回到顶部](#-amazon-review-analysis-system)

</div>
