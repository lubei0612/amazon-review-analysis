# 🚀 生产环境部署指南

## 📋 概述

本文档提供最简单、最优的Docker部署方案，适用于服务器生产环境部署。

---

## 🎯 部署架构

```
┌─────────────────────────────────────┐
│         Nginx (可选反向代理)        │
│         Port: 80/443               │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐ ┌─────▼─────┐
│  Frontend   │ │  Backend  │
│  (Nginx)    │ │  (Node.js)│
│  Port: 3002 │ │  Port: 3001│
└─────────────┘ └───────────┘
       │               │
       │       ┌───────┴────────┐
       │       │                │
       │  ┌────▼────┐    ┌──────▼─────┐
       │  │ Gemini  │    │   Apify    │
       │  │  API    │    │    API     │
       │  └─────────┘    └────────────┘
       │
       └──────────────────────────────┐
                                      │
                              ┌───────▼──────┐
                              │     Logs     │
                              │  (Persistent)│
                              └──────────────┘
```

---

## ⚙️ 部署准备

### 1. 服务器要求

- **操作系统**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **内存**: 最低2GB，推荐4GB+
- **CPU**: 2核+
- **硬盘**: 10GB+
- **Docker**: 20.10+
- **Docker Compose**: 1.29+

### 2. 安装Docker和Docker Compose

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 3. 获取API密钥

#### Gemini API Key
1. 访问：https://aistudio.google.com/app/apikey
2. 注册并创建API密钥
3. 保存密钥（格式：AIzaSy...）

#### Apify API Token
1. 访问：https://apify.com/
2. 注册账号
3. 进入 Settings → Integrations
4. 复制API Token（格式：apify_api_...）

---

## 🚀 快速部署（3步完成）

### 第1步：上传项目到服务器

```bash
# 方式1：使用Git
git clone https://your-repo-url.git
cd maijiaplug

# 方式2：使用SCP上传
scp -r ./maijiaplug user@server:/path/to/deployment/
```

### 第2步：配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑.env文件，填入真实的API密钥
nano .env
```

**必填配置**：
```env
# AI分析服务（必填）
GEMINI_API_KEY=your_gemini_api_key_here

# 爬虫服务（必填）
APIFY_API_TOKEN=your_apify_token_here
```

### 第3步：启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**完成！** 🎉

- 前端访问：http://your-server-ip:3002
- 后端API：http://your-server-ip:3001

---

## 🔧 高级配置

### 配置Nginx反向代理（推荐）

#### 安装Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

#### 配置站点

```bash
sudo nano /etc/nginx/sites-available/amazon-review-analysis
```

```nginx
# 前端配置
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    # 前端（Web界面）
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 增加超时时间（AI分析可能需要较长时间）
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

#### 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/amazon-review-analysis /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 配置SSL证书（使用Let's Encrypt）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 📊 服务管理

### 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 停止并删除容器
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 进入容器内部
docker-compose exec backend sh
```

### 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build

# 清理旧镜像
docker image prune -f
```

### 备份和恢复

```bash
# 备份日志
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/

# 备份.env配置
cp .env .env.backup-$(date +%Y%m%d)

# 恢复（将备份文件放回原位即可）
cp .env.backup-20251107 .env
```

---

## 🔍 监控和日志

### 健康检查

```bash
# 检查后端健康状态
curl http://localhost:3001/api/health

# 检查前端
curl http://localhost:3002/

# 检查Docker容器健康
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### 日志位置

```
项目目录/
├── logs/                    # 应用日志（持久化）
│   ├── app-2025-11-07.log  # 应用日志
│   ├── error-2025-11-07.log # 错误日志
│   └── combined-2025-11-07.log
└── docker logs              # 容器日志
    ├── docker-compose logs backend
    └── docker-compose logs frontend
```

### 日志查看

```bash
# 实时查看应用日志
tail -f logs/app-$(date +%Y-%m-%d).log

# 查看错误日志
tail -f logs/error-$(date +%Y-%m-%d).log

# 查看Docker日志
docker-compose logs -f --tail=100 backend
```

---

## ⚠️ 故障排查

### 问题1：容器启动失败

```bash
# 查看详细日志
docker-compose logs backend

# 检查.env配置
cat .env | grep -E "GEMINI|APIFY"

# 检查端口占用
netstat -tulpn | grep -E "3001|3002"
```

### 问题2：API密钥无效

```bash
# 检查后端日志中的错误信息
docker-compose logs backend | grep -i "error\|failed"

# 验证Gemini API
curl -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models

# 验证Apify API
curl -H "Authorization: Bearer YOUR_APIFY_TOKEN" \
  https://api.apify.com/v2/acts
```

### 问题3：服务无响应

```bash
# 检查容器状态
docker-compose ps

# 重启服务
docker-compose restart

# 完全重建
docker-compose down
docker-compose up -d --build
```

### 问题4：内存不足

```bash
# 查看资源使用
docker stats

# 清理Docker资源
docker system prune -a -f

# 限制内存使用（修改docker-compose.yml）
services:
  backend:
    mem_limit: 1g
    memswap_limit: 1g
```

---

## 🔒 安全建议

### 1. 保护API密钥

```bash
# .env文件权限
chmod 600 .env

# 不要提交.env到Git
echo ".env" >> .gitignore
```

### 2. 配置防火墙

```bash
# 只开放必要端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# 不要直接暴露3001、3002端口（使用Nginx反向代理）
```

### 3. 定期更新

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新Docker镜像
docker-compose pull
docker-compose up -d
```

### 4. 配置日志轮转

```bash
sudo nano /etc/logrotate.d/amazon-review-analysis
```

```
/path/to/maijiaplug/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 root root
    sharedscripts
    postrotate
        docker-compose restart backend
    endscript
}
```

---

## 📈 性能优化

### 1. 启用Gzip压缩

在`web/nginx.conf`中添加：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. 配置缓存

```nginx
location /static/ {
    expires 7d;
    add_header Cache-Control "public, immutable";
}
```

### 3. 限制并发请求

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

---

## 📞 支持

### 文档链接

- **项目README**: [../README.md](../README.md)
- **快速开始**: [./快速开始.md](./快速开始.md)
- **API文档**: [./03-后端API设计文档.md](./03-后端API设计文档.md)

### 常见问题

遇到问题请查看：
1. 应用日志：`logs/error-*.log`
2. Docker日志：`docker-compose logs`
3. 系统日志：`/var/log/syslog`

---

## ✅ 部署检查清单

部署完成后，请验证以下项目：

- [ ] Docker和Docker Compose已安装
- [ ] API密钥已正确配置在.env文件中
- [ ] 容器已成功启动（`docker-compose ps` 显示 Up）
- [ ] 后端健康检查通过（`curl http://localhost:3001/api/health`）
- [ ] 前端可以访问（`curl http://localhost:3002/`）
- [ ] 可以创建分析任务
- [ ] 日志正常写入
- [ ] Nginx反向代理配置（如需要）
- [ ] SSL证书配置（如需要）
- [ ] 防火墙规则配置
- [ ] 备份策略已设置

---

## 🎉 完成

恭喜！你已经成功部署了Amazon评论分析系统到生产环境！

**下一步**：
- 监控服务运行状态
- 定期备份日志和配置
- 根据使用情况优化性能

**访问地址**：
- 前端：http://your-domain.com
- API文档：http://your-domain.com/api/

---

*更新日期：2025-11-07*
*版本：v1.0.0*




