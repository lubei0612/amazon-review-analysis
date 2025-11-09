# 🚀 部署和测试清单

---

## ✅ 1. 环境配置检查清单

### .env文件配置（已完成✅）

根据你的截图，你的配置已经正确：

- ✅ `GEMINI_API_KEY` - 已配置
- ✅ `APIFY_API_TOKEN` - 已配置
- ✅ RapidAPI相关已注释
- ⚠️ `NODE_ENV=development` → 需要改为 `production`

**请修改你的.env文件的这一行：**
```env
NODE_ENV=production  # 从development改为production
```

---

## 🐳 2. Docker部署（推荐）

### 方式A：使用一键部署脚本

```bash
# 1. 双击运行
docker-deploy.bat

# 或命令行运行
.\docker-deploy.bat
```

脚本会自动：
- ✅ 检查Docker安装
- ✅ 检查.env配置
- ✅ 构建镜像
- ✅ 启动服务
- ✅ 健康检查

### 方式B：手动部署

```bash
# 1. 构建镜像
docker-compose build

# 2. 启动服务
docker-compose up -d

# 3. 查看状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

---

## 💻 3. 本地开发模式（可选）

如果不使用Docker，可以本地运行：

```bash
# 1. 启动后端
npm start

# 2. 启动前端（新窗口）
cd web
npm run dev

# 3. 访问
# 后端: http://localhost:3001
# 前端: http://localhost:5173
```

或使用快速测试脚本：
```bash
test-full-system.bat
```

---

## 🧪 4. 功能测试清单

### 测试1: 后端API健康检查

```bash
curl http://localhost:3001/api/health
```

**预期结果**:
```json
{
  "success": true,
  "message": "Amazon评论分析服务运行中",
  "timestamp": "..."
}
```

### 测试2: 创建分析任务

```bash
curl -X POST http://localhost:3001/api/tasks/create \
  -H "Content-Type: application/json" \
  -d "{\"asin\":\"B0D9JBGWCL\",\"productUrl\":\"https://www.amazon.com/dp/B0D9JBGWCL\",\"source\":\"test\"}"
```

**预期结果**:
```json
{
  "success": true,
  "message": "任务创建成功",
  "data": {
    "taskId": "uuid-here",
    "status": "pending"
  }
}
```

### 测试3: Web前端访问

1. 访问: http://localhost:3002 (Docker) 或 http://localhost:5173 (本地开发)
2. 点击 "Create Report"
3. 输入ASIN: `B0D9JBGWCL`
4. 点击 "开始分析"
5. 等待1-2分钟
6. 查看完整报告

**检查点**:
- ✅ 消费者画像至少有3个behaviors
- ✅ 使用场景显示完整
- ✅ 星级影响度有数据
- ✅ 产品体验（好评/差评）完整
- ✅ 购买动机分析正确
- ✅ 未满足需求有建议

### 测试4: Chrome扩展

1. 访问: https://www.amazon.com/dp/B0D9JBGWCL
2. 点击页面右下角 "🚀 开始AI分析"
3. 等待分析完成
4. 查看6个维度的分析结果
5. 点击任一维度的 "查看详情"
6. 验证数据完整性

---

## 📊 5. Chrome DevTools调试

### 浏览器控制台检查

**F12打开开发者工具 → Console**

正常日志应该包含：
```
✅ 后端服务连接成功
✅ Gemini Provider 已初始化
✅ Apify爬虫已初始化
✅ 爬取完成: 100条评论
✅ AI分析完成: 7/7成功
```

**Network标签检查**:
- `/api/health` → 200 OK
- `/api/tasks/create` → 200 OK
- `/api/tasks/:id/status` → 200 OK（轮询）

---

## 🐛 6. 故障排查

### 问题1: Docker构建失败

**错误**: `npm install` 超时

**解决**:
```bash
# 配置npm国内镜像
npm config set registry https://registry.npmmirror.com

