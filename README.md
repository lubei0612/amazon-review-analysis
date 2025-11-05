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

## English

### 🌟 Features

- **🤖 AI Analysis**: Powered by Gemini 2.5 Pro for deep consumer insights
- **🕷️ Smart Crawling**: Multi-source review scraping (Apify, Puppeteer)
- **📊 Rich Reports**: 6 analysis dimensions with visual charts
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
- **🕷️ 智能爬虫**：多源评论抓取（Apify、Puppeteer）
- **📊 丰富报告**：6大分析维度，可视化图表展示
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
- **爬虫**: Apify, Puppeteer
- **部署**: Docker, Docker Compose, Nginx

### 📞 技术支持

- **文档**: 查看 `docs/` 目录下的详细文档
- **问题**: 提交 GitHub Issue
- **邮件**: support@example.com

### 🤝 贡献

欢迎贡献代码！请随时提交Pull Request。

### 📄 许可证

本项目采用MIT许可证。

---

<div align="center">

**Made with ❤️ by JiMao Team**

[Documentation](docs/) | [Issues](https://github.com/your-repo/issues) | [Releases](https://github.com/your-repo/releases)

</div>

