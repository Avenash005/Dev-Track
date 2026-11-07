# DevTrack AI — Student Assessment Preparation Guide & Demonstration Script

This guide provides a comprehensive preparation script covering all **27 core curriculum topics** (including Server-Side Rendering, Payment Gateway Integration, Docker Containerization, Redis In-Memory Caching, and WebSocket Real-Time Communication) evaluated during technical presentations, code reviews, and viva examinations.

---

## Demonstration Script & Topic-by-Topic Defense

### Topic 1: Monorepo Architecture & Modular Organization
- **Where to show**: Root `package.json`, `.gitignore`, `client/`, `server/`, `docs/`.
- **Examiner Question**: *"Why structure the project as a monorepo rather than two separate repositories?"*
- **Student Answer**:
  > *"A monorepo structure co-locates the React frontend, Express API, and architectural documentation under unified version control. Using npm workspaces allows single-command root orchestration (`npm run client:dev`, `npm run server:dev`), shared linting/formatting standards, and atomic commits that link backend API changes with corresponding frontend consumption."*

---

### Topic 2: Structured Git Workflow & Branching Strategy
- **Where to show**: `git log --oneline --graph`, feature branches (`feature/frontend-dashboard`, `feature/authentication`).
- **Examiner Question**: *"Explain your branching strategy and why direct commits to main are discouraged."*
- **Student Answer**:
  > *"We utilize Gitflow branching. `main` strictly holds deployable production code, `develop` serves as the integration trunk, and isolated feature branches (e.g., `feature/frontend-dashboard`, `feature/authentication`) isolate ongoing development. This prevents broken intermediary states from halting team progress and ensures every commit message follows conventional commit specifications (`feat:`, `chore:`, `fix:`)."*

---

### Topic 3: React Component Architecture & Atomic Design
- **Where to show**: `client/src/components/common/` (`StatCard.jsx`, `Badge.jsx`, `Modal.jsx`, `EmptyState.jsx`), `client/src/components/layout/`.
- **Examiner Question**: *"How did you ensure UI components are reusable across multiple pages?"*
- **Student Answer**:
  > *"Components follow the Single Responsibility Principle. Atomic components like `StatCard`, `Badge`, and `Modal` accept configurable props (color variants, callbacks, child elements) without hardcoding business assumptions. For example, `Modal.jsx` manages backdrop blur and ESC key listeners while accepting dynamic form bodies (`ProjectForm` or `TaskForm`)."*

---

### Topic 4: React State Management with `useState`
- **Where to show**: `ProjectsPage.jsx`, `TasksPage.jsx`, `LearnConceptsPage.jsx`.
- **Examiner Question**: *"How do you decide what belongs in local state versus context state?"*
- **Student Answer**:
  > *"Transient UI state that only affects a single view—such as search inputs, modal visibility toggles (`isCreateOpen`), active tab selection, and form field validation errors—resides in local `useState`. Global state shared across distant components (authenticated user session, project lists) is elevated to React Context (`AuthContext`, `DataContext`)."*

---

### Topic 5: React Lifecycle & Side Effects with `useEffect`
- **Where to show**: `AuthContext.jsx` (session hydration), `Modal.jsx` (DOM event listeners), `AIAssistantPage.jsx` (chat scroll pinning).
- **Examiner Question**: *"Why is a cleanup function critical when using useEffect for window event listeners?"*
- **Student Answer**:
  > *"In `Modal.jsx`, we attach a keydown listener for the Escape key and set `document.body.style.overflow = 'hidden'`. When the modal closes or unmounts, the cleanup return function strips the listener with `removeEventListener` and restores body scrolling. Omitting cleanup leads to memory leaks and unintended event handlers firing on unmounted components."*

---

### Topic 6: Client-Side Routing with React Router DOM
- **Where to show**: `client/src/App.jsx`, `AppLayout.jsx`.
- **Examiner Question**: *"How does client-side routing differ from traditional server-side rendering?"*
- **Student Answer**:
  > *"With `react-router-dom`, navigation happens entirely in the browser without reloading the page or requesting a new HTML document from the server. The `AppLayout` renders a master shell with `<Sidebar>` and `<Header>`, while `<Outlet />` dynamically mounts sub-routes (`/dashboard`, `/projects`, `/tasks`, `/ai`, `/learn`, `/settings`) with zero page flicker."*

---

### Topic 7: Modern CSS Styling with Tailwind CSS Tokens
- **Where to show**: `client/tailwind.config.js`, `client/src/index.css`.
- **Examiner Question**: *"How did you configure custom design tokens?"*
- **Student Answer**:
  > *"We extended the Tailwind theme in `tailwind.config.js` to match the exact SaaS dark-theme specification: background `#09090B`, sidebar `#111113`, cards `#18181B`, borders `#27272A`, primary violet `#8B5CF6`, and secondary blue `#3B82F6`. This guarantees consistent styling without arbitrary inline CSS."*

---

