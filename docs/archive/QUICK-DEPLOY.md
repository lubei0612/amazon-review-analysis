# 快速部署指南 - 5分钟上线

本文档提供最精简的部署步骤，适合熟悉Linux和Docker的用户。

---

## 🚀 腾讯云一键部署（推荐）

### 前置条件

- 腾讯云服务器（2核4GB以上，Ubuntu 22.04）
- 已配置好安全组（开放 22, 80, 443端口）
- 拥有 Gemini API Key 和 Apify API Token

### 5步完成部署

```bash
# 1️⃣ 安装Docker（约2分钟）
curl -fsSL https://get.docker.com | sh
systemctl start docker && systemctl enable docker

# 2️⃣ 下载项目（约1分钟）
cd /opt
git clone https://your-repo-url.git amazon-review
cd amazon-review

# 或手动上传：
# scp -r maijiaplug root@服务器IP:/opt/amazon-review/

# 3️⃣ 配置环境变量（约1分钟）
cp env.example .env
vim .env  # 填写 GEMINI_API_KEY 和 APIFY_API_TOKEN

# 4️⃣ 启动服务（约2分钟）
docker-compose up -d

# 5️⃣ 验证部署（立即）
curl http://localhost:3001/api/health
curl http://localhost:3002
```

**完成！** 🎉

- 后端API: `http://服务器IP:3001`
- Web前端: `http://服务器IP:3002`

---

## 🔧 常用命令

```bash
# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose stop

# 更新代码并重启
git pull && docker-compose up -d --build
```

---

## 🌐 配置域名（可选）

### 1. DNS解析
在域名管理添加A记录：`yourdomain.com` → `服务器IP`

### 2. 安装Nginx和Certbot
```bash
apt install -y nginx certbot python3-certbot-nginx
```

### 3. 配置反向代理
```bash
# 创建Nginx配置
cat > /etc/nginx/sites-available/amazon-review << 'EOF'
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_connect_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# 启用站点
ln -s /etc/nginx/sites-available/amazon-review /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 4. 申请SSL证书
```bash
certbot --nginx -d yourdomain.com
```

**完成！** 访问 `https://yourdomain.com` 

---

## 📊 监控脚本（可选）

创建 `/opt/monitor.sh`:
```bash
#!/bin/bash
echo "=== 服务状态 ==="
docker-compose ps

echo -e "\n=== 内存使用 ==="
free -h

echo -e "\n=== 磁盘使用 ==="
df -h /

echo -e "\n=== API健康检查 ==="
curl -s http://localhost:3001/api/health | jq .
```

运行：`bash /opt/monitor.sh`

---

## ❓ 故障排查

| 问题 | 命令 |
|------|------|
| 服务未启动 | `docker-compose ps` |
| 查看错误日志 | `docker-compose logs backend` |
| 端口被占用 | `netstat -tlnp \| grep 3001` |
| 重置服务 | `docker-compose down && docker-compose up -d` |

---

**需要详细文档？** 查看 `DEPLOY-TENCENT-CLOUD.md`

