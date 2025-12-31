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
