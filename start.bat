@echo off
title Kalakar Setu - Local Dev Server (Port 2882)
echo ===================================================
echo   Starting Kalakar Setu on http://localhost:2882
echo ===================================================

cd /d "%~dp0mobile"

echo Opening browser at http://localhost:2882 ...
start http://localhost:2882

echo Launching Expo Metro Bundler on port 2882...
set WEB_PORT=2882
npx expo start --port 2882 --localhost

pause
