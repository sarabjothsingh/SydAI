#!/bin/bash

# Script to install dependencies for all services
# Usage: ./scripts/install-all.sh

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📦 Installing dependencies for all services..."
echo ""

# List of service directories to check
SERVICES=("frontend" "server" "database" "ai_services")

for service in "${SERVICES[@]}"; do
    service_path="$REPO_ROOT/$service"
    
    if [ -d "$service_path" ] && [ -f "$service_path/package.json" ]; then
        echo "Installing dependencies for $service..."
        (cd "$service_path" && npm install) || {
            echo "⚠️  Warning: Failed to install dependencies for $service"
        }
        echo ""
    else
        echo "ℹ️  Skipping $service (directory not found or no package.json)"
        echo ""
    fi
done

echo "✅ Installation complete!"
