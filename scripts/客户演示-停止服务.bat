@echo off
chcp 65001 >nul
color 0C
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║         🛑 Amazon评论分析系统 - 停止所有服务                    ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📌 功能说明:
echo    - 停止后端API服务 (端口3001)
echo    - 停止Web详细报告服务 (端口3002)
echo    - 清理所有Node.js进程
echo.
echo ════════════════════════════════════════════════════════════════
echo.

echo ⚠️  确认操作:
echo.
echo    此操作将停止以下服务:
echo    - 【后端API】Amazon评论分析系统
echo    - 【Web报告】Amazon评论分析系统
echo.
set /p confirm="是否确认停止所有服务? (Y/N): "

if /i not "%confirm%"=="Y" (
    echo.
    echo ✅ 操作已取消
    echo.
    pause
    exit /b 0
)

echo.
echo ════════════════════════════════════════════════════════════════
echo 🔄 正在停止服务...
echo ════════════════════════════════════════════════════════════════
echo.

REM 尝试停止所有Node.js进程
echo 🛑 正在停止Node.js进程...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js进程已停止
) else (
    echo ⚠️  未找到运行中的Node.js进程
)

echo.

REM 等待1秒确保进程已停止
timeout /t 1 /nobreak >nul

REM 再次检查是否还有残留进程
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I "node.exe" >NUL
if %errorlevel% equ 0 (
    echo ⚠️  检测到残留的Node.js进程，再次尝试停止...
    taskkill /F /IM node.exe >nul 2>&1
    timeout /t 1 /nobreak >nul
    
    REM 第三次检查
    tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I "node.exe" >NUL
    if %errorlevel% equ 0 (
        echo ❌ 警告: 仍有Node.js进程未能停止
        echo    请手动打开任务管理器检查
        echo.
        pause
    ) else (
        echo ✅ 所有Node.js进程已成功停止
    )
) else (
    echo ✅ 所有服务已成功停止
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ✅ 服务停止完成
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 已停止的服务:
echo    ├─ 后端API (端口3001)
echo    ├─ Web报告 (端口3002)
echo    └─ 所有相关Node.js进程
echo.
echo 💡 提示:
echo    - 下次使用时，运行"客户演示-一键启动.bat"即可
echo    - 如需手动启动，运行"START.bat"选择启动模式
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
exit /b 0

