# Yaichi Docker Client Fix

## Problem
The original yaichi image uses Docker client 1.40, which is incompatible with newer Docker daemons requiring API 1.44+.

## Solution
This fork provides a fixed version `simudin/yaichi:fixed` with Docker client 25.0.3 (API 1.44).

## Usage

### For Quipper Monorepo Developers
1. Pull the fixed image:
   ```bash
   docker pull simudin/yaichi:fixed
   ```

2. Update docker-compose.yml to use:
   ```yaml
   yaichi:
     image: simudin/yaichi:fixed
   ```

3. Restart the service:
   ```bash
   docker-compose up -d yaichi
   ```

### Building Locally
```bash
# Build the fixed image
docker build -f Dockerfile.fixed -t simudin/yaichi:fixed .

# Push to Docker Hub
docker push simudin/yaichi:fixed
```

## Technical Details
- **Base Image**: mtsmfm/yaichi:latest
- **Docker Client**: 25.0.3 (API 1.44)
- **Fix Method**: Multi-stage build that replaces Docker binary while preserving nginx/mruby functionality

## Verification
```bash
docker run --rm simudin/yaichi:fixed docker version
# Should show: API version: 1.44
```
