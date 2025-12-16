# Colyx - Collaborative Task Manager

## Project Overview

A full-stack TypeScript collaborative task management application with real-time updates via Socket.io, JWT authentication, and PostgreSQL database.

**Designed & Developed by Manish Sharma** - [LinkedIn](https://www.linkedin.com/in/manishsharma31/)

## Architecture

### Backend (Port 3000)
- Express.js with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication with HttpOnly cookies
- Socket.io for real-time updates
- Service-Repository pattern

### Frontend (Port 5000)
- React 18 with TypeScript and Vite
- Tailwind CSS for styling with modern UI
- SWR for data fetching
- React Hook Form + Zod for forms
- Socket.io Client for real-time

## Project Structure

```
/
├── backend/           # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   ├── dtos/
│   │   ├── socket/
│   │   └── server.ts
│   └── prisma/
├── frontend/          # React application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── context/
└── README.md
```

## Running the Application

### Backend
```bash
cd backend && npm run dev
```

### Frontend
```bash
cd frontend && npm run dev
```

## Key Features
- User authentication (register/login) with secure HttpOnly JWT cookies
- Task CRUD with role-based authorization (creator/assignee only)
- Real-time updates via Socket.io
- Priority and status filtering
- Dashboard with statistics
- Responsive design with modern UI (gradient backgrounds, glass-morphism, animations)

## Security
- CORS whitelist configuration for trusted origins
- User-scoped task queries (users only see their own tasks)
- Authorization checks on all task operations

## Database
PostgreSQL with Prisma ORM. Tables: User, Task

## Environment Variables
- DATABASE_URL (PostgreSQL connection)
- JWT_SECRET (for token signing)
- FRONTEND_URL (for CORS)

## Recent Changes
- Rebranded application from "TaskManager" to "Colyx"
- Added modern UI with gradient backgrounds, glass-morphism effects, and animations
- Added "Designed & Developed by Manish Sharma" credit with LinkedIn link on login/register pages
- Updated Inter font for modern typography
- Backend port changed from 3001 to 3000
