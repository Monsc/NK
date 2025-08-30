# Deploy script for NoKing
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Add all files
Write-Host "📁 Adding files to git..." -ForegroundColor Yellow
git add -A

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Add Vercel deployment configuration and trigger auto-deploy"

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deployment triggered successfully!" -ForegroundColor Green
Write-Host "🔗 Check GitHub Actions: https://github.com/Monsc/NK/actions" -ForegroundColor Cyan
