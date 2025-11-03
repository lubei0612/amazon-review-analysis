@echo off
chcp 65001 >nul
color 0C
title 停止所有服务

echo.
echo ╔════════════════════════════════════════════╗
echo ║   停止所有服务                             ║
echo ╚════════════════════════════════════════════╝
echo.

echo 正在停止所有Node.js进程...
taskkill /F /IM node.exe >nul 2>&1

if errorlevel 1 (
    echo ⚠️ 没有运行中的Node.js进程
) else (
    echo ✅ 已停止所有Node.js进程
)

echo.
echo 完成！
timeout /t 2 >nul



