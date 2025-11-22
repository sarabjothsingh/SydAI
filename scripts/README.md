# SydAI Deployment Scripts

This directory contains scripts for managing SydAI deployments and builds.

## Available Scripts

### check-uncommitted.sh

Checks for uncommitted changes in the git repository before deployment.

**Usage:**
```bash
./scripts/check-uncommitted.sh [--force]
```

**Options:**
- `--force`, `-f`: Proceed even if uncommitted changes are detected
- `--help`, `-h`: Show help message

**Examples:**
```bash
# Check for uncommitted changes (fails if found)
./scripts/check-uncommitted.sh

# Check and proceed even with uncommitted changes
./scripts/check-uncommitted.sh --force

# Show help
./scripts/check-uncommitted.sh --help
```

**Exit Codes:**
- `0`: Success (no uncommitted changes or --force used)
- `1`: Failure (uncommitted changes detected)

**Use Cases:**
- Pre-deployment checks to ensure clean git state
- CI/CD pipeline safety checks
- Build verification before releasing

### deploy.sh

Main deployment script that builds Docker images and deploys to Kubernetes.

**Usage:**
```bash
./scripts/deploy.sh [--force]
```

**What it does:**
1. Checks for uncommitted changes (can be skipped with --force)
2. Builds Docker images for backend, frontend, and database using a helper function
3. Deploys to Kubernetes cluster using kubectl

**Prerequisites:**
- Docker installed and running
- kubectl configured with cluster access
- Docker images buildable (Dockerfiles present)

**Examples:**
```bash
# Standard deployment (fails if uncommitted changes)
./scripts/deploy.sh

# Force deployment even with uncommitted changes
./scripts/deploy.sh --force
```

### install-all.sh

Installs npm dependencies for all services in the repository.

**Usage:**
```bash
./scripts/install-all.sh
```

**What it does:**
1. Checks for the existence of each service directory (frontend, server, database, ai_services)
2. Verifies each directory has a package.json file
3. Runs `npm install` in each service directory
4. Provides clear feedback for each service

**Examples:**
```bash
# Install all dependencies
./scripts/install-all.sh
```

**Features:**
- Gracefully handles missing directories
- Continues even if one service fails to install
- Provides clear status messages for each service

## NPM Scripts

You can also use npm scripts from the root package.json:

```bash
# Check for uncommitted changes
npm run check-uncommitted

# Check with force (always succeeds)
npm run check-uncommitted:force

# Run deployment (includes pre-check)
npm run deploy

# Force deployment (skips uncommitted changes check)
npm run deploy:force

# Run predeploy checks manually
npm run predeploy

# Build all services (includes pre-check)
npm run build:all

# Build only frontend
npm run build:frontend

# Install all dependencies
npm run install:all
```

## Integration with CI/CD

To integrate these scripts into your CI/CD pipeline:

1. **Pre-deployment check:**
   ```yaml
   - name: Check for uncommitted changes
     run: ./scripts/check-uncommitted.sh
   ```

2. **Build and deploy:**
   ```yaml
   - name: Deploy
     run: ./scripts/deploy.sh
   ```

3. **Force deploy (use with caution):**
   ```yaml
   - name: Force Deploy
     run: ./scripts/deploy.sh --force
   ```

## Best Practices

- Always commit or stash changes before deployment
- Use `--force` flag only in automated environments or when absolutely necessary
- Review the output of uncommitted changes before deciding to force proceed
- Test deployment scripts in a staging environment first
