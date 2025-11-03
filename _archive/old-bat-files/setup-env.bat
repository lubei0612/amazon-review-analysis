@echo off
chcp 65001 >nul
echo ================================================
echo 环境配置工具 - Amazon评论分析系统
echo ================================================
echo.

REM 检查 .env 文件是否已存在
if exist .env (
    echo ✓ .env 文件已存在
    echo.
    choice /C YN /M "是否覆盖现有配置"
    if errorlevel 2 (
        echo 取消操作
        pause
        exit /b
    )
)

echo 正在创建 .env 配置文件...
echo.

REM 创建 .env 文件
(
echo # ========================
echo # Amazon评论分析系统 - 环境配置
echo # ========================
echo.
echo # ========================
echo # Groq AI配置 ^(必填^)
echo # ========================
echo GROQ_API_KEY=your_groq_api_key_here
echo GROQ_MODEL=llama-3.1-70b-versatile
echo GROQ_TEMPERATURE=0.3
echo GROQ_MAX_TOKENS=8000
echo.
echo # ========================
echo # 服务器配置
echo # ========================
echo PORT=3000
echo NODE_ENV=development
echo.
echo # ========================
echo # RapidAPI配置^(可选 - 用于快速爬取^)
echo # ========================
echo # RAPIDAPI_KEY=your_rapidapi_key_here
echo # RAPIDAPI_HOST=real-time-amazon-data.p.rapidapi.com
) > .env

echo ✓ .env 文件创建成功！
echo.
echo ================================================
echo 下一步操作：
echo ================================================
echo.
echo 1. 获取 Groq API Key：
echo    访问 https://console.groq.com/
echo    登录并创建 API Key
echo.
echo 2. 编辑 .env 文件：
echo    将 your_groq_api_key_here 替换为实际的 API Key
echo.
echo 3. 保存文件并重启服务器
echo.
echo ================================================
echo.

choice /C YN /M "是否立即打开 .env 文件进行编辑"
if errorlevel 2 (
    echo 稍后请手动编辑 .env 文件
    pause
    exit /b
)

echo.
echo 正在打开 .env 文件...
notepad .env

echo.
echo 完成！请确保已填写 GROQ_API_KEY
pause















































