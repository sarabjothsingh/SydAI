#!/bin/bash

# Script to check for uncommitted changes before deployment
# Usage: ./scripts/check-uncommitted.sh [--force]

set -e

FORCE_PROCEED=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --force|-f)
            FORCE_PROCEED=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--force]"
            echo ""
            echo "Check for uncommitted changes in the git repository."
            echo ""
            echo "Options:"
            echo "  --force, -f    Proceed even if uncommitted changes are detected"
            echo "  --help, -h     Show this help message"
            exit 0
            ;;
    esac
done

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not a git repository"
    exit 1
fi

# Check if HEAD exists (repository has at least one commit)
if ! git rev-parse HEAD > /dev/null 2>&1; then
    echo "⚠️  New repository with no commits yet"
    echo ""
    if [ "$FORCE_PROCEED" = true ]; then
        echo "⚠️  Proceeding with new repository (--force flag was used)"
        echo ""
        exit 0
    else
        echo "❌ Please make an initial commit before deployment"
        echo ""
        echo "Alternatively, use --force flag to proceed anyway:"
        echo "  $0 --force"
        echo ""
        exit 1
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "⚠️  Uncommitted changes detected"
    echo ""
    echo "The following files have uncommitted changes:"
    git status --short
    echo ""
    
    if [ "$FORCE_PROCEED" = true ]; then
        echo "⚠️  Proceeding with uncommitted changes (--force flag was used)"
        echo ""
        exit 0
    else
        echo "❌ Deployment aborted due to uncommitted changes"
        echo ""
        echo "Please commit or stash your changes before deploying."
        echo "Alternatively, use --force flag to proceed anyway:"
        echo "  $0 --force"
        echo ""
        exit 1
    fi
fi

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard)
if [ -n "$UNTRACKED" ]; then
    echo "ℹ️  Untracked files detected:"
    echo "$UNTRACKED"
    echo ""
    echo "Consider adding these files to .gitignore or committing them."
    echo ""
fi

echo "✅ No uncommitted changes detected. Safe to proceed."
exit 0
