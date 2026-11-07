# DevTrack AI — RESTful API Specification

The DevTrack AI Express backend follows strict RESTful conventions, using standard JSON payloads, stateless JWT bearer authorization, and precise HTTP status codes.

**Base URL**: `http://localhost:5000/api`

---

## HTTP Status Codes Reference

| Code | Status | Meaning | Usage Scenario in DevTrack AI |
|---|---|---|---|
| **200** | OK | Request succeeded | Successful GET, PUT, or login request. |
| **201** | Created | Resource created | Successful entity registration or creation (User, Project, Task). |
| **204** | No Content | Successfully deleted | Entity removed via DELETE request. No body returned. |
| **400** | Bad Request | Validation error | Missing required fields, invalid email format, password too short. |
| **401** | Unauthorized | Authentication failure | Missing, expired, or invalid JWT signature; bad login credentials. |
| **403** | Forbidden | Permission denied | Attempting to access an entity owned by another user. |
| **404** | Not Found | Resource not found | Project ID or Task ID does not exist. |
| **409** | Conflict | Duplicate resource | Attempting to register with an email that is already in use. |
| **500** | Internal Error | Server failure | Uncaught runtime error on the backend. |
| **503** | Service Unavailable | External dependency offline | Local Ollama daemon unreachable at `http://localhost:11434`. |

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Registration
- **Endpoint**: `POST /api/auth/register`
- **Auth**: None
- **Body**:
  ```json
  {
    "name": "Alex Chen",
    "email": "alex.chen@devtrack.ai",
    "password": "securePassword123!"
  }
  ```
- **Responses**:
  - `201 Created`: User created and JWT token returned.
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Email already registered.

### 1.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Auth**: None
- **Body**:
  ```json
  {
    "email": "alex.chen@devtrack.ai",
    "password": "securePassword123!"
  }
  ```
- **Responses**:
  - `200 OK`: Valid credentials; JWT token returned.
  - `401 Unauthorized`: Invalid email or password.

### 1.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Auth**: `Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "id": "usr-123456",
      "name": "Alex Chen",
      "email": "alex.chen@devtrack.ai",
      "created_at": "2026-11-07T08:00:00.000Z"
    }
  }
  ```

---

## 2. Projects Endpoints (`/api/projects`)

All project endpoints require the `Authorization: Bearer <token>` header.

### 2.1 List Projects
- **Endpoint**: `GET /api/projects`
- **Response**: `200 OK` (returns list with task counts & completion percentages)

### 2.2 Create Project
- **Endpoint**: `POST /api/projects`
- **Body**:
  ```json
  {
    "title": "Distributed Key-Value Store",
    "description": "Raft consensus protocol with LSM-tree storage engine",
    "status": "IN_PROGRESS"
  }
  ```
- **Response**: `201 Created`

### 2.3 Get Project by ID
- **Endpoint**: `GET /api/projects/:id`
- **Response**: `200 OK` (includes project details and all associated tasks)

### 2.4 Update Project
- **Endpoint**: `PUT /api/projects/:id`
- **Body**: Fields to update (`title`, `description`, `status`)
- **Response**: `200 OK`

### 2.5 Delete Project
- **Endpoint**: `DELETE /api/projects/:id`
- **Response**: `204 No Content` (cascades deletion to all tasks mapped to this project)

---

## 3. Tasks Endpoints (`/api/tasks`)

All task endpoints require the `Authorization: Bearer <token>` header.

### 3.1 List Tasks
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `status`: `ALL | PENDING | IN_PROGRESS | COMPLETED`
  - `priority`: `ALL | LOW | MEDIUM | HIGH`
  - `search`: string keyword
  - `projectId`: filter by associated project
- **Response**: `200 OK`

### 3.2 Create Task
- **Endpoint**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "projectId": "proj-123456",
    "title": "Implement WAL (Write-Ahead Log)",
    "description": "Append-only segment file with CRC32 checksums",
    "status": "PENDING",
    "priority": "HIGH",
    "dueDate": "2026-11-20"
  }
  ```
- **Response**: `201 Created`

### 3.3 Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Body**: Fields to update (`title`, `status`, `priority`, `dueDate`, `description`)
- **Response**: `200 OK`

### 3.4 Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Response**: `204 No Content`

---

## 4. Dashboard Endpoints (`/api/dashboard`)

### 4.1 Get Dashboard Statistics
- **Endpoint**: `GET /api/dashboard/stats`
- **Auth**: `Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "totalProjects": 3,
      "totalTasks": 12,
      "completedTasks": 8,
      "pendingTasks": 4,
      "completionRate": 67
    }
  }
  ```

### 4.2 Get Recent Activity
- **Endpoint**: `GET /api/dashboard/activity`
- **Auth**: `Bearer <token>`
- **Response**: `200 OK`

---

## 5. AI Assistant Endpoints (`/api/ai`)

### 5.1 Send Prompt to Ollama Proxy
- **Endpoint**: `POST /api/ai/chat`
- **Auth**: `Bearer <token>`
- **Body**:
  ```json
  {
    "conversationId": "optional-thread-id",
    "message": "Explain how lexical scope enables JavaScript closures."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "conversationId": "conv-987654",
      "userMessage": {
        "role": "user",
        "content": "Explain how lexical scope enables JavaScript closures.",
        "timestamp": "2026-11-07T08:30:00.000Z"
      },
      "assistantMessage": {
        "role": "assistant",
        "content": "Lexical scope means that variable access is determined by physical positioning in source code...",
        "timestamp": "2026-11-07T08:30:01.400Z"
      },
      "isOllamaOnline": true
    }
  }
  ```

### 5.2 List Conversations
- **Endpoint**: `GET /api/ai/conversations`
- **Response**: `200 OK`

### 5.3 Delete Conversation
- **Endpoint**: `DELETE /api/ai/conversations/:id`
- **Response**: `204 No Content`
