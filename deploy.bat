@echo off
echo 🚀 Starting deployment process...

echo 📁 Adding files to git...
git add -A

echo 💾 Committing changes...
git commit -m "feat: Add Vercel deployment configuration and trigger auto-deploy"

echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Deployment triggered successfully!
echo 🔗 Check GitHub Actions: https://github.com/Monsc/NK/actions
pause
