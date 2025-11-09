# 腾讯云 Docker 部署指南

## 📦 项目简介

Amazon 评论分析系统 - 基于 Apify 爬虫 + Gemini AI 的智能多站点评论分析平台

---

## 🚀 快速部署步骤

### 1. 准备工作

**腾讯云服务器要求**：
- **CPU**: 2核及以上
- **内存**: 4GB及以上  
- **磁盘**: 20GB及以上
- **操作系统**: Ubuntu 20.04 / 22.04 或 CentOS 7/8
- **网络**: 开放端口 3001（后端）和 80/443（前端）

### 2. 安装 Docker 和 Docker Compose

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | bash
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 3. 克隆项目代码

```bash
# 从 GitHub 克隆项目
git clone <your-github-repo-url> maijiaplug
cd maijiaplug

# 或者从 Gitee 克隆（国内更快）
git clone <your-gitee-repo-url> maijiaplug
cd maijiaplug
```

### 4. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑配置文件
nano .env
```

**必填配置项**：

```env
# ===================================
# AI分析服务（Gemini 2.5 Pro）
# ===================================
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_BASE_URL=https://aihubmix.com/v1
GEMINI_MODEL=gemini-2.5-pro
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=16000

# ===================================
# 爬虫服务（Apify - 唯一爬虫）
# ===================================
APIFY_API_TOKEN=your_apify_token_here

# ===================================
# 服务器配置
# ===================================
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
```

### 5. 构建并启动服务

```bash
# 一键部署（推荐）
./deploy.sh

# 或者手动执行
docker-compose up -d --build
```

### 6. 验证部署

```bash
# 检查容器状态
docker-compose ps

# 查看后端日志
docker-compose logs -f backend

# 查看前端日志
docker-compose logs -f frontend

# 测试后端API
curl http://localhost:3001/api/health

# 测试前端（需要开放80端口）
curl http://your-server-ip
```

---

## 🔧 常用命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看某个服务的日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 更新代码

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build
```

### 清理资源

```bash
# 停止并删除容器
docker-compose down

# 删除所有数据（包括卷）
docker-compose down -v

# 清理未使用的镜像
docker system prune -a
```

---

## 🌐 配置域名和 HTTPS

### 1. 配置 Nginx 反向代理

编辑 `web/nginx.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. 使用 Let's Encrypt 配置 HTTPS

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 📊 系统监控

### 查看资源使用情况

```bash
# 实时监控容器资源
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 日志管理

```bash
# 查看最近 100 行日志
docker-compose logs --tail=100 backend

# 持续查看日志
docker-compose logs -f backend

# 导出日志到文件
docker-compose logs backend > backend.log
```

---

## ⚠️ 故障排查

### 问题1：容器无法启动

```bash
# 检查端口占用
sudo netstat -tulpn | grep 3001

# 检查Docker日志
docker-compose logs backend

# 重新构建
docker-compose down
docker-compose up -d --build
```

### 问题2：API返回403错误

- **原因**：Apify Token 无效或过期
- **解决**：
  1. 检查 `.env` 文件中的 `APIFY_API_TOKEN`
  2. 重新启动服务：`docker-compose restart`

### 问题3：AI分析失败

- **原因**：Gemini API Key 无效或配额用完
- **解决**：
  1. 检查 `.env` 文件中的 `GEMINI_API_KEY`
  2. 确认API配额：登录 [https://aihubmix.com](https://aihubmix.com)
  3. 重新启动服务

### 问题4：前端无法访问后端

- **原因**：跨域或端口配置问题
- **解决**：
  1. 检查 `web/src/config.js` 中的 API 地址
  2. 确保防火墙开放了3001端口
  3. 检查 Nginx 反向代理配置

---

## 📈 性能优化建议

### 1. 数据库优化（如使用）

- 定期清理旧数据
- 添加适当的索引
- 使用持久化卷存储

### 2. 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G
```

### 3. 日志轮转

编辑 Docker 日志配置：

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 🔐 安全建议

1. **使用强密码**：确保API密钥足够复杂
2. **限制访问**：使用防火墙限制3001端口仅对Nginx开放
3. **定期更新**：及时更新Docker镜像和系统包
4. **备份数据**：定期备份环境变量和数据库
5. **HTTPS**：生产环境必须使用HTTPS

---

## 📞 技术支持

如遇到问题，请按以下顺序排查：

1. 查看服务日志：`docker-compose logs -f`
2. 检查环境变量配置
3. 验证API密钥是否有效
4. 查看 GitHub Issues 或项目文档

---

## 🎯 快速命令速查表

| 操作 | 命令 |
|------|------|
| 启动服务 | `docker-compose up -d` |
| 停止服务 | `docker-compose down` |
| 查看日志 | `docker-compose logs -f` |
| 重启服务 | `docker-compose restart` |
| 更新代码 | `git pull && docker-compose up -d --build` |
| 查看状态 | `docker-compose ps` |
| 清理资源 | `docker system prune -a` |

---

**部署完成后，访问 `http://your-server-ip` 即可使用系统！**🎉



