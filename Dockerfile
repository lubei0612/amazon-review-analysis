# ===================================
# 后端服务 Dockerfile
# ===================================

FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装 Chromium（Puppeteer需要）
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 告诉 Puppeteer 跳过下载 Chromium，使用系统安装的版本
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制项目文件（排除node_modules和其他不必要的文件）
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# 启动命令
CMD ["node", "server.js"]

