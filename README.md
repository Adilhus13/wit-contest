# 49ers Leaderboard API

A Laravel-based REST API for managing player statistics and leaderboards for the San Francisco 49ers.

## Tech Stack

- PHP 8.3+
- Laravel 11
- MySQL 8.0
- Docker & Docker Compose
- Nginx

## Prerequisites

- PHP 8.3 or higher
- Composer
- MySQL 8.0
- Docker and Docker Compose (for containerized setup)
- Node.js 20+ (for frontend development)

## Project Structure

```
backend/
├── app/                 # Application code
│   ├── Http/           # Controllers, Requests, Middleware
│   ├── Models/         # Eloquent models (User, Player, Game, PlayerStat)
│   └── Providers/      # Service providers
├── database/           # Migrations, seeders, factories
├── routes/             # API routes
├── config/             # Configuration files
├── tests/              # Test suites
└── storage/            # Logs and cache
```

## Setup Instructions

### Option 1: Local Development

1. Clone the repository and navigate to backend:
```bash
cd backend
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
docker compose up -d --build
docker composer install
```

4. Generate application key:
```bash
docker compose exec app php artisan key:generate
```

5. Create database and run migrations:
```bash
docker compose exec app php artisan migrate
```

6. Seed the database (optional):
```bash
docker compose exec app php artisan db:seed
```

The API will be available at `http://localhost:8000`

### Option 2: Docker Setup

1. Navigate to project root:
```bash
cd ..
```

2. Start containers:
```bash
docker-compose up -d
```

3. Access the app container and run setup:
```bash
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
```

The API will be available at `http://localhost:8080`

## Environment Configuration

Key environment variables in `.env`:

- `APP_NAME` - Application name
- `APP_ENV` - Environment (local, production)
- `APP_DEBUG` - Debug mode (true/false)
- `APP_URL` - Application URL
- `DB_CONNECTION` - Database driver (mysql, sqlite)
- `DB_HOST` - Database host
- `DB_DATABASE` - Database name
- `DB_USERNAME` - Database user
- `DB_PASSWORD` - Database password
- `SANCTUM_STATEFUL_DOMAINS` - Frontend domains for CORS

See `.env.example` for all available options.

## Database

### Migrations

Run all pending migrations:
```bash
php artisan migrate
```

Roll back last migration batch:
```bash
php artisan migrate:rollback
```

Reset database:
```bash
php artisan migrate:reset
```

### Seeders

Populate database with sample data:
```bash
php artisan db:seed
```

### Models

The application includes the following models:

- `User` - API users
- `Player` - Player information and stats
- `Game` - Game records and results
- `PlayerStat` - Player performance statistics

## Testing

Run the test suite:
```bash
docker compose exec app php artisan test
```

Run specific test file:
```bash
docker compose exec app php artisan test tests/Feature/GameTest.php
```

Run tests with coverage:
```bash
docker compose exec app php artisan test --coverage
```

## Useful Commands

```bash
# Create new migration
docker compose exec app php artisan make:migration create_table_name

# Create new model with migration
docker compose exec app php artisan make:model ModelName -m

# Create new controller
docker compose exec app php artisan make:controller Api/ControllerName

# View registered routes
docker compose exec app php artisan route:list

# Clear all caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Run tinker shell
docker compose exec app php artisan tinker
```

## Troubleshooting

### Database Connection Error

Ensure database credentials in `.env` match your MySQL configuration and the database exists.

### Permission Denied Errors

Ensure proper permissions on storage and bootstrap directories:
```bash
chmod -R 755 storage bootstrap/cache
```

### Port Already in Use

Change `APP_URL` and the port in `docker-compose.yml` or use different port for `php artisan serve`.


---

# 49ers Leaderboard Frontend

A modern Next.js application for displaying San Francisco 49ers player statistics, leaderboards, and game results.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query
- Jest for testing
- Zod for validation

## Prerequisites

- Node.js 20 or higher
- npm or yarn package manager

