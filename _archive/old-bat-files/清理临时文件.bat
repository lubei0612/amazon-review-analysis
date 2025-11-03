@echo off
chcp 65001 >nul
color 0E
title 清理临时文件 - 归档到_archive目录

echo.
echo ╔════════════════════════════════════════════╗
echo ║   清理临时文件 - 归档模式                 ║
echo ╚════════════════════════════════════════════╝
echo.
echo 此脚本将把临时文件移动到 _archive 目录
echo 包括: 测试脚本、调试文件、开发文档等
echo.

set /p CONFIRM="确认执行清理? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo 已取消
    pause
    exit /b
)

echo.
echo 开始清理...
echo.

REM 创建归档目录
echo [1/5] 创建归档目录...
if not exist "_archive" mkdir "_archive"
if not exist "_archive\test-scripts" mkdir "_archive\test-scripts"
if not exist "_archive\debug-files" mkdir "_archive\debug-files"
if not exist "_archive\old-docs" mkdir "_archive\old-docs"
if not exist "_archive\old-bat-files" mkdir "_archive\old-bat-files"
echo    ✅ 目录创建完成

REM 移动测试脚本
echo.
echo [2/5] 归档测试脚本...
move /Y test-*.js "_archive\test-scripts\" >nul 2>&1
move /Y test-*.bat "_archive\test-scripts\" >nul 2>&1
move /Y check-*.js "_archive\test-scripts\" >nul 2>&1
echo    ✅ 测试脚本已归档

REM 移动调试文件
echo.
echo [3/5] 归档调试文件...
move /Y debug-*.* "_archive\debug-files\" >nul 2>&1
echo    ✅ 调试文件已归档

REM 移动开发文档
echo.
echo [4/5] 归档开发文档...
move /Y ✅*.md "_archive\old-docs\" >nul 2>&1
move /Y 🎉*.md "_archive\old-docs\" >nul 2>&1
move /Y 🎯*.md "_archive\old-docs\" >nul 2>&1
move /Y 📊*.md "_archive\old-docs\" >nul 2>&1
move /Y 📞*.md "_archive\old-docs\" >nul 2>&1
move /Y 🧪*.md "_archive\old-docs\" >nul 2>&1
move /Y 🚀*.md "_archive\old-docs\" >nul 2>&1
move /Y AI-*.md "_archive\old-docs\" >nul 2>&1
move /Y Chrome*.md "_archive\old-docs\" >nul 2>&1
move /Y EXECUTION-*.md "_archive\old-docs\" >nul 2>&1
move /Y FINAL-*.md "_archive\old-docs\" >nul 2>&1
move /Y FIXES-*.md "_archive\old-docs\" >nul 2>&1
move /Y Groq*.md "_archive\old-docs\" >nul 2>&1
move /Y ISSUE-*.md "_archive\old-docs\" >nul 2>&1
move /Y LOGGER*.md "_archive\old-docs\" >nul 2>&1
move /Y OUTSCRAPER-*.md "_archive\old-docs\" >nul 2>&1
move /Y Outscraper-*.md "_archive\old-docs\" >nul 2>&1
move /Y Puppeteer*.md "_archive\old-docs\" >nul 2>&1
move /Y QUICK-START.md "_archive\old-docs\" >nul 2>&1
move /Y QUICK-START-GUIDE.md "_archive\old-docs\" >nul 2>&1
move /Y RAPIDAPI-*.md "_archive\old-docs\" >nul 2>&1
move /Y RapidAPI*.md "_archive\old-docs\" >nul 2>&1
move /Y TEST-*.md "_archive\old-docs\" >nul 2>&1
move /Y TESTING-*.md "_archive\old-docs\" >nul 2>&1
move /Y WEB-*.md "_archive\old-docs\" >nul 2>&1
move /Y 01-*.md "_archive\old-docs\" >nul 2>&1
move /Y 修复*.md "_archive\old-docs\" >nul 2>&1
move /Y 云端*.md "_archive\old-docs\" >nul 2>&1
move /Y 完全*.md "_archive\old-docs\" >nul 2>&1
move /Y 完整*.md "_archive\old-docs\" >nul 2>&1
move /Y 实现*.md "_archive\old-docs\" >nul 2>&1
move /Y 快速*.md "_archive\old-docs\" >nul 2>&1
move /Y 测试*.md "_archive\old-docs\" >nul 2>&1
move /Y 环境*.md "_archive\old-docs\" >nul 2>&1
move /Y 脚本*.md "_archive\old-docs\" >nul 2>&1
move /Y 评论*.md "_archive\old-docs\" >nul 2>&1
move /Y 配置*.md "_archive\old-docs\" >nul 2>&1
move /Y 重启*.md "_archive\old-docs\" >nul 2>&1
move /Y 项目*.md "_archive\old-docs\" >nul 2>&1
move /Y 首页*.md "_archive\old-docs\" >nul 2>&1
echo    ✅ 开发文档已归档

REM 移动旧批处理文件
echo.
echo [5/5] 归档旧批处理文件...
move /Y 一键启动-*.bat "_archive\old-bat-files\" >nul 2>&1
move /Y 一键测试.bat "_archive\old-bat-files\" >nul 2>&1
move /Y start-*.bat "_archive\old-bat-files\" >nul 2>&1
move /Y setup-*.bat "_archive\old-bat-files\" >nul 2>&1
move /Y create-icons.bat "_archive\old-bat-files\" >nul 2>&1
move /Y install-with-taobao.bat "_archive\old-bat-files\" >nul 2>&1
move /Y 重启*.bat "_archive\old-bat-files\" >nul 2>&1
echo    ✅ 旧批处理文件已归档

REM 移动环境配置模板
move /Y env-template-云端模式.txt "_archive\old-docs\" >nul 2>&1

echo.
echo ═══════════════════════════════════════════════
echo 🎉 清理完成！
echo.
echo 📊 归档统计：
echo    • 测试脚本 → _archive\test-scripts\
echo    • 调试文件 → _archive\debug-files\
echo    • 开发文档 → _archive\old-docs\
echo    • 旧批处理 → _archive\old-bat-files\
echo.
echo 💡 提示：
echo    • 归档的文件已移动到 _archive 目录
echo    • 可以随时查看或恢复
echo    • 建议定期备份此目录
echo ═══════════════════════════════════════════════
echo.
pause


