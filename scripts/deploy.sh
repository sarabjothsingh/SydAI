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

# Function to build a Docker image
build_image() {
    local service_name=$1
    local service_path=$2
    local image_tag=$3
    
    echo "Building $service_name..."
    if ! docker build -t "$image_tag" "$service_path"; then
        echo "❌ $service_name build failed"
        exit 1
    fi
    echo "✅ $service_name built successfully"
}

build_image "backend" "$REPO_ROOT/server" "sydai/backend:latest"
build_image "frontend" "$REPO_ROOT/frontend" "sydai/frontend:latest"
build_image "database" "$REPO_ROOT/database" "sydai/database:latest"

echo ""
echo "☸️  Deploying to Kubernetes..."
kubectl apply -f "$REPO_ROOT/k8s/" || { echo "Kubernetes deployment failed"; exit 1; }

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "To check the status of your deployment, run:"
echo "  kubectl get pods"
echo "  kubectl get services"
