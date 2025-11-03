@echo off
chcp 65001 >nul
title 项目文件整理
color 0B

echo.
echo ╔════════════════════════════════════════════╗
echo ║   项目文件整理脚本                         ║
echo ╚════════════════════════════════════════════╝
echo.

echo 📋 步骤1: 创建必要的目录...
if not exist "scripts" mkdir scripts
if not exist "tests" mkdir tests
if not exist "docs\guides" mkdir docs\guides
if not exist "docs\api" mkdir docs\api
if not exist "docs\archive" mkdir docs\archive
echo    ✅ 目录创建完成
echo.

echo 📋 步骤2: 移动核心bat文件到scripts目录...

REM 检查并移动文件（如果存在）
if exist "快速启动.bat" (
    move "快速启动.bat" "scripts\" >nul 2>&1
    echo    ✅ 快速启动.bat
)

if exist "启动Web前端.bat" (
    move "启动Web前端.bat" "scripts\" >nul 2>&1
    echo    ✅ 启动Web前端.bat
)

if exist "停止所有服务.bat" (
    move "停止所有服务.bat" "scripts\" >nul 2>&1
    echo    ✅ 停止所有服务.bat
)

if exist "快速测试-RapidAPI独立版.bat" (
    move "快速测试-RapidAPI独立版.bat" "scripts\快速测试-RapidAPI.bat" >nul 2>&1
    echo    ✅ 快速测试-RapidAPI.bat
)

echo.
echo 📋 步骤3: 归档旧的bat文件...

REM 移动旧bat文件到archive
if exist "一键启动-客户版.bat" move "一键启动-客户版.bat" "_archive\old-bat-files\" >nul 2>&1
if exist "快速测试-RapidAPI.bat" move "快速测试-RapidAPI.bat" "_archive\old-bat-files\" >nul 2>&1
if exist "快速测试-logger修复.bat" move "快速测试-logger修复.bat" "_archive\old-bat-files\" >nul 2>&1
if exist "快速验证-API健康检查.bat" move "快速验证-API健康检查.bat" "_archive\old-bat-files\" >nul 2>&1
if exist "快速验证-评论保留率.bat" move "快速验证-评论保留率.bat" "_archive\old-bat-files\" >nul 2>&1
if exist "清理临时文件.bat" move "清理临时文件.bat" "_archive\old-bat-files\" >nul 2>&1

echo    ✅ 旧文件已归档
echo.

echo 📋 步骤4: 移动测试文件到tests目录...

if exist "test-rapid-api.js" move "test-rapid-api.js" "tests\" >nul 2>&1
if exist "test-rapid-api-only.js" move "test-rapid-api-only.js" "tests\" >nul 2>&1

echo    ✅ 测试文件已移动
echo.

echo 📋 步骤5: 整理文档...

REM 移动指南类文档
if exist "QUICK-START-AFTER-FIXES.md" move "QUICK-START-AFTER-FIXES.md" "docs\guides\" >nul 2>&1
if exist "RapidAPI测试指南.md" move "RapidAPI测试指南.md" "docs\guides\" >nul 2>&1
if exist "RapidAPI配置与测试完整指南.md" move "RapidAPI配置与测试完整指南.md" "docs\guides\" >nul 2>&1
if exist "USER-GUIDE-WEB-CREATE.md" move "USER-GUIDE-WEB-CREATE.md" "docs\guides\" >nul 2>&1

REM 移动历史文档
if exist "Outscraper集成完成-操作指南.md" move "Outscraper集成完成-操作指南.md" "docs\archive\" >nul 2>&1
if exist "修改前后对比-评论提取优化.md" move "修改前后对比-评论提取优化.md" "docs\archive\" >nul 2>&1
if exist "客户交付清单-DEMO版.md" move "客户交付清单-DEMO版.md" "docs\archive\" >nul 2>&1
if exist "项目理解-Amazon评论分析系统.md" move "项目理解-Amazon评论分析系统.md" "docs\" >nul 2>&1

echo    ✅ 文档已整理
echo.

echo ═══════════════════════════════════════════════
echo 🎉 项目整理完成！
echo.
echo 📁 新的目录结构：
echo    • scripts/       - 启动和测试脚本
echo    • tests/         - 测试文件
echo    • docs/          - 技术文档
echo    • docs/guides/   - 用户指南
echo    • docs/archive/  - 历史文档
echo    • _archive/      - 旧文件归档
echo.
echo 💡 提示：
echo    • 启动脚本已移到 scripts/ 目录
echo    • 运行 scripts\快速启动.bat 启动项目
echo    • 运行 node scripts\health-check.js 进行健康检查
echo ═══════════════════════════════════════════════
echo.
pause

