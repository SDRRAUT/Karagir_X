<#
.SYNOPSIS
  Kalakar Setu Ecosystem Master PowerShell Launcher
.PARAMETER Service
  Optional service to launch: 'all', 'artisan', 'buyer', 'admin', 'lan'
#>
param(
  [ValidateSet('all', 'artisan', 'seller', 'buyer', 'admin', 'lan')]
  [string]$Service
)

$RootDir = $PSScriptRoot

if (-not $Service) {
  Clear-Host
  Write-Host "===================================================================" -ForegroundColor Cyan
  Write-Host "    KALAKAR SETU ~ NATIONAL HANDICRAFT ECOSYSTEM LAUNCHER" -ForegroundColor Yellow
  Write-Host "===================================================================" -ForegroundColor Cyan
  Write-Host "  [1] Start ALL Services (Artisan:2882 + Buyer:2883 + Admin:3000)" -ForegroundColor White
  Write-Host "  [2] Start Artisan Studio (Port 2882)" -ForegroundColor White
  Write-Host "  [3] Start Buyer Marketplace (Port 2883)" -ForegroundColor White
  Write-Host "  [4] Start Admin OPS Command Center (Port 3000)" -ForegroundColor White
  Write-Host "  [5] Start Artisan Studio in LAN Mode (Port 2882)" -ForegroundColor White
  Write-Host "  [6] Exit" -ForegroundColor White
  Write-Host "===================================================================" -ForegroundColor Cyan
  $choice = Read-Host "Enter choice [1-6] (Default 1)"
  if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }

  switch ($choice) {
    "1" { $Service = 'all' }
    "2" { $Service = 'artisan' }
    "3" { $Service = 'buyer' }
    "4" { $Service = 'admin' }
    "5" { $Service = 'lan' }
    default { return }
  }
}

switch ($Service.ToLower()) {
  'all' {
    & "$RootDir\start-all.ps1"
  }
  { $_ -in 'artisan', 'seller' } {
    & "$RootDir\start-artisan.ps1"
  }
  'buyer' {
    & "$RootDir\start-buyer.ps1"
  }
  'admin' {
    & "$RootDir\start-admin.ps1"
  }
  'lan' {
    Set-Location "$RootDir\mobile"
    Write-Host "Launching Artisan Studio in LAN mode (Port 2882)..." -ForegroundColor Yellow
    npx expo start --port 2882 --host lan
  }
}
