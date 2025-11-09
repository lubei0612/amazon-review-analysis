#!/bin/bash
# ================================
# Amazon评论分析系统 - 一键部署脚本
# 使用方法:
#   bash deploy.sh APIFY_TOKEN GEMINI_KEY
#   或
#   APIFY_TOKEN=xxx GEMINI_KEY=xxx bash deploy.sh
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

# 从命令行参数或环境变量获取API密钥
APIFY_TOKEN="${1:-${APIFY_API_TOKEN}}"
GEMINI_KEY="${2:-${GEMINI_API_KEY}}"

# 检测docker-compose命令（兼容新旧版本）
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ 未找到 docker-compose 或 docker compose 命令${NC}"
    echo -e "${YELLOW}请安装 Docker Compose:${NC}"
    echo -e "  Ubuntu/Debian: ${CYAN}sudo apt-get install docker-compose${NC}"
    echo -e "  或使用新版本: ${CYAN}sudo apt-get install docker.io${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Amazon评论分析系统 - 一键部署脚本      ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# 1. 克隆或更新项目
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${CYAN}📦 目录已存在，检查是否为Git仓库...${NC}"
    cd "$PROJECT_DIR"
    
    # 检查是否为Git仓库
    if [ -d .git ]; then
        echo -e "${GREEN}✅ 检测到Git仓库，更新代码...${NC}"
        # 备份.env文件
        if [ -f .env ]; then
            cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
            echo -e "${GREEN}✅ 已备份现有.env文件${NC}"
        fi
        
        git fetch origin
        git reset --hard origin/main
        echo -e "${GREEN}✅ 代码更新完成${NC}"
    else
        echo -e "${YELLOW}⚠️  目录存在但不是Git仓库，清理后重新克隆...${NC}"
        cd /opt
        rm -rf "$PROJECT_DIR"
        echo -e "${CYAN}📦 克隆项目...${NC}"
        sudo mkdir -p /opt
        sudo chown $USER:$USER /opt
        git clone "https://github.com/${GITHUB_REPO}.git" "$PROJECT_DIR"
        cd "$PROJECT_DIR"
        echo -e "${GREEN}✅ 项目克隆完成${NC}"
    fi
else
    echo -e "${CYAN}📦 克隆项目...${NC}"
    sudo mkdir -p /opt
    sudo chown $USER:$USER /opt
    git clone "https://github.com/${GITHUB_REPO}.git" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    echo -e "${GREEN}✅ 项目克隆完成${NC}"
fi

echo ""

# 2. 自动配置.env文件
echo -e "${CYAN}📋 配置环境变量...${NC}"

# 如果提供了API密钥，自动创建.env文件
if [ -n "$APIFY_TOKEN" ] && [ -n "$GEMINI_KEY" ]; then
    echo -e "${GREEN}✅ 检测到API密钥，自动创建.env文件...${NC}"
    cat > .env << EOF
# ================================
# Amazon评论分析系统 - 环境变量
# 自动生成于: $(date)
# ================================

# ===== Apify配置 =====
APIFY_API_TOKEN=${APIFY_TOKEN}

# ===== Gemini AI配置 =====
GEMINI_API_KEY=${GEMINI_KEY}
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=16000
GEMINI_BASE_URL=https://aihubmix.com/v1

# ===== 服务器配置 =====
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
DEBUG=false
EOF
    chmod 600 .env
    echo -e "${GREEN}✅ .env文件已自动创建并配置${NC}"
elif [ -f .env ]; then
    echo -e "${YELLOW}⚠️  使用现有.env文件${NC}"
    source .env
    APIFY_TOKEN="${APIFY_API_TOKEN}"
    GEMINI_KEY="${GEMINI_API_KEY}"
else
    echo -e "${RED}❌ 未提供API密钥且.env文件不存在${NC}"
    echo ""
    echo -e "${CYAN}使用方法:${NC}"
    echo -e "  方法1: ${YELLOW}bash deploy.sh APIFY_TOKEN GEMINI_KEY${NC}"
    echo -e "  方法2: ${YELLOW}APIFY_TOKEN=xxx GEMINI_KEY=xxx bash deploy.sh${NC}"
    echo ""
    exit 1