### Topic 8: JavaScript Lexical Scope & Closures
- **Where to show**: `client/src/pages/LearnConceptsPage.jsx` (Module 1 & live counter demo).
- **Examiner Question**: *"What is a closure, and how does your interactive counter demonstrate it?"*
- **Student Answer**:
  > *"A closure is a function bundled with references to its surrounding lexical environment. In our interactive sandbox, `createCounter(initialValue)` declares a private variable `let count`. The returned methods (`increment`, `decrement`, `getCount`) retain access to that exact heap-allocated variable even long after `createCounter` finished execution."*

---

### Topic 9: JavaScript Event Loop, Call Stack & Microtasks
- **Where to show**: `client/src/pages/LearnConceptsPage.jsx` (Module 2).
- **Examiner Question**: *"Why does Promise.then execute before setTimeout(0)?"*
- **Student Answer**:
  > *"The event loop gives priority to the Microtask Queue (which processes Promises and `queueMicrotask`) over the Macrotask Queue (timers like `setTimeout`). Once the synchronous Call Stack drains, all pending microtasks are executed before the event loop advances to the next timer phase."*

---

### Topic 10: JavaScript Hoisting & Temporal Dead Zone (TDZ)
- **Where to show**: `client/src/pages/LearnConceptsPage.jsx` (Module 3).
- **Examiner Question**: *"What happens when you access a `let` variable before declaration versus a `var`?"*
- **Student Answer**:
  > *"`var` is hoisted and initialized to `undefined`. In contrast, `let` and `const` declarations are hoisted into the Temporal Dead Zone (TDZ)—they exist in memory but remain uninitialized. Accessing them prior to the declaration line throws a `ReferenceError`."*

---

### Topic 11: Callbacks vs Promises vs Async/Await
- **Where to show**: `client/src/pages/LearnConceptsPage.jsx` (Module 4).
- **Examiner Question**: *"What advantages does async/await provide over nested callbacks?"*
- **Student Answer**:
  > *"Nested callbacks produce 'Callback Hell', obscuring control flow and complicating error handling. Promises flattened this into `.then().catch()` chains. `async`/`await` provides synchronous-style readability over Promises, allowing developers to use standard `try/catch` blocks for unified error management."*

---

### Topic 12: Node.js & Express RESTful API Architecture
- **Where to show**: `server/src/server.js`, `server/src/controllers/`, `server/src/services/`.
- **Examiner Question**: *"Explain how requests flow through your backend layers."*
- **Student Answer**:
  > *"Requests arrive at `server.js`, pass through CORS and body parsers, flow through middlewares (logging, JWT verification, body validation), reach the Controller (which handles HTTP transport and validation), call the Service (which executes business logic and database queries), and return via `apiResponse` with proper HTTP status codes."*

---

### Topic 13: Express Middleware Execution Pipeline
- **Where to show**: `server/src/middleware/` (`loggingMiddleware.js`, `authMiddleware.js`, `validationMiddleware.js`, `errorMiddleware.js`).
- **Examiner Question**: *"How does Express know when to proceed to the next middleware?"*
- **Student Answer**:
  > *"Middleware functions accept `(req, res, next)`. By calling `next()`, control passes to the next handler in the stack. If a validation error or authentication failure occurs, the middleware short-circuits execution by returning a response immediately (e.g. `401 Unauthorized`), preventing unauthorized requests from ever touching downstream controllers."*

---

### Topic 14: Relational Data Modeling with PostgreSQL & Prisma
- **Where to show**: `server/prisma/schema.prisma`.
- **Examiner Question**: *"Walk me through the relations and cascade deletes in your schema."*
- **Student Answer**:
  > *"We have three relational models: `User`, `Project`, and `Task`. `Project` belongs to `User` via `user_id`, and `Task` belongs to `Project` via `project_id`. Both relationships specify `onDelete: Cascade`. If a user deletes a project, PostgreSQL automatically deletes all mapped tasks, preserving database integrity."*

---

### Topic 15: Document Modeling with MongoDB & Mongoose
- **Where to show**: `server/src/models/Conversation.js`.
- **Examiner Question**: *"Why use MongoDB for AI conversations instead of PostgreSQL?"*
- **Student Answer**:
  > *"AI chat interactions are unstructured, polymorphic, and append-heavy. Storing conversations as MongoDB documents with embedded message arrays eliminates the need for complex multi-table joins. We apply a compound index `{ userId: 1, updatedAt: -1 }` for rapid conversation history lookups."*

---

### Topic 16: User Authentication with JWT & bcrypt
- **Where to show**: `server/src/services/authService.js`, `server/src/middleware/authMiddleware.js`.
- **Examiner Question**: *"How do you protect user passwords and authorize requests?"*
- **Student Answer**:
  > *"During registration, passwords are salted and hashed using `bcryptjs` with 10 rounds. On login, `bcrypt.compare` verifies the submitted plaintext password against the stored hash. Upon verification, the server signs a stateless JWT containing `{ id, email, name }` with a 7-day expiration. Protected endpoints check `Authorization: Bearer <token>`."*

---

### Topic 17: Full Project CRUD Operations
- **Where to show**: `server/src/controllers/projectController.js`, `client/src/pages/ProjectsPage.jsx`.
- **Examiner Question**: *"How do you prevent User A from modifying User B's project?"*
- **Student Answer**:
  > *"Every query in `projectService.js` scopes its lookup to `WHERE id = projectId AND user_id = req.user.id`. Even if an attacker knows another project's UUID, the database query returns `null`, and the service throws a `404 Not Found`."*

