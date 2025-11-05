# 🔧 RapidAPI 503 错误修复指南

## 问题描述

你遇到了 RapidAPI 返回 **503 Service Unavailable** 错误，导致评论爬取失败。

## 已完成的修复

✅ **1. 禁用了 Puppeteer 降级**
   - 现在系统只使用 RapidAPI，不会尝试使用 Puppeteer
   - 如果 RapidAPI 失败，会直接报错并提示如何修复

✅ **2. 创建了诊断脚本**
   - `diagnose-rapidapi.js` - 详细诊断 RapidAPI 的问题
   - `诊断-RapidAPI.bat` - 一键运行诊断

✅ **3. 添加了环境变量控制**
   - `ENABLE_PUPPETEER_FALLBACK` - 控制是否启用 Puppeteer 降级

---

## 立即执行的步骤

### 步骤1: 运行诊断脚本

**双击运行：**
```
诊断-RapidAPI.bat
```

**或命令行运行：**
```bash
node diagnose-rapidapi.js
```

**诊断脚本会检查：**
- ✅ API Key 是否正确配置
- ✅ API 是否能正常连接
- ✅ 是否有配额限制
- ✅ 详细的错误信息

### 步骤2: 根据诊断结果修复

#### 情况A：503 错误 - API 配额用尽

如果诊断脚本显示 **503 错误**，最可能的原因是：

**🔍 检查 RapidAPI 配额：**
1. 访问：https://rapidapi.com/developer/dashboard
2. 登录你的账户
3. 查看 "Real-Time Amazon Data" API 的使用情况
4. 检查是否还有剩余配额

**💡 解决方案：**

**方案1：等待配额重置**
- 免费套餐每月重置
- 查看控制台了解重置时间

**方案2：升级套餐**
- 购买更多配额
- 或升级到付费套餐

**方案3：更换 API Key**
- 如果你有多个 RapidAPI 账户
- 更换到有配额的账户的 API Key

#### 情况B：401/403 错误 - API Key 无效

**解决方法：**

1. 访问：https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
2. 确保已经订阅这个 API（点击 "Subscribe" 选择免费套餐）
3. 复制正确的 API Key
4. 更新 `.env` 文件（见下面步骤3）

#### 情况C：订阅了错误的端点

**重要：** 你需要订阅的是 **"Product Reviews"** 端点，不是 "Product Details"

**检查方法：**
1. 访问 API 页面：https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
2. 查看 "Endpoints" 标签
3. 确保 "Product Reviews" 端点可用
4. 如果不可用，重新订阅或选择正确的套餐

### 步骤3: 更新 .env 文件

**打开 `.env` 文件**，确保以下配置正确：

```env
# Gemini API Key (必填)
GEMINI_API_KEY=sk-YuSuAj3YMcgImJFd570G0cEbCc2a4c26Bb97AdE1779d0e11

# RapidAPI Key (必填)
RAPIDAPI_KEY=845bc700d3msh6568bef37dc45c4p1ee085jsn98e798ce9542
RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com

# 禁用 Puppeteer 降级（只使用 RapidAPI）
ENABLE_PUPPETEER_FALLBACK=false

# 其他配置...
PORT=3001
WEB_PORT=3002
NODE_ENV=development
DEBUG=false
LOG_API_REQUESTS=true
```

**⚠️ 重要说明：**
- 确保 `RAPIDAPI_KEY` 前后没有空格
- 确保没有多余的引号
- `ENABLE_PUPPETEER_FALLBACK=false` 这一行很重要（禁用 Puppeteer）

### 步骤4: 重启后端服务

**关闭当前后端**（按 `Ctrl+C` 或关闭窗口）

**重新启动：**
```bash
# 方式1：双击启动
客户演示-一键启动.bat

# 方式2：命令行启动
npm start
```

**验证启动日志：**
应该看到类似这样的输出：
```
[INFO] ✅ RapidAPI爬虫已初始化
[INFO] 📍 默认站点: US
[INFO] ✅ CrawlerFacade已初始化
[INFO]    主爬虫: Outscraper (未配置)
[INFO]    备用爬虫1: RapidAPI (可用)
[INFO]    备用爬虫2: Puppeteer (已禁用)  ⬅️ 看到"已禁用"就对了
```

