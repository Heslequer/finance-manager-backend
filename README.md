# Finance Manager – Backend

REST API for **Finance Manager**, a personal finance app for managing income, expenses, categories, subcategories, and credit cards.

## Tech Stack

- **Runtime:** Node.js  
- **Framework:** [NestJS](https://nestjs.com/) 11  
- **ORM:** [Prisma](https://www.prisma.io/) 7  
- **Database:** PostgreSQL (compatible with [Supabase](https://supabase.com/))  
- **Authentication:** JWT (Passport) + Supabase Auth integration  
- **Validation:** class-validator + class-transformer  

## Prerequisites

- Node.js 18+  
- PostgreSQL (or a Supabase project)  
- npm or yarn  

## Installation

```bash
# Clone the repository (or navigate to the backend folder)
cd finance-manager-backend

# Install dependencies
npm install

# Generate Prisma Client and run migrations (after configuring .env)
npx prisma generate --schema=src/prisma/schema.prisma
# npx prisma migrate deploy  # if using migrations
```

## Environment Variables

Create a `.env` file in the project root with:

| Variable            | Description                                      |
|---------------------|--------------------------------------------------|
| `DATABASE_URL`      | PostgreSQL connection URL (e.g. connection pool) |
| `DIRECT_URL`        | Direct PostgreSQL URL (for migrations)          |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret (token validation)        |
| `PORT`              | Server port (optional, default: 3000)           |

## Running the App

```bash
# Development (watch mode)
npm run start:dev

# Production (build + node)
npm run build
npm run start:prod

# Start only (no watch)
npm run start
```

The API is available at `http://localhost:3000` (or the port set in `PORT`).

## Scripts

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm run build`      | Generates Prisma Client and builds the project |
| `npm run start`      | Starts the server                        |
| `npm run start:dev`  | Starts in development mode (watch)       |
| `npm run start:prod` | Runs the compiled build (`dist/`)        |
| `npm run lint`       | Runs ESLint                              |
| `npm run format`     | Formats code with Prettier               |
| `npm run test`       | Runs unit tests                          |
| `npm run test:e2e`   | Runs end-to-end tests                    |

## Project Structure

- **`src/`** – Source code  
  - **`auth/`** – Authentication and JWT middlewares  
  - **`users/`** – Users  
  - **`categories/`** – Categories  
  - **`subcategories/`** – Subcategories  
  - **`incomes/`** – Income  
  - **`expenses/`** – Expenses  
  - **`credit-cards/`** – Credit Cards  
  - **`transactions/`** – Transactions  
  - **`prisma/`** – Prisma schema and config  

- **`test/`** – E2E tests  
- **`prisma/`** – Migrations (if used)  

## CORS

In development and production, the API accepts requests from these origins:

- `http://localhost:5173` (Vite dev)  
- `https://finance-manager-frontend-mu.vercel.app`  
- `https://heavenance.web.app`  

To change them, edit the `origin` array in `src/main.ts`.

## License

UNLICENSED – private use only.
