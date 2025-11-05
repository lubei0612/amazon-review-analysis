@echo off
cls
echo ================================================
echo    Complete System Restart - Full Cleanup
echo ================================================
echo.
echo This will completely restart your backend server.
echo.
pause
echo.

echo [Step 1] Kill ALL Node.js processes
echo ------------------------------------------------
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] All Node.js processes killed successfully.
) else (
    echo [INFO] No Node.js processes found.
)
timeout /t 2 /nobreak >nul
echo.

echo [Step 2] Clear port 3001
echo ------------------------------------------------
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo Found process PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)
echo [OK] Port 3001 cleared.
timeout /t 2 /nobreak >nul
echo.

echo [Step 3] Clear port 3002
echo ------------------------------------------------
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo Found process PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)
echo [OK] Port 3002 cleared.
timeout /t 2 /nobreak >nul
echo.

echo [Step 4] Verify code changes
echo ------------------------------------------------
echo Checking if PromptTemplates.js contains the fix...
findstr /C:"r.body || r.content" src\ai\PromptTemplates.js >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Code fix confirmed in PromptTemplates.js
) else (
    echo [WARNING] Code fix NOT found in PromptTemplates.js
    echo Please check if the file was saved correctly!
    pause
)
echo.

echo [Step 5] Start backend server
echo ------------------------------------------------
echo Backend will start in a new window...
echo.
start "Amazon Review Backend" cmd /k "cd /d %~dp0 && npm start"
timeout /t 3 /nobreak >nul
echo [OK] Backend server started in new window.
echo.

echo ================================================
echo    Next Steps (MANUAL)
echo ================================================
echo.
echo 1. Wait for backend to fully start
echo    - Look for: "Server running on: http://localhost:3001"
echo    - in the new window that just opened
echo.
echo 2. Run the test script:
echo    - In a NEW terminal window, run:
echo    - node test-server-nightlight.js
echo.
echo 3. If test passes, then test in browser:
echo    - Close ALL Chrome windows
echo    - Reopen Chrome
echo    - Go to: chrome://extensions/
echo    - Reload extension (click refresh button)
echo    - Clear cache: Ctrl+Shift+Delete
echo    - Visit: https://www.amazon.com/dp/B0D9JBGWCL
echo    - Press Ctrl+Shift+R
echo    - Click "Start AI Analysis"
echo.
echo ================================================
echo.
echo Press any key to close this window...
pause >nul