## Project Structure

```
frontend/
├── .next/
├── node_modules/
├── public/
└── src/
    ├── app/       
    ├── components/
    │   └── scoreboard/
    │       ├── __tests__/
    │       │   ├── Mappers.test.tsx
    │       │   └── ScoreboardPage.test.tsx
    │       ├── components/
    │       │   ├── cards/
    │       │   │   ├── __tests__/
    │       │   │   ├── GameCard.tsx
    │       │   │   ├── PlayerSummaryCard.tsx
    │       │   │   ├── RankingChartCard.tsx
    │       │   │   ├── RightPanel.tsx
    │       │   │   └── TopScoreboard.tsx
    │       │   ├── common/
    │       │   │   ├── Spinner.tsx
    │       │   │   └── Toast.tsx
    │       │   ├── layout/
    │       │   │   ├── __tests__/
    │       │   │   ├── FilterSidebar.tsx
    │       │   │   ├── ScorecardLayout.tsx
    │       │   │   └── TopBar.tsx
    │       │   ├── modals/
    │       │   │   ├── CreateEditPlayerModal.tsx
    │       │   │   └── DeletePlayerModal.tsx
    │       │   └── table/
    │       │       ├── __tests__/
    │       │       ├── columns.tsx
    │       │       ├── HeaderCell.tsx
    │       │       ├── LeaderboardTable.tsx
    │       │       └── PaginationBar.tsx
    │       ├── hooks/
    │       │   ├── useDebouncedValue.tsx
    │       │   └── useLeaderboard.tsx
    │       ├── api.ts
    │       ├── mappers.ts
    │       ├── ScorecardPage.tsx
    │       └── types.ts
    ├── lib/
    └── env.local
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

If you encounter peer dependency conflicts, use:
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set the API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Development Server

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

The page auto-reloads when you make changes to the source files.

## Available Scripts

### Development

```bash
npm run dev
```

Runs the app in development mode with hot module replacement.

### Build

```bash
npm run build
```

Builds the application for production in the `.next` directory.

### Production

```bash
npm start
```

Starts the production server. Run `npm run build` first.

### Testing

```bash
npm run test
```

Runs the Jest test suite.

```bash
npm run test:watch
```

Runs tests in watch mode. Re-runs tests when files change.

### Linting

```bash
npm run lint
```

Runs ESLint to check for code quality issues.

## Environment Configuration

### Development (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and client-side code.

## Components

### Dashboard Components

- **DashboardPage** - Main dashboard layout
- **LeaderboardTable** - Sortable player leaderboard table
- **PlayerSummaryCard** - Player profile card
- **TopScoreboard** - Game scores display
- **RankingChartCard** - Statistical charts
- **FilterSidebar** - Filter controls
- **RightPanel** - Additional player information
- **PlayerModal** - Player details modal
- **deleteModal** - Confirmation dialog for deletions

## API Integration

The application communicates with the backend API via the `apiGet` and related functions in `src/lib/api.ts`.

### Authentication

API requests use Sanctum tokens for authentication. The token is managed via the `getToken()` function.

## Testing

The project includes Jest with React Testing Library for unit tests.

### Running Tests

```bash
npm test
```

### Test Examples

- `LeaderboardTable.test.tsx` - Table rendering and interactions
- `PlayerSummaryCard.test.tsx` - Card display and data
- `TopScoreboard.test.tsx` - API mocking and async data

## Styling

The project uses Tailwind CSS for styling with custom configuration in `tailwind.config.ts`.

### Color Scheme

- Primary Red: `#C00000`
- Dark Red: `#6B0000`
- Gold Accent: `#F7E37A`
- Dark Gray: `#4A4A4A`

## Performance Optimization

- Image optimization via Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind
- Query caching with TanStack React Query

## Troubleshooting

### Port Already in Use

Change the port:
```bash
npm run dev -- -p 3001
```

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Ensure backend server is running

### Build Errors

Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack React Query](https://tanstack.com/query/latest)
