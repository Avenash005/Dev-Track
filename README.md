# DevTrack AI — Full-Stack AI-Powered Student Productivity Platform

> A modern, full-stack productivity and computer science learning management platform engineered for software engineering students and developers.

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/Relational_DB-PostgreSQL_%2B_Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![MongoDB](https://img.shields.io/badge/Document_DB-MongoDB_%2B_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Ollama](https://img.shields.io/badge/Local_AI-Ollama_(llama3.2)-FF6F00?logo=ollama&logoColor=white)](https://ollama.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 1. Project Overview

DevTrack AI empowers students to:
- **Manage Projects & Tasks**: Organize software development milestones, track priorities, set deadlines, and monitor real-time completion velocity.
- **Consult Local AI Mentors**: Chat with an offline, locally hosted LLM via Ollama (`llama3.2`) proxied securely through the Express backend, with conversations persisted in MongoDB.
- **Master Core JavaScript Mechanics**: Explore interactive sandboxes with live execution outputs and quizzes for **Closures**, the **Event Loop**, **Hoisting & TDZ**, and **Promises vs Callbacks**.
- **Inspect System Architecture**: View database connection telemetry and system metrics in a dark-themed SaaS dashboard (`#09090B` palette).

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Custom Dark Theme tokens: `#09090B`, `#111113`, `#18181B`, `#27272A`, `#8B5CF6`, `#3B82F6`)
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API with custom error handling

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js REST API
- **Middleware Pipeline**: Request logging, CORS whitelist, JWT Bearer verification, request payload validation, and centralized error handling
- **Security**: `bcryptjs` password hashing (10 salt rounds) and stateless `jsonwebtoken` tokens

### Databases (Polyglot Architecture)
- **PostgreSQL**: Managed via **Prisma ORM** for relational entities (`User`, `Project`, `Task`) with foreign keys and cascade deletes.
- **MongoDB**: Managed via **Mongoose ODM** for polymorphic AI conversations and message histories.

### AI Integration
- **Ollama**: Locally hosted LLM (`llama3.2`) accessed via Ollama's local HTTP API (`http://localhost:11434/api/chat`).

---

## 3. Project Monorepo Structure

```
DevTrack-AI/
├── client/                     # React 18 Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/         # StatCard, Badge, Modal, EmptyState, LoadingSpinner
│       │   ├── dashboard/      # QuickActions, RecentProjects, UpcomingTasks, RecentActivity
│       │   ├── layout/         # Sidebar, Header, AppLayout
│       │   ├── projects/       # ProjectForm
│       │   └── tasks/          # TaskForm
│       ├── context/            # AuthContext, DataContext
│       ├── pages/              # Dashboard, Projects, Tasks, AI, Learn, Settings, Login, Register
│       ├── services/           # api.js (Fetch client)
│       ├── App.jsx             # React Router Route Tree
│       ├── main.jsx            # Entry Point
│       └── index.css           # Tailwind base styles
│
├── server/                     # Node.js / Express Backend
│   ├── data/                   # Embedded persistent store (local fallback)
│   ├── prisma/
│   │   └── schema.prisma       # PostgreSQL schema with Prisma
│   ├── src/
│   │   ├── config/             # env.js, database.js
│   │   ├── controllers/        # auth, project, task, dashboard, ai controllers
│   │   ├── middleware/         # auth, validation, logging, error middlewares
│   │   ├── models/             # Conversation.js (Mongoose MongoDB)
│   │   ├── routes/             # REST resource routes
│   │   ├── services/           # Business logic & Ollama proxy
│   │   ├── utils/              # apiResponse.js (HTTP status code helpers)
│   │   └── server.js           # Express application entry
│   ├── test-api.js             # Automated 28-assertion test suite
│   ├── .env.example
│   └── package.json
│
├── docs/                       # Project Documentation
│   ├── ARCHITECTURE.md         # System design, data flow, sequence diagrams
│   ├── DATABASE.md             # ER diagrams, schemas, foreign keys, indexes
│   ├── API.md                  # RESTful API specifications & status codes
│   └── ASSESSMENT-GUIDE.md     # 22-topic demonstration & exam preparation script
│
├── docker-compose.yml          # PostgreSQL & MongoDB container orchestration
├── .gitignore
├── package.json                # Monorepo workspaces configuration
└── README.md
```

---

## 4. Getting Started

