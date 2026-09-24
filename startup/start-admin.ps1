Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Admin OPS on http://localhost:3000" -ForegroundColor Blue
Write-Host "===================================================" -ForegroundColor Cyan

Set-Location (Split-Path -Parent $PSScriptRoot)
node admin-web/server.js
