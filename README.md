# 🥩 Macro Tracker

A mobile-first Next.js app to track daily protein, carbs, and fats.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
```

### 3. Initialize database
```bash
npm run db:push
```

### 4. Start dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Running with Docker

```bash
docker compose up --build
```

App runs at http://localhost:3000. Data persists in a named Docker volume.

---

## Migrating to PostgreSQL (V2)

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   # was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/macro_tracker"
   ```

3. Run:
   ```bash
   npm run db:push
   ```

That's it — no other code changes needed.

---

## Tech Stack
- [Next.js 14](https://nextjs.org/) (App Router)
- [Prisma](https://prisma.io/) ORM
- [SQLite](https://sqlite.org/) → PostgreSQL path
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://docker.com/)
