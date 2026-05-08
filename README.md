<div align="center">

```
██████╗ ██╗██╗   ██╗██╗██████╗ ███████╗███╗   ██╗██████╗ ██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗
██╔══██╗██║██║   ██║██║██╔══██╗██╔════╝████╗  ██║██╔══██╗██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║
██║  ██║██║██║   ██║██║██║  ██║█████╗  ██╔██╗ ██║██║  ██║██║ █╗ ██║███████║   ██║   ██║     ███████║
██║  ██║██║╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║╚██╗██║██║  ██║██║███╗██║██╔══██║   ██║   ██║     ██╔══██║
██████╔╝██║ ╚████╔╝ ██║██████╔╝███████╗██║ ╚████║██████╔╝╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║
╚═════╝ ╚═╝  ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
```

**Dividend stock intelligence for DACH retail investors.**  
Track yields, simulate savings plans, and assess sustainability — all in one dark, fast, open-source app.

<br/>

[![MIT License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Data via Yahoo Finance](https://img.shields.io/badge/data-Yahoo%20Finance-7c3aed?style=flat-square)](https://finance.yahoo.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e?style=flat-square)](CONTRIBUTING.md)

<br/>

[**Live Demo**](https://dividendwatch.vercel.app) · [Report Bug](https://github.com/Vinyxsoftware/dividendwatch/issues) · [Request Feature](https://github.com/Vinyxsoftware/dividendwatch/issues)

</div>

---

## What is DividendWatch?

DividendWatch is a **free, open-source** financial tool built specifically for retail investors in the DACH region (🇨🇭 Switzerland · 🇩🇪 Germany · 🇦🇹 Austria). It cuts through noise to answer one question:

> **Which dividend stocks are actually worth holding?**

No ads. No paywalls. No data selling. Just clean, fast, honest financial data.

---

## Features

### Dividend Rankings
Browse and filter **40+ dividend stocks** from Swiss (SIX), European (XETRA, AMS, EPA), and US (NYSE, NASDAQ) exchanges — sorted by yield, filtered by region.

### Sustainability Scoring
Each stock gets a sustainability badge based on payout ratio and dividend growth history:
- **Sustainable** — Payout < 60% with positive growth
- **Check** — Payout 60–85% or stagnant dividend
- **At Risk** — Payout > 85% or recent dividend cut

### DRIP Savings Plan Simulator
Compound your wealth with a full **Dividend Reinvestment Plan (DRIP)** simulator. Set your monthly budget, stock price, dividend, and growth rate — see exactly where you land after 1–40 years, with an interactive chart.

### Budget Calculator
Enter any CHF amount and instantly see: how many shares you can buy, annual dividend income, monthly income, and leftover cash.

### Growth Stock Tracker
Side-by-side comparison of **Dividend vs. Growth strategies** with a grid of top growth stocks (NVDA, MSFT, AMZN, AAPL, and more) including P/E, Beta, and Market Cap.

### Swiss Tax Guidance
Every stock detail page includes **jurisdiction-specific tax notes** — Swiss Verrechnungssteuer, US withholding tax under the DBA treaty, EU per-country rates — so you know your real after-tax return.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Database | [PostgreSQL](https://postgresql.org) via [Prisma ORM](https://prisma.io) |
| Data Source | [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | Syne · DM Sans · JetBrains Mono |
| Deployment | [Vercel](https://vercel.com) |
| Package Manager | [pnpm](https://pnpm.io) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (local or hosted — [Neon](https://neon.tech) and [Supabase](https://supabase.com) both have free tiers)

### 1. Clone the repo

```bash
git clone https://github.com/Vinyxsoftware/dividendwatch.git
cd dividendwatch
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
# PostgreSQL connection string (Supabase, Neon, Railway, etc.)
DATABASE_URL="postgresql://user:password@host:5432/dividendwatch?sslmode=require"

# Secret for the /api/refresh endpoint (any random string)
REFRESH_SECRET="change-me-in-production"
```

### 4. Set up the database

```bash
# Push schema and generate Prisma client
pnpm prisma migrate deploy
pnpm prisma generate

# Seed with live market data from Yahoo Finance
pnpm seed
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the full app with live data.

---

## Project Structure

```
dividendwatch/
├── app/
│   ├── page.tsx              # Homepage — rankings + budget calculator
│   ├── simulator/page.tsx    # DRIP savings plan simulator
│   ├── wachstum/page.tsx     # Growth stocks comparison
│   ├── stock/[ticker]/       # Stock detail page
│   └── api/
│       ├── stocks/           # REST endpoint — list + detail
│       └── refresh/          # Trigger data refresh from Yahoo Finance
├── components/
│   ├── SiteHeader.tsx        # Shared glass nav header
│   ├── StockTable.tsx        # Filterable dividend ranking table
│   ├── BudgetCalculator.tsx  # Interactive budget → dividend calculator
│   ├── SimulatorChart.tsx    # Recharts DRIP area chart
│   └── SustainabilityBadge.tsx
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── yahoo.ts              # Yahoo Finance fetcher + ticker list
│   └── calculations.ts       # Sustainability scoring logic
├── prisma/
│   └── schema.prisma         # Stock, Dividend, PriceSnapshot models
└── scripts/
    └── seed.ts               # Bulk data seeder
```

---

## Data Refresh

Stock data is fetched from Yahoo Finance. To refresh manually, call the API endpoint with your secret:

```bash
curl -X POST https://your-deployment.vercel.app/api/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_SECRET"
```

To automate refreshes, set up a cron job or use [Vercel Cron](https://vercel.com/docs/cron-jobs).

---

## Deploying to Vercel

The fastest way to self-host your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vinyxsoftware/dividendwatch)

You'll need to set `DATABASE_URL` and `REFRESH_SECRET` in the Vercel project environment variables after cloning.

---

## Contributing

Contributions are what make open source great. All contributions are welcome — bug fixes, new features, better data sources, UI improvements, additional ticker lists for other regions.

### Quick contribution flow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request

### Ideas we'd love help with

- [ ] Dark/light theme toggle
- [ ] Portfolio tracker (add your own holdings)
- [ ] Email/webhook alerts for dividend date reminders
- [ ] More regions: UK (LSE), Scandinavia, Asia
- [ ] Historical yield charts per stock
- [ ] CSV / JSON export of rankings

Please open an [issue](https://github.com/Vinyxsoftware/dividendwatch/issues) before starting large changes so we can discuss the approach.

---

## License

Distributed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

---

<div align="center">
  <sub>Built with care for DACH retail investors · Data via Yahoo Finance · No investment advice</sub>
</div>
