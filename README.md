# MERN Stack E-Commerce Application (DevOps Edition)

A production-grade full-stack MERN (MongoDB, Express, React, Node.js) application with automated **Zero-Touch "Push-to-Deploy" CI/CD**, **Nginx Web Server & Reverse Proxy**, **Husky Pre-commit Quality Gates**, and **Dependabot / DefenderBot Security Scanning**.

---

## 🚀 DevOps Architecture Overview

```text
 ┌──────────────────────┐
 │  Local Developer     │ ──> git commit (Husky Pre-commit: lint & build validation)
 └──────────┬───────────┘
            │ git push origin main
            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                GitHub Actions CI/CD Pipeline                │
 │  1. CI Checks: Backend syntax & Frontend production build   │
 │  2. Security: Trivy container CVE scan & npm audit          │
 │  3. Build & Publish: Push Nginx & Backend images to GHCR    │
 │  4. Automated SSH Deploy: Connects to Remote Server         │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Automated SSH Deployment
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │           Remote Ubuntu Server (167.172.77.230)             │
 │                                                             │
 │  Path: /var/www/Sineth-Test/05-09-2026-s/04-09-2026-s       │
 │                                                             │
 │  ┌───────────────────────────────────────────────────────┐  │
 │  │        NGINX Production Container (Port 5173:80)      │  │
 │  │  - Serves compiled React assets with Gzip & Caching  │  │
 │  │  - SPA client routing (try_files $uri /index.html)   │  │
 │  │  - Reverse proxies /api/ requests to Backend (no CORS)│  │
 │  └──────────────────────────┬────────────────────────────┘  │
 │                             ▼                               │
 │  ┌───────────────────────────────────────────────────────┐  │
 │  │         Express.js Backend Container (Port 5050:5000) │  │
 │  └──────────────────────────┬────────────────────────────┘  │
 │                             ▼                               │
 │  ┌───────────────────────────────────────────────────────┐  │
 │  │           MongoDB Container (Internal Network)        │  │
 │  └───────────────────────────────────────────────────────┘  │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Zero-Touch "Push-to-Deploy" CI/CD (Way 2)

Whenever changes are pushed to `main`, GitHub Actions automatically:
1. Validates tests and builds both frontend and backend.
2. Builds and publishes Docker images to **GitHub Container Registry (`ghcr.io`)**.
3. Opens a secure SSH session to the remote server (`167.172.77.230`).
4. Pulls the new images and executes a seamless container restart with zero manual intervention.

### Required GitHub Secrets Configuration
To enable automated push-to-deploy, configure the following secrets under **Settings > Secrets and variables > Actions** in your GitHub repository:

| Secret Name | Description | Example / Value |
| :--- | :--- | :--- |
| `SSH_HOST` | Remote server IP address | `167.172.77.230` |
| `SSH_USER` | Server SSH username | `root` |
| `SSH_KEY` | Private SSH key for server access | OpenSSH Private Key (`-----BEGIN OPENSSH PRIVATE KEY-----...`) |
| `DEPLOY_PATH` | Directory where compose file lives | `/var/www/Sineth-Test/05-09-2026-s/04-09-2026-s` |

---

## ⚙️ Server Configuration (`.env`)

On the remote server (`/var/www/Sineth-Test/05-09-2026-s/04-09-2026-s`), create the production `.env` file:

```bash
cat << 'EOF' > .env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongodb:27017/ecommerce
CLIENT_URL=http://167.172.77.230:5173
VITE_API_BASE_URL=/api
FRONTEND_IMAGE=ghcr.io/sinethch/05-09-2026-s/frontend:main-latest
BACKEND_IMAGE=ghcr.io/sinethch/05-09-2026-s/backend:main-latest
EOF
```

> [!NOTE]
> The server only requires `docker-compose.deploy.yml` and `.env`. The full repository does not need to be cloned on the server.

---

## 🛡️ DevOps & Security Tooling

### 1. Nginx Production Web Server & Reverse Proxy
- **Multi-stage Docker build** (`node:20-alpine` builder $\rightarrow$ `nginx:alpine` runtime).
- **SPA client-side routing fallback**: `try_files $uri $uri/ /index.html;` ensures page refreshes never 404.
- **Internal API reverse proxy**: Requests to `/api/` are forwarded directly to the backend container, eliminating CORS discrepancies.
- **Production HTTP security headers**: Injects `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and `Referrer-Policy`.

### 2. Husky Pre-commit Quality Gates
- Configured in root [`package.json`](package.json) and [`.husky/pre-commit`](.husky/pre-commit).
- Automatically triggers before any `git commit`:
  1. Backend syntax validation (`node --check src/server.js`).
  2. Frontend production build verification (`vite build`).
- Rejects commits if errors or breaking changes are detected.

### 3. Dependabot Dependency Management
- File: [`.github/dependabot.yml`](.github/dependabot.yml)
- Weekly automated scans and pull requests for:
  - Root, backend, and frontend `npm` packages
  - Dockerfile base images (Node, Nginx)
  - GitHub Actions dependencies

### 4. DefenderBot / Security Pipeline
- File: [`.github/workflows/security.yml`](.github/workflows/security.yml)
- **Trivy Container Security Scanner**: Detects CVEs and operating system vulnerabilities in production images.
- **npm audit**: Scans dependencies for known security advisories.

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or Atlas connection string)
- **Docker & Docker Compose**

### 2. Install Workspace Dependencies & Husky
```bash
npm install
```

### 3. Run Backend (Dev)
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 4. Run Frontend (Dev)
```bash
cd frontend
npm install
npm run dev
```
Frontend development server runs on `http://localhost:5173`.

### 5. Run Full Stack locally with Docker
```bash
docker compose up -d --build
```
Access UI at `http://localhost:5173` (served by Nginx).

---

## 🔍 Live Application Verification

- **Frontend UI (Nginx)**: [`http://167.172.77.230:5173/`](http://167.172.77.230:5173/)
- **API Health Check**: [`http://167.172.77.230:5173/api/health`](http://167.172.77.230:5173/api/health)

For additional setup and multi-environment details, see the [CI/CD Guide](docs/CI_CD_GUIDE.md).
