@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo    Amazon评论分析系统 - Docker部署
echo ========================================
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker未安装！
    echo.
    echo 请先安装Docker Desktop:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

echo ✅ Docker已安装
docker --version
echo.

REM 检查.env文件
if not exist .env (
    echo ❌ 未找到.env文件！
    echo.
    echo 请先创建.env文件并配置API密钥
    echo 参考: env.example
    echo.
    pause
    exit /b 1
)

echo ✅ .env文件已找到
echo.

REM 检查必需的API密钥
findstr /C:"GEMINI_API_KEY=sk-" .env >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ GEMINI_API_KEY未配置！
    echo 请在.env文件中配置 GEMINI_API_KEY
    pause
    exit /b 1
)

findstr /C:"APIFY_API_TOKEN=apify_api" .env >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ APIFY_API_TOKEN未配置！
    echo 请在.env文件中配置 APIFY_API_TOKEN
    pause
    exit /b 1
)

echo ✅ API密钥已配置
echo.

echo ========================================
echo    步骤 1/3: 构建Docker镜像
echo ========================================
echo.
docker-compose build
if %errorlevel% neq 0 (
    echo ❌ Docker镜像构建失败！
    pause
    exit /b 1
)

echo.
echo ✅ 镜像构建完成
echo.

echo ========================================
echo    步骤 2/3: 启动服务
echo ========================================
echo.
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ 服务启动失败！
    pause
    exit /b 1
)

echo.
echo ✅ 服务已启动
echo.

echo ========================================
echo    步骤 3/3: 健康检查
echo ========================================
echo.
echo 等待服务就绪...
timeout /t 5 /nobreak >nul

REM 检查后端服务
echo 检查后端服务...
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务运行正常
) else (
    echo ⚠️  后端服务未响应（可能还在启动中）
)
echo.

REM 检查前端服务
echo 检查前端服务...
curl -s http://localhost:3002 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行正常
) else (
    echo ⚠️  前端服务未响应（可能还在启动中）
)
echo.

echo ========================================
echo    ✅ 部署完成！
echo ========================================
echo.
echo 📌 访问地址:
echo    后端API:  http://localhost:3001
echo    Web前端:  http://localhost:3002
echo.
echo 📊 常用命令:
echo    查看日志:   docker-compose logs -f
echo    停止服务:   docker-compose stop
echo    重启服务:   docker-compose restart
echo    完全清理:   docker-compose down
echo.
echo 🔍 健康检查:
echo    curl http://localhost:3001/api/health
echo.
pause

