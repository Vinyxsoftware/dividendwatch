# Contributing to DividendWatch

## Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Vinyxsoftware/dividendwatch.git
   cd dividendwatch
   npm install
   ```

2. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: PostgreSQL connection string
   - `REFRESH_SECRET`: a random secret for protecting `/api/refresh` (generate with `openssl rand -hex 32`)

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Seed stock data (requires internet access — fetches from Yahoo Finance):
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Running locally without a database

The app requires PostgreSQL. The easiest way to run one locally is Docker:
```bash
docker run -d --name dividendwatch-db \
  -e POSTGRES_DB=dividendwatch \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16
```

## Adding new stocks

1. Open `lib/yahoo.ts`.
2. Add your ticker to `TOP_DIVIDEND_TICKERS` (dividend stocks) or `GROWTH_TICKERS` (growth stocks):
   ```ts
   { ticker: "ABCD.SW", region: "CH", exchange: "SIX" },
   ```
   Valid regions: `CH`, `EU`, `US`. The ticker must be a valid Yahoo Finance symbol.
3. Re-run the seed script or trigger `POST /api/refresh` to pull data.

## Refreshing data

```bash
curl -X POST http://localhost:3000/api/refresh \
  -H "Authorization: Bearer $REFRESH_SECRET"
```

## Code style

- TypeScript — no `any`, maintain strict types
- No new external dependencies without discussion
- Formatting utilities belong in `lib/format.ts`, not in individual components
