# CI/CD Pipeline, Security & Multi-Environment Deployment Guide

This repository is configured with a robust DevOps toolchain featuring:
- **Nginx Web Server & Reverse Proxy** (Multi-stage containerized static hosting & API routing)
- **Husky Pre-commit Automation** (Git hook quality gates)
- **Dependabot** (Automated dependency updates)
- **DefenderBot / Security Workflow** (Trivy container scanning & npm audit)
- **GitHub Actions CI/CD** (`qa`, `staging`, `main`)

---

## 1. Branching & Deployment Strategy

```text
 feature/* or fix/*  ──(Husky Pre-commit)──> (Pull Request)──> [CI Pipeline: Tests, Lint, Docker Build Check]
                                                                          │
                   ┌──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┐
                   ▼                                                      ▼                                                      ▼
              [qa branch]                                          [staging branch]                                        [main branch]
                   │                                                      │                                                      │
                   ▼                                                      ▼                                                      ▼
         Deploy to QA (Auto)                                   Deploy to Staging (Auto)                              Deploy to Production (Auto/Approved)
```

| Environment | Trigger Branch | Primary Purpose | GitHub Environment Protection |
| :--- | :--- | :--- | :--- |
| **QA** | `qa` | Functional & QA validation | None (immediate auto-deploy) |
| **Staging** | `staging` | Pre-production validation & staging tests | Optional approval |
| **Main** | `main` | Production deployment | Recommended: Required reviewers |

---

## 2. Nginx Web Server & Reverse Proxy Architecture

The frontend uses a multi-stage Docker build:
1. **Builder Stage**: `node:20-alpine` runs `npm run build` to generate production static files in `dist/`.
2. **Runtime Stage**: `nginx:alpine` copies `dist/` into `/usr/share/nginx/html` and serves them with:
   - Client-side routing fallback: `try_files $uri $uri/ /index.html;`
   - Gzip compression for CSS, JavaScript, JSON, and SVG.
   - Reverse proxy for `/api/` requests to `http://backend:5000/api/`, eliminating CORS discrepancies.
   - Production HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`).

Both Port **80** (standard HTTP) and Port **5173** are mapped to Nginx in `docker-compose.deploy.yml` and `docker-compose.yml`.

---

## 3. Husky Pre-commit Quality Gates

Husky protects the codebase by executing automated checks before any commit is finalized:
- **Pre-commit script**: `.husky/pre-commit` triggers `npm run check:all`.
- **Backend check**: Validates syntax via `node --check src/server.js`.
- **Frontend check**: Validates compilation via `npm run build --prefix frontend`.

If any check fails, the git commit is rejected until the issue is fixed.

---

## 4. Dependabot & DefenderBot Security Automation

### Dependabot (`.github/dependabot.yml`)
Monitors weekly and automatically submits Pull Requests for outdated or vulnerable dependencies:
- **npm**: `/`, `/backend`, `/frontend`
- **Docker**: `/backend`, `/frontend` base image updates
- **GitHub Actions**: `/` workflow action versions

### DefenderBot / Security Pipeline (`.github/workflows/security.yml`)
Runs on push/PR and daily at 02:00 UTC:
- **npm audit**: Scans backend and frontend dependencies for known vulnerabilities.
- **Trivy Container Scanner**: Scans both backend and frontend (Nginx) Docker container images for CVEs, operating system flaws, and security misconfigurations.

---

## 5. Remote Server Deployment Guide (`167.172.77.230`)

To deploy or upgrade your existing deployment on the remote server (`167.172.77.230`):

### Step 1: Connect to the Remote Server
Open your terminal and SSH into your server:
```bash
ssh <username>@167.172.77.230
```

### Step 2: Navigate to the Project Directory
```bash
cd ~/ecommerce   # or your designated project directory
```

### Step 3: Pull Latest Changes or Update Source Code
If using git on the server:
```bash
git pull origin main
```
*(Or transfer the updated files from your local workspace using `scp` / `rsync`)*

### Step 4: Verify Environment File (`.env`)
Ensure your environment file contains the server's public IP:
```bash
cat << 'EOF' > .env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongodb:27017/ecommerce
CLIENT_URL=http://167.172.77.230:5173,http://167.172.77.230
VITE_API_BASE_URL=/api
EOF
```

### Step 5: Build and Restart Services with Nginx
Run Docker Compose with the deploy configuration:
```bash
# Stop old containers (e.g. old Vite dev server)
docker compose -f docker-compose.deploy.yml down

# Rebuild and start services in background
docker compose -f docker-compose.deploy.yml up -d --build
```

### Step 6: Verify Firewall Rules
Ensure ports 80 and 5173 are open if UFW firewall is active:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 5173/tcp
sudo ufw status
```

### Step 7: Verify Service Health
Check running containers and test connectivity:
```bash
# Check running containers
docker compose -f docker-compose.deploy.yml ps

# Test Nginx HTTP response locally on server
curl -I http://localhost:80
curl -I http://localhost:5173

# Test API health check through Nginx reverse proxy
curl http://localhost:80/api/health
```

### Step 8: Access UI in Browser
Open your browser and visit:
- **Standard HTTP**: `http://167.172.77.230/`
- **Port 5173 (Backward compatible)**: `http://167.172.77.230:5173/`
