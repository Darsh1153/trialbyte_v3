#!/bin/bash

# TrialByte Deployment Test Script
echo "🚀 Testing TrialByte Monorepo Configuration..."

# Check if required files exist
echo "📁 Checking required files..."

files=(
    "vercel.json"
    "package.json"
    "trialbyte-frontend-v1/package.json"
    "trialbyte-backend-v1/package.json"
    "trialbyte-backend-v1/api/index.js"
    "trialbyte-frontend-v1/next.config.mjs"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check if dependencies are installed
echo "📦 Checking dependencies..."

if [ -d "trialbyte-frontend-v1/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "⚠️  Frontend dependencies not installed. Run: cd trialbyte-frontend-v1 && npm install"
fi

if [ -d "trialbyte-backend-v1/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "⚠️  Backend dependencies not installed. Run: cd trialbyte-backend-v1 && npm install"
fi

# Check environment variables template
echo "🔧 Checking environment configuration..."
if [ -f "ENVIRONMENT_VARIABLES.md" ]; then
    echo "✅ Environment variables template created"
else
    echo "❌ Environment variables template missing"
fi

echo ""
echo "🎉 Configuration test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel"
echo "2. Ensure your database is accessible"
echo "3. Deploy to Vercel"
echo "4. Test the deployed application"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
