# 阶段1: 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 复制依赖清单并安装
COPY package*.json ./
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npm run build

# 阶段2: 运行阶段
FROM nginx:alpine

# 将构建产物复制到Nginx默认目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 如果有自定义 Nginx 配置，可覆盖
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 修改 Nginx 监听端口为 7777
RUN sed -i 's/listen       80;/listen       7777;/' /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 7777

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:7777/ || exit 1

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
