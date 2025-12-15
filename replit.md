# Collaborative Task Manager

## Project Overview

A full-stack TypeScript collaborative task management application with real-time updates via Socket.io, JWT authentication, and PostgreSQL database.

## Architecture

### Backend (Port 3001)
- Express.js with TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication with HttpOnly cookies
- Socket.io for real-time updates
- Service-Repository pattern

### Frontend (Port 5000)
- React 18 with TypeScript and Vite
- Tailwind CSS for styling
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
- User authentication (register/login)
- Task CRUD with assignments
- Real-time updates via Socket.io
- Priority and status filtering
- Dashboard with statistics
- Responsive design

## Database
PostgreSQL with Prisma ORM. Tables: User, Task

## Environment Variables
- DATABASE_URL (PostgreSQL connection)
- JWT_SECRET (for token signing)
- FRONTEND_URL (for CORS)
