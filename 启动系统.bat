@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║           🚀 Amazon评论分析系统 - 一键启动                     ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
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
    echo ❌ 错误: 未找到 .env 配置文件
    echo.
    echo 请先创建 .env 文件:
    echo    1. 复制 env.example 为 .env
    echo    2. 填写 GEMINI_API_KEY 和 RAPIDAPI_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ .env 配置文件已找到
echo.

REM 检查后端依赖
echo 📦 检查后端依赖...
if not exist "node_modules" (
    echo ⚠️  后端依赖未安装，正在安装...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 后端依赖安装完成
) else (
    echo ✅ 后端依赖已安装
)
echo.

REM 检查Web前端依赖
echo 📦 检查Web前端依赖...
if not exist "web\node_modules" (
    echo ⚠️  前端依赖未安装，正在安装...
    cd web
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 前端依赖安装完成
) else (
    echo ✅ 前端依赖已安装
)
echo.

echo ════════════════════════════════════════════════════════════════
echo.
echo 🎯 启动模式选择:
echo.
echo    [1] 标准模式 - 启动后端API（推荐，配合Chrome插件使用）
echo    [2] 完整模式 - 启动后端 + Web前端（开发/演示用）
echo    [3] 仅前端   - 只启动Web界面（需要后端已运行）
echo    [4] 退出
echo.
set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto full
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto end
echo ❌ 无效选择，请重新运行
pause
exit /b 1

:full
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 启动完整系统 (后端 + 前端)
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 启动信息:
echo    - 后端 API : http://localhost:3001
echo    - Web 前端 : http://localhost:3002
echo.
echo 💡 提示: 
echo    - 按 Ctrl+C 可以停止服务
echo    - 请保持此窗口打开
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause

REM 启动后端（在新窗口）
start "Amazon评论分析 - 后端服务" cmd /k "color 0B && npm start"

REM 等待2秒让后端启动
timeout /t 2 /nobreak >nul

REM 启动前端（在新窗口）
start "Amazon评论分析 - Web前端" cmd /k "color 0E && cd web && npm run dev"

echo.
echo ✅ 系统已启动！
echo.
echo 📝 服务地址:
echo    后端健康检查: http://localhost:3001/api/health
echo    Web前端界面: http://localhost:3002
echo.
echo 🌐 正在打开浏览器...
timeout /t 3 /nobreak >nul
start http://localhost:3002

echo.
echo 💡 提示: 关闭各个服务窗口即可停止服务
echo.
pause
exit /b 0

:backend
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 启动后端 API 服务 (标准模式)
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 服务信息:
echo    - API 地址: http://localhost:3001
echo    - 健康检查: http://localhost:3001/api/health
echo.
echo 📌 使用方式:
echo    1. 保持此窗口打开（后端服务运行中）
echo    2. 打开 Chrome 浏览器
echo    3. 访问任意 Amazon 产品页面
echo    4. 点击 Chrome 扩展图标
echo    5. 开始分析评论
echo.
echo 💡 提示: 
echo    - 按 Ctrl+C 可以停止服务
echo    - 首次使用需要先安装 Chrome 扩展
echo.
echo ════════════════════════════════════════════════════════════════
echo.

npm start

goto end

:frontend
echo.
echo ════════════════════════════════════════════════════════════════
echo 🚀 启动 Web 前端界面
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 服务信息:
echo    - 前端地址: http://localhost:3002
echo.
echo ⚠️  注意: 前端需要后端API支持，请确保后端已启动
echo.
echo 💡 提示: 按 Ctrl+C 可以停止服务
echo.
echo ════════════════════════════════════════════════════════════════
echo.

cd web
npm run dev

goto end

:end
exit /b 0

