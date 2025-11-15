#!/bin/bash
# ================================
# 交互式环境配置脚本
# ================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Amazon评论分析系统 - 环境配置向导       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# 检查是否已存在.env文件
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  检测到现有.env文件${NC}"
    read -p "是否覆盖现有配置？(y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}保持现有配置，退出${NC}"
        exit 0
    fi
    # 备份现有文件
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✅ 已备份现有配置${NC}"
fi

# 创建.env文件
echo -e "${CYAN}📋 开始配置环境变量...${NC}"
echo ""

# 1. Apify API Token
echo -e "${CYAN}1. Apify API Token${NC}"
echo -e "   获取地址: ${YELLOW}https://console.apify.com/account/integrations${NC}"
read -p "   请输入Apify API Token: " APIFY_TOKEN

while [ -z "$APIFY_TOKEN" ]; do
    echo -e "${RED}❌ Apify API Token不能为空${NC}"
    read -p "   请输入Apify API Token: " APIFY_TOKEN
done

echo -e "${GREEN}✅ Apify Token已配置${NC}"
echo ""

# 2. Gemini API Key
echo -e "${CYAN}2. Gemini API Key${NC}"
echo -e "   获取地址: ${YELLOW}https://ai.google.dev/${NC}"
read -p "   请输入Gemini API Key: " GEMINI_KEY

while [ -z "$GEMINI_KEY" ]; do
    echo -e "${RED}❌ Gemini API Key不能为空${NC}"
    read -p "   请输入Gemini API Key: " GEMINI_KEY
done

echo -e "${GREEN}✅ Gemini API Key已配置${NC}"
echo ""

# 3. 服务器端口配置
echo -e "${CYAN}3. 服务器配置${NC}"
read -p "   后端端口 (默认3001): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-3001}

# 4. 环境类型
read -p "   环境类型 (development/production，默认production): " NODE_ENV
NODE_ENV=${NODE_ENV:-production}

echo -e "${GREEN}✅ 服务器配置完成${NC}"
echo ""

# 生成.env文件
cat > .env << EOF
# ================================
# Amazon评论分析系统 - 环境变量
# 生成时间: $(date)
# ================================

# ===== Apify配置 =====
APIFY_API_TOKEN=$APIFY_TOKEN

# ===== Gemini AI配置 =====
GEMINI_API_KEY=$GEMINI_KEY
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=16000

# ===== 服务器配置 =====
PORT=$BACKEND_PORT
NODE_ENV=$NODE_ENV

# ===== CORS配置 =====
# 生产环境请修改为您的实际域名
# ALLOWED_ORIGINS=https://yourdomain.com
EOF

# 设置文件权限
chmod 600 .env

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ✅ 环境配置完成！                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}配置文件位置:${NC} $(pwd)/.env"
echo -e "${CYAN}配置文件权限:${NC} 600 (仅所有者可读写)"
echo ""
echo -e "${YELLOW}⚠️  重要提示:${NC}"
echo -e "  1. .env文件包含敏感信息，请勿提交到Git"
echo -e "  2. 已自动添加到.gitignore"
echo -e "  3. 备份文件已保存（如果存在）"
echo ""
echo -e "${CYAN}下一步:${NC}"
echo -e "  运行部署脚本: ${GREEN}bash deploy.sh${NC}"
echo ""

exit 0


