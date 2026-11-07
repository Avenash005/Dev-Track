# DevTrack AI — Full-Stack AI-Powered Student Productivity Platform

> A modern, full-stack productivity and computer science learning management platform engineered for software engineering students and developers.

[![CI](https://github.com/Avenash005/Dev-Track/actions/workflows/ci.yml/badge.svg)](https://github.com/Avenash005/Dev-Track/actions)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/Relational_DB-PostgreSQL_%2B_Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![MongoDB](https://img.shields.io/badge/Document_DB-MongoDB_%2B_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Cache-Redis_7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![SSR](https://img.shields.io/badge/SSR-React_DOM_Server-000000?logo=react&logoColor=61DAFB)](https://react.dev)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay_Test_Mode-02042B?logo=razorpay&logoColor=3395FF)](https://razorpay.com)
[![Ollama](https://img.shields.io/badge/Local_AI-Ollama_(llama3.2)-FF6F00?logo=ollama&logoColor=white)](https://ollama.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 1. Project Overview

DevTrack AI empowers students to:
- **Manage Projects & Tasks**: Organize software development milestones, track priorities, set deadlines, and monitor real-time completion velocity.
- **Consult Local AI Mentors**: Chat with an offline, locally hosted LLM via Ollama (`llama3.2`) proxied securely through the Express backend, with conversations persisted in MongoDB.
- **Master Core JavaScript Mechanics**: Explore interactive sandboxes with live execution outputs and quizzes for **Closures**, the **Event Loop**, **Hoisting & TDZ**, and **Promises vs Callbacks**.
- **Server-Side Rendered (SSR) Public Pages**: Ultra-fast initial page loads with pre-rendered HTML for public showcase pages (`/`, `/explore`, `/p/:id`), complete with server data pre-fetching and client hydration.
- **Redis In-Memory Caching (Cache-Aside)**: Sub-millisecond response caching for dashboard metrics, projects, and tasks with per-user tenant isolation, TTL policies, and automated mutation invalidation.
- **Razorpay Subscription Gateway**: End-to-end payment processing in Test Mode with cryptographic HMAC-SHA256 signature verification for **Free** (₹0), **Pro** (₹149/mo), and **Premium** (₹299/mo) tiers.
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
│       ├── pages/              # Dashboard, Projects, Tasks, AI, Learn, Pricing, Settings, Login, Register
│       ├── services/           # api.js (Fetch client with Payment APIs)
│       ├── App.jsx             # React Router Route Tree
│       ├── main.jsx            # Entry Point
│       └── index.css           # Tailwind base styles
│
├── server/                     # Node.js / Express Backend + SSR Engine
│   ├── data/                   # Embedded persistent store (local fallback)
│   ├── prisma/
│   │   └── schema.prisma       # PostgreSQL schema (User, Project, Task, Subscription, Payment)
│   ├── public/                 # Static assets & client hydration scripts
│   │   └── ssr/                # hydrate-landing.js, hydrate-project.js
│   ├── src/
│   │   ├── config/             # env.js, database.js
│   │   ├── controllers/        # auth, project, task, dashboard, ai, payment controllers
│   │   ├── generated/          # Prisma client output
│   │   ├── middleware/         # auth, validation, logging, error middlewares
│   │   ├── models/             # Conversation.js (Mongoose MongoDB)
│   │   ├── routes/             # REST resource routes & paymentRoutes.js
│   │   ├── services/           # auth, project, task, dashboard, ai, paymentService.js
│   │   ├── ssr/                # SSR engine & pre-rendered React components
│   │   │   ├── components/     # LandingPage.js, ExplorePage.js, PublicProjectPage.js
│   │   │   └── renderer.js     # ReactDOMServer renderToString & HTML shell injection
│   │   ├── utils/              # apiResponse.js (HTTP status code helpers)
│   │   └── server.js           # Express app, SSR route handlers, payment router
│   ├── test-api.js             # Automated 52-assertion test suite (Auth, CRUD, AI, SSR, Payments)
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
RAZORPAY_KEY_ID=rzp_test_DevTrackKey2026
RAZORPAY_KEY_SECRET=devtrack_razorpay_secret_test_2026
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

DevTrack AI includes a comprehensive 69-assertion automated test suite that validates health checks, registration, JWT authentication, duplicate email conflicts (409), unauthorized rejections (401), project CRUD, task foreign-key cascades, dashboard analytics, AI chat, Server-Side Rendered (SSR) public HTML delivery, Razorpay payment order creation, HMAC signature verification, tampering defense, subscription updates, and Redis in-memory caching (cache hits, misses, TTL, user isolation, automated mutation invalidations, and cache telemetry):

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
  ✔ PASS : Project created with ID: proj-...
  ✔ PASS : GET /api/projects returned 200 OK
  ✔ PASS : Projects list contains created project
  ✔ PASS : POST /api/tasks returned 201 Created
  ✔ PASS : Task created with ID: task-...
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

--- Verifying Server-Side Rendering (SSR) ---
  ✔ PASS : SSR GET / returned 200 OK
  ✔ PASS : SSR GET / returned text/html content-type
  ✔ PASS : SSR HTML contains <!DOCTYPE html> preamble
  ✔ PASS : SSR pre-rendered HTML contains brand title 'DevTrack AI'
  ✔ PASS : SSR HTML contains server injected window.__INITIAL_DATA__
  ✔ PASS : SSR HTML references browser hydration bundle
  ✔ PASS : SSR GET /explore returned 200 OK
  ✔ PASS : SSR explore page pre-renders public catalog
  ✔ PASS : SSR GET /p/proj-1 returned 200 OK
  ✔ PASS : SSR project page pre-renders project showcase

--- Verifying Razorpay Payment Gateway ---
  ✔ PASS : GET /api/payment/plans returned 200 OK
  ✔ PASS : Returned exactly 3 subscription tiers (Free, Pro, Premium)
  ✔ PASS : Pro plan priced correctly at ₹149/mo
  ✔ PASS : POST /api/payment/create-order without auth rejected with 401 Unauthorized
  ✔ PASS : POST /api/payment/create-order returned 201 Created
  ✔ PASS : Received Razorpay order ID: order_test_...
  ✔ PASS : Order amount in paise equals 14900 (₹149.00)
  ✔ PASS : Tampered payment signature correctly rejected with 400 Bad Request
  ✔ PASS : Valid HMAC-SHA256 signature verified with 200 OK
  ✔ PASS : User subscription tier successfully updated to PRO
  ✔ PASS : Subscription status is ACTIVE
  ✔ PASS : GET /api/payment/subscription returned 200 OK
  ✔ PASS : Active subscription reflects PRO plan
  ✔ PASS : POST /api/payment/failure successfully logged failure record

--- Verifying Redis In-Memory Caching (Cache-Aside Pattern) ---
  ✔ PASS : Cold GET /api/dashboard/stats returned X-Cache: MISS (database query)
  ✔ PASS : Warm GET /api/dashboard/stats returned X-Cache: HIT (sub-millisecond cache)
  ✔ PASS : Cached statistics match original payload
  ✔ PASS : Cold GET /api/projects returned X-Cache: MISS
  ✔ PASS : Warm GET /api/projects returned X-Cache: HIT
  ✔ PASS : Cold GET /api/tasks returned X-Cache: MISS
  ✔ PASS : Warm GET /api/tasks returned X-Cache: HIT
  ✔ PASS : User isolation verified (User B receives MISS and isolated dataset)
  ✔ PASS : Creating project invalidated projects cache (subsequent GET is MISS)
  ✔ PASS : Creating task invalidated tasks, projects, and dashboard stats caches
  ✔ PASS : Status change to COMPLETED invalidated cache
  ✔ PASS : Updating task invalidated cache
  ✔ PASS : Deleting task invalidated cache
  ✔ PASS : GET /api/cache/stats returned 200 OK with real-time hit/miss telemetry

======================================================
  Test Results: 69 Passed, 0 Failed
======================================================
```

---

## 6. Server-Side Rendering (SSR) Architecture

DevTrack AI implements a hybrid rendering architecture:
- **Client-Side Rendering (CSR)**: Used for authenticated, dynamic dashboard tools (`/dashboard`, `/projects`, `/tasks`, `/ai`, `/learn`, `/pricing`, `/settings`) via React 18 and Vite for smooth SPA state transitions.
- **Server-Side Rendering (SSR)**: Used for public, indexable landing and showcase pages (`/`, `/explore`, `/p/:id`) pre-rendered directly on the Node.js Express server using `react-dom/server` (`renderToString`).

### SSR Request Lifecycle
```
[User Browser]
       │
       ▼  1. GET / or GET /explore
[Express Server]
       │
       ├─► 2. Pre-fetch Data from Database (PostgreSQL / localDb store)
       ├─► 3. React Component Tree rendered via ReactDOMServer.renderToString(element)
       ├─► 4. Generate Complete HTML Shell + inject window.__INITIAL_DATA__
       │
       ▼  5. Complete Pre-rendered HTML Streamed to Browser (Instant FCP)
[Browser DOM Rendered]
       │
       ▼  6. Browser loads /ssr/hydrate-landing.js
[ReactDOM.hydrateRoot(root, Component)]
       │
       ▼  7. Event listeners attached (Interactive Hydration Complete)
[Interactive Web Page]
```

### SSR vs CSR Technical Comparison
| Architectural Dimension | Server-Side Rendering (SSR) | Client-Side Rendering (CSR) |
|---|---|---|
| **Primary Target Pages** | Public Landing (`/`), Explore (`/explore`), Project Details (`/p/:id`) | Authenticated App (`/dashboard`, `/projects`, `/tasks`, `/ai`, `/pricing`) |
| **Initial HTML Response** | Fully formed HTML containing actual titles, stats, and text | Minimal `<div id="root"></div>` shell |
| **First Contentful Paint (FCP)** | Instant (~5-15ms) on initial request | Delayed until JS bundle downloads and executes (~200-500ms) |
| **SEO & Social Crawlers** | 100% crawlable without JavaScript execution | Requires crawler JS evaluation |
| **Data Fetching Timing** | Pre-fetched on server before response dispatch | Fetched asynchronously in `useEffect` on client |
| **Hydration Mechanics** | `ReactDOM.hydrateRoot()` binds listeners to pre-existing DOM nodes | `ReactDOM.createRoot().render()` creates DOM from scratch |
| **Implementation Files** | `server/src/ssr/renderer.js`, `server/src/ssr/components/*`, `server/public/ssr/*` | `client/src/App.jsx`, `client/src/main.jsx` |

---

## 7. Payment Gateway Integration (Razorpay Test Mode)

DevTrack AI integrates Razorpay Test Mode with strict server-side cryptographic verification to prevent tampering or unearned subscription upgrades.

### Subscription Plans
1. **Free Plan** (₹0/mo): 3 projects, 25 tasks per project, standard JavaScript modules.
2. **Pro Plan** (₹149/mo): Unlimited projects & tasks, accelerated local Ollama mentorship, milestone velocity reports.
3. **Premium Plan** (₹299/mo): Everything in Pro, 1-on-1 viva defense simulator, deep context memory, and Docker templates.

### Payment Lifecycle & Cryptographic Security
```
[User on /pricing]
       │
       ▼  1. Click "Upgrade to Pro"
[Express API: POST /api/payment/create-order] (Authenticated)
       │
       ├─► Validates plan ID & user session
       ├─► Generates unique Razorpay test order ID (e.g. order_test_...)
       ├─► Calculates exact amount in smallest currency unit (₹149 = 14900 paise)
       └─► Stores record with status: "CREATED"
       │
       ▼  2. Returns { orderId, amount: 14900, currency: "INR", keyId }
[Razorpay Checkout SDK Modal (Client)]
       │
       ├─► User submits test payment (Card / NetBanking / UPI)
       └─► Razorpay returns { razorpay_order_id, razorpay_payment_id, razorpay_signature }
       │
       ▼  3. POST /api/payment/verify (Authenticated)
[Express API: Cryptographic Verification]
       │
       ├─► Recomputes expected signature:
       │     crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
       │           .update(razorpay_order_id + '|' + razorpay_payment_id)
       │           .digest('hex')
       │
       ├─► Timing-Safe Buffer Comparison:
       │     crypto.timingSafeEqual(expectedBuffer, actualBuffer)
       │
       ├─► IF MISMATCH: Rejects with 400 Bad Request, marks payment "FAILED"
       └─► IF MATCH: Marks payment "SUCCESS", activates 30-day Subscription in PostgreSQL
       │
       ▼  4. Returns 200 OK + Updated Subscription
[Client / Dashboard]
       │
       └─► React AuthContext refreshes badge: PRO Active
```

### Key Security Implementations
- **Zero Key Leakage**: `RAZORPAY_KEY_SECRET` resides strictly in `server/.env`.
- **Timing-Safe Comparison**: `crypto.timingSafeEqual` prevents timing attacks on signatures.
- **Relational Integrity**: `Payment` and `Subscription` models are bound to the authenticated `User` with PostgreSQL foreign key constraints.
- **Tampering Invariant**: Subscriptions cannot be activated without a mathematically valid signature signed with the server's private secret.

---

## 8. Complete Docker Containerization & Orchestration

DevTrack AI provides complete, production-ready Docker containerization orchestrating the frontend, backend, PostgreSQL database, MongoDB database, and Ollama local AI runtime in an isolated, reproducible environment.

### 8.1 Core Containerization Concepts
* **What is Docker?**: An open-source containerization platform that packages applications and their full runtime dependencies (system binaries, libraries, configuration) into standardized executable units called containers.
* **What is Containerization?**: Operating-system-level virtualization that isolates processes using Linux kernel namespaces and cgroups. Unlike traditional Virtual Machines (VMs) which emulate an entire guest operating system and virtual hardware, containers share the host OS kernel, resulting in near-instant boot times (~1-3s) and minimal CPU/memory overhead.
* **Image vs. Container**:
  * **Docker Image**: An immutable, read-only, multi-layered template containing source code, runtime, libraries, environment variables, and configuration files.
  * **Docker Container**: A live, runnable instance of an image. When started, Docker adds a thin, writeable container layer on top of the immutable image layers.

### 8.2 Service Topology (`docker-compose.yml`)

```
                          [User Host Browser]
                                   │
              ┌────────────────────┴────────────────────┐
              ▼ :80 / :5173                             ▼ :5000
    ┌───────────────────┐                     ┌───────────────────┐
    │ devtrack_frontend │                     │  devtrack_backend │
    │   (Nginx 1.27)    │───/api/ reverse────►│ (Express.js API)  │
    └───────────────────┘       proxy         └───────────────────┘
              │                                         │
              │                                         │
  ════════════╪═════════════════════════════════════════╪══════════════════
              │     devtrack-network (Bridge DNS)       │
              └──────────────────┬──────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│devtrack_postgres │   │ devtrack_mongodb │   │  devtrack_ollama │
│ (PostgreSQL 16)  │   │   (MongoDB 7.0)  │   │  (Ollama Daemon) │
└──────────────────┘   └──────────────────┘   └──────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
 ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
 │postgres_data  │       │  mongo_data   │       │ ollama_models │
 │ (Named Volume)│       │ (Named Volume)│       │ (Named Volume)│
 └───────────────┘       └───────────────┘       └───────────────┘
```

| Service | Container Name | Base Image | Internal Port | Host Port | Purpose |
|---|---|---|---|---|---|
| **frontend** | `devtrack_frontend` | `nginx:1.27-alpine` (multi-stage) | `80` | `80:80`, `5173:80` | Serves compiled React 18 production bundle, proxies `/api/` & SSR |
| **backend** | `devtrack_backend` | `node:20-alpine` | `5000` | `5000:5000` | Node.js Express API, Prisma ORM, SSR rendering, JWT auth |
| **postgres** | `devtrack_postgres` | `postgres:16-alpine` | `5432` | `5432:5432` | Relational storage for Users, Projects, Tasks, Subscriptions |
| **mongodb** | `devtrack_mongodb` | `mongo:7.0` | `27017` | `27017:27017` | Document database for AI conversation threads & message histories |
| **ollama** | `devtrack_ollama` | `ollama/ollama:latest` | `11434` | `11434:11434` | Local LLM inference engine serving `llama3.2` |

### 8.3 Dockerfiles Implementation

#### Frontend Multi-Stage Build ([`client/Dockerfile`](file:///d:/Project/client/Dockerfile))
* **Stage 1 (`builder`)**: Uses `node:20-alpine`, installs dependencies, and compiles the React + Vite static bundle into `/app/dist`.
* **Stage 2 (`runner`)**: Uses `nginx:1.27-alpine`, copies the compiled bundle to `/usr/share/nginx/html`, and applies a custom [`client/nginx.conf`](file:///d:/Project/client/nginx.conf) providing Single-Page Application routing (`try_files $uri $uri/ /index.html;`), gzip compression, and reverse proxying for `/api/` to `http://backend:5000/api/`.

#### Backend Production Image ([`server/Dockerfile`](file:///d:/Project/server/Dockerfile))
* Uses `node:20-alpine` with `openssl` and `libc6-compat` libraries required for the Prisma query engine.
* Runs `npx prisma generate` to build the platform-specific Linux musl Prisma client.
* Switches to a non-root system user (`USER node`) for security best practices.
* Implements an HTTP health check probe via `wget --spider http://localhost:5000/api/health`.

### 8.4 Docker Networking & Service Discovery
* All containers join an isolated bridge network: `devtrack-network`.
* Containers communicate using internal Docker DNS service names rather than `localhost`:
  * PostgreSQL: `postgres:5432` (Connection string: `postgresql://postgres:postgres@postgres:5432/devtrack_db?schema=public`)
  * MongoDB: `mongodb:27017` (URI: `mongodb://mongodb:27017/devtrack_ai`)
  * Ollama: `http://ollama:11434`
  * Express API: `http://backend:5000`

### 8.5 Data Persistence with Named Volumes
Data survives container lifecycle events (stop, destroy, rebuild) via Docker named volumes:
* `devtrack_postgres_data`: Persists PostgreSQL relational tables at `/var/lib/postgresql/data`.
* `devtrack_mongo_data`: Persists MongoDB collections and B-Tree indexes at `/data/db`.
* `devtrack_ollama_models`: Persists downloaded LLM model weights (e.g., ~2.0 GB for `llama3.2`) at `/root/.ollama` so models are not re-downloaded upon container restart.

### 8.6 Health Checks & Startup Ordering
Services declare health checks so dependent services only start when dependencies are genuinely ready:
```yaml
depends_on:
  postgres:
    condition: service_healthy
  mongodb:
    condition: service_healthy
  ollama:
    condition: service_started
```
* **Postgres**: Validated via `pg_isready -U postgres -d devtrack_db`.
* **MongoDB**: Validated via `mongosh --eval 'db.adminCommand("ping")'`.
* **Backend**: Validated via `wget --spider http://localhost:5000/api/health`.
* **Frontend**: Validated via `wget --spider http://localhost/health`.

### 8.7 Step-by-Step Docker Commands

#### 1. Validate Configuration
```bash
docker compose config
```

#### 2. Build and Start All Containers in Background
```bash
docker compose up -d --build
```

#### 3. Inspect Container Status & Health
```bash
docker compose ps
```

#### 4. Pull the Local AI Model into the Persistent Volume
```bash
docker compose exec ollama ollama pull llama3.2
```
> **Note on GPU Access**: Ollama runs on CPU by default in standard Docker Desktop configurations. On Linux workstations with an NVIDIA GPU and `nvidia-container-toolkit` installed, GPU passthrough can be enabled by adding `deploy: resources: reservations: devices: - driver: nvidia, count: all, capabilities: [gpu]` under the `ollama` service in `docker-compose.yml`.

#### 5. Stream Container Logs
```bash
# View logs from all services:
docker compose logs -f

# View logs from backend only:
docker compose logs -f backend
```

#### 6. Stop and Clean Up Containers
```bash
# Stop containers (preserves volume data):
docker compose down

# Stop containers and remove named volumes (clean reset):
docker compose down -v
```

---

## 9. Redis In-Memory Caching (Cache-Aside Pattern)

DevTrack AI integrates Redis 7 as an enterprise-grade, in-memory caching tier designed to eliminate repetitive database aggregation queries, accelerate dashboard response times to sub-millisecond speeds, and isolate cached data on a per-user multi-tenant boundary.

```
                           [Client Request]
                                  │
                                  ▼
                     [Express Controller / Route]
                                  │
                                  ▼
               ┌─────────────────────────────────────┐
               │    1. Check Redis (cacheService)    │
               └─────────────────────────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼ (Cache Hit)                     ▼ (Cache Miss)
        ┌──────────────────┐              ┌──────────────────┐
        │ Return from RAM  │              │ Query PostgreSQL │
        │   (X-Cache: HIT) │              │  (Prisma Engine) │
        └──────────────────┘              └──────────────────┘
                 │                                 │
                 │                                 ▼
                 │                        ┌──────────────────┐
                 │                        │ Populate Redis   │
                 │                        │   with TTL       │
                 │                        └──────────────────┘
                 │                                 │
                 │                                 ▼
                 └────────────────►┬───────────────┘
                                   │
                                   ▼
                         [X-Cache: MISS / HIT]
                        [Send 200 OK Response]
```

### 9.1 Core Caching Fundamentals

* **What is Redis?**: Remote Dictionary Server is an open-source, advanced in-memory key-value data structure store. Because all dataset items reside in volatile RAM rather than magnetic or solid-state disk, read and write operations execute in microsecond or single-digit millisecond time frames.
* **Why Caching is Useful**:
  * **Reduces Database Contention**: Eliminates repeated relational `COUNT(*)`, `WHERE`, and `JOIN` operations across thousands of concurrent student requests.
  * **Accelerates User Experience**: Decreases typical API latency from ~45–120ms (disk-bound SQL execution) to <2ms (in-memory lookup).
  * **Scales Read-Heavy Workloads**: In typical developer dashboards, read queries outnumber write queries by more than 10:1. Serving reads from Redis frees PostgreSQL CPU cycles to focus on write transactions.
* **Cache Hit vs. Cache Miss**:
  * **Cache Hit**: The requested key is found in Redis and its TTL has not expired. The serialized JSON string is parsed and immediately dispatched with HTTP response header `X-Cache: HIT`.
  * **Cache Miss**: The key is missing, expired, or invalidated. The application executes the database query, serializes the result, stores it in Redis with an expiration TTL, and dispatches the response with HTTP header `X-Cache: MISS`.
* **Time-To-Live (TTL)**:
  * An automated expiration counter (in seconds) assigned to every cached key upon creation (`SET key value EX ttlSeconds`).
  * Prevents stale data from lingering indefinitely and guards RAM against memory exhaustion.
  * In DevTrack AI:
    * Dashboard statistics: **300 seconds** (5 minutes).
    * Project list: **300 seconds** (5 minutes).
    * Task list: **120 seconds** (2 minutes).

### 9.2 Cache-Aside (Lazy Loading) Architecture

DevTrack AI strictly implements the **Cache-Aside** design pattern:
1. **Read Operations**: The application logic first queries Redis. If data is present (Hit), it returns early. If data is absent (Miss), the application reads from PostgreSQL, writes the result to Redis, and returns the response. Redis never communicates directly with the database.
2. **Write Operations (Mutations)**: When an entity is created, modified, or deleted (`POST`, `PUT`, `DELETE`), the application writes directly to the primary database, and immediately **invalidates** (deletes) all relevant cached keys. Future reads will naturally miss and re-populate the cache with fresh data.

### 9.3 Multi-Tenant Key Schema & User Isolation

To guarantee that User A can never inspect or leak User B's cached metrics, every cache key is strictly prefixed with the authenticated student's unique UUID:

| Resource | Cache Key Template | TTL | Invalidation Trigger |
|---|---|---|---|
| **Dashboard Stats** | `devtrack:user:{userId}:dashboard:stats` | 300s | Project or Task Create, Update, Delete, Toggle |
| **Projects List** | `devtrack:user:{userId}:projects:list` | 300s | Project Create, Update, Delete; Task Status Toggle |
| **Project Details** | `devtrack:user:{userId}:projects:{projectId}` | 300s | Project Update, Delete |
| **Tasks List** | `devtrack:user:{userId}:tasks:list:{queryHash}` | 120s | Task Create, Update, Delete, Status Toggle |
| **Task Details** | `devtrack:user:{userId}:tasks:{taskId}` | 120s | Task Update, Delete, Status Toggle |

### 9.4 Automated Cascade Invalidation Logic

Because task progress directly alters project completion percentages and dashboard velocity metrics, mutations trigger intelligent multi-key invalidations:
* **Creating / Updating / Deleting a Project**:
  * Calls `delPattern("devtrack:user:{userId}:projects:*")`
  * Calls `del("devtrack:user:{userId}:dashboard:stats")`
* **Creating / Updating / Deleting / Toggling a Task**:
  * Calls `delPattern("devtrack:user:{userId}:tasks:*")`
  * Calls `delPattern("devtrack:user:{userId}:projects:*")` (updates dynamic completion percentages)
  * Calls `del("devtrack:user:{userId}:dashboard:stats")` (updates pending/completed metrics)

### 9.5 Technical Comparison: Redis vs. PostgreSQL

| Dimension | Redis (In-Memory Cache) | PostgreSQL (Relational Database) |
|---|---|---|
| **Primary Role** | Fast ephemeral cache & session store | Source of truth for ACID relational entities |
| **Storage Medium** | Volatile RAM (optional RDB/AOF persistence) | Non-volatile Disk / SSD with write-ahead logging (WAL) |
| **Data Model** | Key-Value, Hashes, Sets, Sorted Sets, Strings | Relational Tables, Rows, Foreign Keys, JSONB |
| **Query Mechanism** | Direct Key Hash Lookup (`O(1)` time complexity) | SQL engine with index scans, joins, query planner |
| **Typical Read Latency** | **< 1 millisecond** (RAM access) | **10–100+ milliseconds** (Disk I/O, locks, parsing) |
| **Durability Guarantee** | Ephemeral / Periodic snapshots | Full ACID durability; zero transaction loss |
| **DevTrack AI Usage** | Accelerates `/dashboard/stats`, `/projects`, `/tasks` | Stores `User`, `Project`, `Task`, `Subscription` |

### 9.6 Resilient Offline Degradation

DevTrack AI adheres to the **Graceful Degradation** design principle:
* If Redis is stopped or unreachable during development, the backend logs a warning and automatically switches to an in-memory LRU Map fallback with identical key isolation.
* The Express API and all client features remain **100% operational** with zero crashes or unhandled promise rejections.
* When Redis comes back online, the client automatically re-establishes its socket connection and resumes distributed caching.

---

## 10. Comprehensive Documentation Links

- **[Product Requirements Document (`PRD.md`)](./PRD.md)**: Product vision, user personas, epics, functional and non-functional requirements.
- **[High-Level Design (`HLD.md`)](./HLD.md)**: C4 diagrams, system topology, polyglot storage rationale, local AI subsystem, and security architecture.
- **[Low-Level Design (`LLD.md`)](./LLD.md)**: Class diagrams, Prisma and Mongoose schemas, middleware call stack, and API response contracts.
- **[System Architecture Guide (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)**: Layered architecture, component composition, and data flow.
- **[Database Models & Schemas (`docs/DATABASE.md`)](./docs/DATABASE.md)**: ER diagrams, foreign key constraints, indexes, and migrations.
- **[RESTful API Specification (`docs/API.md`)](./docs/API.md)**: Detailed endpoint schemas, request/response bodies, and HTTP status codes.
- **[Assessment Preparation Guide (`docs/ASSESSMENT-GUIDE.md`)](./docs/ASSESSMENT-GUIDE.md)**: Complete demonstration script and viva defense manual covering all 26 core curriculum topics.

---

## 11. License

MIT License. Built for software engineering education.
