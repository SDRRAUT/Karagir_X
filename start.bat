@echo off
title Kalakar Setu - Ecosystem Master Launcher
color 0F

set "ACTION=%~1"
if not "%ACTION%"=="" goto handle_arg

:menu
cls
echo ===================================================================
echo     KALAKAR SETU ~ NATIONAL HANDICRAFT ECOSYSTEM LAUNCHER
echo ===================================================================
echo.
echo   [1] Start ALL Services (Artisan:2882 + Buyer:2883 + Admin:3000)
echo   [2] Start Artisan Studio (Port 2882)
echo   [3] Start Buyer Marketplace (Port 2883)
echo   [4] Start Admin OPS Command Center (Port 3000)
echo   [5] Start Artisan Studio in LAN Mode (for Mobile Devices)
echo   [6] Exit
echo.
echo ===================================================================
set /p choice="Enter choice [1-6] (Default 1): "
if "%choice%"=="" set choice=1
if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_artisan
if "%choice%"=="3" goto start_buyer
if "%choice%"=="4" goto start_admin
if "%choice%"=="5" goto start_lan
if "%choice%"=="6" goto exit_launcher
echo Invalid option selected.
timeout /t 2 >nul
goto menu

:handle_arg
if /i "%ACTION%"=="all" goto start_all
if /i "%ACTION%"=="artisan" goto start_artisan
if /i "%ACTION%"=="seller" goto start_artisan
if /i "%ACTION%"=="buyer" goto start_buyer
if /i "%ACTION%"=="admin" goto start_admin
if /i "%ACTION%"=="lan" goto start_lan
goto menu

:start_all
call "%~dp0start-all.bat"
goto exit_launcher

:start_artisan
call "%~dp0start-artisan.bat"
goto exit_launcher

:start_buyer
call "%~dp0start-buyer.bat"
goto exit_launcher

:start_admin
call "%~dp0start-admin.bat"
goto exit_launcher

:start_lan
cd /d "%~dp0mobile"
echo ===================================================
echo   Launching Artisan Studio in LAN Mode (Port 2882)
echo ===================================================
npx expo start --port 2882 --host lan
pause
goto exit_launcher

:exit_launcher
exit /b
