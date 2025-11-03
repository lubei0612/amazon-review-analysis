@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ========================================================================
::  Amazon Review Analysis System - Full Volume Analysis Test
::  测试脚本：全量评论分析功能
:: ========================================================================

color 0A
title Amazon Review Analysis - Full Volume Test

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║       🧪 Amazon Review Analysis - Full Volume Test            ║
echo ║          全量评论分析功能 - 测试脚本                              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: ========================================================================
:: Step 1: Check Node.js Installation
:: ========================================================================

echo ════════════════════════════════════════════════════════════════
echo 📋 Step 1: Checking System Environment
echo ════════════════════════════════════════════════════════════════
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo 📥 Please install Node.js from: https://nodejs.org/
    echo    Recommended version: v18.x or higher
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js detected: %NODE_VERSION%
echo.

:: ========================================================================
:: Step 2: Check Environment Variables
:: ========================================================================

echo ════════════════════════════════════════════════════════════════
echo 📋 Step 2: Checking Environment Configuration
echo ════════════════════════════════════════════════════════════════
echo.

if not exist ".env" (
    echo ❌ ERROR: .env file not found!
    echo.
    echo 💡 Solution:
    echo    1. Copy env.example to .env
    echo    2. Fill in your API keys:
    echo       - RAPIDAPI_KEY
    echo       - GEMINI_API_KEY
    echo.
    pause
    exit /b 1
)

echo ✅ .env file found
echo.

:: Quick check for API keys
findstr /C:"RAPIDAPI_KEY" .env >nul
if %errorlevel% equ 0 (
    echo ✅ RAPIDAPI_KEY configured
) else (
    echo ⚠️  WARNING: RAPIDAPI_KEY not found in .env
)

findstr /C:"GEMINI_API_KEY" .env >nul
if %errorlevel% equ 0 (
    echo ✅ GEMINI_API_KEY configured
) else (
    echo ⚠️  WARNING: GEMINI_API_KEY not found in .env
)
echo.

:: ========================================================================
:: Step 3: Check Dependencies
:: ========================================================================

echo ════════════════════════════════════════════════════════════════
echo 📋 Step 3: Checking Dependencies
echo ════════════════════════════════════════════════════════════════
echo.

if not exist "node_modules\" (
    echo ⚠️  node_modules not found, installing dependencies...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)
echo.

:: ========================================================================
:: Step 4: Run Full Volume Analysis Test
:: ========================================================================

echo ════════════════════════════════════════════════════════════════
echo 🚀 Step 4: Starting Full Volume Analysis Test
echo ════════════════════════════════════════════════════════════════
echo.
echo 📌 Test Features:
echo    ✅ Full volume review scraping (no limit)
echo    ✅ Deep consumer profile analysis
echo    ✅ Gender ratio identification
echo    ✅ Demographics, usage time, location, behaviors
echo    ✅ Percentage accuracy to 2 decimal places
echo.
echo ⏱️  Estimated Time:
echo    - 100 reviews: ~60-90 seconds
echo    - 500 reviews: ~2-3 minutes
echo    - 1000+ reviews: ~4-5 minutes
echo.
echo 💡 Press Ctrl+C anytime to stop the test
echo.
echo ════════════════════════════════════════════════════════════════
echo.

pause

:: Run the test
node tests/test-full-analysis.js

set TEST_RESULT=%errorlevel%

echo.
echo ════════════════════════════════════════════════════════════════
if %TEST_RESULT% equ 0 (
    echo 🎉 Test Completed Successfully!
    echo ════════════════════════════════════════════════════════════════
    echo.
    echo ✅ Next Steps:
    echo    1. Review the analysis results above
    echo    2. Check gender ratio percentages
    echo    3. Verify demographics details
    echo    4. Test with Chrome extension (run START-BACKEND.bat)
    echo.
) else (
    echo ❌ Test Failed
    echo ════════════════════════════════════════════════════════════════
    echo.
    echo 🔍 Troubleshooting:
    echo    1. Check API keys in .env file
    echo    2. Verify internet connection
    echo    3. Check console output for error details
    echo    4. Review logs in logs/ directory
    echo.
)

echo ════════════════════════════════════════════════════════════════
echo.

pause
exit /b %TEST_RESULT%