### 步骤5: 测试完整流程

**1. 打开 Chrome 插件**
   - 访问任意 Amazon 产品页面
   - 点击插件图标
   - 点击"开始分析"

**2. 观察后端日志**
   - 查看是否成功爬取评论
   - 如果还是失败，查看详细错误信息

**3. 如果成功**
   - 应该看到评论数据
   - AI 开始分析
   - 显示六大维度结果

---

## 常见问题 FAQ

### Q1: 诊断脚本显示 503，但我刚注册的账户？

**A:** 免费套餐通常有以下限制：
- 每月 500 次请求
- 某些地区可能有限制
- 需要验证邮箱/手机号

**解决：**
1. 确认邮箱已验证
2. 查看是否有地区限制
3. 尝试联系 RapidAPI 客服

### Q2: 我想临时使用 Puppeteer，怎么办？

**A:** 修改 `.env` 文件：
```env
ENABLE_PUPPETEER_FALLBACK=true
```

然后安装 Chrome：
```bash
npx puppeteer browsers install chrome
```

重启后端即可。

**注意：** Puppeteer 速度较慢，且可能被 Amazon 封禁。

### Q3: RapidAPI 配额用完了，有其他方案吗？

**A:** 有以下选择：

**方案1：Outscraper（推荐）**
```env
OUTSCRAPER_API_KEY=your_outscraper_key_here
```
- 更稳定
- 更高成功率
- 需要付费

**方案2：多个 RapidAPI 账户**
- 注册多个账户
- 轮换使用
- 每个账户 500 次/月

**方案3：等待配额重置**
- 免费套餐每月 1 号重置
- 或升级到付费套餐

### Q4: 为什么禁用 Puppeteer？

**A:** 因为：
1. Puppeteer 需要安装 Chrome（占用空间大）
2. 速度很慢（每页需要 10-15 秒）
3. 容易被 Amazon 检测和封禁
4. 你只想用 RapidAPI

如果 RapidAPI 不可用，应该先修复 RapidAPI，而不是降级到 Puppeteer。

---

## 验证修复

### 成功的标志

✅ **后端启动日志：**
```
[INFO] ✅ RapidAPI爬虫已初始化
[INFO]    备用爬虫2: Puppeteer (已禁用)
```

✅ **爬取日志：**
```
[INFO] 🚀 开始使用RapidAPI爬取 ASIN: B0CCRHQDR5
[INFO] 📡 请求第 1 页 (站点: US)
[INFO] ✓ 第 1 页爬取成功，累计 10 条评论
```

✅ **AI 分析日志：**
```
[INFO] 🤖 开始 AI 分析...
[INFO] ✅ 维度 1/7 完成: 消费者画像
[INFO] ✅ 维度 2/7 完成: 使用场景
...
```

### 失败的情况

❌ **如果看到：**
```
[ERROR] 第 1 页爬取失败: Request failed with status code 503
[ERROR] ❌ Puppeteer 降级已禁用
[ERROR] 💡 提示：
   1. 检查 RapidAPI Key 是否正确
   2. 运行诊断脚本：node diagnose-rapidapi.js
   3. 查看 RapidAPI 配额：https://rapidapi.com/developer/dashboard
```

**说明：** RapidAPI 有问题，需要按上面的步骤修复。

---

## 下一步

修复完成后，你应该能够：

1. ✅ 成功爬取评论
2. ✅ AI 分析六大维度
3. ✅ Chrome 插件正常显示结果
4. ✅ 消费者画像数据完整

如果还有问题，请运行诊断脚本并查看详细错误信息。

---

## 联系支持

如果以上步骤都无法解决问题：

1. 📋 运行诊断脚本并保存输出
2. 📊 截图 RapidAPI 控制台的配额使用情况
3. 📝 记录详细的错误信息
4. 📧 联系技术支持

---

**最后更新：** 2025-11-04
**版本：** v1.0