---

### Topic 18: Task CRUD & Filtering
- **Where to show**: `server/src/services/taskService.js`, `client/src/pages/TasksPage.jsx`.
- **Examiner Question**: *"How does task filtering work across status, priority, and search?"*
- **Student Answer**:
  > *"`GET /api/tasks` accepts query parameters: `?status=IN_PROGRESS&priority=HIGH&search=Raft`. The service constructs a dynamic filter clause matching user-owned projects, returns the filtered tasks, and updates the UI reactively."*

---

### Topic 19: Local Ollama AI Integration
- **Where to show**: `server/src/services/aiService.js`, `client/src/pages/AIAssistantPage.jsx`.
- **Examiner Question**: *"Explain the flow of an AI prompt from the UI to Ollama and back."*
- **Student Answer**:
  > *"The React UI sends `POST /api/ai/chat` with user prompt and JWT. Express validates authentication, loads past conversation messages from MongoDB, appends a system prompt ('You are DevTrack AI mentor...'), and forwards the payload via HTTP to `http://localhost:11434/api/chat`. Express saves the assistant's reply to MongoDB and returns it to the client. If Ollama is offline, Express returns a 503 or helpful troubleshooting instructions without crashing."*

---

### Topic 20: HTTP Status Code Precision
- **Where to show**: `server/src/utils/apiResponse.js`, `server/test-api.js`.
- **Examiner Question**: *"Give examples of when your API returns 201, 204, 400, 409, and 503."*
- **Student Answer**:
  > *"201 is returned when creating a user or project; 204 is returned when deleting a project with no response body; 400 is returned when registration input fails email/password validation; 409 is returned when registering an email that already exists; and 503 is returned if the local Ollama daemon or database service is unreachable."*

---

### Topic 21: Environment Security & Configuration
- **Where to show**: `server/src/config/env.js`, `server/.env.example`.
- **Examiner Question**: *"How do you protect sensitive credentials?"*
- **Student Answer**:
  > *"All secrets (`JWT_SECRET`, database URIs) reside in `server/.env`, which is strictly ignored by `.gitignore`. `server/src/config/env.js` validates these variables at startup and halts the process if critical keys are missing. We provide `server/.env.example` as a template for team onboarding without leaking production keys."*

---

### Topic 22: Automated Verification & Testing
- **Where to show**: `server/test-api.js`.
- **Examiner Question**: *"How do you verify that your API meets requirements?"*
- **Student Answer**:
  > *"We execute `node test-api.js`, which runs an automated 84-assertion test suite verifying health checks, registration, token generation, 409 duplicate handling, 401 unauthorized rejection, project CRUD, task CRUD, dashboard statistics, AI chat, SSR public HTML pre-rendering, Razorpay payment order creation, signature verification, tampering defense, subscription updates, Redis in-memory caching (cache hits, misses, TTL, user isolation, and cascade invalidations), and WebSocket real-time communication (Socket.IO handshake authentication, user room isolation, and multi-client event broadcasting). Every assertion must pass with 0 failures."*

---

### Topic 23: Server-Side Rendering (SSR) & React Hydration
- **Where to show**: `server/src/ssr/renderer.js`, `server/src/ssr/components/LandingPage.js`, `server/public/ssr/hydrate-landing.js`, `GET /` and `GET /explore`.
- **Examiner Question**: *"Walk me through how a request reaches the server, fetches data, generates pre-rendered HTML, and hydrates on the client."*
- **Student Answer**:
  > *"When a client requests `GET /`, Express intercepts the route in `server/src/server.js`. The server fetches live project and task aggregates directly from the database, constructs a React component tree (`<LandingPage initialData={stats} />`), and invokes `ReactDOMServer.renderToString()` to produce a static HTML markup string. We embed this inside an HTML document shell that serializes the data into `window.__INITIAL_DATA__` and references the client hydration script `/ssr/hydrate-landing.js`.\n\nThe browser receives fully formed, search-engine-crawlable HTML with zero layout shift (First Contentful Paint occurs immediately). Once the browser loads `hydrate-landing.js`, `ReactDOM.hydrateRoot()` matches the existing DOM tree and attaches JavaScript event listeners—such as our interactive FAQ accordion—without re-rendering DOM nodes. This demonstrates the performance and SEO benefits of SSR alongside the interactivity of React."*

---

### Topic 24: Payment Gateway Integration & HMAC-SHA256 Cryptographic Verification
- **Where to show**: `server/src/services/paymentService.js`, `server/src/controllers/paymentController.js`, `client/src/pages/PricingPage.jsx`, `server/test-api.js`.
- **Examiner Question**: *"Why can't you trust payment success callbacks from the frontend, and how does HMAC-SHA256 verification work?"*
- **Student Answer**:
  > *"A client-side browser is an untrusted environment. A malicious user could tamper with frontend JavaScript, intercept network traffic, or forge a 'success' response payload to gain free subscription access without paying. To prevent this, we use Razorpay Test Mode with strict two-phase server verification:\n\n1. In phase one (`POST /api/payment/create-order`), Express creates a unique order record with status `CREATED` and calculates the exact integer price in paise (₹149 = 14900 paise). The secret key `RAZORPAY_KEY_SECRET` remains exclusively on the backend.\n2. In phase two (`POST /api/payment/verify`), the browser sends back `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The backend computes `expectedSignature = crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex')` and validates it against `razorpay_signature` using `crypto.timingSafeEqual` to prevent timing attacks. Only if the cryptographic signature matches is the payment marked `SUCCESS` and the user's `Subscription` upgraded in PostgreSQL."*

