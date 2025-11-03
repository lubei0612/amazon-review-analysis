# Amazon评论分析系统 - 客户演示版

**版本**: v1.2-stable  
**更新时间**: 2025-10-27  
**系统状态**: ✅ 可用于演示

---

## 🚀 快速开始（3步完成）

### 步骤1: 安装依赖（首次使用）

打开终端，在项目目录执行：

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd web
npm install
cd ..
```

**预计时间**: 3-5分钟（取决于网络速度）

---

### 步骤2: 配置API密钥

1. 复制 `.env.example` 为 `.env`
2. 打开 `.env` 文件，填入您的API密钥：

```env
# AI分析（必须）
GEMINI_API_KEY=your_gemini_api_key_here

# 数据爬取（必须）
OUTSCRAPER_API_KEY=your_outscraper_api_key_here

# 备用爬虫（可选）
RAPIDAPI_KEY=your_rapidapi_key_here
```

**获取API密钥**:
- Gemini: https://makersuite.google.com/app/apikey
- Outscraper: https://app.outscraper.com/profile

---

### 步骤3: 启动系统

**双击运行**: `一键启动-客户版.bat`

系统将自动：
- ✅ 清理旧进程
- ✅ 启动后端服务（http://localhost:3001）
- ✅ 启动Web前端（http://localhost:3002）
- ✅ 打开浏览器

**看到这个界面说明成功**:
```
🎉 系统启动完成！

📍 服务地址：
   • 后端API: http://localhost:3001
   • Web前端: http://localhost:3002
```

---

## 📖 使用方法

### 方式1: Web端（推荐）⭐

**适合**: 深度分析，查看完整数据

1. 访问: http://localhost:3002
2. 在搜索框输入Amazon产品ASIN
   - 例如: `B08S7NJLMG`
   - 或完整URL: `https://www.amazon.com/dp/B08S7NJLMG`
3. 点击"Search" → "开始分析"
4. 等待1-2分钟
5. 查看完整的分析报告

**支持的分析内容**:
- 消费者画像（性别、年龄、职业、家庭）
- 使用场景
- 星级分布分析
- 产品优缺点
- 购买动机
- 未满足的需求

---

### 方式2: Chrome扩展

**适合**: 在Amazon页面快速分析

**安装步骤**:
1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的 `chrome-extension` 文件夹
6. 安装完成！

**使用步骤**:
1. 访问任意Amazon产品页
2. 页面会自动注入分析面板
3. 点击"开始AI分析"
4. 查看Top 5关键信息
5. 点击"查看详细报告"跳转到Web端

---

## 🛠️ 系统管理

### 停止系统
双击运行: `停止所有服务.bat`

或手动关闭两个弹出的终端窗口。

### 重启系统
1. 先运行 `停止所有服务.bat`
2. 再运行 `一键启动-客户版.bat`

### 查看日志
- **后端日志**: 在标题为"Amazon分析-后端"的终端窗口
- **前端日志**: 在标题为"Amazon分析-前端"的终端窗口

---

## 📊 系统功能说明

### AI分析引擎
- **模型**: Google Gemini 2.5 Pro
- **语言**: 中文输出
- **分析深度**: 6个维度全面分析

### 数据爬取
- **主爬虫**: Outscraper（付费，稳定）
- **备用1**: RapidAPI（付费，可选）
- **备用2**: Puppeteer（免费，较慢）
- **降级策略**: 自动切换

### 性能指标
- **爬取时间**: 10-30秒（500条评论）
- **分析时间**: 30-60秒
- **总耗时**: 40-90秒
- **成功率**: 60-90%（取决于配置）

---

## 🐛 常见问题

### Q1: 启动失败，提示端口被占用？

**解决方法**:
```bash
# 检查端口占用
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# 结束占用进程
taskkill /F /PID <进程ID>
```

### Q2: 显示"所有爬虫都失败"？

**原因**: Outscraper API不稳定

