# Prisma Database Guide

This project uses Prisma ORM to manage the PostgreSQL database schema and migrations.

## Schema Overview

The database includes the following models:

- **User**: Application users with role-based access (ADMIN/USER)
- **Prompt**: AI prompt templates with content, model configuration, and publication status
- **PromptImage**: Images associated with prompts
- **Tag**: Categorization tags for prompts
- **PromptTag**: Many-to-many relationship between prompts and tags
- **Subscription**: User subscription plans (FREE/PRO/ENTERPRISE)
- **ViewLog**: Analytics tracking for prompt views

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env` and update the `DATABASE_URL`:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

Using Docker Compose:

```bash
docker compose up -d postgres
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Migrations

Create the database schema:

```bash
npm run prisma:migrate
```

This will prompt you for a migration name. For the initial migration, you can use: `init`

### 6. Seed the Database

Populate the database with initial data:

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@promptstudio.dev`
- Demo user: `demo@promptstudio.dev`
- 8 sample tags
- 4 sample prompts with images and tags
- Subscriptions for both users
- Sample view logs for analytics

## Common Workflows

### Creating a New Migration

After modifying the schema in `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

Prisma will:
1. Detect schema changes
2. Generate SQL migration file
3. Apply the migration to your database
4. Regenerate the Prisma Client

### Viewing the Database

Open Prisma Studio (a visual database browser):

```bash
npx prisma studio
```

This launches at `http://localhost:5555` and allows you to view and edit data.

### Resetting the Database

To completely reset your database and re-run all migrations and seeds:

```bash
npm run db:reset
```

⚠️ **Warning:** This will delete all data in your database!

### Regenerating Prisma Client

If you've pulled changes or modified the schema without running migrations:

```bash
npm run prisma:generate
```

## Migration Files

Migrations are stored in `prisma/migrations/` directory. Each migration includes:
- SQL file with database changes
- Migration metadata

Never manually edit migration files in production. Always create new migrations for schema changes.

## Production Deployment

For production environments:

1. Set the `DATABASE_URL` environment variable
2. Run migrations during deployment:
   ```bash
   npx prisma migrate deploy
   ```
3. Do not use `prisma migrate dev` in production
4. Consider using connection pooling (e.g., PgBouncer)

## Troubleshooting

### Migration Conflicts

If you encounter migration conflicts:

```bash
# Mark migrations as applied without running them
npx prisma migrate resolve --applied <migration_name>

# Or reset and start fresh (development only)
npm run db:reset
```

### Connection Issues

Verify your `DATABASE_URL` format:
```
postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

Ensure PostgreSQL is running:
```bash
docker compose ps
```

### Schema Out of Sync

If your database schema doesn't match the Prisma schema:

```bash
npx prisma db push
```

This is useful for prototyping but prefer migrations for tracked changes.

## Data Access Layer

The project includes reusable data access helpers in `lib/data/prompts.ts`:

- `listPrompts()`: Query prompts with filtering, search, and pagination
- `getPromptById()`: Fetch a single prompt with view counts
- `recordPromptView()`: Log a view event
- `getPromptViewCount()`: Get total views for a prompt
- `fetchViewCounts()`: Bulk fetch view counts
- `listTagsWithUsage()`: Get all tags with prompt counts

Example usage:

```typescript
import { listPrompts, recordPromptView } from '@/lib/data/prompts';

// Get featured prompts
const featured = await listPrompts({
  featuredOnly: true,
  publishedOnly: true,
  take: 10,
});

// Search prompts
const results = await listPrompts({
  search: 'creative writing',
  tagSlugs: ['creative-writing', 'productivity'],
});

// Record a view
await recordPromptView({
  promptId: 'prompt-id',
  userId: 'user-id',
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0...',
});
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
