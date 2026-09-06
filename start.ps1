Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Kalakar Setu on http://localhost:2882" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$MobileDir = Join-Path $PSScriptRoot "mobile"
Set-Location $MobileDir

$env:WEB_PORT = "2882"

# Open browser in background
Start-Process "http://localhost:2882"

# Start Expo server
npx expo start --port 2882 --localhost
