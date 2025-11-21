#!/bin/bash

# Main deployment script for SydAI
# This script checks for uncommitted changes before deploying

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Starting SydAI Deployment..."
echo ""

# Check for uncommitted changes
if ! "$SCRIPT_DIR/check-uncommitted.sh" "$@"; then
    echo ""
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "📦 Building Docker images..."
echo "Building backend..."
docker build -t sydai/backend:latest "$REPO_ROOT/server" || { echo "Backend build failed"; exit 1; }

echo "Building frontend..."
docker build -t sydai/frontend:latest "$REPO_ROOT/frontend" || { echo "Frontend build failed"; exit 1; }

echo "Building database..."
docker build -t sydai/database:latest "$REPO_ROOT/database" || { echo "Database build failed"; exit 1; }

echo ""
echo "☸️  Deploying to Kubernetes..."
kubectl apply -f "$REPO_ROOT/k8s/" || { echo "Kubernetes deployment failed"; exit 1; }

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "To check the status of your deployment, run:"
echo "  kubectl get pods"
echo "  kubectl get services"
