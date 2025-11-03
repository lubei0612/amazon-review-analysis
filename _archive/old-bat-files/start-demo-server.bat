@echo off
echo ========================================
echo Starting Amazon Review Analysis Server
echo ========================================
echo.

taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Starting Node.js server...
node server.js



