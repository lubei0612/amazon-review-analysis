@echo off
chcp 65001 >nul
color 0E
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🔄 重启后端服务 - Restart Backend Service            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo ════════════════════════════════════════════════════════════════
echo 📋 Step 1: Stopping All Services
echo ════════════════════════════════════════════════════════════════
echo.

echo 🛑 Terminating all Node.js processes...

REM 停止所有node进程
taskkill /F /IM node.exe >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node processes terminated successfully
) else (
    echo ⚠️  No Node processes found or already stopped
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ⏳ Step 2: Waiting for processes to clear...
echo ════════════════════════════════════════════════════════════════
echo.

timeout /t 3 /nobreak >nul
echo ✅ Wait complete

echo.
echo ════════════════════════════════════════════════════════════════
echo 🔍 Step 3: Verifying cleanup
echo ════════════════════════════════════════════════════════════════
echo.

tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Warning: Node processes still running
    echo    Attempting force cleanup...
    taskkill /F /IM node.exe >nul 2>nul
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ All Node processes cleared
)

echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 Step 4: Starting Backend Service
echo ════════════════════════════════════════════════════════════════
echo.

REM Check .env file
if not exist ".env" (
    echo ❌ Error: .env file not found
    echo.
    echo Please create .env file and configure API keys
    echo.
    pause
    exit /b 1
)

echo ✅ Configuration file found
echo.
echo 📋 Service Info:
echo    - API URL: http://localhost:3001
echo    - Health Check: http://localhost:3001/api/health
echo    - AI Engine: Gemini 2.5 Pro
echo.
echo 💡 IMPORTANT - 重要提示:
echo    请观察日志中是否显示以下内容（确认新版本）：
echo    ✅ "🎯 目标爬取数量: 全量（无限制）"
echo    ✅ "⚡ 爬取策略: 全量模式（不设上限）"
echo.
echo    如果没有看到上述日志，说明重启失败！
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 Starting Backend Service NOW...
echo ════════════════════════════════════════════════════════════════
echo.

npm start

