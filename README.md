# MERN Stack E-Commerce Application

A production-ready full-stack MERN (MongoDB, Express, React, Node.js) application with feature-based frontend and module-based backend architecture, fortified with **Nginx**, **Husky pre-commit quality gates**, and **Dependabot / Security Defender Bot**.

## Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or MongoDB Atlas connection string in `backend/.env`)
- **Docker & Docker Compose** (for containerized execution)

### 2. Workspace & Git Hooks Setup (Husky)
Initialize dependencies and pre-commit hooks from the repository root:
```bash
npm install
```
This automatically enables Husky pre-commit checks to ensure code quality before every git commit (`npm run check:all`).

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 4. Frontend Setup (Development)
```bash
cd frontend
npm install
npm run dev
```
Frontend development server runs on `http://localhost:5173`.

---

## Production Deployment with Nginx & Docker

In production, the frontend is built into optimized static assets and served via high-performance **Nginx** (`nginx:alpine`), which also reverse-proxies `/api` calls to the Express backend.

To build and run all services with Docker Compose:
```bash
docker compose up -d --build
```
- Access UI: `http://localhost:80` (or `http://localhost:5173`)
- Access Backend API: `http://localhost:5000/api` (or proxied via `http://localhost:80/api`)

---

## DevOps Features

- **Nginx Web Server & Reverse Proxy**:
  - Serves compiled React production bundle with Gzip compression and caching.
  - Handles client-side SPA routing (`try_files $uri $uri/ /index.html;`).
  - Proxies `/api/` directly to backend container, eliminating CORS issues.
- **Husky Pre-commit Quality Gates**:
  - Automatically runs backend syntax validation and frontend production builds before any commit.
- **Dependabot (`.github/dependabot.yml`)**:
  - Automated weekly dependency vulnerability scans and pull requests for npm, Docker base images, and GitHub Actions.
- **Security Defender Bot Pipeline (`.github/workflows/security.yml`)**:
  - Scans container images using Aquasecurity Trivy.
  - Audits npm packages for high/critical security advisories.
- **CI/CD Pipelines (`.github/workflows/ci.yml` & `cd.yml`)**:
  - Multi-environment automated testing and container deployment (`qa`, `staging`, `main`).

See full details in the [CI/CD Guide](docs/CI_CD_GUIDE.md).
