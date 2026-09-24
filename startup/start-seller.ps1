Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Artisan Studio on http://localhost:2882" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$MobileDir = Join-Path (Split-Path -Parent $PSScriptRoot) "mobile"
Set-Location $MobileDir
$env:WEB_PORT = "2882"

Start-Process "http://localhost:2882"
npx expo start --port 2882 --localhost
