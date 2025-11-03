@echo off
chcp 65001 >nul
color 0A
title 即贸 Amazon评论分析系统 - 快速启动

echo.
echo ╔════════════════════════════════════════════╗
echo ║   即贸 Amazon评论分析系统 - 快速启动     ║
echo ╚════════════════════════════════════════════╝
echo.

REM 停止旧进程
echo [1/3] 停止旧进程...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo    ✅ 清理完成
echo.

REM 启动后端
echo [2/3] 启动后端服务...
start "Amazon评论分析-后端" cmd /c "npm start"
echo    ✅ 后端已启动（新窗口）
echo    📌 地址: http://localhost:3001
echo.

REM 等待后端启动
echo [3/3] 等待服务就绪（5秒）...
timeout /t 5 /nobreak >nul
echo.

REM 询问是否启动Web前端
set /p START_WEB="是否启动Web前端? (Y/N): "
if /i "%START_WEB%"=="Y" (
    echo.
    echo 🚀 启动Web前端...
    start "Amazon评论分析-Web前端" cmd /c "cd web && npm run dev"
    echo    ✅ Web前端已启动（新窗口）
    echo    📌 地址: http://localhost:3002
)

echo.
echo ═══════════════════════════════════════════════
echo 🎉 启动完成！
echo.
echo 📝 访问地址：
echo    • 后端API: http://localhost:3001
echo    • Web前端: http://localhost:3002
echo.
echo 💡 提示：
echo    • 请勿关闭后端和Web前端的窗口
echo    • 运行 "停止所有服务.bat" 可停止所有服务
echo ═══════════════════════════════════════════════
echo.
pause



