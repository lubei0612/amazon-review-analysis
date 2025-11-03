@echo off
chcp 65001 >nul
title RapidAPI 快速测试

echo ============================================================
echo 🧪 RapidAPI 修复验证 - 快速测试
echo ============================================================
echo.

REM 检查.env文件是否存在
if not exist .env (
    echo ⚠️  .env 文件不存在，正在创建...
    echo.
    copy env.example .env >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ 创建失败，请手动复制 env.example 为 .env
        pause
        exit /b 1
    )
    echo ✅ .env 文件已创建
    echo.
    echo 📝 请先编辑 .env 文件，填写以下必需的配置：
    echo.
    echo    1. RAPIDAPI_KEY=你的RapidAPI密钥
    echo    2. GEMINI_API_KEY=你的Gemini密钥（可选）
    echo.
    echo 💡 提示：
    echo    - RapidAPI密钥获取：https://rapidapi.com/
    echo    - 订阅API：Real-Time Amazon Data
    echo.
    echo 配置完成后，再次运行此脚本
    echo.
    pause
    notepad .env
    exit /b 0
)

echo ✅ 找到 .env 文件
echo.

REM 检查RAPIDAPI_KEY是否配置
findstr /C:"RAPIDAPI_KEY=your_" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ RAPIDAPI_KEY 未配置（仍是默认值）
    echo.
    echo 请编辑 .env 文件，将：
    echo    RAPIDAPI_KEY=your_rapidapi_key_here
    echo 改为：
    echo    RAPIDAPI_KEY=你的真实密钥
    echo.
    pause
    notepad .env
    exit /b 1
)

findstr /C:"RAPIDAPI_KEY=$" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ RAPIDAPI_KEY 为空
    echo.
    echo 请编辑 .env 文件并填写真实的API密钥
    echo.
    pause
    notepad .env
    exit /b 1
)

echo ✅ RAPIDAPI_KEY 已配置
echo.

echo 🚀 开始运行测试...
echo.
echo ============================================================
echo.

REM 运行测试脚本
node test-rapid-api.js

echo.
echo ============================================================
echo.

if %errorlevel% equ 0 (
    echo ✅ 测试完成！
    echo.
    echo 📊 测试结果：RapidAPI 工作正常
    echo.
    echo 下一步：
    echo    1. 启动完整系统：运行 快速启动.bat
    echo    2. 查看Web界面：http://localhost:3002
    echo    3. 测试Chrome扩展
    echo.
) else (
    echo ❌ 测试失败
    echo.
    echo 请检查：
    echo    1. RAPIDAPI_KEY 是否正确
    echo    2. RapidAPI 订阅是否有效
    echo    3. API 配额是否充足
    echo.
    echo 💡 查看详细的测试指南：RapidAPI测试指南.md
    echo.
)

pause


