# 🚀 服务器一键部署指南

## 📋 部署前准备

确保服务器满足以下条件：
- ✅ 已安装Docker和Docker Compose
- ✅ 已克隆项目到 `/opt/amazon-review-analysis`
- ✅ 服务器可以访问GitHub

---

## 🎯 一键部署命令

在服务器上执行以下**单条命令**即可完成部署：

```bash
cd /opt/amazon-review-analysis && git pull origin main && bash scripts/server-deploy.sh
```

---

## 📝 首次部署需要配置.env

如果是首次部署，脚本会提示配置.env文件。请按以下步骤操作：

### 步骤1: 创建.env文件
```bash
cd /opt/amazon-review-analysis
nano .env
```

### 步骤2: 复制以下内容到.env文件

**⚠️ 重要：请将占位符替换为你的真实API密钥！**

```bash
# ========================================
# 即贸 Amazon评论分析系统 - 环境变量配置
# ========================================

# AI环境配置核心项目Gemini 2.5 Pro
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_BASE_URL=https://aihubmix.com/v1
GEMINI_MODEL=gemini-2.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=16000

# 爬虫服务配置
APIFY_API_TOKEN=your_apify_api_token_here

# 服务器配置
PORT=8088
WEB_PORT=8089
NODE_ENV=production
LOG_LEVEL=info

# CORS配置
CORS_ORIGIN=*
```

**📝 API密钥获取**:
- Gemini API Key: https://aihubmix.com (或 https://aistudio.google.com)
- Apify API Token: https://console.apify.com/account/integrations

### 步骤3: 保存并退出
- 按 `Ctrl + X`
- 按 `Y` 确认保存
- 按 `Enter` 确认文件名

### 步骤4: 重新运行部署脚本
```bash
bash scripts/server-deploy.sh
```

---

## 🔄 后续更新部署

配置好.env文件后，后续更新只需执行：

```bash
cd /opt/amazon-review-analysis && git pull origin main && bash scripts/server-deploy.sh
```

---

## ✅ 部署验证

部署完成后，脚本会自动：
1. ✅ 显示容器状态
2. ✅ 显示后端和前端日志
3. ✅ 测试API连接
4. ✅ 显示访问地址

---

## 🌐 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端Web | `http://服务器IP:8089` | Vue3前端应用 |
| 后端API | `http://服务器IP:8088` | Express后端API |
| Chrome扩展 | 配置后端地址 | 快速分析工具 |

---

## 📊 常用管理命令

### 查看服务状态
```bash
cd /opt/amazon-review-analysis
docker compose ps
```

### 查看实时日志
```bash
# 所有服务
docker compose logs -f

# 仅后端
docker compose logs -f backend

# 仅前端
docker compose logs -f frontend
```

### 重启服务
```bash
docker compose restart
```

### 停止服务
```bash
docker compose down
```

### 完全重新部署
```bash
docker compose down
docker compose up -d --build
```

---

## 🔧 故障排查

### 容器无法启动

**检查日志**:
```bash
docker compose logs backend
docker compose logs frontend
```

**常见问题**:
- ❌ .env文件配置错误 → 检查API密钥
- ❌ 端口被占用 → 修改PORT和WEB_PORT
- ❌ Docker镜像构建失败 → 检查Dockerfile

### API测试失败

**测试后端**:
```bash
curl http://localhost:8088/
```

**测试前端**:
```bash
curl http://localhost:8089/
```

### 在服务器上测试API密钥

```bash
cd /opt/amazon-review-analysis
node tests/test-api-keys.js
```

---

## 📱 Chrome扩展配置

部署成功后，配置Chrome扩展：

1. 打开扩展设置
2. 修改后端地址为: `http://你的服务器IP:8088`
3. 保存配置
4. 测试连接

---

## 🎉 完成！

现在你的Amazon评论分析系统已经成功部署到服务器！

**下一步**:
- 📱 配置Chrome扩展
- 🧪 测试完整分析流程
- 📊 查看分析报告
- 🔒 配置域名和HTTPS（可选）
