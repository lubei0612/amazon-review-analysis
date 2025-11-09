# ===================================
# 后端服务 Dockerfile - 生产环境优化
# ===================================
# 只使用Apify爬虫，无需Chromium/Puppeteer

FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（仅生产依赖）
RUN npm ci --only=production && npm cache clean --force

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

