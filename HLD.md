# DevTrack AI — High-Level Design (HLD) Document

**Document Title**: System High-Level Design Specification  
**Architecture Style**: Decoupled Monorepo with Polyglot Persistence & Local AI Subsystem  
**Version**: 1.0.0  

---

## 1. System Overview & Architecture Goals

DevTrack AI provides an integrated productivity and learning environment. Its architectural design prioritizes:
1. **Decoupled Modularity**: Independent React client and Express API within a unified monorepo.
2. **Data-Centric Polyglot Persistence**: Matching strict relational models (PostgreSQL) with flexible polymorphic document stores (MongoDB).
3. **Zero-Cloud Dependency**: Completely local, cost-free AI inference via Ollama.
4. **Fault Tolerance & Resilience**: Transparent fallback mechanisms allowing the application to run seamlessly regardless of whether Docker containers or local databases are running.

---

## 2. C4 Model Architectural Diagrams

### 2.1 Level 1: System Context Diagram
Shows how users interact with DevTrack AI and its internal/local boundaries.

```mermaid
flowchart TD
    User["Student Developer / Reviewer"]
    
    subgraph DevTrackPlatform["DevTrack AI Platform"]
        WebUI["React 18 SPA (Vite)"]
        APIServer["Express.js REST API"]
    end

    subgraph DataLayer["Storage Tier"]
        PostgresDB[("PostgreSQL Database\n(Users, Projects, Tasks)")]
        MongoDB[("MongoDB Database\n(Chat Threads & Messages)")]
        LocalStore[("Resilient Local Engine\n(devtrack-store.json)")]
    end

    subgraph LocalAI["Host Machine AI Daemon"]
        OllamaEngine["Ollama Runtime\n(http://localhost:11434)"]
        LLM["llama3.2 Model in VRAM"]
    end

    User -->|HTTPS/HTTP on :5173| WebUI
    User -->|Public GET /, /explore, /p/:id on :5000| APIServer
    WebUI -->|RESTful JSON Calls / Bearer JWT on :5000| APIServer
    APIServer -->|Prisma Client| PostgresDB
    APIServer -->|Mongoose ODM| MongoDB
    APIServer -.->|Automatic Fallback| LocalStore
    APIServer -->|Local HTTP Proxy| OllamaEngine
    APIServer -->|Test Order Creation & HMAC Verify| RazorpayGateway["Razorpay Test Gateway"]
    OllamaEngine --> LLM
```

### 2.2 Level 2: Container Diagram
Details internal containers and communication protocols.

```mermaid
flowchart LR
    subgraph Browser["Client Container"]
        SPA["Single Page Application\nReact 18 + Tailwind CSS"]
    end

    subgraph ServerContainer["Backend API Container"]
        Router["Express Router & Dispatcher"]
        Middleware["Security & Auth Middleware Stack"]
        Services["Domain Services Layer"]
        Router --> Middleware
        Middleware --> Services
    end

    subgraph DatabaseContainers["Database Subsystems"]
        PG["PostgreSQL Container\nport: 5432"]
        MG["MongoDB Container\nport: 27017"]
    end

    subgraph HostDaemons["Host Daemon"]
        OL["Ollama Engine\nport: 11434"]
    end

    SPA -->|HTTP / JSON (Port 5000)| Router
    Services -->|Prisma Connection Pool| PG
    Services -->|Mongoose Connection Pool| MG
    Services -->|HTTP Client (Fetch)| OL
```

---

## 3. Polyglot Storage Strategy

The platform implements a split storage tier:

```mermaid
graph TD
    DataEntry["Incoming Application Data"]
    DataEntry -->|Structured / Relational / ACID| RelationalPath["PostgreSQL (Prisma ORM)"]
    DataEntry -->|Polymorphic / High-Velocity Append| DocumentPath["MongoDB (Mongoose ODM)"]

    RelationalPath --> Users["Users Table (Unique Email, Bcrypt Hash)"]
    RelationalPath --> Projects["Projects Table (FK user_id, Cascade Delete)"]
    RelationalPath --> Tasks["Tasks Table (FK project_id, Priority, Due Date)"]

    DocumentPath --> Convs["Conversations Collection"]
    Convs --> Messages["Subdocument Messages Array [Role, Content, Timestamp]"]
```

