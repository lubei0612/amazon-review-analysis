# 腾讯云部署指南 - Amazon评论分析系统

本文档提供了在腾讯云上部署Amazon评论分析系统的完整步骤。

---

## 📋 目录

1. [系统要求](#系统要求)
2. [准备工作](#准备工作)
3. [方案一：Docker部署（推荐）](#方案一docker部署推荐)
4. [方案二：宝塔面板部署](#方案二宝塔面板部署)
5. [配置域名和SSL](#配置域名和ssl)
6. [监控和维护](#监控和维护)
7. [常见问题](#常见问题)

---

## 🖥️ 系统要求

### 服务器配置推荐

| 配置项 | 最低配置 | 推荐配置 |
|--------|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 存储 | 40GB SSD | 100GB SSD |
| 带宽 | 1Mbps | 5Mbps |
| 操作系统 | Ubuntu 20.04+ | Ubuntu 22.04 LTS |

### 软件要求

- Docker 20.10+
- Docker Compose 2.0+
- Nginx（如果不使用Docker）
- Node.js 18+（如果不使用Docker）

---

## 🔧 准备工作

### 1. 购买腾讯云服务器

1. 访问 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 选择 **云服务器 CVM**
3. 推荐配置：
   - **地域**：根据用户位置选择（如：香港、新加坡）
   - **实例**：标准型 S5.MEDIUM4（2核4GB）或以上
   - **镜像**：Ubuntu Server 22.04 LTS
   - **公网带宽**：按使用流量，带宽上限5Mbps
   - **安全组**：开放端口 22, 80, 443

### 2. 连接到服务器

**Windows用户**（使用PowerShell或PuTTY）:
```bash
ssh root@你的服务器IP
```

**Mac/Linux用户**:
```bash
ssh root@你的服务器IP
```

### 3. 更新系统

```bash
# 更新软件包列表
apt update

# 升级已安装的软件包
apt upgrade -y

# 安装基础工具
apt install -y curl wget git vim
```

---

## 🐳 方案一：Docker部署（推荐）

这是最简单、最可靠的部署方式。

### 步骤 1: 安装Docker

```bash
# 安装Docker
curl -fsSL https://get.docker.com | sh

# 启动Docker服务
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

### 步骤 2: 克隆项目代码

```bash
# 创建项目目录
mkdir -p /opt/amazon-review-analysis
cd /opt/amazon-review-analysis

# 从Git仓库克隆（如果有）
# git clone https://github.com/your-repo/amazon-review-analysis.git .

# 或者通过FTP/SCP上传项目文件
# 可使用WinSCP、FileZilla等工具
```

**手动上传方式**：
```bash
# 在本地打包项目（排除node_modules）
# 然后使用scp上传

# 本地执行（Windows PowerShell）:
scp -r D:\Users\Desktop\maijiaplug root@服务器IP:/opt/amazon-review-analysis/
```

### 步骤 3: 配置环境变量

```bash
# 进入项目目录
cd /opt/amazon-review-analysis

# 从示例文件创建.env
cp env.example .env

# 编辑.env文件，填写API密钥
vim .env
```

**必填配置项**:
```env
# AI分析服务（必填）
GEMINI_API_KEY=sk-your-actual-key-here

# 爬虫服务（必填）
APIFY_API_TOKEN=apify_api_your-actual-token-here

# 服务器配置
NODE_ENV=production
LOG_LEVEL=info
```

### 步骤 4: 构建和启动服务

```bash
# 构建Docker镜像
docker-compose build

# 启动服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 步骤 5: 验证部署

```bash
# 检查后端API
curl http://localhost:3001/api/health

# 检查前端
curl http://localhost:3002

# 预期输出：
# {"success":true,"message":"Amazon评论分析服务运行中"...}
```

### 步骤 6: 配置防火墙

```bash
# 安装ufw（如果未安装）
apt install -y ufw

# 允许SSH
ufw allow 22/tcp

# 允许HTTP和HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 启用防火墙
ufw enable

# 查看规则
ufw status
```

---

## 🎛️ 方案二：宝塔面板部署

如果您习惯使用图形界面，可以使用宝塔面板。

### 步骤 1: 安装宝塔面板

```bash
# 安装宝塔Linux面板（官方脚本）
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh
bash install.sh ed8484bec

# 安装完成后会显示：
# - 面板地址：http://服务器IP:8888/xxxxxxxx
# - 用户名和密码
```

### 步骤 2: 登录宝塔面板

1. 访问面板地址
2. 使用显示的用户名和密码登录
3. 安装推荐的软件：
   - Nginx 1.22+
   - MySQL 5.7+（可选）
   - PM2管理器
   - Node.js 18+

### 步骤 3: 上传项目文件

1. 在宝塔面板 → **文件** → 创建目录 `/www/wwwroot/amazon-review`
2. 上传项目文件（可以压缩后上传再解压）
3. 解压：`unzip maijiaplug.zip`

### 步骤 4: 安装依赖

```bash
# 进入项目目录
cd /www/wwwroot/amazon-review

# 安装后端依赖
npm install --production

# 进入web目录，安装前端依赖并构建
cd web
npm install
npm run build
```

### 步骤 5: 配置PM2

在宝塔面板 → **软件商店** → **PM2管理器** → **添加项目**：

- **项目名称**: amazon-review-backend
- **项目路径**: `/www/wwwroot/amazon-review`
- **启动文件**: `server.js`
- **运行模式**: `cluster`（多进程）
- **进程数量**: `2`（根据CPU核心数）

### 步骤 6: 配置Nginx

在宝塔面板 → **网站** → **添加站点**：

#### 后端API配置（可选）
创建站点：`api.yourdomain.com`

**Nginx配置**:
```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
    # 超时设置
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
}
```

#### 前端Web配置
创建站点：`www.yourdomain.com`

**根目录**: `/www/wwwroot/amazon-review/web/dist`

**Nginx配置**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    
    # 超时设置
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
}
```

---

## 🌐 配置域名和SSL

### 1. 域名解析

在您的域名DNS管理页面添加A记录：

| 主机记录 | 记录类型 | 记录值 |
|---------|---------|--------|
| @ 或 www | A | 服务器IP |
| api | A | 服务器IP |

### 2. 申请SSL证书（推荐Let's Encrypt）

**使用宝塔面板**:
1. 网站 → 设置 → SSL
2. 选择 "Let's Encrypt"
3. 勾选域名 → 申请
4. 开启 "强制HTTPS"

**使用Certbot（手动）**:
```bash
# 安装Certbot
apt install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
certbot renew --dry-run
```

### 3. 配置Nginx HTTPS

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # SSL优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # ...其他配置
}
```

---

## 📊 监控和维护

### 日志查看

**Docker部署**:
```bash
# 查看后端日志
docker-compose logs -f backend

# 查看前端日志
docker-compose logs -f frontend

# 查看最近100行日志
docker-compose logs --tail=100 backend
```

**宝塔面板部署**:
- 后端日志：`/www/wwwroot/amazon-review/logs/`
- Nginx日志：`/www/wwwlogs/`
- PM2日志：宝塔面板 → PM2管理器 → 日志

### 服务管理

**Docker**:
```bash
# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build

# 完全清理
docker-compose down
docker system prune -a
```

**PM2**:
```bash
# 查看所有进程
pm2 list

# 重启服务
pm2 restart amazon-review-backend

# 查看日志
pm2 logs amazon-review-backend

# 监控
pm2 monit
```

### 性能优化

1. **启用Gzip压缩** （Nginx已配置）
2. **配置Redis缓存** （可选，用于缓存AI分析结果）
3. **使用CDN** （加速静态资源）
4. **定期清理日志**:
   ```bash
   # 清理30天前的日志
   find /opt/amazon-review-analysis/logs -name "*.log" -mtime +30 -delete
   ```

---

## ❓ 常见问题

### Q1: Docker构建失败

**问题**: `npm install` 超时或失败

**解决方案**:
```bash
# 配置npm国内镜像
npm config set registry https://registry.npmmirror.com

# 或在Dockerfile中添加
RUN npm config set registry https://registry.npmmirror.com
```

### Q2: 服务无法访问

**问题**: `curl http://localhost:3001` 连接被拒绝

**检查步骤**:
```bash
# 1. 检查服务是否运行
docker-compose ps
# 或
pm2 list

# 2. 检查端口是否监听
netstat -tlnp | grep 3001

# 3. 检查防火墙
ufw status

# 4. 检查日志
docker-compose logs backend
```

### Q3: AI分析失败

**问题**: 任务一直停留在"analyzing"状态

**检查步骤**:
```bash
# 1. 检查Gemini API密钥是否正确
grep GEMINI_API_KEY .env

# 2. 测试API连通性
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
     https://aihubmix.com/v1/models

# 3. 查看详细错误日志
docker-compose logs backend | grep -i error
```

### Q4: 爬虫抓取失败

**问题**: 无法获取Amazon评论

**解决方案**:
1. 检查Apify API Token是否正确
2. 检查Apify账户配额是否充足
3. 查看后端日志获取详细错误信息

### Q5: 内存不足

**问题**: 服务器内存占用过高

**解决方案**:
```bash
# 限制Docker容器内存
# 在docker-compose.yml中添加：
services:
  backend:
    mem_limit: 2g
    
# 或重启服务释放内存
docker-compose restart
```

---

## 📞 技术支持

如有问题，请联系：
- **Email**: support@example.com
- **文档**: 查看 `docs/` 目录
- **日志**: 查看 `/opt/amazon-review-analysis/logs/`

---

## 🔄 更新部署

```bash
# 1. 备份数据
cd /opt/amazon-review-analysis
tar -czf backup-$(date +%Y%m%d).tar.gz .

# 2. 拉取最新代码
git pull origin main

# 3. 重新构建和启动
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 4. 验证
curl http://localhost:3001/api/health
```

---

**部署完成！** 🎉

访问您的域名即可开始使用Amazon评论分析系统。

