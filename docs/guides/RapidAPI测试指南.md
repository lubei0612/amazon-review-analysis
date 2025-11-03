# 🧪 RapidAPI 修复验证指南

## 📋 测试前准备

### 步骤1: 配置环境变量

1. **复制环境变量模板**
```bash
copy env.example .env
```

2. **编辑 .env 文件，填写以下配置**

找到这几行并填入你的真实API密钥：

```env
# RapidAPI配置（必填）
RAPIDAPI_KEY=你的RapidAPI密钥
RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com

# Gemini配置（测试不需要，但系统运行需要）
GEMINI_API_KEY=你的Gemini密钥

# 数据库配置（测试不需要）
DB_HOST=localhost
DB_PASSWORD=你的MySQL密码
```

### 步骤2: 获取RapidAPI密钥

如果你还没有RapidAPI密钥：

1. 访问 https://rapidapi.com/
2. 注册/登录账号
3. 订阅 "Real-Time Amazon Data" API
   - 地址：https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
4. 在API页面找到你的 `X-RapidAPI-Key`
5. 复制并粘贴到 `.env` 文件中

---

## 🚀 运行测试

配置完成后，运行测试脚本：

```bash
node test-rapid-api.js
```

### 测试内容

测试脚本会验证以下内容：

1. ✅ **配置检查** - 确认RAPIDAPI_KEY已配置
2. ✅ **初始化检查** - 确认RapidAPI爬虫正常初始化
3. ✅ **功能测试** - 爬取2个热门产品的评论：
   - Apple AirPods Pro (第2代)
   - Apple AirTag
4. ✅ **数据验证** - 检查返回的评论数据结构是否正确

---

## 📊 预期结果

### ✅ 测试通过的输出示例：

```
============================================================
🧪 RapidAPI 修复验证测试
============================================================

📋 步骤1: 检查配置
------------------------------------------------------------
✅ RAPIDAPI_KEY: abc123de...
✅ RAPIDAPI_HOST: real-time-amazon-data.p.rapidapi.com

📋 步骤2: 初始化RapidAPI爬虫
------------------------------------------------------------
✅ RapidAPI爬虫初始化成功
   默认站点: CA
   可用站点: CA, UK, DE, FR, IT, ES, JP

📋 步骤3: 测试用例 #1
------------------------------------------------------------
   产品: Apple AirPods Pro (第2代)
   ASIN: B0BSHF7WHW
   目标评论数: 20

   🚀 开始爬取...
   📊 进度: 50% (10/20) - 已爬取 10/20 条评论（RapidAPI快速模式）
   📊 进度: 100% (20/20) - 已爬取 20/20 条评论（RapidAPI快速模式）

   ✅ 测试通过！
   📊 获取评论数: 20
   ⏱️  耗时: 2.35秒

   📝 样例评论 (前2条):
   ---
   #1:
     评分: 5 星
     标题: Amazing sound quality!
     内容: These AirPods Pro are absolutely worth it. The noise cancellation is...
     作者: John D.
     日期: 2024-10-15
     认证购买: 是

============================================================
📊 测试总结
============================================================

总测试数: 2
✅ 通过: 2
❌ 失败: 0
成功率: 100.0%

🎉 所有测试通过！RapidAPI工作正常
============================================================
```

---

## ❌ 常见问题排查

### 问题1: "RAPIDAPI_KEY 未配置"

**原因**: .env文件不存在或未填写RAPIDAPI_KEY

**解决方法**:
```bash
# 1. 复制模板
copy env.example .env

# 2. 编辑.env文件，填写真实的API密钥
notepad .env
```

### 问题2: "RapidAPI认证失败"

**可能原因**:
- API密钥错误
- API密钥过期
- API订阅已取消

**解决方法**:
1. 访问 https://rapidapi.com/developer/dashboard
2. 检查API订阅状态
3. 重新复制正确的API密钥到.env文件

### 问题3: "返回0条评论"

**可能原因**:
- 测试的ASIN在选定站点（默认CA-加拿大）无评论
- API配额用完
- API端点问题

**解决方法**:
1. 检查API配额：https://rapidapi.com/developer/billing
2. 尝试更换站点（修改 `RapidAPICrawler.js` 中的 `currentDomain`）
3. 尝试其他ASIN

### 问题4: "速率限制错误 (429)"

**原因**: 请求太频繁，触发API限流

**解决方法**:
- 等待60秒后重试
- 检查你的订阅计划限制
- 测试脚本会自动处理这个问题

---

## 🔍 手动验证 RapidAPI

如果自动测试有问题，可以手动测试API：

### 使用curl测试（Windows PowerShell）

```powershell
$headers = @{
    'X-RapidAPI-Key' = '你的密钥'
    'X-RapidAPI-Host' = 'real-time-amazon-data.p.rapidapi.com'
}

$params = @{
    asin = 'B0BSHF7WHW'
    domain = 'CA'
    page = '1'
}

Invoke-RestMethod -Method Get `
    -Uri 'https://real-time-amazon-data.p.rapidapi.com/product-reviews' `
    -Headers $headers `
    -Body $params
```

### 预期响应格式

正常情况下应该返回类似这样的JSON：

```json
{
  "data": {
    "reviews": [
      {
        "review_id": "...",
        "rating_text": "5.0 out of 5 stars",
        "title": "Great product!",
        "body": "I love these AirPods...",
        "reviewer_name": "John",
        "date_text": "Reviewed in Canada on October 15, 2024",
        "verified_purchase": true,
        ...
      }
    ]
  }
}
```

---

## 📝 测试完成后的下一步

### ✅ 如果测试通过

恭喜！RapidAPI已经修复并可以正常使用。你可以：

1. **集成到完整系统**
```bash
# 启动后端服务
npm start

# 启动Web端
cd web
npm run dev
```

2. **测试完整流程**
   - 访问 http://localhost:3002
   - 输入任意Amazon ASIN
   - 查看是否能正常爬取和分析

3. **测试降级策略**
   - 暂时注释掉Outscraper配置
   - 测试系统是否会自动降级到RapidAPI

### ❌ 如果测试失败

请提供以下信息，我可以帮你进一步诊断：

1. 完整的测试输出日志
2. .env文件中的配置（隐藏密钥）
3. RapidAPI订阅计划和配额状态
4. 错误信息的截图

---

## 📞 需要帮助？

如果遇到问题，可以：

1. 查看项目README: `README.md`
2. 查看API文档: `docs/03-后端API设计文档.md`
3. 查看爬虫对比: `docs/04-第三方爬虫平台对接方案对比.md`

---

**最后更新**: 2025-10-31


