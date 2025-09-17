#!/bin/bash

# Underground Voices Setup Script
# This script helps you set up the entire project

echo "🚀 Setting up Underground Voices..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Download from: https://git-scm.com"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files
echo "⚙️  Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "📝 Created backend/.env - Please update with your actual values"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cp frontend/env.example frontend/.env
    echo "📝 Created frontend/.env - Please update with your actual values"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Supabase and API keys"
echo "2. Update frontend/.env with your configuration"
echo "3. Run the database setup script in Supabase"
echo "4. Start the backend: cd backend && npm start"
echo "5. Start the frontend: cd frontend && npm start"
echo ""
echo "For detailed instructions, see the README.md file"
