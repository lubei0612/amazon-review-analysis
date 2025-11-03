@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║      🚀 Amazon Review Analysis System - Backend Service        ║
echo ╚════════════════════════════════════════════════════════════════╝
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
echo ════════════════════════════════════════════════════════════════
echo 🚀 Starting Backend Service...
echo ════════════════════════════════════════════════════════════════
echo.

npm start

