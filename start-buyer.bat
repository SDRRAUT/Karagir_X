@echo off
title Kalakar Setu - Buyer Marketplace (Port 2883)
color 0B

echo ===================================================
echo   Starting Buyer Marketplace on http://localhost:2883
echo ===================================================

cd /d "%~dp0mobile"

echo Opening browser at http://localhost:2883 ...
start http://localhost:2883

set WEB_PORT=2883
npx expo start --port 2883 --localhost
pause