### Prerequisites
- **Node.js** (v18+ or v25 recommended)
- **npm** (v9+)
- **Git**
- *(Optional)* **Docker Desktop** (for containerized PostgreSQL and MongoDB)
- *(Optional)* **Ollama** (for local LLM inference)

---

### Step 1: Clone and Install Dependencies

```bash
git clone <repository-url>
cd DevTrack-AI

# Install all dependencies across workspaces in one command:
npm install
```

---

### Step 2: Configure Environment Variables

Create `server/.env` based on `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Default `.env` settings:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devtrack_db?schema=public
MONGODB_URI=mongodb://localhost:27017/devtrack_ai
JWT_SECRET=super_secure_devtrack_jwt_secret_key_change_in_production_2026
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

---

### Step 3: (Optional) Start Databases with Docker Compose

If you have Docker installed, start PostgreSQL and MongoDB:

```bash
docker compose up -d
```

Generate and synchronize the Prisma schema:
```bash
cd server
npm run prisma:generate
npm run prisma:push
```

> **Note**: If Docker or PostgreSQL/MongoDB are not running on your machine, DevTrack AI automatically activates its **Resilient Repository Engine** to persist records locally with full relational integrity and bcrypt hashing, allowing you to develop and test immediately with zero external friction.

---

### Step 4: (Optional) Setup Ollama Local AI

To chat with local AI:
1. Download Ollama from [ollama.com](https://ollama.com).
2. Start the daemon:
   ```bash
   ollama serve
   ```
3. Pull the default lightweight model:
   ```bash
   ollama pull llama3.2
   ```

---

### Step 5: Start the Full-Stack Application

In two separate terminals:

**Terminal 1 (Backend API)**:
```bash
npm run server:dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client)**:
```bash
npm run client:dev
# Running on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 5. Running Automated API Tests

DevTrack AI includes a comprehensive 28-assertion test suite that validates health checks, registration, JWT authentication, duplicate email conflicts (409), unauthorized rejections (401), project CRUD, task foreign-key cascades, dashboard analytics, and AI chat:

```bash
cd server
node test-api.js
```

**Test Output**:
```
======================================================
   DevTrack AI — Comprehensive API Test Suite
======================================================

  ✔ PASS : GET /api/health returned 200 OK
  ✔ PASS : Server reports healthy state
  ✔ PASS : POST /api/auth/register returned 201 Created
  ✔ PASS : Registration returned JWT bearer token
  ✔ PASS : Duplicate email registration correctly returned 409 Conflict
  ✔ PASS : POST /api/auth/login returned 200 OK
  ✔ PASS : Login returned user email correctly
  ✔ PASS : Incorrect password correctly returned 401 Unauthorized
  ✔ PASS : Protected route without token returned 401 Unauthorized
  ✔ PASS : GET /api/auth/me with Bearer token returned 200 OK
  ✔ PASS : Profile name matches registered user
  ✔ PASS : POST /api/projects returned 201 Created
  ✔ PASS : Project created with ID
  ✔ PASS : GET /api/projects returned 200 OK
  ✔ PASS : Projects list contains created project
  ✔ PASS : POST /api/tasks returned 201 Created
  ✔ PASS : Task created with ID
  ✔ PASS : PUT /api/tasks/:id returned 200 OK
  ✔ PASS : Task status transitioned to COMPLETED
  ✔ PASS : GET /api/dashboard/stats returned 200 OK
  ✔ PASS : Total projects is >= 1
  ✔ PASS : Completed tasks is >= 1
  ✔ PASS : POST /api/ai/chat returned 200 OK
  ✔ PASS : AI chat returned conversationId
  ✔ PASS : GET /api/ai/conversations returned 200 OK
  ✔ PASS : Conversations list contains new thread
  ✔ PASS : DELETE /api/tasks/:id returned 204 No Content
  ✔ PASS : DELETE /api/projects/:id returned 204 No Content

======================================================
  Test Results: 28 Passed, 0 Failed
======================================================
```

---

## 6. Comprehensive Documentation Links

- [System Architecture & Design Patterns (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [Database Models & Schemas (`docs/DATABASE.md`)](./docs/DATABASE.md)
- [RESTful API Specification (`docs/API.md`)](./docs/API.md)
- [22-Topic Assessment Preparation Guide (`docs/ASSESSMENT-GUIDE.md`)](./docs/ASSESSMENT-GUIDE.md)

---

## 7. License

MIT License. Built for software engineering education.
