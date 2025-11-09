#!/bin/bash
# ================================
# Amazon评论分析系统 - 自动化部署脚本
# ================================

set -e  # 遇到错误立即退出

echo "🚀 开始部署 Amazon评论分析系统..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
PROJECT_DIR="/opt/maijiaplug"
BACKUP_DIR="/opt/maijiaplug-backups"
GITHUB_REPO="your-username/maijiaplug"  # 修改为您的仓库地址

# ===== 1. 检查环境 =====
echo -e "${CYAN}📋 步骤1: 检查环境...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker未安装，请先安装Docker${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker环境检查通过${NC}"

# ===== 2. 备份当前.env文件 =====
if [ -f "$PROJECT_DIR/.env" ]; then
    echo -e "${CYAN}📋 步骤2: 备份现有配置...${NC}"
    mkdir -p "$BACKUP_DIR"
    cp "$PROJECT_DIR/.env" "$BACKUP_DIR/.env.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✅ 配置文件已备份${NC}"
fi

# ===== 3. 从GitHub拉取最新代码 =====
echo -e "${CYAN}📋 步骤3: 从GitHub拉取最新代码...${NC}"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "初次部署，克隆仓库..."
    git clone "https://github.com/$GITHUB_REPO.git" "$PROJECT_DIR"
else
    cd "$PROJECT_DIR"
    
    # 保存.env文件
    if [ -f ".env" ]; then
        cp .env /tmp/.env.backup
    fi
    
    # 拉取最新代码
    git fetch origin
    git reset --hard origin/main  # 或 origin/master
    
    # 恢复.env文件
    if [ -f "/tmp/.env.backup" ]; then
        cp /tmp/.env.backup .env
        rm /tmp/.env.backup
    fi
fi

cd "$PROJECT_DIR"
echo -e "${GREEN}✅ 代码更新完成${NC}"

# ===== 4. 处理环境变量 =====
echo -e "${CYAN}📋 步骤4: 配置环境变量...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env文件不存在，从模板创建...${NC}"
    
    if [ -f "env.template" ]; then
        cp env.template .env
        echo -e "${YELLOW}⚠️  请编辑 .env 文件并填写真实的API密钥${NC}"
        echo -e "${YELLOW}⚠️  完成后再次运行此脚本${NC}"
        exit 1
    else
        echo -e "${RED}❌ env.template文件不存在${NC}"
        exit 1
    fi
fi

# 验证必需的环境变量
source .env

if [ "$APIFY_API_TOKEN" == "your_apify_token_here" ] || [ -z "$APIFY_API_TOKEN" ]; then
    echo -e "${RED}❌ APIFY_API_TOKEN 未配置${NC}"
    echo -e "${YELLOW}请编辑 $PROJECT_DIR/.env 文件并填写真实的API密钥${NC}"
    exit 1
fi

if [ "$GEMINI_API_KEY" == "your_gemini_api_key_here" ] || [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ GEMINI_API_KEY 未配置${NC}"
    echo -e "${YELLOW}请编辑 $PROJECT_DIR/.env 文件并填写真实的API密钥${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境变量验证通过${NC}"

# ===== 5. 停止旧容器 =====
echo -e "${CYAN}📋 步骤5: 停止旧容器...${NC}"
docker-compose down || docker compose down || true
echo -e "${GREEN}✅ 旧容器已停止${NC}"

# ===== 6. 构建并启动新容器 =====
echo -e "${CYAN}📋 步骤6: 构建并启动容器...${NC}"
docker-compose up -d --build || docker compose up -d --build

# 等待服务启动
echo "等待服务启动..."
sleep 10

# ===== 7. 验证部署 =====
echo -e "${CYAN}📋 步骤7: 验证部署...${NC}"

# 检查后端健康
if curl -f http://localhost:3001/api/health &> /dev/null; then
    echo -e "${GREEN}✅ 后端服务运行正常${NC}"
else
    echo -e "${RED}❌ 后端服务启动失败${NC}"
    docker-compose logs backend
    exit 1
fi

# 检查前端
if curl -f http://localhost:3002 &> /dev/null; then
    echo -e "${GREEN}✅ 前端服务运行正常${NC}"
else
    echo -e "${YELLOW}⚠️  前端服务可能未启动（检查端口3002）${NC}"
fi

# ===== 8. 清理旧镜像 =====
echo -e "${CYAN}📋 步骤8: 清理旧镜像...${NC}"
docker image prune -f
echo -e "${GREEN}✅ 清理完成${NC}"

# ===== 9. 显示部署信息 =====
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        🎉 部署成功！                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}服务访问地址:${NC}"
echo -e "  后端API: ${GREEN}http://localhost:3001${NC}"
echo -e "  前端界面: ${GREEN}http://localhost:3002${NC}"
echo ""
echo -e "${CYAN}查看日志:${NC}"
echo -e "  docker-compose logs -f backend"
echo -e "  docker-compose logs -f frontend"
echo ""
echo -e "${CYAN}管理命令:${NC}"
echo -e "  重启服务: docker-compose restart"
echo -e "  停止服务: docker-compose down"
echo -e "  查看状态: docker-compose ps"
echo ""

exit 0
