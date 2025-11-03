@echo off
chcp 65001 > nul
echo ========================================
echo 🧪 RapidAPI 独立测试
echo ========================================
echo.
echo 说明：此脚本仅测试RapidAPI爬虫
echo       不会使用Outscraper或Puppeteer
echo.
echo ========================================
echo.

REM 检查 .env 文件是否存在
if not exist ".env" (
    echo ❌ 错误：.env 文件不存在
    echo.
    echo 📝 请先创建 .env 文件：
    echo    1. 执行：copy env.example .env
    echo    2. 编辑 .env 文件，填写 RAPIDAPI_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ 发现 .env 文件
echo.
echo 🚀 开始测试...
echo.

node test-rapid-api-only.js

echo.
echo ========================================
pause