# 重新构建
docker-compose build --no-cache
```

### 问题2: 端口被占用

**错误**: `address already in use :::3001`

**解决**:
```bash
# 查找占用端口的进程
netstat -ano | findstr ":3001"

# 杀死进程（替换PID）
taskkill /PID <PID> /F

# 或使用重启脚本
restart.bat
```

### 问题3: AI分析失败

**错误**: 任务一直停留在"analyzing"

**检查**:
1. GEMINI_API_KEY是否正确
2. 查看后端日志: `docker-compose logs backend`
3. 测试API连通性: `curl https://aihubmix.com/v1/models`

### 问题4: 爬虫抓取失败

**错误**: "爬取评论失败"

**检查**:
1. APIFY_API_TOKEN是否正确
2. Apify账户额度是否充足（访问 https://console.apify.com/）
3. 查看详细日志

### 问题5: 前端显示空白

**解决**:
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 硬刷新（Ctrl+Shift+R）
3. 检查浏览器控制台错误（F12）
4. 确认后端API正常运行

---

## 🌐 7. 腾讯云部署清单

### 准备工作

- [ ] 购买腾讯云服务器（2核4GB+，Ubuntu 22.04）
- [ ] 配置安全组（开放22, 80, 443端口）
- [ ] 准备域名（可选）
- [ ] 准备API密钥
  - [ ] Gemini API Key
  - [ ] Apify API Token

### 部署步骤

```bash
# 1. 安装Docker
curl -fsSL https://get.docker.com | sh

# 2. 上传项目
scp -r maijiaplug root@服务器IP:/opt/amazon-review

# 3. 配置环境
cd /opt/amazon-review
cp env.example .env
vim .env  # 填写API密钥，NODE_ENV=production

# 4. 启动服务
docker-compose up -d

# 5. 验证
curl http://localhost:3001/api/health
```

详细步骤: [DEPLOY-TENCENT-CLOUD.md](DEPLOY-TENCENT-CLOUD.md)

---

## 📝 8. Git代码管理

### 本地Git（已完成✅）

- ✅ Git仓库已初始化
- ✅ .gitignore已配置
- ✅ 初始提交已完成

### 推送到GitHub（可选）

```bash
# 1. 在GitHub创建仓库: amazon-review-analysis

# 2. 关联远程仓库
git remote add origin https://github.com/你的用户名/amazon-review-analysis.git

# 3. 推送代码
git push -u origin main
```

详细步骤: [GITHUB-SETUP.md](GITHUB-SETUP.md)

---

## ✅ 9. 最终检查清单

### 配置检查
- [ ] .env文件已配置
- [ ] NODE_ENV=production（生产环境）
- [ ] GEMINI_API_KEY已填写
- [ ] APIFY_API_TOKEN已填写

### Docker检查
- [ ] Docker已安装
- [ ] docker-compose已安装
- [ ] 镜像构建成功
- [ ] 服务启动成功

### 功能检查
- [ ] 后端API健康检查通过
- [ ] 可以创建分析任务
- [ ] AI分析正常工作
- [ ] Web前端可访问
- [ ] Chrome扩展正常

### 数据完整性
- [ ] 消费者画像至少3个behaviors
- [ ] 使用场景有数据
- [ ] 星级影响度完整
- [ ] 好评/差评分析正确
- [ ] 购买动机显示
- [ ] 未满足需求有建议

---

## 🎯 10. 下一步行动

### 本地测试（立即）
```bash
# 选择一种方式:

# 方式1: Docker部署
docker-deploy.bat

# 方式2: 本地开发
test-full-system.bat
```

### 云端部署（准备好后）
1. 修改.env中的NODE_ENV=production
2. 上传到腾讯云服务器
3. 运行docker-compose up -d
4. 测试所有功能

### 交付客户
1. 提供访问地址
2. 提供使用文档
3. 演示核心功能
4. 交付源代码

---

**准备就绪！** 🚀

所有配置和文档已完成，项目可以立即部署到生产环境。

