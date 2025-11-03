@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🚀 Amazon评论分析系统 - 后端服务                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM 检查.env文件
if not exist ".env" (
    echo ❌ 错误: 未找到 .env 配置文件
    echo.
    echo 请先创建 .env 文件并配置 API 密钥
    echo.
    pause
    exit /b 1
)

echo ✅ 配置文件已找到
echo.
echo 📋 服务信息:
echo    - API 地址: http://localhost:3001
echo    - 健康检查: http://localhost:3001/api/health
echo    - AI引擎: Gemini 2.5 Pro
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 正在启动后端服务...
echo ════════════════════════════════════════════════════════════════
echo.

npm start

