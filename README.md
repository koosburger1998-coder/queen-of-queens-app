# Queen of Queens — App

Live drag competition judging and audience voting platform.

Built with Angular 17, NestJS 10, PostgreSQL + Prisma, NgRx, Socket.io.

---

## Routes

| Path | Description |
|---|---|
| `/` | Landing page — event info + links |
| `/judge` | Judge login and scoring UI |
| `/audience` | Audience vote |
| `/admin` | Admin dashboard (requires admin code) |

Default admin code on first run: **`ADMIN2026`** — change it immediately in Admin → Settings.

---

## Project structure

```
queen-of-queens-app/
├── src/                   Angular frontend
│   └── app/
│       ├── core/          Auth, API, Socket services
│       ├── shared/        Components, pipes, directives
│       ├── store/         NgRx — judge / audience / admin slices
│       └── features/      landing / judge / audience / admin
├── backend/               NestJS backend
│   ├── prisma/            schema.prisma + migrations
│   └── src/
│       ├── auth/          JWT auth, guards
│       ├── events/        Event CRUD + judge/contestant assignment
│       ├── contestants/   Contestant CRUD
│       ├── judges/        Judge CRUD
│       ├── categories/    Judge + guest voting categories
│       ├── scores/        Score submission and admin management
│       ├── guest-votes/   Audience voting
│       ├── competition/   Competition rounds, winners, CSV export
│       ├── gateway/       Socket.io — real-time state broadcasts
│       └── seed/          First-run default data
├── package.json           Angular workspace root
├── render.yaml            Render Blueprint — one-click deploy
└── deployingsteps.md      Full deployment guide
```

---

## Local development

### Prerequisites

- Node 18+
- PostgreSQL running locally (or point `DATABASE_URL` at the Render DB for remote dev)

### First-time setup

```bash
# Install all dependencies
npm run install:all

# Copy and configure the backend env file
cp backend/.env.example backend/.env
# Edit backend/.env — set DATABASE_URL and JWT_SECRET
```

`backend/.env` should look like:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/queen_of_queens"
JWT_SECRET="any-long-random-string"
PORT=3000
NODE_ENV=development
```

### Apply the database schema

```bash
# Against a local PostgreSQL (full migration history)
cd backend && npx prisma migrate dev --name init

# Against a managed/remote DB (no superuser required)
cd backend && npx prisma db push
```

### Run both servers with one command

```bash
npm run dev
```

This starts:
- Angular dev server on **http://localhost:4200** (with `/api` proxy to the backend)
- NestJS backend on **http://localhost:3000**

Changes to both Angular and NestJS source files hot-reload automatically.

---

## Deployment

See **[deployingsteps.md](./deployingsteps.md)** for the full guide covering:

- Pushing to GitHub
- One-click Render Blueprint deploy
- Manual Render setup
- All environment variables
- Database migration notes
- Post-deploy checklist
- Troubleshooting

**Quick version:** Push the repo to GitHub, then in Render create a **Blueprint** pointing at the repo. The included `render.yaml` handles the rest — database creation, build command, start command, auto-linked `DATABASE_URL`, and auto-generated `JWT_SECRET`.

---

## Useful commands

```bash
# Start both servers (dev)
npm run dev

# Build Angular for production
npm run build:prod

# Build NestJS
npm run build:backend

# Build both (used by Render)
npm run build:all

# Apply DB schema (managed DB / no superuser)
cd backend && npx prisma db push

# Apply existing migrations (production)
cd backend && npx prisma migrate deploy

# Create a new migration after schema change
cd backend && npx prisma migrate dev --name <name>

# Browse the database visually
cd backend && npx prisma studio
```

---

## First-run seeded data

On first startup the backend seeds the following automatically:

| Data | Default |
|---|---|
| Admin code | `ADMIN2026` |
| Judge categories | Look / Stage Presence / Performance / Creativity / Audience Connection / Overall Impression |
| Audience categories | Fan Favourite / Best Look / Best Stage Energy |
| Competition config | 28 contestants, 7 heats, 3 songs per contestant |
| Default event | Today's date, marked active |

**Change the admin code** straight away via Admin → Settings.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Angular 17, Angular Material, NgRx, Socket.io client |
| Backend | NestJS 10, Passport JWT, Socket.io gateway |
| Database | PostgreSQL + Prisma 5 ORM |
| Hosting | Render (web service + managed PostgreSQL) |
| Real-time | Socket.io — state broadcast on every mutation |
| PWA | Angular Service Worker |
