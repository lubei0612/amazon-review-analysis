# 🚀 服务器更新指令

## 修复内容总结

### ✅ 已完成修复：

1. **修复百分比显示问题**
   - 统一所有组件的 `percentage` 格式化函数
   - 自动识别数据格式（0-1 或 1-100）
   - 修复了占比显示过小的问题（如0.16%变成16%）

2. **简化 ReviewDialog**
   - 移除"找到 xx 条相关评论"显示
   - 移除"加载更多 (x/x)"显示
   - 只保留放大镜功能和基本交互

3. **修复描述数据缺失问题**
   - 为空的 `reason` 字段添加默认值"暂无说明"
   - 避免显示空白或 "--"

4. **修复的组件**：
   - `ProductExperience.vue` - 产品体验
   - `PurchaseMotivation.vue` - 购买动机
   - `UnmetNeeds.vue` - 未被满足的需求
   - `UsageScenarios.vue` - 使用场景
   - `ReviewDialog.vue` - 原评论弹窗

---

## 🔧 更新命令

在服务器上执行以下命令更新代码并重新构建：

```bash
# 进入项目目录
cd /opt/amazon-review-analysis

# 拉取最新代码
git pull origin main

# 停止并重新构建 Docker 容器
docker-compose down
docker-compose up -d --build

# 等待容器启动（约30秒）
sleep 30

# 检查容器状态
docker-compose ps

# 查看日志
docker-compose logs -f --tail=50
```

---

## ✨ 验证修复

### 1. 检查前端页面
访问：http://43.130.35.117:8089

### 2. 创建新的分析报告
使用 ASIN: `B0CHWRXH8B` 测试

### 3. 检查修复点
- [ ] 百分比显示正常（如 28.5%，不是 0.285%）
- [ ] 点击放大镜可以查看原评论
- [ ] 原评论弹窗不显示"找到 xx 条"
- [ ] 描述字段不为空，显示"暂无说明"而不是空白
- [ ] 消费者画像有数据显示

---

## ⚠️ 如果遇到问题

### 问题1：容器启动失败
```bash
# 查看详细日志
docker-compose logs backend
docker-compose logs frontend
```

### 问题2：前端没有更新
```bash
# 清除 Docker 缓存并重新构建
docker-compose down -v
docker system prune -f
docker-compose up -d --build --force-recreate
```

### 问题3：端口冲突
```bash
# 检查端口占用
lsof -ti:8088 | xargs kill -9
lsof -ti:8089 | xargs kill -9
docker-compose up -d
```

---

## 📋 技术细节

### 修改的文件：
1. `web/src/components/ProductExperience.vue`
2. `web/src/components/PurchaseMotivation.vue`
3. `web/src/components/UnmetNeeds.vue`
4. `web/src/components/UsageScenarios.vue`
5. `web/src/components/ReviewDialog.vue`

### 核心修复逻辑：

#### formatPercentage 函数
```javascript
function formatPercentage(value) {
  if (!value) return 0
  // 如果值已经是百分比形式（>1），直接返回
  if (value > 1) {
    return value.toFixed(1)
  }
  // 如果是小数形式（0-1），转换为百分比
  return (value * 100).toFixed(1)
}
```

#### 默认值处理
```javascript
// 之前
{{ item.reason }}

// 之后
{{ item.reason || '暂无说明' }}
```

---

**Git Commit**: `822c1c0` - "fix: Fix percentage display and remove result count"

