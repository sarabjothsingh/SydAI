#!/bin/bash

# Main deployment script for SydAI
# This script checks for uncommitted changes before deploying

set -e

echo "🚀 Starting SydAI Deployment..."
echo ""

# Check for uncommitted changes
if ! ./scripts/check-uncommitted.sh "$@"; then
    echo ""
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "📦 Building Docker images..."
echo "Building backend..."
docker build -t sydai/backend:latest ./server || { echo "Backend build failed"; exit 1; }

echo "Building frontend..."
docker build -t sydai/frontend:latest ./frontend || { echo "Frontend build failed"; exit 1; }

echo "Building database..."
docker build -t sydai/database:latest ./database || { echo "Database build failed"; exit 1; }

echo ""
echo "☸️  Deploying to Kubernetes..."
kubectl apply -f k8s/ || { echo "Kubernetes deployment failed"; exit 1; }

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "To check the status of your deployment, run:"
echo "  kubectl get pods"
echo "  kubectl get services"