---

### Topic 25: Full-Stack Docker Containerization & Multi-Service Orchestration
- **Where to show**: `docker-compose.yml`, `client/Dockerfile`, `client/nginx.conf`, `server/Dockerfile`, `.dockerignore`.
- **Examiner Question**: *"Explain how your multi-service Docker architecture operates and how containers discover one another."*
- **Student Answer**:
  > *"DevTrack AI defines 5 distinct services in `docker-compose.yml`: `frontend` (React + Vite compiled into a multi-stage Nginx image), `backend` (Node.js 20 Express API running as a non-root `node` user with platform-generated Prisma client), `postgres` (PostgreSQL 16), `mongodb` (MongoDB 7.0), and `ollama` (local LLM runtime). All containers are attached to a shared bridge network (`devtrack-network`). Containers discover and route to one another using internal Docker DNS service names (e.g. `postgresql://postgres:postgres@postgres:5432/devtrack_db` and `mongodb://mongodb:27017/devtrack_ai`). Nginx on the frontend reverse proxies `/api/` calls directly to `http://backend:5000/api/`, eliminating cross-origin browser issues. Service dependencies use `condition: service_healthy` so the backend only launches when PostgreSQL and MongoDB pass their respective health checks."*

---

### Topic 26: Redis In-Memory Caching & Cache-Aside Invalidation
- **Where to show**: `server/src/config/redis.js`, `server/src/services/cacheService.js`, `server/src/controllers/dashboardController.js`, `server/src/controllers/projectController.js`, `server/src/controllers/taskController.js`, `docker-compose.yml` (redis service).
- **Examiner Question**: *"Explain your caching strategy. How do you ensure cache consistency when data changes, and how do you prevent cross-tenant data leaks?"*
- **Student Answer**:
  > *"We implement the Cache-Aside (lazy loading) pattern using Redis 7. For read operations (such as `GET /api/dashboard/stats`, `GET /api/projects`, `GET /api/tasks`), Express inspects Redis first using `cacheService`. On a cache hit, we return the cached JSON in sub-millisecond time with header `X-Cache: HIT`. On a cache miss, we query PostgreSQL, store the serialized payload in Redis with a Time-To-Live (TTL) of 120s–300s, and return `X-Cache: MISS`.\n\nTo prevent cross-tenant data leaks, all keys are strictly namespaced with the authenticated user's UUID (`devtrack:user:{userId}:...`), ensuring User A can never access User B's cached metrics. To maintain cache consistency and prevent stale data, write operations (`POST`, `PUT`, `DELETE`, status toggles) immediately write to PostgreSQL and trigger automated cascade invalidations via `delPattern()`. For example, modifying a task deletes `devtrack:user:{userId}:tasks:*`, `devtrack:user:{userId}:projects:*` (since project completion percentage updates), and `devtrack:user:{userId}:dashboard:stats`. Furthermore, if Redis is temporarily offline, our client employs an in-memory fallback cache so the Express API never crashes."*

---

### Topic 27: WebSocket Real-Time Communication & Full-Duplex Event Architecture
- **Where to show**: `server/src/config/socket.js`, `server/src/server.js`, `client/src/services/socket.js`, `client/src/context/DataContext.jsx`, `client/src/components/layout/AppLayout.jsx`.
- **Examiner Question**: *"How do WebSockets differ from HTTP polling, how do you authenticate WebSocket connections, and how do you prevent User A from seeing User B's events?"*
- **Student Answer**:
  > *"HTTP polling is inefficient and half-duplex—it forces clients to repeatedly establish TCP handshakes and dispatch empty HTTP GET requests every few seconds, generating high latency and server load. In contrast, WebSockets provide persistent, full-duplex communication over a single long-lived connection initiated via an HTTP 101 Upgrade handshake.\n\nIn DevTrack AI, we use Socket.IO (v4.8). We authenticate the connection in `server/src/config/socket.js` using an `io.use()` handshake middleware that verifies the client's JWT bearer token against `env.JWT_SECRET`. Unauthorized connections are immediately rejected. Upon successful verification, the socket automatically joins an isolated user room (`user:${socket.user.id}`).\n\nWhen a mutation succeeds in PostgreSQL (such as creating a task or toggling a status), the controller invokes `socketEvents.emitTaskCreated(userId, task)`, broadcasting the event strictly to that user's private room. In the React frontend, `DataContext.jsx` subscribes to these events and updates local state in memory without refreshing the page, while `AppLayout.jsx` renders an animated live sync toast notification."*

---

## Technical Viva Defense: Containerization with Docker (15 Questions & Answers)

