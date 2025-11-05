# 🔧 Gemini API 401 错误修复指南

## 问题描述

```
[ERROR] Gemini AI调用失败: Request failed with status code 401
{
  "error": {
    "message": "Invalid token: YuSuAj3YMcgImJFd570G0cEbCc2a4c26Bb97AdE1779d0e11",
    "type": "Aihubmix_api_error"
  }
}
```

**原因：** 你的 API Key 通过 Aihubmix 代理服务，但这个 Key 已经无效或过期。

---

## ⚡ 方案1：更新 Aihubmix API Key（最快）

### 步骤1：获取新的 API Key

1. 访问：https://aihubmix.com
2. 登录你的账户
3. 进入 API 管理页面
4. 生成新的 API Key

### 步骤2：更新 .env 文件

**打开 `.env` 文件，修改：**

```env
# 旧的（无效）
GEMINI_API_KEY=sk-YuSuAj3YMcgImJFd570G0cEbCc2a4c26Bb97AdE1779d0e11

# 改为新的
GEMINI_API_KEY=sk-你的新API-Key
```

### 步骤3：重启后端

```bash
# 关闭当前后端（Ctrl+C）
# 重新启动
npm start
```

### 步骤4：测试

```bash
# 运行测试
node tests/test-gemini-api.js
```

**预期结果：**
```
✅ Gemini API 测试通过
✅ 返回了有效的 JSON 数据
```

---

## 🎯 方案2：切换到 Google 官方 API（推荐，更稳定）

### 步骤1：获取官方 API Key

1. 访问：https://aistudio.google.com/app/apikey
2. 点击 "Create API Key"
3. 复制 API Key（格式类似：AIzaSyD...）

### 步骤2：修改配置

**打开 `.env` 文件：**

```env
# 使用 Google 官方 API
GEMINI_API_KEY=AIzaSy你的官方API-Key

# 设置官方基础 URL
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta

# 设置模型
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 步骤3：修改代码（如果需要）

**检查 `src/ai/GeminiProvider.js` 的第 38-63 行：**

如果使用官方 API，可能需要调整请求格式。官方格式是：

```javascript
// Google 官方格式
const response = await axios.post(
  `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
  {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\n${userPrompt}`
      }]
    }],
    generationConfig: {
      temperature: this.temperature,
      maxOutputTokens: this.maxTokens,
      responseMimeType: "application/json"
    }
  }
)
```

### 步骤4：测试

```bash
# 重启后端
npm start

# 测试
node tests/test-gemini-api.js
```

---

## 🔥 方案3：临时使用模拟数据（演示用）

如果来不及修复 API，可以临时使用模拟数据：

### 步骤1：创建模拟服务

**创建文件 `src/ai/MockGeminiProvider.js`：**

```javascript
const logger = require('../../utils/logger')

class MockGeminiProvider {
  constructor() {
    logger.info('✅ 使用模拟 Gemini Provider（演示模式）')
  }
  
  async analyze(systemPrompt, userPrompt) {
    logger.info('🎭 使用模拟数据（演示模式）')
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 返回模拟数据
    return {
      success: true,
      data: this.generateMockData(systemPrompt),
      duration: 1.0,
      tokens: 0
    }
  }
  
