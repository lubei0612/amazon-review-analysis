# 🚀 Amazon评论分析系统 - 快速开始指南

## 📋 前置要求

在开始之前，请确保已安装：

- ✅ **Node.js** (v14 或更高版本)
  - 下载地址：https://nodejs.org/
  - 验证安装：打开命令行输入 `node --version`

- ✅ **Chrome浏览器** (用于Chrome扩展)

---

## ⚙️ 第一步：配置环境变量

### 1. 创建 `.env` 文件

复制 `env.example` 文件并重命名为 `.env`：

```bash
# Windows
copy env.example .env

# 或者手动复制粘贴
```

### 2. 填写 API 密钥

编辑 `.env` 文件，填写以下必需的配置：

```env
# Gemini API Key (必填) - AI分析引擎
GEMINI_API_KEY=你的Gemini密钥

# RapidAPI Key (必填) - 评论爬虫
RAPIDAPI_KEY=你的RapidAPI密钥
RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com
```

### 3. 获取 API 密钥

#### 🤖 Gemini API Key

1. 访问：https://aistudio.google.com/app/apikey
2. 登录 Google 账号
3. 点击「Create API Key」
4. 复制密钥（格式：`AIzaSy...` 或通过代理 `sk-...`）

#### 🕷️ RapidAPI Key

1. 访问：https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
2. 注册并登录
3. 订阅免费套餐（500次/月）
4. 复制 API Key

---

## 🚀 第二步：启动系统

### 方式1：一键启动（推荐）

双击运行：

```
启动系统.bat
```

会弹出菜单让您选择启动模式：
- **[1] 完整模式** - 同时启动后端和前端（推荐首次使用）
- **[2] 仅后端** - 只启动API服务
- **[3] 仅前端** - 只启动Web界面

### 方式2：分别启动

#### 启动后端 API

双击运行：
```
快速启动-后端.bat
```

**服务地址：**
- API: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

#### 启动 Web 前端

双击运行：
```
快速启动-前端.bat
```

**访问地址：**
- Web界面: http://localhost:3002

---

## 🌐 第三步：使用系统

### Web 界面使用

1. 打开浏览器访问：http://localhost:3002
2. 输入 Amazon 产品 ASIN（例如：B07ZPKN6YR）
3. 点击「开始分析」
4. 等待爬取和AI分析完成
5. 查看6维度分析报告

### Chrome 扩展使用

1. 打开 Chrome，访问：`chrome://extensions/`
2. 开启「开发者模式」（右上角）
3. 点击「加载已解压的扩展程序」
4. 选择项目中的 `chrome-extension` 文件夹
5. 访问任意 Amazon 产品页面
6. 点击扩展图标
7. 配置 Gemini API Key
8. 点击「开始分析」

---

## ⛔ 停止服务

双击运行：
```
停止所有服务.bat
```

这会自动停止所有运行中的后端和前端服务。

---

## 📊 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    用户界面层                            │
│  ┌──────────────┐              ┌──────────────┐         │
│  │  Web 界面    │              │ Chrome 扩展  │         │
│  │  (Vue 3)     │              │  (Popup)     │         │
│  └──────────────┘              └──────────────┘         │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   API 服务层                             │
│                  (Express.js)                            │
│                  localhost:3001                          │
└─────────────────────────────────────────────────────────┘
           │                            │
           ▼                            ▼
┌────────────────────┐      ┌────────────────────┐
│   爬虫服务          │      │   AI 分析服务       │
│  - RapidAPI        │      │  - Gemini 2.5 Pro  │
│  - Puppeteer       │      │  - 6维度分析        │
└────────────────────┘      └────────────────────┘
```

---

## 🔍 健康检查

### 检查后端状态

访问：http://localhost:3001/api/health

**正常响应：**
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T11:30:00.000Z",
  "services": {
    "rapidapi": "available",
    "puppeteer": "available",
    "gemini": "available"
  }
}
```

---

## ❓ 常见问题

### Q1: 启动时提示「未找到 .env 文件」？

**解决：**
1. 确认项目根目录有 `.env` 文件
2. 如果没有，复制 `env.example` 为 `.env`
3. 填写必需的 API 密钥

### Q2: 后端启动失败，提示端口被占用？

**解决：**
1. 运行 `停止所有服务.bat`
2. 或手动关闭占用3001端口的进程

### Q3: AI分析失败，提示 API Key 错误？

**解决：**
1. 检查 `.env` 中的 `GEMINI_API_KEY` 是否正确
2. 确认密钥有效且未过期
3. 检查网络连接（需要能访问 Google 服务）

### Q4: RapidAPI 爬取失败？

**解决：**
1. 检查 `RAPIDAPI_KEY` 是否正确配置
2. 确认 RapidAPI 订阅未过期
3. 检查免费配额是否用完（500次/月）
4. 系统会自动降级到 Puppeteer 爬虫

### Q5: Web 前端无法连接后端？

**解决：**
1. 确保后端服务已启动（http://localhost:3001）
2. 检查防火墙设置
3. 查看浏览器控制台是否有 CORS 错误

---

## 📁 项目目录结构

```
maijiaplug/
├── 启动系统.bat           # 一键启动脚本（主要）
├── 快速启动-后端.bat       # 单独启动后端
├── 快速启动-前端.bat       # 单独启动前端
├── 停止所有服务.bat        # 停止所有服务
├── .env                   # 环境配置（需手动创建）
├── env.example            # 环境配置模板
├── server.js              # 后端入口
├── package.json           # 后端依赖
├── src/                   # 后端源码
│   ├── ai/                # AI 分析模块
│   ├── crawler/           # 爬虫模块
│   └── services/          # 业务服务
├── chrome-extension/      # Chrome 扩展
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
└── web/                   # Web 前端
    ├── package.json
    └── src/
```

---

## 📞 获取帮助

如果遇到问题：

1. 📖 查看详细文档：
   - [项目技术方案](docs/01-项目技术方案总体设计.md)
   - [Gemini API验证报告](GEMINI-API-VERIFICATION-REPORT.md)
   - [项目优化报告](PROJECT-OPTIMIZATION-REPORT.md)

2. 🔍 运行健康检查：
   ```bash
   node scripts/health-check.js
   ```

3. 🧪 运行测试：
   ```bash
   # 测试 Gemini API
   node tests/test-gemini-api.js
   
   # 测试 RapidAPI
   node tests/test-rapid-api-only.js
   ```

---

## 🎉 开始使用

现在您可以：

1. ✅ 双击 `启动系统.bat`
2. ✅ 选择「完整模式」
3. ✅ 打开 http://localhost:3002
4. ✅ 输入 Amazon ASIN 开始分析！

**祝您使用愉快！** 🚀

