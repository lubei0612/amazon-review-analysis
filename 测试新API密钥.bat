@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              🧪 测试新的 Apify API 密钥                        ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version
echo.

REM 检查.env文件
if not exist ".env" (
    echo ❌ 错误: .env 文件不存在
    pause
    exit /b 1
)

echo ✅ .env 配置文件存在
echo.

REM 显示当前API密钥（部分）
echo 📋 当前配置的API密钥:
findstr "APIFY_API_TOKEN" .env
echo.

REM 检查依赖
if not exist "node_modules" (
    echo ⚠️  正在安装依赖...
    call npm install
    echo.
)

echo ════════════════════════════════════════════════════════════════
echo 🚀 开始测试 Apify API...
echo ════════════════════════════════════════════════════════════════
echo.
echo 测试内容:
echo   - 验证API密钥是否有效
echo   - 爬取 20 条评论（快速测试）
echo   - 测试产品: AirPods Pro 2 (B0CHWRXH8B)
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause

REM 运行测试脚本
node test-new-apify.js

echo.
echo ════════════════════════════════════════════════════════════════
echo.

if %errorlevel% equ 0 (
    echo ✅ 测试成功！新的 API 密钥工作正常
    echo.
    echo 🎯 下一步:
    echo    1. 运行 START.bat 启动完整系统
    echo    2. 或者使用 Chrome 扩展进行测试
    echo.
) else (
    echo ❌ 测试失败！请检查:
    echo    1. API 密钥是否正确
    echo    2. 网络连接是否正常
    echo    3. Apify 账户余额是否充足
    echo.
    echo 💡 查看 Apify 控制台:
    echo    https://console.apify.com/account/integrations
    echo.
)

pause
