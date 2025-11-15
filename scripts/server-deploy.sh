#!/bin/bash
# ========================================
# Amazon评论分析系统 - 服务器一键部署脚本
# ========================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/opt/amazon-review-analysis"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Amazon评论分析系统 - 服务器部署${NC}"
echo -e "${CYAN}========================================${NC}"

# 1. 检查项目目录
echo -e "\n${BLUE}[1/7] 检查项目目录...${NC}"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}错误: 项目目录不存在: $PROJECT_DIR${NC}"
    echo -e "${YELLOW}请先克隆项目: git clone https://github.com/lubei0612/amazon-review-analysis.git $PROJECT_DIR${NC}"
    exit 1
fi
cd "$PROJECT_DIR"
echo -e "${GREEN}✓ 项目目录: $PROJECT_DIR${NC}"

# 2. 拉取最新代码
echo -e "\n${BLUE}[2/7] 拉取最新代码...${NC}"
git fetch origin
git reset --hard origin/main
echo -e "${GREEN}✓ 代码已更新到最新版本${NC}"

# 3. 检查.env文件
echo -e "\n${BLUE}[3/7] 配置环境变量...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env文件不存在，从env.example创建...${NC}"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${YELLOW}请手动编辑.env文件，填入正确的API密钥${NC}"
        echo -e "${YELLOW}nano .env${NC}"
        echo -e "${RED}按Ctrl+C退出，配置好.env后重新运行此脚本${NC}"
        exit 1
    else
        echo -e "${RED}错误: env.example文件不存在${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env文件已存在${NC}"
    # 检查关键配置
    if ! grep -q "GEMINI_API_KEY=sk-" .env || ! grep -q "APIFY_API_TOKEN=apify_api_" .env; then
        echo -e "${YELLOW}⚠️  警告: .env文件中的API密钥可能未配置${NC}"
        echo -e "${YELLOW}请确保已配置以下变量:${NC}"
        echo -e "  - GEMINI_API_KEY"
        echo -e "  - APIFY_API_TOKEN"
    fi
fi

# 确保生产环境配置
sed -i 's/NODE_ENV=development/NODE_ENV=production/g' .env 2>/dev/null || true
sed -i 's/PORT=3001/PORT=8088/g' .env 2>/dev/null || true

# 添加缺失的配置项
if ! grep -q "WEB_PORT=" .env; then
    echo "WEB_PORT=8089" >> .env
fi
if ! grep -q "CORS_ORIGIN=" .env; then
    echo "CORS_ORIGIN=*" >> .env
fi

echo -e "${GREEN}✓ 环境变量检查完成${NC}"

# 5. 停止旧容器
echo -e "\n${BLUE}[4/7] 停止旧容器...${NC}"
docker compose down 2>/dev/null || true
echo -e "${GREEN}✓ 旧容器已停止${NC}"

# 6. 清理未使用的Docker资源（可选）
echo -e "\n${BLUE}[5/7] 清理Docker资源...${NC}"
docker system prune -f
echo -e "${GREEN}✓ Docker资源已清理${NC}"

# 7. 构建并启动新容器
echo -e "\n${BLUE}[6/7] 构建并启动容器...${NC}"
docker compose up -d --build

# 8. 等待容器启动
echo -e "\n${BLUE}[7/7] 等待容器启动...${NC}"
sleep 30

# 9. 检查容器状态
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}  容器状态${NC}"
echo -e "${CYAN}========================================${NC}"
docker compose ps

# 10. 显示日志
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}  后端日志（最近30行）${NC}"
echo -e "${CYAN}========================================${NC}"
docker compose logs backend --tail=30

echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}  前端日志（最近30行）${NC}"
echo -e "${CYAN}========================================${NC}"
docker compose logs frontend --tail=30

# 11. 测试API
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}  API测试${NC}"
echo -e "${CYAN}========================================${NC}"

echo -e "\n${BLUE}测试后端API...${NC}"
BACKEND_RESPONSE=$(curl -s http://localhost:8088/ || echo "连接失败")
if [[ "$BACKEND_RESPONSE" == *"Amazon评论分析系统"* ]]; then
    echo -e "${GREEN}✓ 后端API正常${NC}"
else
    echo -e "${RED}✗ 后端API异常${NC}"
fi

echo -e "\n${BLUE}测试前端服务...${NC}"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8089/ || echo "000")
if [ "$FRONTEND_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ 前端服务正常${NC}"
else
    echo -e "${RED}✗ 前端服务异常（状态码: $FRONTEND_RESPONSE）${NC}"
fi

# 12. 显示访问信息
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}  部署完成！${NC}"
echo -e "${CYAN}========================================${NC}"

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo -e "${GREEN}✓ 部署成功！${NC}"
echo -e "\n${YELLOW}访问地址:${NC}"
echo -e "  前端: ${BLUE}http://${SERVER_IP}:8089${NC}"
echo -e "  后端: ${BLUE}http://${SERVER_IP}:8088${NC}"
echo -e "\n${YELLOW}常用命令:${NC}"
echo -e "  查看日志: ${BLUE}docker compose logs -f${NC}"
echo -e "  重启服务: ${BLUE}docker compose restart${NC}"
echo -e "  停止服务: ${BLUE}docker compose down${NC}"
echo -e "  查看状态: ${BLUE}docker compose ps${NC}"

echo -e "\n${CYAN}========================================${NC}"
