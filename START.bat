@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║         🚀 Amazon Review Analysis System - Quick Start         ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js not found
    echo.
    echo Please install Node.js first: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js installed
node --version
echo.

REM Check .env file
if not exist ".env" (
    echo ❌ Error: .env file not found
    echo.
    echo Please create .env file:
    echo    1. Copy env.example to .env
    echo    2. Fill in GEMINI_API_KEY and RAPIDAPI_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ .env configuration found
echo.

REM Check backend dependencies
echo 📦 Checking backend dependencies...
if not exist "node_modules" (
    echo ⚠️  Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies ready
)
echo.

REM Check frontend dependencies
echo 📦 Checking frontend dependencies...
if not exist "web\node_modules" (
    echo ⚠️  Installing frontend dependencies...
    cd web
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies ready
)
echo.

echo ════════════════════════════════════════════════════════════════
echo.
echo 🎯 Select Startup Mode:
echo.
echo    [1] Standard Mode - Start Backend API (Recommended, for Chrome Extension)
echo    [2] Full Mode - Start Backend + Web Frontend (Demo/Development)
echo    [3] Frontend Only - Start Web UI (Backend must be running)
echo    [4] Exit
echo.
set /p choice="Please select (1-4): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto full
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto end
echo ❌ Invalid choice, please run again
pause
exit /b 1

:full
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 Starting Full System (Backend + Frontend)
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 Service Info:
echo    - Backend API : http://localhost:3001
echo    - Web Frontend: http://localhost:3002
echo.
echo 💡 Tips: 
echo    - Press Ctrl+C to stop services
echo    - Keep windows open while using
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause

REM Start backend in new window
start "Amazon Review Analysis - Backend" cmd /k "color 0B && npm start"

REM Wait 2 seconds for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend in new window
start "Amazon Review Analysis - Frontend" cmd /k "color 0E && cd web && npm run dev"

echo.
echo ✅ System started!
echo.
echo 📝 Service URLs:
echo    Backend Health Check: http://localhost:3001/api/health
echo    Web Frontend: http://localhost:3002
echo.
echo 🌐 Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:3002

echo.
echo 💡 Tip: Close service windows to stop services
echo.
pause
exit /b 0

:backend
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 Starting Backend API (Standard Mode)
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 Service Info:
echo    - API URL: http://localhost:3001
echo    - Health Check: http://localhost:3001/api/health
echo.
echo 📌 How to Use:
echo    1. Keep this window open (Backend service running)
echo    2. Open Chrome browser
echo    3. Visit any Amazon product page
echo    4. Click Chrome Extension icon
echo    5. Start analyzing reviews
echo.
echo 💡 Tips: 
echo    - Press Ctrl+C to stop service
echo    - First-time use: Install Chrome Extension first
echo.
echo ════════════════════════════════════════════════════════════════
echo.

npm start

goto end

:frontend
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 Starting Web Frontend
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 Frontend Info:
echo    - Frontend URL: http://localhost:3002
echo.
echo ⚠️  Note: Frontend requires Backend API (http://localhost:3001)
echo          Please make sure backend is running!
echo.
echo 💡 Tip: Press Ctrl+C to stop service
echo.
echo ════════════════════════════════════════════════════════════════
echo.

cd web
npm run dev

goto end

:end
exit /b 0

