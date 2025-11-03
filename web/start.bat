@echo off
chcp 65001 >nul
echo ========================================
echo   即贸 Amazon评论分析工具 - Web端
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查Node.js环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js已安装: 
node -v
echo.

echo [2/3] 检查依赖是否已安装...
if not exist "node_modules\" (
    echo [!] 依赖未安装，正在安装依赖包...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    echo.
    echo [✓] 依赖安装完成！
) else (
    echo [✓] 依赖已存在
)
echo.

echo [3/3] 启动开发服务器...
echo.
echo ========================================
echo   服务器启动中...
echo   访问地址: http://localhost:3000
echo ========================================
echo.
echo [提示] 按 Ctrl+C 可停止服务器
echo.

call npm run dev

pause

