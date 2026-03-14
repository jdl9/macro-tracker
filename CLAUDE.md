# Macro Tracker — Claude Code Context

## Project Overview
A mobile-first Next.js app for tracking daily nutritional macros (protein, carbs, fats).

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Prisma 6
- **Database**: SQLite (V1) → PostgreSQL (V2+)
- **Containerization**: Docker / Docker Compose

## Project Structure
```
app/
  api/
    entries/route.ts       # GET (by date), POST new entry
    entries/[id]/route.ts  # DELETE entry
    goals/route.ts         # GET goals, PUT update goals
  dashboard/page.tsx       # Main daily view
  goals/page.tsx           # Set daily macro goals
  layout.tsx
  page.tsx                 # Redirects to /dashboard
components/
  MacroRing.tsx            # SVG progress ring for each macro
  EntryCard.tsx            # Single food entry row
  AddEntryForm.tsx         # Form to log a new food entry
lib/
  prisma.ts                # Prisma client singleton
  types.ts                 # Shared TypeScript interfaces
  utils.ts                 # todayString(), computeCalories(), clampRatio()
prisma/
  schema.prisma            # Data models: Entry, DailyGoal
```

## Data Models
### Entry
| Field     | Type     | Notes                              |
|-----------|----------|------------------------------------|
| id        | String   | cuid()                             |
| name      | String   | Food name                          |
| protein   | Float    | grams                              |
| carbs     | Float    | grams                              |
| fats      | Float    | grams                              |
| calories  | Float    | computed: p*4 + c*4 + f*9          |
| date      | String   | YYYY-MM-DD (local time)            |
| createdAt | DateTime |                                    |
| updatedAt | DateTime |                                    |

### DailyGoal
| Field   | Type   | Notes         |
|---------|--------|---------------|
| id      | String | cuid()        |
| protein | Float  | grams/day     |
| carbs   | Float  | grams/day     |
| fats    | Float  | grams/day     |

## Conventions
- Dates stored as YYYY-MM-DD strings (local timezone via `todayString()` in lib/utils.ts)
- `DailyGoal` is a single-row table (upsert pattern in goals API)
- All API routes return JSON
- No auth in V1 — single user assumed

## Environment Variables
```
DATABASE_URL="file:./prisma/data/macro-tracker.db"  # SQLite
# DATABASE_URL="postgresql://..."                    # Postgres (V2)
```

## Common Commands
```bash
npm run dev          # Start dev server
npm run db:push      # Sync Prisma schema to database
npm run db:studio    # Open Prisma Studio (DB GUI)
docker compose up    # Run in Docker
```

## V2 Roadmap
- [ ] Auth (NextAuth.js / Auth.js)
- [ ] Multi-user support
- [ ] PostgreSQL (change Prisma provider + DATABASE_URL)
- [ ] Food database search (Open Food Facts API)
- [ ] History / weekly view
- [ ] AWS EKS deployment
