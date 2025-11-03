@echo off
chcp 65001 >nul
color 0C
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          ⛔ Stop All Amazon Review Analysis Services          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Finding running services...
echo.

REM Kill processes on port 3001 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo 📍 Found backend service (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Backend service stopped
    )
)

REM Kill processes on port 3002 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002 ^| findstr LISTENING') do (
    echo 📍 Found frontend service (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Frontend service stopped
    )
)

REM Kill processes on port 5173 (Vite default)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo 📍 Found Vite dev service (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Vite service stopped
    )
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ✅ All services stopped!
echo ════════════════════════════════════════════════════════════════
echo.
pause