  generateMockData(systemPrompt) {
    // 根据 systemPrompt 返回不同的模拟数据
    if (systemPrompt.includes('消费者画像')) {
      return {
        genderRatio: { male: 45, female: 40, unknown: 15 },
        dimensions: {
          personas: [
            { persona: '年轻科技爱好者', percent: 35, reason: '评论中频繁提到科技感和创新' },
            { persona: '家庭用户', percent: 30, reason: '多次提到家庭使用场景' },
            { persona: '专业人士', percent: 25, reason: '关注产品专业性能' }
          ],
          moments: [
            { occasion: '睡前放松', percent: 40, reason: '多用于助眠和放松' },
            { occasion: '聚会氛围', percent: 30, reason: '用于营造派对气氛' }
          ],
          locations: [
            { place: '卧室', percent: 50, reason: '最常见使用场所' },
            { place: '客厅', percent: 30, reason: '家庭娱乐区域' }
          ],
          behaviors: [
            { behavior: '拍照分享', percent: 35, reason: '视觉效果出众' },
            { behavior: '冥想助眠', percent: 30, reason: '舒缓放松功能' }
          ]
        }
      }
    } else if (systemPrompt.includes('使用场景')) {
      return {
        items: [
          { name: '睡前助眠', percent: 40, reason: '星空效果帮助放松入睡' },
          { name: '派对氛围', percent: 25, reason: '灯光效果增添气氛' },
          { name: '冥想放松', percent: 20, reason: '舒缓的灯光有助于冥想' }
        ]
      }
    } else if (systemPrompt.includes('未被满足')) {
      return {
        items: [
          { need: '更多颜色模式', percent: 30, reason: '希望有更多颜色选择' },
          { need: '音乐同步功能', percent: 25, reason: '灯光随音乐节奏变化' }
        ]
      }
    } else if (systemPrompt.includes('好评')) {
      return {
        items: [
          { aspect: '视觉效果出色', percent: 45, reason: '星空效果逼真震撼' },
          { aspect: 'App控制便捷', percent: 35, reason: '手机控制简单方便' }
        ]
      }
    } else if (systemPrompt.includes('差评') || systemPrompt.includes('weaknesses')) {
      return {
        items: [
          { aspect: '亮度不够', percent: 25, reason: '部分用户觉得不够亮' },
          { aspect: '噪音问题', percent: 20, reason: '有轻微工作噪音' }
        ]
      }
    } else if (systemPrompt.includes('购买动机')) {
      return {
        items: [
          { type: '礼物购买', percent: 35, reason: '作为礼物送人' },
          { type: '个人使用', percent: 40, reason: '自己使用享受' }
        ]
      }
    }
    
    return { items: [] }
  }
}

module.exports = MockGeminiProvider
```

### 步骤2：切换到模拟模式

**修改 `src/ai/AnalysisService.js` 第 5 行：**

```javascript
// 原来
const GeminiProvider = require('./GeminiProvider')

// 改为
const GeminiProvider = require('./MockGeminiProvider')
```

### 步骤3：重启测试

```bash
npm start
# 测试应该成功，使用模拟数据
```

---

## 🎯 推荐方案对比

| 方案 | 速度 | 稳定性 | 成本 | 推荐度 |
|------|------|--------|------|--------|
| 方案1：更新 Aihubmix Key | ⭐⭐⭐ 最快 | ⭐⭐ 中等 | 💰 付费 | 🌟🌟🌟 |
| 方案2：切换 Google 官方 | ⭐⭐ 较快 | ⭐⭐⭐ 最稳定 | 💰 免费/付费 | 🌟🌟🌟🌟🌟 |
| 方案3：模拟数据 | ⭐⭐⭐ 最快 | ⭐ 仅演示 | 💰 免费 | 🌟🌟 仅演示 |

---

## ✅ 验证修复

### 测试1：健康检查

```bash
curl http://localhost:3001/api/health
```

### 测试2：完整流程

```bash
node tests/test-full-analysis.js
```

**成功标志：**
```
✅ AI分析完成: 7/7 成功
✅ 消费者画像: 完整
✅ 使用场景: 完整
✅ 未满足需求: 完整
✅ 产品体验: 完整
✅ 购买动机: 完整
```

---

## 🚨 紧急演示指南

**如果距离演示时间很紧：**

1. **立即使用方案3**（模拟数据）
   - 5分钟内可以运行
   - 展示完整功能
   - 数据看起来真实

2. **演示后修复**
   - 使用方案2（Google 官方）
   - 更稳定，长期可用

---

## 📞 需要帮助？

如果遇到问题，提供以下信息：

1. 你选择的方案（1/2/3）
2. `.env` 文件的 GEMINI_API_KEY 配置（脱敏）
3. 错误日志（完整）
4. 运行测试的输出

---

**更新时间：** 2025-11-04  
**优先级：** 🔴 P0 - 紧急