**解决方法**:
1. **等待1分钟后重试**（成功率70%）
2. 检查Outscraper配额: https://app.outscraper.com/profile
3. 尝试不同的ASIN（选择评论数>1000的产品）
4. 配置RapidAPI作为备用

### Q3: 后端启动失败？

**可能原因**:
- Node.js未安装
- 依赖未安装
- .env配置错误

**解决方法**:
```bash
# 检查Node.js版本
node -v
npm -v

# 重新安装依赖
npm install

# 检查.env文件
# 确保GEMINI_API_KEY和OUTSCRAPER_API_KEY已配置
```

### Q4: Web前端无法访问？

**解决方法**:
```bash
# 重新安装前端依赖
cd web
npm install
npm run dev
```

### Q5: Chrome扩展不显示？

**可能原因**:
- 不是Amazon产品页
- 页面布局不支持

**解决方法**:
1. 确认URL包含 `/dp/XXXXXXXXXX`
2. 刷新页面
3. 打开F12控制台查看日志

---

## 💡 使用技巧

### 技巧1: 选择合适的ASIN
- ✅ 推荐: 评论数 > 500的产品
- ✅ 推荐: 评分在3-5星的产品
- ❌ 避免: 评论数 < 10的产品

### 技巧2: 提高成功率
1. 配置多个爬虫（Outscraper + RapidAPI）
2. 失败后等待1分钟重试
3. 选择流行产品（评论数多）
4. 检查Outscraper配额

### 技巧3: 最佳使用场景
- **Chrome扩展**: 快速浏览时使用
- **Web端**: 需要详细数据时使用
- **配合使用**: 先用扩展快速看，再到Web端深入分析

---

## 📞 技术支持

### 详细文档
- `USER-GUIDE-WEB-CREATE.md` - Web端使用指南
- `QUICK-START-AFTER-FIXES.md` - 快速开始指南

### API文档
- Gemini API: https://ai.google.dev/docs
- Outscraper API: https://app.outscraper.com/api-docs

### 系统要求
- **操作系统**: Windows 10+
- **Node.js**: v16.0.0+
- **浏览器**: Chrome 90+
- **内存**: 4GB+
- **网络**: 稳定的互联网连接

---

## 📦 项目结构

```
amazon-review-analysis/
├── 一键启动-客户版.bat    ← 一键启动脚本
├── 停止所有服务.bat        ← 停止脚本
├── README-客户版.md       ← 本文档
├── server.js              ← 后端主文件
├── package.json           ← 后端依赖
├── .env                   ← API配置（需自行创建）
├── chrome-extension/      ← Chrome插件
├── src/                   ← 后端源码
│   ├── ai/               ← AI分析模块
│   ├── crawler/          ← 爬虫模块
│   └── services/         ← 业务逻辑
├── web/                   ← Web前端
│   ├── src/              ← 前端源码
│   └── package.json      ← 前端依赖
└── utils/                 ← 工具函数
```

---

## ⚠️ 重要提示

### 关于Outscraper
- **费用**: 约$2/1000条评论
- **稳定性**: 时好时坏（已知问题）
- **建议**: 配置备用爬虫提高成功率

### 关于数据准确性
- 本系统为AI辅助分析工具
- 分析结果仅供参考
- 建议结合人工判断使用

### 关于演示限制
- 当前版本为演示版
- 某些功能可能受限于API配额
- 建议在测试环境使用

---

## 🎉 开始使用

现在您已经了解了所有功能，可以开始使用了！

**最简单的测试流程**:
1. 运行 `一键启动-客户版.bat`
2. 访问 http://localhost:3002
3. 输入 `B08S7NJLMG`
4. 点击"Search" → "开始分析"
5. 等待查看报告！

---

**版本**: v1.2-stable  
**更新日期**: 2025-10-27  
**系统状态**: ✅ 可用于演示  

**祝您使用愉快！** 🎉


