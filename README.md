# Collaborative Task Manager

A full-stack TypeScript collaborative task management application with real-time updates, user authentication, and comprehensive task tracking.

## Project Overview

This is a production-ready task management application that enables teams to collaborate on tasks in real-time. Users can create, assign, and track tasks with various priorities and statuses, receiving instant updates when tasks change.

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HttpOnly cookies
- **Real-time**: Socket.io
- **Validation**: Zod

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: SWR (stale-while-revalidate)
- **Forms**: React Hook Form with Zod validation
- **Real-time**: Socket.io Client
- **Icons**: Lucide React
- **Routing**: React Router v6

## Features

### Authentication
- User registration with secure password hashing (bcrypt)
- JWT-based authentication with HttpOnly cookies
- Protected routes and session management

### Task Management
- Create, read, update, and delete tasks
- Assign tasks to team members
- Set priority levels (Low, Medium, High, Urgent)
- Track status (To Do, In Progress, Review, Completed)
- Due date tracking with overdue indicators
- Filter tasks by status and priority
- Sort tasks by various fields

### Real-time Collaboration
- Live task updates across all connected clients
- Instant notifications when tasks are assigned
- Socket.io integration for real-time events

### Dashboard
- Overview of task statistics
- Quick access to assigned, created, and overdue tasks
- Visual indicators for task priorities

## Architecture

### Backend: Service-Repository Pattern

```
backend/
├── src/
│   ├── controllers/    # Route handlers
│   ├── services/       # Business logic
│   ├── repositories/   # Data access layer
│   ├── middleware/     # Auth, error handling
│   ├── dtos/           # Validation schemas
│   ├── types/          # TypeScript interfaces
│   ├── config/         # Configuration
│   └── socket/         # WebSocket handlers
└── prisma/             # Database schema
```

### Frontend: Component-Based Architecture

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication forms
│   │   ├── tasks/      # Task-related components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # Base UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and Socket clients
│   ├── context/        # React contexts
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
```

### Real-time Integration Flow

1. Client connects to Socket.io server
2. On authentication, client joins user-specific room
3. When tasks are modified, server emits events
4. Clients receive events and update SWR cache
5. UI automatically reflects changes

## Database Schema

### User Model
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `name`: User display name
- `createdAt`/`updatedAt`: Timestamps

### Task Model
- `id`: UUID primary key
- `title`: Task title (max 100 chars)
- `description`: Task description
- `dueDate`: Due date/time
- `priority`: LOW, MEDIUM, HIGH, URGENT
- `status`: TODO, IN_PROGRESS, REVIEW, COMPLETED
- `creatorId`: Reference to creator
- `assignedToId`: Reference to assignee
- `createdAt`/`updatedAt`: Timestamps

## Database Choice

I chose **PostgreSQL** because:
1. **Relational Data**: Tasks and users have clear relationships that benefit from foreign keys and joins
2. **ACID Compliance**: Ensures data integrity for critical task operations
3. **Prisma Support**: Excellent ORM support with type-safe queries
4. **Scalability**: Handles concurrent users well for collaborative features
5. **Rich Querying**: Complex filters and sorting are efficiently supported

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

## API Documentation

### Authentication

#### POST /api/auth/register
Register a new user.
```json
Body: { "email": "user@example.com", "password": "password123", "name": "John Doe" }
Response: { "success": true, "data": { "user": {...} } }
```

#### POST /api/auth/login
Login and receive JWT cookie.
```json
Body: { "email": "user@example.com", "password": "password123" }
Response: { "success": true, "data": { "user": {...} } }
```

#### GET /api/auth/me
Get current authenticated user.
```json
Response: { "success": true, "data": { "user": {...} } }
```

#### POST /api/auth/logout
Logout and clear cookie.
```json
Response: { "success": true, "data": { "message": "Logged out successfully" } }
```

### Tasks

#### GET /api/tasks
Get all tasks with optional filters.
```
Query params: status, priority, sortBy, order
Response: { "success": true, "data": { "tasks": [...] } }
```

#### POST /api/tasks
Create a new task.
```json
Body: { "title": "Task", "description": "...", "dueDate": "2024-01-01T00:00:00Z", "priority": "HIGH" }
Response: { "success": true, "data": { "task": {...} } }
```

#### GET /api/tasks/:id
Get single task by ID.

#### PATCH /api/tasks/:id
Update a task.

#### DELETE /api/tasks/:id
Delete a task (creator only).

### Users

#### GET /api/users
Get all users (for task assignment).

## Socket Events

### Client to Server
- `join` - Join user-specific room for notifications

### Server to Client
- `task:created` - Broadcast when new task is created
- `task:updated` - Broadcast when task is modified
- `task:deleted` - Broadcast when task is deleted
- `task:assigned` - Sent to specific user when task is assigned to them

## Testing

```bash
cd backend
npm test
```

Tests cover:
1. Task creation with valid data
2. Task creation with invalid data (validation)
3. Unauthorized task update prevention

## Trade-offs & Assumptions

1. **JWT in HttpOnly Cookies**: Chosen for security over localStorage, prevents XSS attacks
2. **Hard Delete**: Tasks are permanently deleted rather than soft delete for simplicity
3. **Real-time for All**: All task events broadcast to all users (in production, might filter by team/project)
4. **Creator-only Delete**: Only task creators can delete tasks for accountability

## Future Improvements

1. **Optimistic Updates**: Update UI immediately before API confirmation
2. **Team/Project Support**: Organize tasks into teams and projects
3. **Comments**: Add comments feature with real-time updates
4. **File Attachments**: Attach files to tasks
5. **Email Notifications**: Send emails for task assignments
6. **Dark Mode**: Theme toggle support
7. **Task History**: Audit log of all task changes
8. **Search**: Full-text search across tasks
9. **Recurring Tasks**: Support for repeating tasks
10. **Mobile App**: React Native companion app
