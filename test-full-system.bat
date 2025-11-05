@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo    完整系统功能测试
echo ========================================
echo.

echo 1️⃣  启动后端服务...
start "Amazon Review Backend" cmd /k "npm start"

echo    等待后端启动（10秒）...
timeout /t 10 /nobreak >nul

echo.
echo 2️⃣  测试后端API健康检查...
curl http://localhost:3001/api/health

echo.
echo.
echo 3️⃣  测试创建分析任务（夜灯产品）...
curl -X POST http://localhost:3001/api/tasks/create ^
  -H "Content-Type: application/json" ^
  -d "{\"asin\":\"B0D9JBGWCL\",\"productUrl\":\"https://www.amazon.com/dp/B0D9JBGWCL\",\"reviewCount\":500,\"source\":\"test\"}"

echo.
echo.
echo 4️⃣  启动Web前端...
cd web
start "Amazon Review Frontend" cmd /k "npm run dev"
cd ..

echo    等待前端启动（5秒）...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    ✅ 系统已启动！
echo ========================================
echo.
echo 📌 访问地址:
echo    后端API:  http://localhost:3001
echo    Web前端:  http://localhost:5173 (Vite开发服务器)
echo.
echo 📊 测试步骤:
echo    1. 访问 http://localhost:5173
echo    2. 点击 "Create Report"
echo    3. 输入ASIN: B0D9JBGWCL
echo    4. 查看分析结果
echo.
echo 🔍 Chrome扩展测试:
echo    1. 访问 https://www.amazon.com/dp/B0D9JBGWCL
echo    2. 点击 "开始AI分析"
echo    3. 查看分析结果
echo.
pause

