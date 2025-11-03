@echo off
chcp 65001 >nul
title 启动Amazon评论分析系统 - Outscraper集成版

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║   🚀 Amazon评论分析系统 - 完整Demo                   ║
echo ║      Outscraper集成版                                 ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

:: 停止所有Node进程
echo [1/3] 🛑 停止现有服务...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ 已清理所有Node进程
echo.

:: 启动后端
echo [2/3] 🚀 启动后端服务器...
start "Amazon评论分析-后端" /MIN cmd /c "npm run start"
timeout /t 3 /nobreak >nul
echo ✅ 后端已启动（端口:3001）
echo.

:: 启动前端
echo [3/3] 🎨 启动前端界面...
cd web
start "Amazon评论分析-前端" /MIN cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
cd ..
echo ✅ 前端已启动（端口:5173）
echo.

echo ╔════════════════════════════════════════════════════════╗
echo ║  ✅ 系统启动完成！                                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📌 访问地址:
echo    前端: http://localhost:5173
echo    后端: http://localhost:3001
echo.
echo 💡 使用说明:
echo    1. 打开前端页面（会自动打开浏览器）
echo    2. 在输入框输入任意Amazon产品ASIN
echo    3. 点击"开始分析"
echo    4. 等待30-60秒获取完整分析报告
echo.
echo 🎯 Demo优势:
echo    ✅ 使用Outscraper专业爬虫（快速可靠）
echo    ✅ 自动清理数据（移除JS/CSS代码）
echo    ✅ Gemini AI深度分析（6个维度）
echo    ✅ 精美报告展示（适合演示）
echo.
echo 🔧 停止服务: 运行 停止所有服务.bat
echo.

pause



