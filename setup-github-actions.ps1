# SydAI CI/CD Setup Script
# This script automates the setup of GitHub Actions CI/CD pipeline

Write-Host "SydAI GitHub Actions CI/CD Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check kubectl
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] kubectl not found" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] kubectl found" -ForegroundColor Green

# Create namespaces
Write-Host "`nStep 1: Creating Kubernetes namespaces..." -ForegroundColor Yellow
kubectl create namespace dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace staging --dry-run=client -o yaml | kubectl apply -f -
Write-Host "[OK] Namespaces created (dev, staging)" -ForegroundColor Green

# Generate kubeconfig secret
Write-Host "`nStep 2: Generating KUBECONFIG secret..." -ForegroundColor Yellow
$kubeconfigPath = "$HOME\.kube\config"
if (Test-Path $kubeconfigPath) {
    $kubeconfigContent = Get-Content $kubeconfigPath -Raw
    $kubeconfigBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($kubeconfigContent))
    $kubeconfigBase64 | Out-File -FilePath "kubeconfig-secret.txt" -Encoding utf8
    Write-Host "[OK] KUBECONFIG encoded successfully" -ForegroundColor Green
    Write-Host "`nAdd this as KUBECONFIG secret in GitHub:" -ForegroundColor Cyan
    Write-Host "1. Go to: GitHub Repository -> Settings -> Secrets -> Actions" -ForegroundColor Gray
    Write-Host "2. Click 'New repository secret'" -ForegroundColor Gray
    Write-Host "3. Name: KUBECONFIG" -ForegroundColor Gray
    Write-Host "4. Value: Copy content from kubeconfig-secret.txt" -ForegroundColor Gray
} else {
    Write-Host "[WARNING] kubeconfig not found at $kubeconfigPath" -ForegroundColor Yellow
}

# Copy deployments
Write-Host "`nStep 3: Copying deployments to dev and staging..." -ForegroundColor Yellow
$deployments = kubectl get deployment -n default -o name

foreach ($deploy in $deployments) {
    $deployName = $deploy.Replace("deployment.apps/", "")
    Write-Host "  Copying $deployName..." -ForegroundColor Gray
    
    kubectl get deployment $deployName -n default -o yaml | `
        ForEach-Object { $_ -replace 'namespace: default', 'namespace: dev' } | `
        kubectl apply -n dev -f - 2>$null
    
    kubectl get deployment $deployName -n default -o yaml | `
        ForEach-Object { $_ -replace 'namespace: default', 'namespace: staging' } | `
        kubectl apply -n staging -f - 2>$null
}
Write-Host "[OK] Deployments copied" -ForegroundColor Green

# Copy services
Write-Host "`nStep 4: Copying services to dev and staging..." -ForegroundColor Yellow
$services = kubectl get svc -n default -o name

foreach ($svc in $services) {
    $svcName = $svc.Replace("service/", "")
    if ($svcName -ne "kubernetes") {
        Write-Host "  Copying $svcName..." -ForegroundColor Gray
        
        kubectl get svc $svcName -n default -o yaml | `
            ForEach-Object { $_ -replace 'namespace: default', 'namespace: dev' } | `
            ForEach-Object { if ($_ -match '^\s*clusterIP:') { "" } else { $_ } } | `
            kubectl apply -n dev -f - 2>$null
        
        kubectl get svc $svcName -n default -o yaml | `
            ForEach-Object { $_ -replace 'namespace: default', 'namespace: staging' } | `
            ForEach-Object { if ($_ -match '^\s*clusterIP:') { "" } else { $_ } } | `
            kubectl apply -n staging -f - 2>$null
    }
}
Write-Host "[OK] Services copied" -ForegroundColor Green

# Summary
Write-Host "`n=============================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Add KUBECONFIG secret to GitHub:" -ForegroundColor White
Write-Host "   - Repository Settings -> Secrets -> Actions" -ForegroundColor Gray
Write-Host "   - New repository secret: KUBECONFIG" -ForegroundColor Gray
Write-Host "   - Value: From kubeconfig-secret.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Enable workflow permissions:" -ForegroundColor White
Write-Host "   - Settings -> Actions -> General" -ForegroundColor Gray
Write-Host "   - Workflow permissions: Read and write" -ForegroundColor Gray
Write-Host "   - Allow GitHub Actions to create PRs: Checked" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Push code to trigger pipeline:" -ForegroundColor White
Write-Host "   git checkout dev" -ForegroundColor Gray
Write-Host "   git push origin dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. View pipeline:" -ForegroundColor White
Write-Host "   - GitHub: Actions tab" -ForegroundColor Gray
Write-Host "   - See visual workflow with all stages" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   - Setup Guide: GITHUB-ACTIONS-SETUP.md" -ForegroundColor Gray
Write-Host "   - Visualization: PIPELINE-VISUALIZATION.md" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to deploy! Push to any branch to trigger CI/CD" -ForegroundColor Cyan
