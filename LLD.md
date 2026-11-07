# DevTrack AI — Low-Level Design (LLD) Document

**Document Title**: Low-Level Software Design & Code Specification  
**Architecture Style**: Layered Controller-Service-Repository Pattern  
**Version**: 1.0.0  

---

## 1. Modular Class & Service Architecture

DevTrack AI follows a strict **Layered Controller-Service-Repository** pattern. Each layer has dedicated responsibilities:

```mermaid
classDiagram
    class AuthController {
        +register(req, res, next)
        +login(req, res, next)
        +getMe(req, res, next)
    }

    class ProjectController {
        +getProjects(req, res, next)
        +getProjectById(req, res, next)
        +createProject(req, res, next)
        +updateProject(req, res, next)
        +deleteProject(req, res, next)
    }

    class TaskController {
        +getTasks(req, res, next)
        +getTaskById(req, res, next)
        +createTask(req, res, next)
        +updateTask(req, res, next)
        +deleteTask(req, res, next)
    }

    class AuthService {
        +register(data) Promise~User, Token~
        +login(credentials) Promise~User, Token~
        +getMe(userId) Promise~User~
    }

    class ProjectService {
        +getProjects(userId) Promise~Project[]~
        +getProjectById(userId, projectId) Promise~Project~
        +createProject(userId, data) Promise~Project~
        +updateProject(userId, projectId, updates) Promise~Project~
        +deleteProject(userId, projectId) Promise~Boolean~
    }

    class TaskService {
        +getTasks(userId, filters) Promise~Task[]~
        +getTaskById(userId, taskId) Promise~Task~
        +createTask(userId, data) Promise~Task~
        +updateTask(userId, taskId, updates) Promise~Task~
        +deleteTask(userId, taskId) Promise~Boolean~
    }

    class AIService {
        +chat(userId, data) Promise~ChatResult~
        +getConversations(userId) Promise~Conversation[]~
        +getConversationById(userId, convId) Promise~Conversation~
        +deleteConversation(userId, convId) Promise~Boolean~
    }

    AuthController --> AuthService
    ProjectController --> ProjectService
    TaskController --> TaskService
```

---

## 2. Express Middleware Pipeline & Execution Flow

Every request executes through an ordered chain of middleware handlers:

```mermaid
sequenceDiagram
    autonumber
    participant Req as Request
    participant Log as loggingMiddleware
    participant Cors as cors & express.json
    participant Auth as authenticateToken
    participant Val as validationMiddleware
    participant Handler as Route Handler
    participant Err as errorHandler

    Req->>Log: Intercepts request & starts timer
    Log->>Cors: Calls next()
    Cors->>Cors: Enforces 1MB limit & whitelist
    Cors->>Auth: Calls next()
    alt Route is Protected
        Auth->>Auth: Checks 'Authorization: Bearer <token>'
        alt Token Missing or Invalid
            Auth-->>Req: 401 Unauthorized
        else Token Valid
            Auth->>Val: Attaches req.user & calls next()
        end
    else Route is Public
        Auth->>Val: Skips auth check
    end
    Val->>Val: Checks body schema & enums
    alt Validation Fails
        Val-->>Req: 400 Bad Request (Field errors)
    else Validation Passes
        Val->>Handler: Calls next()
        alt Exception Thrown
            Handler->>Err: next(err)
            Err-->>Req: Uniform JSON Error Envelope (409, 404, 500)
        else Normal Return
            Handler-->>Req: 200 / 201 / 204 JSON response
        end
    end
```

---

## 3. Database Schema & Data Models

### 3.1 PostgreSQL Tables (Prisma Schema)

```sql
-- Users Table
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Projects Table
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "projects_user_id_idx" ON "projects"("user_id");

-- Tasks Table
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "due_date" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "tasks_project_id_idx" ON "tasks"("project_id");
```

### 3.2 MongoDB Schema (`Conversation.js`)

```javascript
const messageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
    content: { type: String, required: true, trim: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, default: 'New Conversation' },
    messages: [messageSchema],
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });
```

---

## 4. Standardized API Response Contracts

All responses adhere to a uniform JSON envelope structure:

### Success Response (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Projects retrieved successfully.",
  "data": [
    {
      "id": "proj-1794021678",
      "userId": "usr-1794021600",
      "title": "Distributed KV Store in Go",
      "description": "Raft consensus protocol with LSM storage",
      "status": "IN_PROGRESS",
      "totalTasks": 4,
      "completedTasks": 3,
      "progress": 75,
      "createdAt": "2026-11-07T08:00:00.000Z",
      "updatedAt": "2026-11-07T08:30:00.000Z"
    }
  ]
}
```

### Validation Error Response (`400 Bad Request`)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "User registration validation failed",
  "errors": {
    "email": "A valid email address is required.",
    "password": "Password must be at least 6 characters."
  }
}
```

### Conflict Error Response (`409 Conflict`)
```json
{
  "success": false,
  "statusCode": 409,
  "message": "A user with this email address already exists."
}
```

---

## 5. Frontend Reactive State Architecture

```mermaid
flowchart TD
    subgraph ContextTier["React Context Providers"]
        AuthCtx["AuthContext\n- user\n- token\n- login()\n- register()\n- logout()"]
        DataCtx["DataContext\n- projects\n- tasks\n- activities\n- stats\n- addProject()\n- toggleTaskStatus()"]
    end

    subgraph Views["Page Views"]
        DashView["DashboardPage\n(Reads stats, projects, tasks)"]
        ProjView["ProjectsPage\n(Reads & filters projects)"]
        TaskView["TasksPage\n(Optimistic task toggle)"]
        AIView["AIAssistantPage\n(Thread selection & streams)"]
    end

    AuthCtx -->|User state| DataCtx
    DataCtx --> DashView
    DataCtx --> ProjView
    DataCtx --> TaskView
    AuthCtx --> AIView
```

### Optimistic UI Updates
When a user toggles a task in the UI:
1. `DataContext.toggleTaskStatus(taskId)` immediately updates the task's state in React memory (`PENDING` $\leftrightarrow$ `COMPLETED`).
2. The UI immediately reflects the completion checkbox, strikethrough, and updated completion percentage score.
3. In the background, `api.tasks.update(taskId, { status })` is dispatched.
4. If the server request fails, the state automatically rolls back to the previous status and an error banner is presented.
