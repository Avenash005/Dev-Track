# DevTrack AI — Student Assessment Preparation Guide & Demonstration Script

This guide provides a comprehensive preparation script covering all **25 core curriculum topics** (including Server-Side Rendering, Payment Gateway Integration, and Docker Containerization) evaluated during technical presentations, code reviews, and viva examinations.

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
  > *"We execute `node test-api.js`, which runs an automated 52-assertion test suite verifying health checks, registration, token generation, 409 duplicate handling, 401 unauthorized rejection, project CRUD, task CRUD, dashboard statistics, AI chat, SSR public HTML pre-rendering, and Razorpay payment order creation, signature verification, tampering defense, and subscription updates. Every assertion must pass with 0 failures."*

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

