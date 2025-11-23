# Quick script to open Kubernetes Dashboard

Write-Host "🎯 Opening Kubernetes Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Check if port-forward is already running
$portForward = Get-Process | Where-Object {$_.ProcessName -eq "kubectl" -and $_.CommandLine -like "*kubernetes-dashboard*"}

if (-not $portForward) {
    Write-Host "🚀 Starting port-forward..." -ForegroundColor Yellow
    Start-Process kubectl -ArgumentList "-n kubernetes-dashboard port-forward svc/kubernetes-dashboard 8443:443" -WindowStyle Minimized
    Start-Sleep -Seconds 3
    Write-Host "✅ Port-forward started" -ForegroundColor Green
} else {
    Write-Host "✅ Port-forward already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Dashboard Access:" -ForegroundColor Cyan
Write-Host "   URL: https://localhost:8443" -ForegroundColor White
Write-Host "   Token: See DASHBOARD_TOKEN.md" -ForegroundColor White
Write-Host ""

# Open browser
Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
Start-Process "https://localhost:8443"

Write-Host ""
Write-Host "⚠️  Accept the certificate warning in your browser" -ForegroundColor Yellow
Write-Host "📝 Then paste the token from DASHBOARD_TOKEN.md" -ForegroundColor Yellow
