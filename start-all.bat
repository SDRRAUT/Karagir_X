@echo off
title Kalakar Setu - Starting All Ecosystem Services
color 0A

echo ===================================================================
echo   Starting Kalakar Setu Full Multi-Localhost Ecosystem
echo ===================================================================
echo   - Artisan Studio:     http://localhost:2882
echo   - Buyer Marketplace:  http://localhost:2883
echo   - Admin Operations:   http://localhost:3000
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/3] Launching Admin Web Command Center (Port 3000)...
start "Kalakar Setu - Admin OPS (3000)" cmd /k "node admin-web/server.js"

echo [2/3] Launching Artisan Studio (Port 2882)...
cd /d "%~dp0mobile"
start "Kalakar Setu - Artisan Studio (2882)" cmd /k "npx expo start --port 2882 --localhost"

echo [3/3] Launching Buyer Marketplace (Port 2883)...
start "Kalakar Setu - Buyer Marketplace (2883)" cmd /k "npx expo start --port 2883 --localhost"

timeout /t 3 /nobreak >nul

echo Opening browser windows for all 3 nodes...
start http://localhost:2882
start http://localhost:2883
start http://localhost:3000

echo.
echo All 3 services are running in their respective windows!
echo Keep those windows open while developing or presenting.
echo.
pause
