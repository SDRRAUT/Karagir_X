@echo off
title Kalakar Setu - Admin Operations Command Center (Port 3000)
color 0D

echo ===================================================
echo   Starting Admin Dashboard on http://localhost:3000
echo ===================================================

cd /d "%~dp0.."

node admin-web/server.js
pause
