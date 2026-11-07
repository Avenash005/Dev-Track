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

---

## 6. Payment & Subscription Endpoints (`/api/payment`)

### 6.1 Get Subscription Plans
- **Endpoint**: `GET /api/payment/plans`
- **Auth**: None (Public)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "free",
        "name": "Free Plan",
        "price": 0,
        "priceFormatted": "₹0",
        "amount": 0,
        "currency": "INR",
        "features": ["Up to 3 active projects", "25 tasks per project", "Standard JS modules"]
      },
      {
        "id": "pro",
        "name": "Pro Plan",
        "price": 149,
        "priceFormatted": "₹149",
        "amount": 14900,
        "currency": "INR",
        "features": ["Unlimited projects & tasks", "Accelerated Ollama AI", "Milestone velocity reports"]
      },
      {
        "id": "premium",
        "name": "Premium Plan",
        "price": 299,
        "priceFormatted": "₹299",
        "amount": 29900,
        "currency": "INR",
        "features": ["Everything in Pro", "1-on-1 viva defense simulator", "Docker Compose sandboxes"]
      }
    ]
  }
  ```

### 6.2 Create Razorpay Order
- **Endpoint**: `POST /api/payment/create-order`
- **Auth**: `Bearer <token>`
- **Body**:
  ```json
  {
    "planId": "pro"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "orderId": "order_test_1794029898681_200f2253",
      "amount": 14900,
      "currency": "INR",
      "planId": "pro",
      "planName": "Pro Plan",
      "keyId": "rzp_test_DevTrackKey2026"
    }
  }
  ```

### 6.3 Verify Payment Signature
- **Endpoint**: `POST /api/payment/verify`
- **Auth**: `Bearer <token>`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_test_1794029898681_200f2253",
    "razorpay_payment_id": "pay_test_987654321",
    "razorpay_signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
  ```
- **Responses**:
  - `200 OK`: Valid HMAC-SHA256 signature; user subscription updated to Pro.
  - `400 Bad Request`: Cryptographic signature mismatch or tampered payload.

### 6.4 Handle Payment Failure / Cancellation
- **Endpoint**: `POST /api/payment/failure`
- **Auth**: `Bearer <token>`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_test_1794029898681_200f2253",
    "reason": "Payment cancelled by user in checkout popup."
  }
  ```
- **Response**: `200 OK`

### 6.5 Get User Subscription Status
- **Endpoint**: `GET /api/payment/subscription`
- **Auth**: `Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "subscription": {
        "id": "sub-1794029898",
        "plan": "pro",
        "status": "ACTIVE",
        "startDate": "2026-11-07T10:00:00.000Z",
        "endDate": "2026-12-07T10:00:00.000Z"
      },
      "paymentHistory": []
    }
  }
  ```

---

## 7. Server-Side Rendered (SSR) Public Routes

| Route | Method | Description | Content-Type | Pre-Render Engine |
|---|---|---|---|---|
| `/` | `GET` | Public Landing Page with pre-rendered hero statistics, feature matrix, and interactive FAQ | `text/html; charset=utf-8` | `react-dom/server` + hydration |
| `/explore` | `GET` | Public Projects Catalog pre-rendered from active database records | `text/html; charset=utf-8` | `react-dom/server` |
| `/p/:id` | `GET` | Individual Project Details showcase with pre-rendered milestone tasks and velocity score | `text/html; charset=utf-8` | `react-dom/server` + hydration |

