# DevTrack AI — Product Requirements Document (PRD)

**Product Name**: DevTrack AI  
**Version**: 1.0.0  
**Target Audience**: Software Engineering Students, CS Undergraduates, Bootcamp Learners, and Mentors  
**Document Status**: Approved / Complete  

---

## 1. Executive Summary & Vision

### 1.1 Vision Statement
DevTrack AI is an AI-powered student productivity and computer science learning management platform designed to unify project tracking, engineering task management, local artificial intelligence assistance, and runtime mechanics education into a single, cohesive developer workspace.

### 1.2 The Problem
Software engineering students frequently face a fragmented learning workflow:
- Traditional project management tools (Jira, Linear, Trello) are overly complex and lack native tie-ins to academic curriculum.
- Commercial AI assistants (ChatGPT, Claude) require paid subscriptions, cloud API keys, or internet connectivity, posing privacy and cost hurdles.
- Abstract computer science concepts (closures, event loop microtasks, variable hoisting, asynchronous flow control) are taught in static lecture slides without interactive runtime experimentation.

### 1.3 The Solution
DevTrack AI solves this by integrating:
1. **Academic Project & Task Management**: Lightweight, relational tracking designed around engineering deliverables.
2. **Offline-Capable Local AI Mentorship**: Privacy-first, local LLM inference powered by Ollama (`llama3.2`) with zero external API fees.
3. **Interactive CS Concept Playground**: Built-in runtime sandboxes for practicing complex JavaScript mechanics with real-time execution feedback and quizzes.
4. **Ergonomic Developer UX**: Dark-themed SaaS design system (`#09090B`) matching modern engineering tools.

---

## 2. User Personas

| Persona | Role | Key Pain Points | DevTrack AI Solution |
|---|---|---|---|
| **Alex Chen** | 3rd Year CS Student | Struggles to track concurrent course projects and milestone deadlines. | Visual project completion percentage and priority-filtered task boards. |
| **Priya Patel** | Bootcamp Learner | Confused by JavaScript event loop order and asynchronous callbacks. | Interactive JavaScript playground with live microtask/macrotask execution comparisons. |
| **Prof. Martinez** | CS Instructor / Mentor | Needs a uniform platform for code reviews and viva examinations. | Comprehensive assessment guide covering 22 core curriculum topics with verifiable git history. |

---

## 3. Product Scope & Functional Requirements

### Epic 1: Authentication & User Management
- **FR-1.1**: The platform must allow new users to register with full name, valid email, and a password (minimum 6 characters).
- **FR-1.2**: Passwords must be cryptographically hashed using `bcrypt` (minimum 10 salt rounds) before persistence.
- **FR-1.3**: The platform must reject duplicate email registrations with `409 Conflict`.
- **FR-1.4**: Successful authentication must issue a stateless JSON Web Token (JWT) with configurable expiration (default 7 days).
- **FR-1.5**: Protected endpoints must reject unauthenticated requests with `401 Unauthorized`.

### Epic 2: Real-Time SaaS Dashboard
- **FR-2.1**: Display personalized welcome banner with active developer velocity score.
- **FR-2.2**: Present 4 core KPI StatCards: Total Projects, Total Tasks, Completed Tasks, Pending Tasks.
- **FR-2.3**: Calculate and render overall project completion percentage with visual progress bars.
- **FR-2.4**: Display Recent Projects list showing milestone progress and task distributions.
- **FR-2.5**: Display Upcoming Tasks list with one-click status toggle and priority tags.
- **FR-2.6**: Stream recent activity timeline reflecting real database mutations.
- **FR-2.7**: Provide Quick Action launch buttons for immediate project/task creation and learning navigation.

### Epic 3: Project Lifecycle Management
- **FR-3.1**: Users must be able to create, read, update, and delete projects.
- **FR-3.2**: Project records must track ID, Title, Description, Status (`PLANNING`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`), and Timestamps.
- **FR-3.3**: Projects must enforce strict ownership: users cannot view, edit, or delete projects belonging to other accounts.
- **FR-3.4**: Deleting a project must trigger cascade deletion of all associated tasks.
- **FR-3.5**: Individual Project Detail view (`/projects/:id`) must display scoped tasks and project completion velocity.

### Epic 4: Task Tracking & Prioritization
- **FR-4.1**: Users must be able to create, read, update, and delete tasks.
- **FR-4.2**: Every task must be mapped to an existing project owned by the user.
- **FR-4.3**: Task fields must include Title, Description, Priority (`LOW`, `MEDIUM`, `HIGH`), Status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), and optional Due Date.
- **FR-4.4**: Filter tasks by status, priority, and text search query.
- **FR-4.5**: Allow instant status toggling between completed and pending from any task list.

### Epic 5: Local AI Assistant (Ollama Proxy)
- **FR-5.1**: Provide a chat interface allowing students to consult an AI engineering mentor.
- **FR-5.2**: All AI inference requests must pass through the Express backend proxy (`POST /api/ai/chat`) to a local Ollama daemon (`http://localhost:11434`).
- **FR-5.3**: Default to the lightweight `llama3.2` model.
- **FR-5.4**: Automatically persist conversation threads and message histories to MongoDB via Mongoose.
- **FR-5.5**: When Ollama is offline or uninstalled, the system must return helpful diagnostic setup instructions instead of crashing.
- **FR-5.6**: Users must be able to create new conversation threads, view past threads, and delete discussions.

### Epic 6: JavaScript Core Concepts Learning Lab
- **FR-6.1**: Include 4 structured runtime modules:
  1. *JavaScript Closures & Lexical Scope* (with live interactive counter).
  2. *JavaScript Event Loop & Microtasks* (Call Stack, Promise microtasks, `setTimeout` timers).
  3. *Hoisting & Temporal Dead Zone* (`var` vs `let`/`const`, function declarations).
  4. *Promises vs Callbacks vs Async/Await* (Flow control evolution).
- **FR-6.2**: Each module must provide theoretical explanation, syntax-highlighted code, runnable execution sandbox with simulated console output, and self-assessment questions with immediate feedback.

### Epic 7: Settings & System Diagnostics
- **FR-7.1**: Display authenticated user profile details.
- **FR-7.2**: Display local Ollama model configuration and provide an interactive connection handshake test.
- **FR-7.3**: Display polyglot database connectivity status for PostgreSQL and MongoDB.
- **FR-7.4**: Confirm active Dark Theme visual tokens.

---

## 4. Non-Functional Requirements (NFRs)

| NFR Category | Requirement | Target Specification |
|---|---|---|
| **Performance** | API response latency | < 50ms for relational queries; < 500ms for local LLM inference startup. |
| **Security** | Transport & Credentials | Passwords salted with bcrypt; JWT signed with SHA-256; CORS strictly restricted. |
| **Reliability** | Database Fallback | Resilient Local Storage Engine activates automatically if PostgreSQL/MongoDB containers are stopped. |
| **Ergonomics** | Visual Design | Dark theme palette adhering to `#09090B` background, `#27272A` borders, `#8B5CF6` violet accents. |
| **Portability** | Deployment | Single-command startup via npm workspaces and Docker Compose containerization. |

---

## 5. Success Metrics & Key Performance Indicators (KPIs)
- **100% Pass Rate** on automated test suite (28/28 assertions verified).
- **Zero External API Cost**: 100% local operation with Ollama.
- **Sub-3s Production Build**: Vite client compilation under 3 seconds.
- **100% Curriculum Coverage**: Complete defense script covering all 22 required assessment topics.
