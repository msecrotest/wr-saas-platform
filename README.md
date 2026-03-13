# WR SaaS Platform

> Digital Warehouse Receipt management — connecting warehouses, traders, and banks.

## Overview

A multi-sided SaaS platform that digitizes the warehouse receipt (WR) workflow across three roles:

- **Warehouse Operators** — issue and manage digital warehouse receipts
- **Commodity Traders** — hold, transfer, and pledge receipts as collateral
- **Bank Credit Officers** — receive pledged receipts, confirm collateral, manage loans

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + Radix UI |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Validation | Zod |
| State | TanStack React Query |
| Email | Resend |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in DATABASE_URL, Clerk keys, Resend key

# Set up database
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign in / sign up pages
│   ├── dashboard/
│   │   ├── trader/      # Trader WR portfolio + pledge actions
│   │   ├── warehouse/   # Warehouse operator: issue + manage WRs
│   │   └── bank/        # Bank officer: pledge queue + approvals
│   └── api/
│       ├── wr/          # Warehouse receipt API routes
│       └── pledge/      # Pledge lifecycle API routes
├── components/          # Shared UI components
├── lib/                 # Prisma client, utilities
└── types/               # TypeScript types
prisma/
└── schema.prisma        # Data model
```

## Iteration Roadmap

- **Iter 1** ✅ Digital WR issuance + trader portfolio
- **Iter 2** 🚧 Bank pledge + financing flow ← _current_
- **Iter 3** Compliance, audit export, KYB, API access
- **Stretch** Blockchain anchoring, secondary market

## Domain Research

See [`docs/`](./docs/) for the full whitepaper and user story documents.

## License

MIT
