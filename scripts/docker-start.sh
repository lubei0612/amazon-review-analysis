#!/bin/bash

# ===================================
# Docker环境快速启动脚本
# ===================================

echo "========================================="
echo "   Amazon评论分析系统 - Docker启动"
echo "========================================="
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    echo "   访问: https://www.docker.com/get-started"
    exit 1
fi

# 检查docker-compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose未安装，请先安装docker-compose"
    exit 1
fi

# 检查.env文件是否存在
if [ ! -f .env ]; then
    echo "⚠️  未找到.env文件，正在创建..."
    
    # 检查是否有env.example
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ 已从env.example创建.env文件"
    else
        echo "❌ 未找到env.example模板文件"
        echo "   请手动创建.env文件并配置API密钥"
        exit 1
    fi
    
    echo ""
    echo "⚠️  请编辑.env文件，填写以下必填项："
    echo "   - GEMINI_API_KEY (AI分析服务密钥)"
    echo "   - APIFY_API_TOKEN (爬虫服务密钥)"
    echo ""
    read -p "是否已完成配置？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "请配置完成后再次运行此脚本"
        exit 1
    fi
fi

echo "1️⃣  检查环境变量..."
if ! grep -q "GEMINI_API_KEY=.*[a-zA-Z0-9]" .env; then
    echo "❌ GEMINI_API_KEY未配置"
    exit 1
fi
if ! grep -q "APIFY_API_TOKEN=.*[a-zA-Z0-9]" .env; then
    echo "❌ APIFY_API_TOKEN未配置"
    exit 1
fi
echo "✅ 环境变量配置正确"
echo ""

echo "2️⃣  构建Docker镜像..."
docker-compose build
if [ $? -ne 0 ]; then
    echo "❌ Docker镜像构建失败"
    exit 1
fi
echo "✅ 镜像构建完成"
echo ""

echo "3️⃣  启动服务..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "❌ 服务启动失败"
    exit 1
fi
echo "✅ 服务启动成功"
echo ""

echo "4️⃣  等待服务就绪..."
sleep 5

# 检查后端服务
echo "   检查后端服务..."
for i in {1..10}; do
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "   ✅ 后端服务运行正常"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "   ⚠️  后端服务未响应，请检查日志: docker-compose logs backend"
    fi
    sleep 2
done

# 检查前端服务
echo "   检查前端服务..."
for i in {1..10}; do
    if curl -s http://localhost:3002 > /dev/null; then
        echo "   ✅ 前端服务运行正常"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "   ⚠️  前端服务未响应，请检查日志: docker-compose logs frontend"
    fi
    sleep 2
done

echo ""
echo "========================================="
echo "   ✅ 系统启动完成！"
echo "========================================="
echo ""
echo "📌 访问地址："
echo "   后端API:  http://localhost:3001"
echo "   Web前端:  http://localhost:3002"
echo ""
echo "📊 常用命令："
echo "   查看日志:   docker-compose logs -f"
echo "   停止服务:   docker-compose stop"
echo "   重启服务:   docker-compose restart"
echo "   完全清理:   docker-compose down"
echo ""
echo "🔍 健康检查："
echo "   curl http://localhost:3001/api/health"
echo ""