### Question 1: What is Docker?
- **Answer**: Docker is an open-source platform that enables developers to build, package, distribute, and run applications in isolated, lightweight environments called containers. Containers bundle application code, language runtimes, system dependencies, libraries, and environment configurations, guaranteeing identical behavior across development workstations, CI/CD pipelines, and cloud production environments.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 1-15.

### Question 2: Why did you containerize DevTrack AI?
- **Answer**: DevTrack AI is a polyglot full-stack platform with five interdependent runtimes: React 18 frontend, Express API, PostgreSQL relational database, MongoDB document database, and an Ollama local LLM engine. Containerizing eliminates the *"it works on my machine"* syndrome by ensuring PostgreSQL 16, MongoDB 7.0, and Node 20 LTS run in identical versions without requiring the developer or evaluator to manually install and configure database servers on their host operating system.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) services definition.

### Question 3: What is the difference between an image and a container?
- **Answer**: A **Docker Image** is an immutable, read-only template built from instructions in a `Dockerfile` (e.g., [`client/Dockerfile`](file:///d:/Project/client/Dockerfile) or [`server/Dockerfile`](file:///d:/Project/server/Dockerfile)). A **Docker Container** is a live, running instance of that image with its own filesystem, network stack, and isolated process space created by adding a thin, writeable container layer on top of the image's immutable base layers.
- **Reference**: [`client/Dockerfile`](file:///d:/Project/client/Dockerfile) (image recipe) vs `docker compose up` (instantiated containers).

### Question 4: What is Docker Compose?
- **Answer**: Docker Compose is an orchestration tool used to define, configure, and manage multi-container Docker applications. Using a single declarative YAML configuration file (`docker-compose.yml`), developers can build images, configure environment variables, create shared virtual networks, mount persistent volumes, and spin up the entire application stack using a single command: `docker compose up -d`.
- **Reference**: Root [`docker-compose.yml`](file:///d:/Project/docker-compose.yml).

### Question 5: What is the purpose of `docker-compose.yml`?
- **Answer**: `docker-compose.yml` acts as the single source of truth for DevTrack AI's infrastructure-as-code. It defines the configuration for all five services (`frontend`, `backend`, `postgres`, `mongodb`, `ollama`), their port mappings (`80:80`, `5000:5000`, `5432:5432`, `27017:27017`, `11434:11434`), persistent storage volumes (`postgres_data`, `mongo_data`, `ollama_models`), inter-container healthcheck dependencies, and restart policies.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 1-175.

### Question 6: What is a Docker volume?
- **Answer**: A Docker volume is a persistent storage mechanism managed directly by Docker outside of the container's writeable lifecycle layer. Standard container filesystems are ephemeral—if a container is stopped or deleted, its internal filesystem state is lost. Named volumes (`postgres_data`, `mongo_data`, `ollama_models`) store database rows and downloaded LLM model weights safely on the host disk, persisting data even when containers are recreated or rebuilt.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 150-165 (`volumes: postgres_data:, mongo_data:, ollama_models:`).

### Question 7: Why use service names instead of localhost?
- **Answer**: Each container has its own isolated network namespace and its own internal loopback interface (`localhost` / `127.0.0.1`). Inside the `backend` container, `localhost:5432` refers to the backend container itself—not the PostgreSQL container. Inside the user-defined bridge network `devtrack-network`, Docker runs an embedded DNS server that automatically resolves container service names (such as `postgres`, `mongodb`, `ollama`) to their dynamically assigned private container IP addresses.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 94-98:
  ```yaml
  DATABASE_URL: postgresql://postgres:postgres@postgres:5432/devtrack_db?schema=public
  MONGODB_URI: mongodb://mongodb:27017/devtrack_ai
  OLLAMA_BASE_URL: http://ollama:11434
  ```

### Question 8: What is port mapping?
- **Answer**: Port mapping publishes a container's internal listening port to a port on the host machine using the syntax `HOST_PORT:CONTAINER_PORT`. For example, `ports: - "5000:5000"` routes external traffic arriving at port `5000` of the host workstation into port `5000` of the `devtrack_backend` container. In the frontend service, `ports: - "80:80"` and `- "5173:80"` allow users to access the Nginx web server on either standard HTTP port 80 or development port 5173.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 136-138.

### Question 9: What is a Docker network?
- **Answer**: A Docker network is a software-defined virtual network that enables isolated communication between containers. DevTrack AI uses a custom bridge network (`devtrack-network`). Containers attached to this network can communicate freely with each other across all ports using their service names, while remaining isolated from external networks and other unrelated containers running on the host machine.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 168-175 (`networks: devtrack-network: driver: bridge`).

### Question 10: What is a health check?
- **Answer**: A health check is an active command executed periodically inside a container to determine whether the running process is genuinely healthy and ready to handle traffic, rather than just running as an idle or hung PID. For PostgreSQL, `pg_isready` verifies the database engine accepts queries; for MongoDB, `mongosh --eval 'db.adminCommand("ping")'` pings the server; for Express and Nginx, `wget --spider` verifies HTTP 200 responses.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 19-24 and 42-47.

### Question 11: What is a multi-stage Docker build?
- **Answer**: A multi-stage Docker build divides the `Dockerfile` into distinct phases using multiple `FROM` instructions to produce lean, secure production images. In [`client/Dockerfile`](file:///d:/Project/client/Dockerfile), **Stage 1 (`builder`)** uses `node:20-alpine` with npm, devDependencies, and build tooling to compile React + Vite into `/app/dist`. **Stage 2 (`runner`)** uses `nginx:1.27-alpine` and copies *only* the compiled static files from Stage 1 into `/usr/share/nginx/html`. The resulting image excludes Node.js and `node_modules` entirely, reducing the image size from ~450MB to ~25MB.
- **Reference**: [`client/Dockerfile`](file:///d:/Project/client/Dockerfile) lines 9-38.

### Question 12: How does the backend communicate with PostgreSQL and MongoDB?
- **Answer**: The backend communicates through Prisma ORM for PostgreSQL over TCP port 5432 and Mongoose ODM for MongoDB over TCP port 27017. In `docker-compose.yml`, the backend declares `depends_on` with `condition: service_healthy` for both database services. The backend will wait until PostgreSQL's `pg_isready` and MongoDB's ping probe return 0 before starting, preventing startup race conditions and database connection timeouts.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 102-108.

### Question 13: How is Ollama integrated?
- **Answer**: The `ollama` service runs official `ollama/ollama:latest` with port 11434 exposed and a persistent volume `ollama_models:/root/.ollama`. The backend communicates with Ollama via internal HTTP calls to `http://ollama:11434/api/chat`. Models are downloaded once using `docker compose exec ollama ollama pull llama3.2` and cached permanently in the volume. If Ollama is offline or starting up, the Express backend's [`aiService.js`](file:///d:/Project/server/src/services/aiService.js) handles connection errors gracefully and returns informative setup guidance.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 53-67.

### Question 14: What happens if a container crashes?
- **Answer**: All services in `docker-compose.yml` configure `restart: unless-stopped`. If an application uncaught exception or fatal system signal causes a container process to terminate with a non-zero exit code, the Docker daemon automatically restarts the container. If the host machine is rebooted, Docker automatically brings the containers back up unless they were explicitly stopped by the developer via `docker compose down` or `docker compose stop`.
- **Reference**: [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) lines 8, 30, 56, 76, 126.

### Question 15: How do you rebuild and restart containers?
- **Answer**:
  - To rebuild application code after edits and start services: `docker compose up -d --build`
  - To restart a specific service without affecting others: `docker compose restart backend`
  - To view live logs from all containers: `docker compose logs -f`
  - To stop containers safely preserving database volumes: `docker compose down`
  - To destroy containers and delete persistent volumes: `docker compose down -v`
- **Reference**: [`README.md`](file:///d:/Project/README.md) Section 8.7.

---

## Technical Viva Defense: Redis In-Memory Caching (10 Questions & Answers)

### Question 1: What is Redis?
- **Answer**: Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used as a distributed database, cache, message broker, and streaming engine. Unlike disk-bound relational databases, Redis keeps all active dataset structures directly in random-access memory (RAM), delivering read and write operations with sub-millisecond response latency.
- **Reference**: [`server/src/config/redis.js`](file:///d:/Project/server/src/config/redis.js) lines 1-40.

### Question 2: Why is caching useful in DevTrack AI?
- **Answer**: In software engineering management tools like DevTrack AI, read traffic vastly exceeds write traffic (e.g. students viewing dashboards, projects, and task lists). Computing dashboard metrics requires multiple relational aggregations (`COUNT`, `WHERE status = 'COMPLETED'`, calculating completion percentage). Caching these calculated responses in Redis reduces database CPU load, avoids disk I/O, and drops API response latency from ~45–120ms to <2ms.
- **Reference**: [`server/src/controllers/dashboardController.js`](file:///d:/Project/server/src/controllers/dashboardController.js) lines 10-38.

### Question 3: What is the difference between a Cache Hit and a Cache Miss?
- **Answer**:
  - **Cache Hit**: The application searches Redis for a requested key, finds the active record (TTL not expired), deserializes the JSON string, and returns it immediately to the client with HTTP header `X-Cache: HIT`. No database query is executed.
  - **Cache Miss**: The key does not exist or has expired. The application queries PostgreSQL via Prisma, serializes the result, writes it to Redis with an expiration TTL, and returns it to the client with HTTP header `X-Cache: MISS`.
- **Reference**: [`server/src/controllers/dashboardController.js`](file:///d:/Project/server/src/controllers/dashboardController.js) lines 15-32.

### Question 4: What is TTL (Time-To-Live) and why is it essential?
- **Answer**: Time-To-Live is an integer threshold in seconds attached to a Redis key specifying when Redis should automatically evict the key from memory (`SET key value EX ttlSeconds`). TTL is essential because:
  1. It acts as an automated safety net ensuring data does not remain stale indefinitely if an invalidation event is somehow missed.
  2. It bounds memory growth in Redis, preventing RAM exhaustion on long-running servers.
  - In DevTrack AI: Dashboard Stats = 300s (5m), Projects List = 300s (5m), Tasks List = 120s (2m).
- **Reference**: [`server/src/services/cacheService.js`](file:///d:/Project/server/src/services/cacheService.js) lines 6-12.

### Question 5: Explain the Cache-Aside (Lazy Loading) pattern.
- **Answer**: In Cache-Aside, the application code manages all interactions with the cache and the database:
  - On **Read**: The application checks the cache first. If found, it returns the cached data. If not found, it queries the database, writes the retrieved data to the cache with a TTL, and returns it.
  - On **Write**: The application writes changes directly to the primary database, and deletes (invalidates) the affected cache keys.
  - **Advantage**: Data is only loaded into the cache when actually requested (lazy), saving memory by never caching unused records.
- **Reference**: [`server/src/services/cacheService.js`](file:///d:/Project/server/src/services/cacheService.js) and [`README.md`](file:///d:/Project/README.md) Section 9.2.

### Question 6: How does cache invalidation work upon mutations in DevTrack AI?
- **Answer**: Whenever an entity is created, updated, deleted, or transitioned:
  1. The mutation is committed to PostgreSQL (or local store).
  2. The controller invokes `cacheService.invalidateProjectCaches(userId)` or `invalidateTaskCaches(userId)`.
  3. Pattern-based deletion (`SCAN` + `DEL`) clears all matching keys (e.g. `devtrack:user:{userId}:tasks:*`).
  4. Task mutations also invalidate project caches and dashboard stats because task completion dynamically changes project completion percentages and dashboard metrics.
- **Reference**: [`server/src/services/cacheService.js`](file:///d:/Project/server/src/services/cacheService.js) lines 28-48.

### Question 7: How do you prevent cross-tenant cache leaks between different users?
- **Answer**: DevTrack AI guarantees multi-tenant cache isolation by incorporating the authenticated student's unique UUID (`req.user.id`) into every generated cache key:
  - Example: `devtrack:user:usr_98a7bc...:dashboard:stats`
  - When User B requests dashboard stats, the lookup queries `devtrack:user:usr_b12c3d...:dashboard:stats`. Even if both users request stats simultaneously, their keys never collide, and User B can never read User A's cached metrics.
- **Reference**: [`server/src/services/cacheService.js`](file:///d:/Project/server/src/services/cacheService.js) lines 14-26.

### Question 8: Compare Redis and PostgreSQL.
- **Answer**:
  - **Storage Medium**: Redis stores data in volatile RAM (sub-millisecond access); PostgreSQL writes to disk/SSD with write-ahead logs (ACID persistence).
  - **Data Model**: Redis is key-value / data-structures (Strings, Hashes, Sets); PostgreSQL is relational (Tables, Rows, Foreign Keys, SQL).
  - **Role in DevTrack AI**: PostgreSQL is the durable source of truth for users, projects, tasks, and subscriptions; Redis is the ephemeral acceleration layer for high-throughput reads.
- **Reference**: [`README.md`](file:///d:/Project/README.md) Section 9.5 comparison table.

### Question 9: What happens if Redis goes offline or crashes?
- **Answer**: DevTrack AI is architected with **Graceful Degradation**. In [`server/src/config/redis.js`](file:///d:/Project/server/src/config/redis.js), if the Redis client fails to connect or disconnects, an error is logged, but the application does not crash. An internal in-memory fallback cache Map automatically handles caching transparently. The Express REST API remains 100% available, and when Redis recovers, the official client automatically reconnects.
- **Reference**: [`server/src/config/redis.js`](file:///d:/Project/server/src/config/redis.js) lines 18-36.

### Question 10: How do you verify Redis caching in the automated test suite?
- **Answer**: In [`server/test-api.js`](file:///d:/Project/server/test-api.js) (Section 19), automated assertions verify:
  1. Cold request returns `X-Cache: MISS`.
  2. Immediate warm request returns `X-Cache: HIT` with identical payload.
  3. Request by User B returns `X-Cache: MISS` (proving user isolation).
  4. Task creation and status toggle invalidate the cache (subsequent GET returns `X-Cache: MISS`).
  5. `GET /api/cache/stats` returns live telemetry counting hits, misses, and sets.
- **Reference**: [`server/test-api.js`](file:///d:/Project/server/test-api.js) lines 340-440.

---

## Technical Viva Defense: WebSocket Real-Time Communication with Socket.IO (10 Questions & Answers)

### Question 1: What is a WebSocket?
- **Answer**: A WebSocket is a bidirectional, full-duplex communication protocol (standardized as RFC 6455) providing continuous, low-latency data exchange over a single persistent TCP connection. Unlike HTTP, where the client must initiate every request and close the connection, WebSockets allow either the client or the server to push messages at any time with minimal per-packet header overhead (2 to 10 bytes vs ~1KB for HTTP headers).
- **Reference**: [`server/src/config/socket.js`](file:///d:/Project/server/src/config/socket.js) lines 1-35.

### Question 2: What is the difference between HTTP polling and WebSockets?
- **Answer**:
  - **HTTP Polling (Short/Long)**: The client repeatedly sends HTTP `GET` requests on an interval (e.g., every 3-5s). Most requests return empty data, wasting client CPU, server compute, and network bandwidth. Furthermore, data latency is bounded by the polling frequency.
  - **WebSockets**: An initial HTTP 101 Upgrade establishes a permanent socket. When a mutation occurs, the server instantly pushes the event to the connected client with single-digit millisecond latency and zero redundant HTTP headers.
- **Reference**: [`README.md`](file:///d:/Project/README.md) Section 10.1 comparison table.

### Question 3: What does "Full-Duplex" mean?
- **Answer**: Full-duplex means bidirectional communication can occur simultaneously in both directions without waiting for the other party to finish or reply. In half-duplex communication (such as classic HTTP request-response or walkie-talkies), one party sends while the other receives. In full-duplex WebSockets, the server can push a `task:created` notification to the client at the exact same moment the client is emitting another event.
- **Reference**: [`server/src/config/socket.js`](file:///d:/Project/server/src/config/socket.js) and [`client/src/services/socket.js`](file:///d:/Project/client/src/services/socket.js).

### Question 4: Why use Socket.IO instead of native HTML5 WebSockets?
- **Answer**: Socket.IO is a feature-rich real-time application framework built on top of WebSockets that provides crucial production-grade features:
  1. **Transport Fallback**: Automatically degrades to HTTP long-polling if corporate firewalls or proxies block WebSocket upgrades.
  2. **Automated Reconnection**: Re-establishes dropped connections with exponential backoff and buffer queuing.
  3. **Rooms & Namespaces**: Built-in grouping abstractions (`socket.join('user:...')`) without having to implement in-memory tracking structures manually.
  4. **Event-Driven Multiplexing**: Allows named event channels (`task:created`, `task:status_changed`) rather than raw string parsing.
- **Reference**: [`README.md`](file:///d:/Project/README.md) Section 10.1 comparison table.

### Question 5: How are WebSocket connections authenticated in DevTrack AI?
- **Answer**: We authenticate sockets during the initial connection handshake before admitting the client into the event loop. In `server/src/config/socket.js`, we configure an `io.use()` middleware. The client passes their JWT bearer token via `socket.handshake.auth.token`. The middleware verifies the token using `jwt.verify(token, env.JWT_SECRET)`. If missing, expired, or tampered, the connection is aborted with an `Authentication error`. If valid, the user identity is attached to `socket.user`.
- **Reference**: [`server/src/config/socket.js`](file:///d:/Project/server/src/config/socket.js) lines 45-66.

### Question 6: What are Rooms in Socket.IO and how are they used here?
- **Answer**: A Room is an arbitrary server-side channel that sockets can join and leave. In DevTrack AI, upon successful authentication, each socket joins a private room named `user:${socket.user.id}`. When user mutations occur, controllers emit events strictly to `io.to('user:' + userId).emit(event, data)`. This isolates data by student and guarantees that multi-tab sessions of the same user receive real-time updates while ensuring User B never receives User A's private notifications.
- **Reference**: [`server/src/config/socket.js`](file:///d:/Project/server/src/config/socket.js) lines 73-82.

### Question 7: Can you trust client-supplied user IDs in WebSocket events?
- **Answer**: No. Client input must never be trusted for identity or authorization. In DevTrack AI, the user ID is extracted strictly from the cryptographically verified JWT payload (`socket.user.id`) attached during the handshake middleware. Clients are never allowed to specify which room to join or supply a target `userId` parameter to receive private data.
- **Reference**: [`server/src/config/socket.js`](file:///d:/Project/server/src/config/socket.js) line 73.

### Question 8: How does the React client avoid duplicate listeners and memory leaks?
- **Answer**: In `client/src/context/DataContext.jsx`, subscriptions to socket events (`socketService.on('task:created', ...)`) are registered inside a `useEffect` hook. The effect returns a cleanup function that explicitly unsubscribes every listener using `socketService.off('task:created', ...)`. When the component unmounts or authentication state changes, stale listener closures are removed from the event emitter, preventing memory leaks and duplicate handler execution.
- **Reference**: [`client/src/context/DataContext.jsx`](file:///d:/Project/client/src/context/DataContext.jsx) lines 125-145.

### Question 9: What happens when a user logs out?
- **Answer**: In `client/src/context/AuthContext.jsx`, the `logout()` function calls `socketService.disconnect()`, immediately tearing down the persistent TCP connection and stripping all active listeners before wiping the local authentication token.
- **Reference**: [`client/src/context/AuthContext.jsx`](file:///d:/Project/client/src/context/AuthContext.jsx) lines 90-97.

### Question 10: How do you demonstrate and test real-time functionality?
- **Answer**:
  1. **Automated Testing**: In `server/test-api.js` (Section 20), we spawn two distinct authenticated socket clients (`User A` and `User B`). When a task is created or updated via the REST API for User A, we assert that User A's socket receives `task:created` and `task:status_changed`, while asserting that User B receives zero events.
  2. **Live Demonstration**: Open DevTrack AI in two separate browser windows logged into the same account. Creating or updating a task in Window 1 instantly displays in Window 2 with a live sync toast notification without refreshing the page.
- **Reference**: [`server/test-api.js`](file:///d:/Project/server/test-api.js) lines 440-580 and [`README.md`](file:///d:/Project/README.md) Section 10.5.



