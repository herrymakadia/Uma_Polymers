@echo off
echo ==============================================
echo  Pushing Uma Polymers changes to GitHub...
echo ==============================================
git add .
set /p msg="Enter commit message (or press Enter for default): "
if "%msg%"=="" set msg="Update website files"
git commit -m "%msg%"
git push origin main
echo.
echo ==============================================
echo  Done! Your repository is updated on GitHub.
echo ==============================================
pause
