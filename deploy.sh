#!/bin/bash
# ================================
# Amazon评论分析系统 - 一键部署脚本
# ================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
PROJECT_DIR="/opt/amazon-review-analysis"
GITHUB_REPO="lubei0612/amazon-review-analysis"

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Amazon评论分析系统 - 一键部署脚本      ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# 1. 克隆或更新项目
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${CYAN}📦 更新项目代码...${NC}"
    cd "$PROJECT_DIR"
    
    # 备份.env文件
    if [ -f .env ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        echo -e "${GREEN}✅ 已备份现有.env文件${NC}"
    fi
    
    git fetch origin
    git reset --hard origin/main
    echo -e "${GREEN}✅ 代码更新完成${NC}"
else
    echo -e "${CYAN}📦 克隆项目...${NC}"
    sudo mkdir -p /opt
    sudo chown $USER:$USER /opt
    git clone "https://github.com/${GITHUB_REPO}.git" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    echo -e "${GREEN}✅ 项目克隆完成${NC}"
fi

echo ""

# 2. 检查.env文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env文件不存在，从模板创建...${NC}"
    if [ ! -f env.template ]; then
        echo -e "${RED}❌ env.template文件不存在${NC}"
        exit 1
    fi
    cp env.template .env
    echo ""
    echo -e "${RED}❌ 请先编辑 .env 文件并填写API密钥:${NC}"
    echo -e "${YELLOW}   nano $PROJECT_DIR/.env${NC}"
    echo ""
    echo -e "${CYAN}必需配置:${NC}"
    echo -e "  - APIFY_API_TOKEN"
    echo -e "  - GEMINI_API_KEY"
    echo ""
    exit 1
fi

# 3. 验证.env文件
echo -e "${CYAN}📋 验证环境变量配置...${NC}"
source .env

if [ "$APIFY_API_TOKEN" = "your_apify_token_here" ] || [ -z "$APIFY_API_TOKEN" ]; then
    echo -e "${RED}❌ APIFY_API_TOKEN 未配置${NC}"
    echo -e "${YELLOW}请编辑 $PROJECT_DIR/.env 文件并填写真实的API密钥${NC}"
    exit 1
fi

if [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ] || [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ GEMINI_API_KEY 未配置${NC}"
    echo -e "${YELLOW}请编辑 $PROJECT_DIR/.env 文件并填写真实的API密钥${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境变量验证通过${NC}"
echo ""

# 4. 停止旧容器
echo -e "${CYAN}🛑 停止旧容器...${NC}"
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✅ 旧容器已停止${NC}"
echo ""

# 5. 构建并启动
echo -e "${CYAN}🔨 构建并启动Docker容器...${NC}"
docker-compose up -d --build

# 6. 等待服务启动
echo -e "${CYAN}⏳ 等待服务启动（30秒）...${NC}"
sleep 30
echo ""

# 7. 验证部署
echo -e "${CYAN}✅ 验证部署...${NC}"

# 检查容器状态
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    docker compose ps
fi
echo ""

# 检查后端健康
echo -e "${CYAN}检查后端服务...${NC}"
if curl -f http://localhost:3001/api/health &> /dev/null; then
    echo -e "${GREEN}✅ 后端服务运行正常${NC}"
    curl -s http://localhost:3001/api/health | head -3
else
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    echo -e "${YELLOW}查看日志: cd $PROJECT_DIR && docker-compose logs backend${NC}"
fi
echo ""

# 检查前端
echo -e "${CYAN}检查前端服务...${NC}"
if curl -f http://localhost:3002 &> /dev/null; then
    echo -e "${GREEN}✅ 前端服务运行正常${NC}"
else
    echo -e "${YELLOW}⚠️  前端服务可能未启动（检查端口3002）${NC}"
fi
echo ""

# 显示完成信息
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        🎉 部署完成！                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📌 服务访问地址:${NC}"
echo -e "  后端API: ${GREEN}http://localhost:3001${NC}"
echo -e "  前端界面: ${GREEN}http://localhost:3002${NC}"
echo ""
echo -e "${CYAN}📌 项目目录:${NC}"
echo -e "  ${GREEN}$PROJECT_DIR${NC}"
echo ""
echo -e "${CYAN}📌 常用命令:${NC}"
echo -e "  查看日志: ${YELLOW}cd $PROJECT_DIR && docker-compose logs -f${NC}"
echo -e "  重启服务: ${YELLOW}cd $PROJECT_DIR && docker-compose restart${NC}"
echo -e "  停止服务: ${YELLOW}cd $PROJECT_DIR && docker-compose down${NC}"
echo -e "  查看状态: ${YELLOW}cd $PROJECT_DIR && docker-compose ps${NC}"
echo ""
echo -e "${CYAN}📌 更新代码:${NC}"
echo -e "  ${YELLOW}cd $PROJECT_DIR${NC}"
echo -e "  ${YELLOW}git pull origin main${NC}"
echo -e "  ${YELLOW}docker-compose up -d --build${NC}"
echo ""

exit 0
