#!/bin/bash
# ================================
# 快速更新前端修复
# ================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="/opt/amazon-review-analysis"

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Amazon评论分析系统 - 前端修复更新      ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# 检测docker-compose命令
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ 未找到 docker-compose 或 docker compose 命令${NC}"
    exit 1
fi

echo -e "${CYAN}📥 拉取最新代码...${NC}"
cd $PROJECT_DIR
git pull origin main
echo -e "${GREEN}✅ 代码更新完成${NC}"
echo ""

echo -e "${CYAN}🔄 重新构建并启动前端...${NC}"
$DOCKER_COMPOSE up -d --build --no-deps frontend
echo -e "${GREEN}✅ 前端容器已更新${NC}"
echo ""

echo -e "${CYAN}⏳ 等待前端服务启动（10秒）...${NC}"
sleep 10
echo ""

echo -e "${CYAN}✅ 验证前端服务...${NC}"
if curl -f http://localhost:8089 &> /dev/null; then
    echo -e "${GREEN}✅ 前端服务运行正常${NC}"
else
    echo -e "${YELLOW}⚠️  前端服务可能未完全启动，请稍候重试${NC}"
fi
echo ""

# 自动检测服务器IP
SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || curl -s ipecho.net/plain || echo "YOUR_SERVER_IP")

echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║             🎉 更新完成！                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📝 修复内容:${NC}"
echo -e "  ✅ 顶部搜索框现在可以直接创建分析任务"
echo -e "  ✅ 实时显示任务进度条（0% → 100%）"
echo -e "  ✅ 显示任务状态（爬取中 → 分析中 → 完成）"
echo -e "  ✅ 完成后自动显示报告卡片"
echo ""
if [ "$SERVER_IP" != "YOUR_SERVER_IP" ]; then
    echo -e "${CYAN}🌐 访问地址: ${GREEN}http://${SERVER_IP}:8089${NC}"
else
    echo -e "${CYAN}🌐 访问地址: ${GREEN}http://YOUR_SERVER_IP:8089${NC}"
fi
echo ""
echo -e "${CYAN}📋 使用说明:${NC}"
echo -e "  1. 打开前端页面"
echo -e "  2. 在顶部搜索框输入 ASIN（例如: B0CHWRXH8B）"
echo -e "  3. 点击 Search 按钮"
echo -e "  4. 等待进度条完成（约 1-3 分钟）"
echo -e "  5. 点击报告卡片查看完整分析结果"
echo ""
echo -e "${YELLOW}💡 提示: 您也可以点击右上角的 'Create Report' 按钮创建任务${NC}"
echo ""

