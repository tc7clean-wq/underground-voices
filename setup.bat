@echo off
REM Underground Voices Setup Script for Windows
REM This script helps you set up the entire project

echo 🚀 Setting up Underground Voices...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org
    pause
    exit /b 1
)

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo    Download from: https://git-scm.com
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create environment files
echo ⚙️  Creating environment files...

REM Backend .env
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo 📝 Created backend\.env - Please update with your actual values
)

REM Frontend .env
if not exist "frontend\.env" (
    copy "frontend\env.example" "frontend\.env"
    echo 📝 Created frontend\.env - Please update with your actual values
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your Supabase and API keys
echo 2. Update frontend\.env with your configuration
echo 3. Run the database setup script in Supabase
echo 4. Start the backend: cd backend ^&^& npm start
echo 5. Start the frontend: cd frontend ^&^& npm start
echo.
echo For detailed instructions, see the README.md file
pause
