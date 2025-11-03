@echo off
chcp 65001 >nul
color 0E
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║     🎯 Amazon评论分析系统 - 客户演示版 (一键启动)              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📌 功能说明:
echo    - 自动启动后端API服务 (Chrome扩展所需)
echo    - 自动启动Web详细报告页面 (客户演示专用)
echo    - 自动打开浏览器访问报告页面
echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装Node.js
    echo.
    echo 请先安装Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js已安装: 
node --version
echo.

REM 检查.env配置
if not exist ".env" (
    echo ❌ 错误: 未找到.env配置文件
    echo.
    echo 请创建.env文件:
    echo    1. 复制env.example为.env
    echo    2. 填写GEMINI_API_KEY和RAPIDAPI_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ .env配置文件已找到
echo.

REM 检查后端依赖
echo 📦 检查后端依赖...
if not exist "node_modules" (
    echo ⚠️  正在安装后端依赖，请稍候...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 后端依赖安装完成
) else (
    echo ✅ 后端依赖已就绪
)
echo.

REM 检查前端依赖
echo 📦 检查前端依赖...
if not exist "web\node_modules" (
    echo ⚠️  正在安装前端依赖，请稍候...
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
    echo ✅ 前端依赖已就绪
)
echo.

echo ════════════════════════════════════════════════════════════════
echo 🚀 正在启动系统...
echo ════════════════════════════════════════════════════════════════
echo.

REM 启动后端（新窗口）
echo 📡 启动后端API服务...
start "【后端API】Amazon评论分析系统" cmd /k "color 0B && echo 🚀 后端API服务运行中... && echo. && echo 📌 API地址: http://localhost:3001 && echo 📌 健康检查: http://localhost:3001/api/health && echo. && echo 💡 提示: 不要关闭此窗口! && echo. && npm start"

REM 等待后端启动（5秒）
echo ⏳ 等待后端服务启动中...
timeout /t 5 /nobreak >nul

REM 检查后端是否启动成功
echo 🔍 检查后端服务状态...
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务已成功启动
) else (
    echo ⚠️  后端服务可能还在启动中，继续...
)
echo.

REM 启动前端（新窗口）
echo 🌐 启动Web详细报告页面...
start "【Web报告】Amazon评论分析系统" cmd /k "color 0E && echo 🌐 Web报告页面运行中... && echo. && echo 📌 报告地址: http://localhost:3002 && echo. && echo 💡 提示: 不要关闭此窗口! && echo. && cd web && npm run dev"

REM 等待前端启动（8秒）
echo ⏳ 等待Web报告页面启动中...
timeout /t 8 /nobreak >nul

echo.
echo ════════════════════════════════════════════════════════════════
echo ✅ 系统启动完成！
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 服务地址:
echo    ├─ 后端API: http://localhost:3001
echo    ├─ API健康检查: http://localhost:3001/api/health
echo    └─ Web详细报告: http://localhost:3002
echo.
echo 📌 使用说明:
echo.
echo    【方式1】Chrome扩展 + Web报告 (推荐用于客户演示)
echo    ────────────────────────────────────────────────
echo    1. 打开Chrome浏览器
echo    2. 访问任意Amazon产品页面
echo    3. 点击Chrome扩展图标，开始分析
echo    4. 分析完成后，点击"查看完整报告"按钮
echo    5. 自动跳转到Web详细报告页面 (localhost:3002)
echo.
echo    【方式2】直接访问Web报告页面
echo    ────────────────────────────────────────────────
echo    - 首页: http://localhost:3002
echo    - 创建分析: http://localhost:3002/#/create
echo.
echo 💡 客户演示建议:
echo    - 先用Chrome扩展快速演示评论抓取
echo    - 然后展示Web报告的详细分析和数据可视化
echo    - Web报告包含完整的6大维度分析图表
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 🌐 正在自动打开Web报告页面...
timeout /t 2 /nobreak >nul
start http://localhost:3002

echo.
echo ✅ 浏览器已打开！
echo.
echo ⚠️  重要提示:
echo    - 请保持【后端API】和【Web报告】两个窗口打开
echo    - 关闭任一窗口将停止对应服务
echo    - 按任意键关闭此窗口（不影响服务运行）
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
exit /b 0