### Why PostgreSQL for Projects & Tasks?
- **Referential Integrity**: Guarantees that a task cannot exist without a parent project (`onDelete: Cascade`).
- **Relational Aggregations**: Enables instant SQL calculations for project completion rates:
  $$\text{Completion Rate} = \left(\frac{\text{Completed Tasks}}{\text{Total Tasks}}\right) \times 100$$
- **Strict Typing**: Enforces enums on status and priorities.

### Why MongoDB for AI Conversations?
- **Variable Message Shape**: Prompts and assistant responses vary in token length, formatting, and subdocument count.
- **Atomic Document Appends**: Adding a message to a thread is an in-place `$push` operation without table locking.
- **Fast Lookups**: Compound indexing `{ userId: 1, updatedAt: -1 }` retrieves student chat history ordered chronologically.

---

## 4. Local AI Subsystem Architecture

The AI subsystem routes all inference through the Express backend to avoid hardcoding API URLs or exposing local ports to the browser:

```mermaid
sequenceDiagram
    autonumber
    actor User as Student User
    participant Client as React Client (Vite)
    participant Server as Express Server (:5000)
    participant Mongo as MongoDB / Local Store
    participant Ollama as Ollama Daemon (:11434)

    User->>Client: Types prompt & clicks Send
    Client->>Server: POST /api/ai/chat (Bearer JWT, message, convId)
    Server->>Server: Verifies JWT & Sanitizes input
    Server->>Mongo: Fetches previous thread messages
    Server->>Server: Prepend system prompt ("You are DevTrack AI mentor...")
    Server->>Ollama: POST http://localhost:11434/api/chat (model: llama3.2)
    alt Ollama Online
        Ollama-->>Server: 200 OK (Assistant response payload)
    else Ollama Offline
        Server-->>Server: Generates helpful diagnostic guidance
    end
    Server->>Mongo: Persists user message + assistant reply
    Server-->>Client: 200 OK (Standard JSON envelope)
    Client-->>User: Renders assistant response with timestamp
```

---

## 5. Security Architecture

1. **Authentication Boundary**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 (`JWT_SECRET`). Tokens expire after 7 days.
2. **Credential Storage**: Passwords are salted with 10 rounds of `bcryptjs` before committing to storage. Raw passwords are never logged or stored.
3. **Access Control (Row-Level Security)**: Every project and task mutation explicitly enforces `WHERE id = resourceId AND user_id = req.user.id`.
4. **CORS Whitelist**: Access is restricted to `http://localhost:5173` and `http://127.0.0.1:5173`.
5. **Payload Boundaries**: Requests exceeding `1MB` are rejected with `413 Payload Too Large` to prevent memory exhaustion.

---

## 6. Infrastructure & Deployment Topology (Docker Multi-Service Architecture)

The entire full-stack application is containerized and orchestrated via [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) across 5 interconnected containers on an isolated bridge network (`devtrack-network`):

```mermaid
flowchart TD
    subgraph Host["Host Machine"]
        ClientPort["Host Port :80 / :5173"]
        BackendPort["Host Port :5000"]
        DBPort1["Host Port :5432"]
        DBPort2["Host Port :27017"]
        AIPort["Host Port :11434"]
    end

    subgraph DockerBridge["devtrack-network (Virtual Bridge DNS)"]
        Frontend["frontend: nginx:1.27-alpine\n(Reverse proxy & SPA runner)"]
        Backend["backend: node:20-alpine\n(Express REST API & SSR engine)"]
        Postgres["postgres: postgres:16-alpine\n(Relational Database)"]
        MongoDB["mongodb: mongo:7.0\n(Document Database)"]
        Ollama["ollama: ollama/ollama\n(Local LLM Daemon)"]
    end

    subgraph Volumes["Docker Named Volumes (Host Persistent Storage)"]
        VPostgres[("devtrack_postgres_data\n/var/lib/postgresql/data")]
        VMongo[("devtrack_mongo_data\n/data/db")]
        VOllama[("devtrack_ollama_models\n/root/.ollama")]
    end

    ClientPort --> Frontend
    BackendPort --> Backend
    DBPort1 --> Postgres
    DBPort2 --> MongoDB
    AIPort --> Ollama

    Frontend -->|Internal Proxy /api/| Backend
    Backend -->|DNS: postgres:5432| Postgres
    Backend -->|DNS: mongodb:27017| MongoDB
    Backend -->|DNS: http://ollama:11434| Ollama

    Postgres --> VPostgres
    MongoDB --> VMongo
    Ollama --> VOllama
```

