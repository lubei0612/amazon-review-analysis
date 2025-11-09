#!/bin/sh
# ================================
# Docker容器启动脚本
# 自动配置环境变量并启动服务
# ================================

set -e

echo "🚀 启动 Amazon评论分析系统..."

# 检查必要的环境变量
if [ -z "$APIFY_API_TOKEN" ] || [ "$APIFY_API_TOKEN" = "your_apify_token_here" ]; then
    echo "❌ 错误: APIFY_API_TOKEN 未配置或使用默认值"
    echo "请在 docker-compose.yml 或 .env 文件中设置 APIFY_API_TOKEN"
    exit 1
fi

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
    echo "❌ 错误: GEMINI_API_KEY 未配置或使用默认值"
    echo "请在 docker-compose.yml 或 .env 文件中设置 GEMINI_API_KEY"
    exit 1
fi

# 创建.env文件（如果不存在）
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
# ================================
# Amazon评论分析系统 - 环境变量
# 自动生成于: $(date)
# ================================

# ===== Apify配置 =====
APIFY_API_TOKEN=${APIFY_API_TOKEN}

# ===== Gemini AI配置 =====
GEMINI_API_KEY=${GEMINI_API_KEY}
GEMINI_MODEL=${GEMINI_MODEL:-gemini-2.0-flash-exp}
GEMINI_TEMPERATURE=${GEMINI_TEMPERATURE:-0.7}
GEMINI_MAX_TOKENS=${GEMINI_MAX_TOKENS:-16000}
GEMINI_BASE_URL=${GEMINI_BASE_URL:-https://aihubmix.com/v1}

# ===== 服务器配置 =====
PORT=${PORT:-8088}
NODE_ENV=${NODE_ENV:-production}
LOG_LEVEL=${LOG_LEVEL:-info}
DEBUG=${DEBUG:-false}
EOF
    echo "✅ .env 文件已创建"
else
    echo "✅ .env 文件已存在，使用现有配置"
fi

# 显示配置信息（隐藏敏感信息）
echo ""
echo "📋 配置信息:"
echo "  APIFY_API_TOKEN: ${APIFY_API_TOKEN:0:20}..."
echo "  GEMINI_API_KEY: ${GEMINI_API_KEY:0:20}..."
echo "  PORT: ${PORT:-8088}"
echo "  NODE_ENV: ${NODE_ENV:-production}"
echo ""

# 启动服务
echo "🚀 启动 Node.js 服务..."
exec "$@"

