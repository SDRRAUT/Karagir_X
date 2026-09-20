Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Buyer Marketplace on http://localhost:2883" -ForegroundColor Magenta
Write-Host "===================================================" -ForegroundColor Cyan

$MobileDir = Join-Path $PSScriptRoot "mobile"
Set-Location $MobileDir
$env:WEB_PORT = "2883"

Start-Process "http://localhost:2883"
npx expo start --port 2883 --localhost
