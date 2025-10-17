# Prompt Studio

Prompt Studio is a friendly, artistic playground for designing expressive AI prompt journeys. This project is built with Next.js 14 and the App Router, Tailwind CSS, TypeScript, and a curated developer experience for rapid iteration.

## Features

- **Next.js 14 (App Router)** with TypeScript and strict linting
- **Tailwind CSS** themed with custom design tokens to reflect a creative brand identity
- **Testing stack** powered by Vitest and Testing Library
- **Automated formatting and linting** with Prettier, ESLint, lint-staged, and Husky hooks
- **Prisma ORM** connected to Postgres with seeds, migrations, and a reusable data-access layer
- **Docker Compose** setup for Postgres-backed local development
- **GitHub Actions** CI workflow that runs linting and unit tests on every push and pull request

## Getting Started

### Prerequisites

- Node.js 18.17 or newer
- npm 9+
- Docker (optional, required for the Postgres service)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and adjust values as needed:

   ```bash
   cp .env.example .env.local
   ```

3. Start the Postgres service:

   ```bash
   docker compose up -d postgres
   ```

4. Generate Prisma Client and run database migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Seed the database with initial data:

   ```bash
   npm run db:seed
   ```

### Development

Run the local development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Quality Checks

- **Linting:** `npm run lint`
- **Tests:** `npm run test`
- **Type checking:** `npm run type-check`
- **Formatting:** `npm run format`

Husky hooks automatically run lint-staged on every commit and lint/tests before pushing.

### Database Commands

- **Open Prisma Studio:** `npx prisma studio`
- **Regenerate Prisma Client:** `npm run prisma:generate`
- **Create/Apply migrations:** `npm run prisma:migrate`
- **Reset database:** `npm run db:reset`
- **Seed database:** `npm run db:seed`

### Docker Notes

The provided `docker-compose.yml` file configures a Postgres 15 instance with sensible defaults. Credentials and database configuration can be controlled through environment variables in `.env.local` or in your shell. Data is persisted in the `postgres-data` volume.

### Database Schema

The project includes a comprehensive database schema managed by Prisma:

- **Users**: Role-based access control (ADMIN/USER)
- **Prompts**: AI prompt templates with metadata and configuration
- **Tags**: Categorization system with many-to-many relationships
- **Subscriptions**: User subscription management integrated with Stripe
- **View Logs**: Analytics for tracking prompt usage

See `prisma/README.md` for detailed database documentation and workflows.

### Continuous Integration

GitHub Actions executes linting and unit tests for every push and pull request using the workflow in `.github/workflows/ci.yml`.
