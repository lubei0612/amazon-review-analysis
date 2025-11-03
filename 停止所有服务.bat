@echo off
chcp 65001 >nul
color 0C
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          ⛔ 停止所有 Amazon 评论分析服务                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 🔍 正在查找运行中的服务...
echo.

REM 查找并终止占用3001端口的进程（后端）
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo 📍 发现后端服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ 后端服务已停止
    )
)

REM 查找并终止占用3002端口的进程（前端）
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002 ^| findstr LISTENING') do (
    echo 📍 发现前端服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ 前端服务已停止
    )
)

REM 查找并终止占用5173端口的进程（Vite默认端口）
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo 📍 发现Vite开发服务 (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Vite服务已停止
    )
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ✅ 服务停止完成！
echo ════════════════════════════════════════════════════════════════
echo.
pause

