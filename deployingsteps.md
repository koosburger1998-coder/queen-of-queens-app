# Deploying Queen of Queens — Step-by-Step Guide

This guide covers deploying the full stack (Angular frontend + NestJS backend + PostgreSQL) to **Render** via GitHub.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Prepare the GitHub repository](#2-prepare-the-github-repository)
3. [Deploy to Render via Blueprint (recommended)](#3-deploy-to-render-via-blueprint-recommended)
4. [Deploy to Render manually (alternative)](#4-deploy-to-render-manually-alternative)
5. [Environment variables reference](#5-environment-variables-reference)
6. [Database setup notes](#6-database-setup-notes)
7. [After deploy — first-run checklist](#7-after-deploy--first-run-checklist)
8. [GitHub Actions CI/CD](#8-github-actions-cicd)
8. [Updating the app](#8-updating-the-app)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

- A **GitHub** account with the repo pushed to it
- A **Render** account — [render.com](https://render.com) (free tier is fine to start)
- Node 18+ installed locally for pre-deploy testing

---

## 2. Prepare the GitHub repository

### 2a. Make sure these files are committed

The `render.yaml` Blueprint file at the repo root is critical — it tells Render exactly how to build and run the app.

```
queen-of-queens-app/
├── render.yaml          ← Render Blueprint config
├── package.json         ← root Angular workspace
├── backend/
│   ├── package.json
│   └── prisma/
│       └── schema.prisma
└── ...
```

### 2b. Check your `.gitignore`

Make sure the following are **ignored** (never committed):

```
node_modules/
backend/node_modules/
dist/
backend/dist/
backend/.env          ← never commit real secrets
```

The `backend/.env.example` file **should** be committed — it documents the required variables without real values.

### 2c. Push to GitHub

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

---

## 3. Deploy to Render via Blueprint (recommended)

The repo includes a `render.yaml` file that automates everything — one database, one web service, auto-linked connection string, auto-generated JWT secret.

### Step-by-step

1. Log in to [render.com](https://render.com).
2. Click **New → Blueprint**.
3. Connect your GitHub account if not already connected.
4. Select the `queen-of-queens-app` repository.
5. Render reads `render.yaml` and shows a preview:
   - **Web Service**: `queen-of-queens-app`
   - **PostgreSQL Database**: `queen-of-queens-db`
6. Click **Apply**.
7. Render will:
   - Create the managed PostgreSQL database
   - Create the web service
   - Auto-link `DATABASE_URL` to the internal DB connection string
   - Auto-generate a `JWT_SECRET`
   - Set `NODE_ENV=production`
   - Run the build command
   - Run the start command (which applies DB migrations before starting)
8. Wait for the build to complete (~5–10 minutes on first deploy).
9. Your app is live at the URL shown in the dashboard (e.g. `https://queen-of-queens-app.onrender.com`).

> **Note:** The free tier spins down after 15 minutes of inactivity. The first request after spin-down takes ~30 seconds. Upgrade to the Starter plan ($7/mo) to avoid this.

---

## 4. Deploy to Render manually (alternative)

Use this if you prefer not to use the Blueprint, or need to customise the setup.

### 4a. Create the PostgreSQL database

1. Render dashboard → **New → PostgreSQL**.
2. Fill in:
   - **Name**: `queen-of-queens-db`
   - **Database Name**: `queen_of_queens`
   - **User**: `qquser`
   - **Region**: pick the one closest to your users
   - **Plan**: Free (or Starter)
3. Click **Create Database**.
4. Wait for it to become **Available**.
5. Open the database → copy the **Internal Database URL** (starts with `postgresql://`).

> Use the **Internal URL** (not External) — services on Render communicate over the internal network for free; the external URL has bandwidth costs and is slower.

### 4b. Create the Web Service

1. Render dashboard → **New → Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - **Name**: `queen-of-queens-app`
   - **Branch**: `main`
   - **Region**: same region as the database
   - **Runtime**: Node
   - **Build Command**:
     ```
     npm install && cd backend && npm install && npx prisma generate && cd .. && npm run build:prod && cd backend && npm run build
     ```
   - **Start Command**:
     ```
     cd backend && npx prisma migrate deploy && node dist/main.js
     ```
4. Click **Create Web Service**.

### 4c. Add environment variables

In the Web Service → **Environment** tab, add the following:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Paste the **Internal Database URL** from step 4a |
| `JWT_SECRET` | A strong random string — generate one with `openssl rand -hex 32` |
| `NODE_ENV` | `production` |

Save and trigger a manual deploy if it doesn't start automatically.

---

## 5. Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Format: `postgresql://user:password@host:5432/dbname` |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens. Use a long random string (32+ chars). **Never share this.** |
| `NODE_ENV` | Yes | Set to `production` on Render. Controls static file serving and logging. |
| `PORT` | No | NestJS listen port. Render sets this automatically; defaults to `3000` locally. |

### Generating a JWT_SECRET locally

```bash
# macOS / Linux
openssl rand -hex 32

# Node.js (any platform)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Local `.env` file (backend/.env)

Copy the example and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/queen_of_queens"
JWT_SECRET="your-long-random-secret-here"
PORT=3000
NODE_ENV=development
```

> **Never commit `backend/.env`** — it is in `.gitignore` for a reason.

---

## 6. Database setup notes

### Render managed PostgreSQL — use `db push` not `migrate dev`

Render's managed PostgreSQL does **not** grant superuser access. `prisma migrate dev` requires superuser to create a shadow database, so it will fail.

Use one of these instead:

| Command | When to use |
|---|---|
| `npx prisma db push` | Local dev against a remote/managed DB, or first-time schema apply with no migration history |
| `npx prisma migrate deploy` | Production — applies existing migration files in `backend/prisma/migrations/` |
| `npx prisma migrate dev` | Local dev with a local PostgreSQL only |

The `render.yaml` start command uses `prisma migrate deploy`. This requires migration files to already exist in the repo. If you have been using `prisma db push` locally and have no migration files, run this **once locally** to create them before deploying:

```bash
cd backend
npx prisma migrate dev --name init
git add prisma/migrations
git commit -m "add initial migration"
git push
```

### Prisma client generation

The build command in `render.yaml` includes `npx prisma generate`. This is required — without it the compiled backend cannot talk to the database.

---

## 7. After deploy — first-run checklist

On first startup, NestJS automatically seeds the database:

| Seeded data | Value |
|---|---|
| Admin code | `ADMIN2026` |
| Judge scoring categories | Look / Stage Presence / Performance / Creativity / Audience Connection / Overall |
| Audience (guest) categories | Fan Favourite / Best Look / Best Stage Energy |
| Competition config | 28 contestants, 7 heats |
| Default event | Today's date, active |

### Immediate actions after going live

- [ ] **Change the admin code** — log in to `/admin`, go to **Settings**, set a new admin code
- [ ] **Create your judges** — go to **Judges**, add each judge with a unique access code
- [ ] **Create contestants** — go to **Contestants**, add each performer
- [ ] **Assign judges and contestants to the event** — go to **Events → Manage Assignments**
- [ ] **Verify the event is set as Active** — check the Active badge on the event card
- [ ] **Test a judge login** — open `/judge` in an incognito window and enter a judge code
- [ ] **Test audience voting** — open `/audience` and cast a vote

---

## 8. Updating the app

Any push to the `main` branch on GitHub triggers an automatic redeploy on Render.

```bash
# Make your changes, then:
git add .
git commit -m "describe your change"
git push origin main
```

Render will rebuild and restart the service. Downtime is ~2–3 minutes during the build.

### Schema changes

If you change `backend/prisma/schema.prisma`:

1. Create a migration locally:
   ```bash
   cd backend
   npx prisma migrate dev --name describe-the-change
   ```
2. Commit the new migration file:
   ```bash
   git add prisma/migrations
   git commit -m "db: describe-the-change migration"
   git push
   ```
3. Render's start command (`prisma migrate deploy`) will apply the migration automatically on the next deploy.

---

## 9. Troubleshooting

### Build fails — "Cannot find module" or Prisma errors

- Make sure `npx prisma generate` runs **before** `npm run build:prod` in the build command. The current `render.yaml` already handles this.

### Start fails — "P1001: Can't reach database"

- Check that `DATABASE_URL` is set correctly in the environment variables.
- On Render, use the **Internal** connection URL, not the External one.
- Make sure the database and web service are in the **same region**.

### Start fails — "P3009: migrate found failed migrations"

- A migration was applied partially. In Render's Shell tab (or via psql), run:
  ```sql
  DELETE FROM "_prisma_migrations" WHERE finished_at IS NULL;
  ```
  Then redeploy.

### Start fails — "permission denied to terminate processes" / superuser error

- You ran `prisma migrate dev` against the Render DB. Use `prisma db push` for local dev against the remote DB, or `prisma migrate deploy` in production. See [section 6](#6-database-setup-notes).

### App loads but API calls return 404

- `NODE_ENV` must be set to `production` on Render. Without it, `ServeStaticModule` is disabled and Angular's `index.html` is not served.

### Free tier — "spinning up" delay

- The free tier sleeps after 15 minutes of inactivity. The first request wakes it up (~30 seconds). Upgrade to Starter to keep it always-on.

### Socket.io not connecting in production

- Socket.io on Render requires **HTTP/1.1** (not HTTP/2). Render's free tier uses HTTP/1.1 by default, so this should work out of the box. If you add a custom domain with a CDN, make sure WebSocket upgrade headers are passed through.

### Logs

View real-time logs in Render: **Web Service → Logs tab**.

```bash
# Or stream logs via Render CLI
render logs --service queen-of-queens-app --tail
```

---

## 8. GitHub Actions CI/CD

The repo includes a workflow at `.github/workflows/deploy.yml` that runs automatically on every push to `main`.

### What it does

| Job | Trigger | Steps |
|---|---|---|
| `build` | push to main + all PRs to main | Install deps → generate Prisma client → build Angular → build NestJS |
| `deploy` | push to main only (after `build` passes) | POST to Render deploy hook |

Pull requests are **validated but not deployed** — the build job runs so you catch type errors and build failures before they merge.

### One-time setup — add the Render deploy hook secret

1. In the Render dashboard: open your **Web Service → Settings → Deploy Hook**.
2. Copy the hook URL (looks like `https://api.render.com/deploy/srv-xxx?key=yyy`).
3. In GitHub: **repo → Settings → Secrets and variables → Actions → New repository secret**.
4. Name: `RENDER_DEPLOY_HOOK_URL`, value: paste the URL.

That's it. The next push to `main` will build and deploy automatically.

### Disable Render's auto-deploy to avoid duplicate deploys

By default, Render also deploys when it detects a push to the connected branch. With GitHub Actions triggering the deploy hook, you get **two deploys per push**. To avoid this:

Render dashboard → your Web Service → Settings → **Auto-Deploy → Disable**.

Now only GitHub Actions controls when a deploy happens (after the build is confirmed green).

### Workflow file location

```
.github/
└── workflows/
    └── deploy.yml
```

### Required GitHub secret

| Secret name | Where to get it |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Render → Web Service → Settings → Deploy Hook |
