# DevTrack AI — Student Assessment Preparation Guide & Demonstration Script

This guide provides a comprehensive preparation script covering all **22 core curriculum topics** evaluated during technical presentations, code reviews, and viva examinations.

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
  > *"We execute `node test-api.js`, which runs an automated 28-assertion test suite verifying health checks, registration, token generation, 409 duplicate handling, 401 unauthorized rejection, project CRUD, task CRUD, dashboard statistics, and AI chat. Every assertion must pass with 0 failures."*

