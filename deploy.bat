@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM Amazon评论分析系统 - 一键部署脚本 (Windows)
REM ========================================

echo =========================================
echo   Amazon评论分析系统 - Docker部署
echo =========================================
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker未安装，请先安装Docker Desktop
    echo    下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查Docker Compose是否安装
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose未安装
    pause
    exit /b 1
)

echo ✅ Docker 和 Docker Compose 已安装
echo.

REM 检查.env文件
if not exist ".env" (
    echo ⚠️  .env文件不存在，正在创建...
    copy env.example .env >nul
    echo ✅ 已创建.env文件
    echo.
    echo ⚠️  请编辑 .env 文件，填入真实的API密钥：
    echo    - GEMINI_API_KEY
    echo    - APIFY_API_TOKEN
    echo.
    echo 编辑完成后，再次运行此脚本
    pause
    exit /b 0
)

echo 🔍 检查API密钥配置...

REM 验证API密钥
findstr /C:"GEMINI_API_KEY=your_gemini_api_key_here" .env >nul
if not errorlevel 1 (
    echo ❌ GEMINI_API_KEY未配置
    echo    请编辑 .env 文件，填入真实的Gemini API密钥
    pause
    exit /b 1
)

findstr /C:"APIFY_API_TOKEN=your_apify_token_here" .env >nul
if not errorlevel 1 (
    echo ❌ APIFY_API_TOKEN未配置
    echo    请编辑 .env 文件，填入真实的Apify API Token
    pause
    exit /b 1
)

echo ✅ API密钥配置正确
echo.

REM 停止旧容器
echo 🔄 停止旧容器...
docker-compose down 2>nul
echo.

REM 构建镜像
echo 🔨 构建Docker镜像...
docker-compose build --no-cache
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo.

REM 启动服务
echo 🚀 启动服务...
docker-compose up -d
if errorlevel 1 (
    echo ❌ 启动失败
    pause
    exit /b 1
)
echo.

REM 等待服务启动
echo ⏳ 等待服务启动（约10秒）...
timeout /t 10 /nobreak >nul
echo.

REM 检查服务状态
echo 📊 检查服务状态...
docker-compose ps
echo.

REM 健康检查
echo 🏥 健康检查...

curl -s http://localhost:3001/api/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ 后端服务正常 (http://localhost:3001)
) else (
    echo ⚠️  后端服务未响应，请查看日志: docker-compose logs backend
)

curl -s http://localhost:3002 >nul 2>&1
if not errorlevel 1 (
    echo ✅ 前端服务正常 (http://localhost:3002)
) else (
    echo ⚠️  前端服务未响应，请查看日志: docker-compose logs frontend
)

echo.
echo =========================================
echo   🎉 部署完成！
echo =========================================
echo.
echo 访问地址：
echo   - 前端: http://localhost:3002
echo   - 后端: http://localhost:3001
echo.
echo 常用命令：
echo   查看日志: docker-compose logs -f
echo   停止服务: docker-compose stop
echo   重启服务: docker-compose restart
echo   删除容器: docker-compose down
echo.
echo 详细文档: docs\PRODUCTION-DEPLOYMENT.md
echo.

REM 询问是否打开浏览器
set /p open="是否现在打开前端页面？(Y/N): "
if /i "%open%"=="Y" (
    start http://localhost:3002
)

pause




