Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  Starting Kalakar Setu Full Multi-Localhost Ecosystem" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  - Artisan Studio:     http://localhost:2882" -ForegroundColor Yellow
Write-Host "  - Buyer Marketplace:  http://localhost:2883" -ForegroundColor Magenta
Write-Host "  - Admin Operations:   http://localhost:3000" -ForegroundColor Blue
Write-Host "===================================================================" -ForegroundColor Cyan

$RootDir = $PSScriptRoot

# 1. Admin Web
Write-Host "[1/3] Launching Admin Web Command Center (Port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir'; node admin-web/server.js"

# 2. Artisan Studio
Write-Host "[2/3] Launching Artisan Studio (Port 2882)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir\mobile'; npx expo start --port 2882 --localhost"

# 3. Buyer Marketplace
Write-Host "[3/3] Launching Buyer Marketplace (Port 2883)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir\mobile'; npx expo start --port 2883 --localhost"

Start-Sleep -Seconds 3

# Open all browsers
Start-Process "http://localhost:2882"
Start-Process "http://localhost:2883"
Start-Process "http://localhost:3000"

Write-Host "All 3 services have been launched in separate terminal windows!" -ForegroundColor Green
