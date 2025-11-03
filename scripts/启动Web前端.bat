@echo off
chcp 65001 >nul
color 0B
title 即贸 Amazon评论分析系统 - Web前端

echo.
echo ╔════════════════════════════════════════════╗
echo ║   即贸 Amazon评论分析系统 - Web前端      ║
echo ╚════════════════════════════════════════════╝
echo.

REM 检查web目录
if not exist "web\" (
    echo ❌ 找不到web目录
    pause
    exit /b 1
)

cd web

REM 检查依赖
if not exist "node_modules\" (
    echo ⚠️ Web前端依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        cd ..
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
)

echo.
echo 🚀 正在启动Web前端服务...
echo 📌 访问地址: http://localhost:3002
echo.
echo ⚠️ 请勿关闭此窗口
echo ─────────────────────────────────────────────
echo.

REM 启动开发服务器
npm run dev

cd ..
pause



