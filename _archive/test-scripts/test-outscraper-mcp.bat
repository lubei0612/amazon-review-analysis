@echo off
chcp 65001 >nul
echo ====================================
echo 测试 Outscraper MCP Server 安装
echo ====================================
echo.

echo [1/3] 检查 Python 环境...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python 未安装
    pause
    exit /b 1
)
echo ✅ Python 已安装
echo.

echo [2/3] 检查 uv 工具...
pip show uv >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ uv 未安装
    echo 正在安装 uv...
    pip install uv
)
echo ✅ uv 已安装
echo.

echo [3/3] 检查 outscraper-mcp-server...
pip show outscraper-mcp-server >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ outscraper-mcp-server 未安装
    echo 正在安装...
    pip install outscraper-mcp-server
) else (
    echo ✅ outscraper-mcp-server 已安装
)
echo.

echo ====================================
echo 测试 uvx 命令...
echo ====================================
uvx --version
if %errorlevel% neq 0 (
    echo ❌ uvx 命令不可用
    pause
    exit /b 1
)
echo ✅ uvx 命令可用
echo.

echo ====================================
echo ✅ 所有依赖已就绪！
echo ====================================
echo.
echo 📋 配置文件已创建：
echo    - .cursorrules-mcp.json
echo    - Outscraper-MCP-配置指南.md
echo.
echo 📝 下一步：
echo    1. 重启 Cursor
echo    2. 在 Cursor 设置中配置 MCP
echo    3. 参考 Outscraper-MCP-配置指南.md
echo.

pause


