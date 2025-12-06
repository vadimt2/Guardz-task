# Backend Service

NestJS API providing entity CRUD endpoints with Postgres, Redis caching, and health checks.

## Quick Start

```bash
# Install deps
npm install

# Run with local Postgres/Redis already available (see env below)
npm run start:dev

# Or use Docker (recommended)
docker compose up --build
```

> If you previously ran Postgres 14, remove or rename the existing `pg_data` volume before starting Postgres 16 (see “Troubleshooting”).

## Configuration

Environment variables (defaults for docker-compose):

- `POSTGRES_HOST` (default: postgres)
- `POSTGRES_PORT` (default: 5432)
- `POSTGRES_USER` (default: user)
- `POSTGRES_PASSWORD` (default: password)
- `POSTGRES_DB` (default: guardz_db)
- `REDIS_HOST` (default: redis)
- `REDIS_PORT` (default: 6379)
- `PORT` (Nest listen port, default: 3000; docker maps 3001:3000)

Create a `.env` in `backend/` if running locally without compose.

## Endpoints

- `GET /api/entities` — list all entities (cached 30s)
- `GET /api/entities/paginated?offset&limit&order&search` — paginated list (`order` = `newest|oldest`)
- `POST /api/entities` — create entity (body: `{ something: string }`)
- `GET /api/health` — Terminus health check (Postgres + Redis)
- Swagger UI: `GET /api/docs`

## Testing

```bash
npm test          # unit
npm run test:e2e  # e2e
npm run test:cov  # coverage
```

## Docker

- Runtime: Node 22 (multi-stage build)
- Services: Postgres 16, Redis 7 (see `docker-compose.yml`)
- Port mapping: backend `3001:3000`, Postgres `5432:5432`, Redis `6379:6379`

## Troubleshooting

- **Postgres version mismatch (14 → 16):** remove old data volume before `docker compose up`:
  ```bash
  docker compose down
  docker volume rm homeWork_pg_data   # confirm with docker volume ls
  docker compose up --build
  ```
- **Cannot resolve `postgres` host:** ensure containers are started via `docker compose up` so service DNS works.
