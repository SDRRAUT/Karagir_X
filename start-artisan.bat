@echo off
title Kalakar Setu - Artisan Studio (Port 2882)
color 0E

echo ===================================================
echo   Starting Artisan Studio on http://localhost:2882
echo ===================================================

cd /d "%~dp0mobile"

echo Opening browser at http://localhost:2882 ...
start http://localhost:2882

set WEB_PORT=2882
npx expo start --port 2882 --localhost
pause
