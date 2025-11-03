# 📞 联系 Outscraper 客服 - 问题说明

**日期**: 2025-10-24  
**账户余额**: $10 (已充值)  
**问题**: Amazon Reviews API 只返回 13 条评论，无论请求多少

---

## 📧 联系方式

**官方客服**:
- 🌐 网站: https://outscraper.com/contact/
- 📧 邮箱: support@outscraper.com
- 💬 在线聊天: https://app.outscraper.cloud/ (右下角)

---

## 📋 问题描述 (英文)

### 标题 (Subject)
```
Amazon Reviews API returning only 13 reviews despite requesting 50+
```

### 正文 (Message)
```
Hello Outscraper Support Team,

I recently recharged my account with $10 USD, but I'm experiencing an issue with the Amazon Reviews API.

**Problem:**
- I'm requesting 50 reviews using the `limit` parameter
- The API only returns 13 reviews, regardless of the limit I set
- I've tested with limits: 10, 20, 50, 100, 167
- Results: Always returns 10-13 reviews maximum

**Test Details:**
- API Endpoint: `GET /amazon/reviews`
- Parameters used:
  - query: https://www.amazon.com/dp/B0C4G36RNS
  - limit: 50 (and other values)
  - async: true
- Sample Task IDs:
  - a-e9c60aa7-da81-4a54-9a2b-882d8a21d127 (requested 50, got 13)
  - a-1626e5b1-b83f-4e12-a04a-e3231f58a3f0 (requested 10, got 10)

**Questions:**
1. Is there a limitation on my current plan that restricts reviews to 10-13 per request?
2. What plan or setting do I need to access more reviews per request?
3. The product has 167 total reviews - how can I retrieve all of them?

**API Key:** M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA

Please advise on how to resolve this issue.

Thank you!
```

---

## 📊 测试数据汇总 (供参考)

| 测试 | 请求参数 | 请求数量 | 实际返回 | 任务ID | 状态 |
|------|---------|---------|---------|--------|------|
| 1 | `limit=10` | 10 | 10 ✅ | a-1626e5b1-b83f-4e12-a04a-e3231f58a3f0 | 完整 |
| 2 | `limit=50` | 50 | 13 ❌ | a-e9c60aa7-da81-4a54-9a2b-882d8a21d127 | 部分 |
| 3 | `limit=167` | 167 | 13 ❌ | (之前的测试) | 部分 |

**测试产品**: ASIN B0C4G36RNS (总评论数: 167)

---

## 🔍 API 请求示例

```bash
curl -X GET "https://api.app.outscraper.com/amazon/reviews" \
  -H "X-API-KEY: M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA" \
  -d "query=https://www.amazon.com/dp/B0C4G36RNS" \
  -d "limit=50" \
  -d "async=true"
```

**实际响应**:
```json
{
  "id": "a-e9c60aa7-da81-4a54-9a2b-882d8a21d127",
  "status": "Success",
  "data": [[...13条评论...]]
}
```

---

## 💡 可能的问题和解决方案

### 1. 账户套餐限制
**问题**: 基础套餐可能有每次请求的评论数量限制  
**解决**: 需要客服确认并建议升级到哪个套餐

### 2. `limit` 参数用法
**问题**: `limit` 可能不是总数，而是"每页"限制  
**解决**: 客服确认是否需要使用其他参数（如 `pages`）

### 3. API 版本问题
**问题**: 可能使用了旧版API  
**解决**: 客服确认正确的API端点和参数

---

## 📝 预期客服回复

**可能的回复 1: 套餐限制**
> "Your current plan limits each request to 10-15 reviews. To access more reviews per request, please upgrade to our Professional plan."

**行动**: 询问 Professional 套餐的价格和限制

**可能的回复 2: 参数问题**
> "To get 50 reviews, you need to use the `pages` parameter along with `limit`."

**行动**: 要求提供完整的参数示例

**可能的回复 3: 需要多次请求**
> "Amazon limits results per page. To get 167 reviews, you'll need to make multiple requests with pagination."

**行动**: 询问如何实现分页

---

## 🚀 后续步骤

### 如果是套餐限制
1. ✅ 了解各套餐的评论数量限制
2. ✅ 比较套餐价格
3. ✅ 决定是否升级

### 如果是参数问题
1. ✅ 获取正确的API调用示例
2. ✅ 更新代码实现
3. ✅ 重新测试

### 如果需要分页
1. ✅ 了解分页参数（`page`, `nextPageToken` 等）
2. ✅ 实现循环请求逻辑
3. ✅ 合并多次请求的结果

---

## 📞 联系步骤

1. **访问客服页面**: https://outscraper.com/contact/
2. **选择联系方式**:
   - 优先：在线聊天（即时回复）
   - 备选：发送邮件到 support@outscraper.com
3. **复制上面的"问题描述 (英文)"**
4. **发送并等待回复**（通常 1-24 小时内回复）
5. **根据回复决定下一步**

---

## ✅ 测试环境信息

**技术栈**:
- Node.js v22.19.0
- Axios (HTTP 客户端)
- API Endpoint: `https://api.app.outscraper.com/amazon/reviews`

**账户信息**:
- API Key: M2UyNTc2NDYyMjQxNDVmNjhiMDY2YzZlMDE4MDQ5MTJ8MjYyNTMwY2RhOA
- 余额: $10 (已充值)
- 使用模式: 异步 (async=true)

**完整测试脚本**: `test-outscraper-fixed.js` (可提供给客服参考)

---

**祝好运！希望客服能快速解决这个问题！** 🎉



