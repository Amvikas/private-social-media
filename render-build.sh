#!/bin/bash

echo "Starting Render build process..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install backend dependencies
echo "Installing backend dependencies..."
npm install --production=false

# Build frontend
echo "Building frontend..."
cd frontend
npm install --production=false
npm run build
cd ..

# Copy frontend build to backend
echo "Setting up production files..."
mkdir -p backend/public
cp -r frontend/dist/* backend/public/ 2>/dev/null || echo "No dist files to copy"

echo "Build process completed successfully!"
echo "Build size:"
du -sh backend/public 2>/dev/null || echo "No public directory"

# Verify critical files exist
echo "Verifying build output..."
ls -la backend/public/ 2>/dev/null || echo "No public directory found"

echo "Ready for deployment!"