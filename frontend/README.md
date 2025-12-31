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
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # Reusable components
│   │   └── dashboard/    # Dashboard components
│   ├── lib/              # Utilities and helpers
│   │   ├── api.ts        # API client
│   │   └── mockData.ts   # Mock data
│   └── styles/           # Styling
├── public/               # Static assets
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.ts    # Tailwind configuration
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
npm test
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
