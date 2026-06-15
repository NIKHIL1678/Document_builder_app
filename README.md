# Cloud Storage App

A full-stack cloud storage project with a React frontend and an Express backend, designed as a clean base for a more production-oriented file platform.

## What Is Included

- JWT-based registration and login
- Protected file upload, listing, download, and delete APIs
- Local file storage with metadata persistence
- File type restrictions and per-user storage limits
- Request IDs, centralized error handling, and security headers
- Frontend dashboard with session restore and storage summary cards

## Project Structure

- `backend`: API, auth, file services, local persistence, upload handling
- `frontend`: app shell, auth flow, dashboard, upload UI

## Quick Start

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Current Enterprise-Baseline Improvements

- Centralized validation and error responses
- Hardened upload pipeline with MIME allowlist
- Per-user storage quota support
- Atomic JSON persistence writes
- Request tracing with `X-Request-Id`
- Health endpoint and structured middleware stack
- Frontend auth state restoration and protected routing

## What Still Needs To Reach True Production Level

- Database-backed persistence
- Refresh-token strategy with httpOnly cookies
- Background jobs and virus scanning
- Folder hierarchy and secure sharing links
- Automated tests and CI/CD pipelines
- Audit logs and role-based authorization
