# DevTrack AI — Database Architecture Documentation

DevTrack AI implements a **Polyglot Persistence Architecture**, combining a relational database (**PostgreSQL** via **Prisma ORM**) and a document database (**MongoDB** via **Mongoose ODM**) to match data access patterns with the optimal database engine.

---

## 1. Polyglot Persistence Strategy: Why Both?

| Criterion | PostgreSQL + Prisma ORM | MongoDB + Mongoose ODM |
|---|---|---|
| **Data Domain** | Core Business Entities: Users, Projects, Tasks | Unstructured Polymorphic Entities: AI Chat Threads |
| **Data Shape** | Rigid tabular schemas with strict data types | Variable-length conversational message arrays |
| **Integrity Model** | ACID compliance, Foreign Keys, Referential Cascades | Eventual consistency, document atomicity |
| **Access Patterns** | Relational joins, aggregations (task completion %) | High-velocity sequential appends (chat tokens) |

---

## 2. PostgreSQL Relational Model (Prisma ORM)

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : "owns (1:N)"
    USERS ||--o{ SUBSCRIPTIONS : "has (1:1)"
    USERS ||--o{ PAYMENTS : "generates (1:N)"
    PROJECTS ||--o{ TASKS : "contains (1:N)"

    USERS {
        string id PK "UUID"
        string name "Full Name"
        string email UK "Unique Email Address"
        string password_hash "Bcrypt Hashed String"
        datetime created_at "Default now()"
        datetime updated_at "Auto-updated timestamp"
    }

    SUBSCRIPTIONS {
        string id PK "UUID"
        string user_id FK "References USERS(id) [ON DELETE CASCADE]"
        string plan "FREE | PRO | PREMIUM"
        string status "ACTIVE | CANCELLED | EXPIRED"
        datetime start_date "Subscription start"
        datetime end_date "Subscription expiry (+30 days)"
        datetime created_at "Default now()"
        datetime updated_at "Auto-updated timestamp"
    }

    PAYMENTS {
        string id PK "UUID"
        string user_id FK "References USERS(id) [ON DELETE CASCADE]"
        string razorpay_order_id UK "Unique Order ID"
        string razorpay_payment_id UK "Unique Payment ID"
        string razorpay_signature "HMAC-SHA256 signature"
        int amount "Amount in paise (e.g. 14900)"
        string currency "INR"
        string plan "pro | premium"
        string status "CREATED | SUCCESS | FAILED"
        string error_code "Error reason code"
        string error_description "Detailed failure note"
        datetime created_at "Default now()"
        datetime updated_at "Auto-updated timestamp"
    }

    PROJECTS {
        string id PK "UUID"
        string user_id FK "References USERS(id) [ON DELETE CASCADE]"
        string title "Project Title (max 100)"
        string description "Detailed Scope"
        string status "PLANNING | IN_PROGRESS | COMPLETED | ON_HOLD"
        datetime created_at "Default now()"
        datetime updated_at "Auto-updated timestamp"
    }

    TASKS {
        string id PK "UUID"
        string project_id FK "References PROJECTS(id) [ON DELETE CASCADE]"
        string title "Task Title"
        string description "Implementation notes"
        string status "PENDING | IN_PROGRESS | COMPLETED"
        string priority "LOW | MEDIUM | HIGH"
        string due_date "ISO Date String (YYYY-MM-DD)"
        datetime created_at "Default now()"
        datetime updated_at "Auto-updated timestamp"
    }
```

### Constraints & Indexes
1. **`users.email`**: Marked with `@unique` constraint. Index type: B-Tree.
2. **`projects.user_id`**: Foreign Key referencing `users.id` with `onDelete: Cascade`. Indexed with `@@index([user_id])` for fast per-user lookups.
3. **`tasks.project_id`**: Foreign Key referencing `projects.id` with `onDelete: Cascade`. Indexed with `@@index([project_id])` for instant task joins.
4. **`subscriptions.user_id`**: Foreign Key referencing `users.id` with `onDelete: Cascade`. Indexed with `@@index([user_id])`.
5. **`payments.user_id`**: Foreign Key referencing `users.id` with `onDelete: Cascade`. Indexed with `@@index([user_id])`.
6. **`payments.razorpay_order_id`**: Marked with `@unique` constraint and indexed with `@@index([razorpay_order_id])`.
7. **`payments.razorpay_payment_id`**: Marked with `@unique` constraint.

### Prisma Schema (`server/prisma/schema.prisma`)
```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password_hash String
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  projects      Project[]
  subscriptions Subscription[]
  payments      Payment[]

  @@map("users")
}

model Project {
  id          String   @id @default(uuid())
  user_id     String
  title       String
  description String?
  status      String   @default("PLANNING")
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@index([user_id])
  @@map("projects")
}

model Task {
  id          String   @id @default(uuid())
  project_id  String
  title       String
  description String?
  status      String   @default("PENDING")
  priority    String   @default("MEDIUM")
  due_date    String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  project     Project  @relation(fields: [project_id], references: [id], onDelete: Cascade)

  @@index([project_id])
  @@map("tasks")
}

model Subscription {
  id          String    @id @default(uuid())
  user_id     String
  plan        String    @default("FREE")
  status      String    @default("ACTIVE")
  start_date  DateTime  @default(now())
  end_date    DateTime?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt

  user        User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@map("subscriptions")
}

model Payment {
  id                  String   @id @default(uuid())
  user_id             String
  razorpay_order_id   String   @unique
  razorpay_payment_id String?  @unique
  razorpay_signature  String?
  amount              Int
  currency            String   @default("INR")
  plan                String
  status              String   @default("CREATED")
  error_code          String?
  error_description   String?
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt

  user                User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id])
  @@index([razorpay_order_id])
  @@map("payments")
}
```

---

## 3. MongoDB Document Model (Mongoose ODM)

AI conversations require dynamic schemas capable of storing varied-length dialog exchanges between users and the local Ollama LLM.

### Collection: `conversations`

```json
{
  "_id": "673c1d4a8e239f1a0b5c98d2",
  "userId": "usr-1731056789-402",
  "title": "Event Loop Microtasks vs Timers",
  "messages": [
    {
      "_id": "673c1d4a8e239f1a0b5c98d3",
      "role": "user",
      "content": "Why does Promise.then execute before setTimeout(0)?",
      "timestamp": "2026-11-07T08:30:00.000Z"
    },
    {
      "_id": "673c1d4a8e239f1a0b5c98d4",
      "role": "assistant",
      "content": "The JavaScript event loop prioritizes the Microtask queue over the Macrotask timers queue...",
      "timestamp": "2026-11-07T08:30:01.200Z"
    }
  ],
  "createdAt": "2026-11-07T08:30:00.000Z",
  "updatedAt": "2026-11-07T08:30:01.200Z"
}
```

### Mongoose Indexing
```javascript
conversationSchema.index({ userId: 1, updatedAt: -1 });
```
This compound index enables sub-millisecond retrieval of a student's conversation threads sorted by recency.

---

## 4. Docker Compose Database Setup

Both PostgreSQL and MongoDB can be provisioned in isolated containers:

```bash
# Start both database services
docker compose up -d

# Verify healthy status
docker compose ps
```

Once running, run the Prisma migration command:
```bash
cd server
npm run prisma:push
```

