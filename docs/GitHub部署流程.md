# GitHub 部署流程

## 📝 准备工作

### 1. 初始化 Git 仓库（如果还没有）

```bash
# 在项目根目录
git init
git add .
git commit -m "feat: Initial commit - Amazon Review Analysis System with Multi-site Crawling"
```

### 2. 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角 `+` → `New repository`
3. 填写仓库信息：
   - **Repository name**: `maijiaplug` 或其他名称
   - **Description**: `Amazon Review Analysis System - AI-powered multi-site review crawler and analyzer`
   - **Visibility**: Private（建议）或 Public
   - ⚠️ **不要**勾选 "Initialize this repository with a README"

---

## 🚀 上传代码到 GitHub

### 方式 1：HTTPS（推荐）

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/maijiaplug.git

# 推送代码
git branch -M main
git push -u origin main
```

### 方式 2：SSH

```bash
# 添加远程仓库
git remote add origin git@github.com:your-username/maijiaplug.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 🏗️ 服务器部署流程

### 1. 在服务器上克隆代码

```bash
# SSH 连接到腾讯云服务器
ssh root@your-server-ip

# 克隆项目
cd /opt
git clone https://github.com/your-username/maijiaplug.git
cd maijiaplug
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置
nano .env
```

填入实际的 API Keys：
- `GEMINI_API_KEY`: 你的 Gemini API 密钥
- `APIFY_API_TOKEN`: 你的 Apify Token

### 3. 启动服务

```bash
# 方式1：使用部署脚本（推荐）
chmod +x deploy.sh
./deploy.sh

# 方式2：手动启动
docker-compose up -d --build
```

### 4. 验证部署

```bash
# 检查容器状态
docker-compose ps

# 测试后端
curl http://localhost:3001/api/health

# 查看日志
docker-compose logs -f
```

---

## 🔄 更新代码流程

### 本地更新并推送

```bash
# 在开发机器上
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

### 服务器拉取更新

```bash
# SSH到服务器
ssh root@your-server-ip

# 进入项目目录
cd /opt/maijiaplug

# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 查看日志确认
docker-compose logs -f
```

---

## 🌿 Git 分支管理建议

### 创建开发分支

```bash
# 创建并切换到开发分支
git checkout -b develop

# 在开发分支上工作
git add .
git commit -m "feat: 新功能开发"
git push origin develop
```

### 合并到主分支

```bash
# 切换到主分支
git checkout main

# 合并开发分支
git merge develop

# 推送到远程
git push origin main
```

---

## 📦 .gitignore 已配置

项目已包含 `.gitignore` 文件，以下内容不会被上传：

- ✅ `node_modules/` - 依赖包
- ✅ `.env` - 环境变量（敏感信息）
- ✅ `logs/` - 日志文件
- ✅ `*.log` - 所有日志
- ✅ `pm_data.json` - 临时数据
- ✅ `.DS_Store` - Mac 系统文件

---

## ⚠️ 重要提示

### 1. 保护敏感信息

**永远不要**将以下文件上传到 GitHub：
- `.env` 文件（已在 .gitignore 中）
- API Keys 和 Tokens
- 数据库密码
- 任何包含敏感信息的文件

### 2. 环境变量管理

```bash
# ✅ 正确做法：使用 env.example 作为模板
cp env.example .env
nano .env  # 填入实际值

# ❌ 错误做法：直接修改 env.example
# 不要把实际的 API Key 写入 env.example
```

### 3. 私有仓库 vs 公开仓库

- **私有仓库**（推荐）：
  - 代码不公开
  - 适合商业项目
  - 免费用户有数量限制

- **公开仓库**：
  - 代码公开可见
  - 适合开源项目
  - ⚠️ 务必确保没有泄漏 API Keys

---

## 🔐 GitHub Actions（可选 - CI/CD）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/maijiaplug
            git pull origin main
            docker-compose up -d --build
```

**配置 Secrets**：
1. 进入 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 添加：
   - `SERVER_HOST`: 服务器IP
   - `SERVER_USER`: SSH用户名
   - `SSH_PRIVATE_KEY`: SSH私钥

---

## 📞 常见问题

### Q1: git push 失败（权限问题）

```bash
# 检查远程仓库地址
git remote -v

# 如果是 HTTPS，输入 GitHub 用户名和 Token
# Token 获取：GitHub → Settings → Developer settings → Personal access tokens
```

### Q2: 服务器无法克隆私有仓库

```bash
# 方式1：使用 Personal Access Token
git clone https://your-token@github.com/your-username/maijiaplug.git

# 方式2：配置 SSH Key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub
# 复制公钥，添加到 GitHub → Settings → SSH and GPG keys
```

### Q3: docker-compose up 失败

```bash
# 检查 .env 文件是否存在
ls -la .env

# 检查 Docker 是否运行
sudo systemctl status docker

# 查看详细错误
docker-compose up
```

---

## ✅ 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] 服务器已克隆代码
- [ ] `.env` 文件已配置（包含真实 API Keys）
- [ ] Docker 和 Docker Compose 已安装
- [ ] 容器成功启动（`docker-compose ps`）
- [ ] 后端API可访问（`curl http://localhost:3001/api/health`）
- [ ] 前端页面可访问（`http://your-server-ip`）
- [ ] 防火墙已开放必要端口（80, 443, 3001）
- [ ] （可选）域名已解析
- [ ] （可选）HTTPS已配置

---

## 🎉 完成

部署完成后，你的 Amazon 评论分析系统应该已经在服务器上运行了！

访问 `http://your-server-ip` 开始使用。

**Good luck! 🚀**