fi

# 3. 验证API密钥
if [ "$APIFY_TOKEN" = "your_apify_token_here" ] || [ -z "$APIFY_TOKEN" ]; then
    echo -e "${RED}❌ APIFY_API_TOKEN 未配置或无效${NC}"
    exit 1
fi

if [ "$GEMINI_KEY" = "your_gemini_api_key_here" ] || [ -z "$GEMINI_KEY" ]; then
    echo -e "${RED}❌ GEMINI_API_KEY 未配置或无效${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境变量验证通过${NC}"
echo ""

# 4. 停止并清理旧容器
echo -e "${CYAN}🛑 停止并清理旧容器...${NC}"
$DOCKER_COMPOSE down 2>/dev/null || true

# 强制停止可能存在的容器（防止端口占用）
echo -e "${CYAN}🔍 清理可能存在的容器...${NC}"
docker stop amazon-review-backend amazon-review-frontend 2>/dev/null || true
docker rm amazon-review-backend amazon-review-frontend 2>/dev/null || true

# 查找并停止占用端口的容器
echo -e "${CYAN}🔍 检查端口占用...${NC}"
# 查找所有运行中的容器，检查端口映射
for container_id in $(docker ps -q 2>/dev/null); do
    port_mapping=$(docker port $container_id 2>/dev/null | grep -E ":(3001|3002)->" || true)
    if [ -n "$port_mapping" ]; then
        echo -e "${YELLOW}⚠️  发现占用端口的容器 $container_id，正在停止...${NC}"
        docker stop $container_id 2>/dev/null || true
        docker rm $container_id 2>/dev/null || true
    fi
done

# 额外检查：使用 lsof 或 netstat 清理非 Docker 进程
if command -v lsof &> /dev/null; then
    if lsof -ti:3001 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 3001 被非 Docker 进程占用，正在清理...${NC}"
        lsof -ti:3001 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    if lsof -ti:3002 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 3002 被非 Docker 进程占用，正在清理...${NC}"
        lsof -ti:3002 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
fi

echo -e "${GREEN}✅ 清理完成${NC}"
echo ""

# 5. 构建并启动
echo -e "${CYAN}🔨 构建并启动Docker容器...${NC}"
$DOCKER_COMPOSE up -d --build

# 6. 等待服务启动
echo -e "${CYAN}⏳ 等待服务启动（30秒）...${NC}"
sleep 30
echo ""

# 7. 验证部署
echo -e "${CYAN}✅ 验证部署...${NC}"

# 检查容器状态
$DOCKER_COMPOSE ps
echo ""

# 检查后端健康
echo -e "${CYAN}检查后端服务...${NC}"
if curl -f http://localhost:3001/api/health &> /dev/null; then
    echo -e "${GREEN}✅ 后端服务运行正常${NC}"
    curl -s http://localhost:3001/api/health | head -3
else
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    echo -e "${YELLOW}查看日志: cd $PROJECT_DIR && $DOCKER_COMPOSE logs backend${NC}"
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
echo -e "  查看日志: ${YELLOW}cd $PROJECT_DIR && $DOCKER_COMPOSE logs -f${NC}"
echo -e "  重启服务: ${YELLOW}cd $PROJECT_DIR && $DOCKER_COMPOSE restart${NC}"
echo -e "  停止服务: ${YELLOW}cd $PROJECT_DIR && $DOCKER_COMPOSE down${NC}"
echo -e "  查看状态: ${YELLOW}cd $PROJECT_DIR && $DOCKER_COMPOSE ps${NC}"
echo ""
echo -e "${CYAN}📌 更新代码:${NC}"
echo -e "  ${YELLOW}cd $PROJECT_DIR${NC}"
echo -e "  ${YELLOW}git pull origin main${NC}"
echo -e "  ${YELLOW}$DOCKER_COMPOSE up -d --build${NC}"
echo ""

exit 0