- **Monorepo Workspaces**: Orchestrated via npm workspaces (`package.json`).
- **Database Provisioning**: Declarative multi-container setup via [`docker-compose.yml`](file:///d:/Project/docker-compose.yml) with health-checked dependency graphs (`condition: service_healthy`).
- **Automated CI/CD**: GitHub Actions workflow ([`.github/workflows/ci.yml`](file:///d:/Project/.github/workflows/ci.yml)) tests every pull request and push to `main` and `develop`.

---

## 7. Server-Side Rendering (SSR) Subsystem Architecture

DevTrack AI implements Server-Side Rendering for public, indexable pages while preserving the high-interactivity React SPA for authenticated users:

```mermaid
sequenceDiagram
    autonumber
    actor Browser as User / Web Crawler
    participant Express as Express Server (:5000)
    participant DB as PostgreSQL / LocalDb Store
    participant SSR as SSR Engine (ReactDOMServer)
    participant Hydrate as Client Hydration Script

    Browser->>Express: GET / or GET /explore
    Express->>DB: Query aggregate metrics (totalProjects, tasks, completionRate)
    DB-->>Express: Return metrics payload
    Express->>SSR: ReactDOMServer.renderToString(<LandingPage initialData={metrics} />)
    SSR-->>Express: Returns pre-rendered static HTML fragment
    Express->>Express: Injects HTML into document shell with window.__INITIAL_DATA__
    Express-->>Browser: 200 OK (Full HTML Document with styles and meta tags)
    Note over Browser: Browser renders content immediately (Instant First Contentful Paint)
    Browser->>Express: GET /ssr/hydrate-landing.js
    Express-->>Browser: Hydration JavaScript bundle
    Browser->>Hydrate: ReactDOM.hydrateRoot(root, <LandingPage initialData={window.__INITIAL_DATA__} />)
    Note over Browser: Interactive event listeners attached (Hydration Complete)
```

### SSR vs CSR Strategy & Boundary
- **Public Routes (`/`, `/explore`, `/p/:id`)**: Handled by Express SSR engine. Fully rendered on server, zero initial layout shift, instant SEO indexing.
- **Application Workspace (`/dashboard`, `/projects`, `/tasks`, `/ai`, `/learn`, `/pricing`, `/settings`)**: Handled by React 18 SPA (Vite) with Client-Side Rendering (CSR), instant routing transitions without full-page reloads.

---

## 8. Payment Gateway Subsystem Architecture (Razorpay Test Mode)

The payment subsystem handles subscription upgrades (`FREE` -> `PRO` -> `PREMIUM`) using Razorpay Test Mode with server-side HMAC-SHA256 signature verification:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Developer
    participant Client as React Client (:5173 /pricing)
    participant Express as Express Server (:5000)
    participant RzpSDK as Razorpay Checkout Modal
    participant PG as PostgreSQL (Prisma)

    Student->>Client: Selects Pro Plan (₹149/mo) and clicks "Upgrade"
    Client->>Express: POST /api/payment/create-order (Bearer JWT, { planId: "PRO" })
    Express->>Express: Validates user session & computes amount (14900 paise)
    Express->>PG: Creates Payment record (status: "CREATED", razorpay_order_id)
    Express-->>Client: 201 Created ({ orderId, amount: 14900, currency: "INR", keyId })
    Client->>RzpSDK: new Razorpay(options).open()
    Note over RzpSDK: User enters test payment credentials (success flow)
    RzpSDK-->>Client: Checkout Success ({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    Client->>Express: POST /api/payment/verify (Bearer JWT, payment payload)
    Express->>Express: Recomputes expectedSignature = HMAC-SHA256(order_id + "|" + payment_id, SECRET)
    Express->>Express: Validates crypto.timingSafeEqual(expectedBuf, actualBuf)
    alt Signature Valid
        Express->>PG: Updates Payment (status: "SUCCESS", razorpay_payment_id)
        Express->>PG: Upserts Subscription (plan: "PRO", status: "ACTIVE", end_date: +30 days)
        Express-->>Client: 200 OK ({ verified: true, subscription: activeSubscription })
        Client-->>Student: Renders success modal & updates Pro badge in header
    else Tampered / Invalid Signature
        Express->>PG: Updates Payment (status: "FAILED", error_code: "SIGNATURE_MISMATCH")
        Express-->>Client: 400 Bad Request ("Signature verification failed")
        Client-->>Student: Displays security rejection alert
    end
```
