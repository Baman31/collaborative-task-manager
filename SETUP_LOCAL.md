# Local Development Setup Guide

This guide explains how to run the Colyx task management application on your local machine.

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher) - running on localhost:5432
- **npm** (comes with Node.js)

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd collaborative-task-manager
```

## Step 2: Setup Environment Variables

### Backend Setup

1. Copy the example file:
```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` with your local database credentials:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/taskmanager
JWT_SECRET=generate-a-random-string-at-least-32-characters-long
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:5000
NODE_ENV=development
```

### Frontend Setup

1. Copy the example file:
```bash
cp frontend/.env.example frontend/.env
```

2. Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

## Step 3: Setup Database

### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskmanager;

# Exit psql
\q
```

### Run Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables
- Seed initial data (if any)

## Step 4: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 5: Run the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 3000
```

### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5000/
  ➜  Network: http://localhost:5000/
```

## Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

You should see the Colyx login page.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middleware/      # Express middleware
│   │   ├── socket/          # Socket.io handlers
│   │   └── server.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── .env.example         # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── .env.example         # Environment template
│   └── package.json
│
└── .env.local.example       # Complete setup reference
```

## Available Commands

### Backend
```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm start           # Start production server
npm test            # Run tests
npm run prisma:migrate  # Run database migrations
npm run prisma:push     # Sync schema with database
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/taskmanager` |
| JWT_SECRET | Secret key for JWT tokens (min 32 chars) | `your-secret-key` |
| JWT_EXPIRES_IN | JWT token expiration time | `7d` |
| PORT | Server port | `3000` |
| FRONTEND_URL | Frontend application URL | `http://localhost:5000` |
| NODE_ENV | Environment mode | `development` or `production` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | `http://localhost:3000` |

## Common Issues

### "Cannot find module 'bcrypt'"
```bash
cd backend
npm install
```

### "Database connection failed"
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check PostgreSQL credentials

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or change the PORT in .env to 3001, etc.
```

### "CORS errors"
- Ensure FRONTEND_URL matches your frontend URL
- Check backend CORS configuration in `src/server.ts`

## Production Deployment

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Environment Variables (Production)
Make sure to set these securely in your deployment platform:
- Use a strong, random JWT_SECRET
- Use a production PostgreSQL database
- Set NODE_ENV=production
- Use correct FRONTEND_URL and VITE_API_URL for your domain

### Run Production Build
```bash
# Backend
PORT=3000 NODE_ENV=production npm start

# Frontend
npm run preview
```

## Features

✅ User Authentication (Sign up, Login, JWT)
✅ Task Management (Create, Read, Update, Delete)
✅ Task Assignment (Assign tasks to other users)
✅ Real-time Updates (Socket.io)
✅ Task Filtering & Sorting
✅ Responsive UI (Mobile-friendly)
✅ Priority Levels & Status Tracking

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user

## Support

For issues or questions, please check:
1. The console logs for error messages
2. The API health endpoint: `http://localhost:3000/api/health`
3. Network tab in browser DevTools for API errors
