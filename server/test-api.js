// DevTrack AI — Automated API Verification Suite
const BASE_URL = 'http://localhost:5000/api';

async function testSuite() {
  console.log('\n======================================================');
  console.log('   DevTrack AI — Comprehensive API Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  \x1b[32m✔ PASS\x1b[0m : ${message}`);
      passed++;
    } else {
      console.error(`  \x1b[31m✖ FAIL\x1b[0m : ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, `GET /api/health returned 200 OK`);
    assert(healthData.data?.status === 'healthy', `Server reports healthy state`);

    // 2. User registration
    const testEmail = `student_${Date.now()}@university.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: testEmail,
        password: 'securePassword123!',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, `POST /api/auth/register returned 201 Created`);
    assert(!!regData.data?.token, `Registration returned JWT bearer token`);
    const token = regData.data?.token;

    // 3. Duplicate user conflict check (409)
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Duplicate',
        email: testEmail,
        password: 'anotherPassword',
      }),
    });
    assert(dupRes.status === 409, `Duplicate email registration correctly returned 409 Conflict`);

    // 4. User login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'securePassword123!',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, `POST /api/auth/login returned 200 OK`);
    assert(loginData.data?.user?.email === testEmail, `Login returned user email correctly`);

    // 5. Invalid password login check (401)
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongPassword',
      }),
    });
    assert(badLoginRes.status === 401, `Incorrect password correctly returned 401 Unauthorized`);

    // 6. Access protected route without token (401)
    const noTokenRes = await fetch(`${BASE_URL}/auth/me`);
    assert(noTokenRes.status === 401, `Protected route without token returned 401 Unauthorized`);

    // 7. Access protected route with token (200)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, `GET /api/auth/me with Bearer token returned 200 OK`);
    assert(meData.data?.name === 'Jordan Lee', `Profile name matches registered user`);

    // 8. Create Project (201)
    const projRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Distributed KV Store in Go',
        description: 'Implementing Raft consensus and write-ahead log replication.',
        status: 'IN_PROGRESS',
      }),
    });
    const projData = await projRes.json();
    assert(projRes.status === 201, `POST /api/projects returned 201 Created`);
    const projectId = projData.data?.id;
    assert(!!projectId, `Project created with ID: ${projectId}`);

    // 9. Get Projects (200)
    const listProjRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listProjData = await listProjRes.json();
    assert(listProjRes.status === 200, `GET /api/projects returned 200 OK`);
    assert(listProjData.data?.length >= 1, `Projects list contains created project`);

    // 10. Create Task associated with Project (201)
    const taskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        title: 'Implement Raft Leader Election',
        description: 'Implement election timer and RequestVote RPC handlers.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2026-11-20',
      }),
    });
    const taskData = await taskRes.json();
    assert(taskRes.status === 201, `POST /api/tasks returned 201 Created`);
    const taskId = taskData.data?.id;
    assert(!!taskId, `Task created with ID: ${taskId}`);

    // 11. Update Task status (200)
    const updateTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'COMPLETED',
      }),
    });
    const updatedTaskData = await updateTaskRes.json();
    assert(updateTaskRes.status === 200, `PUT /api/tasks/:id returned 200 OK`);
    assert(updatedTaskData.data?.status === 'COMPLETED', `Task status transitioned to COMPLETED`);

    // 12. Dashboard Stats (200)
    const statsRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200, `GET /api/dashboard/stats returned 200 OK`);
    assert(statsData.data?.totalProjects >= 1, `Total projects is >= 1`);
    assert(statsData.data?.completedTasks >= 1, `Completed tasks is >= 1`);

    // 13. AI Chat endpoint (200)
    const aiRes = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: 'How does Raft leader election handle split votes?',
      }),
    });
    const aiData = await aiRes.json();
    assert(aiRes.status === 200, `POST /api/ai/chat returned 200 OK`);
    assert(!!aiData.data?.conversationId, `AI chat returned conversationId`);
    const conversationId = aiData.data?.conversationId;

    // 14. AI Conversations List (200)
    const convsRes = await fetch(`${BASE_URL}/ai/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const convsData = await convsRes.json();
    assert(convsRes.status === 200, `GET /api/ai/conversations returned 200 OK`);
    assert(convsData.data?.length >= 1, `Conversations list contains new thread`);

    // 15. Delete Task (204)
    const delTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(delTaskRes.status === 204, `DELETE /api/tasks/:id returned 204 No Content`);

    // 16. Delete Project (204)
    const delProjRes = await fetch(`${BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(delProjRes.status === 204, `DELETE /api/projects/:id returned 204 No Content`);

    console.log(`\n======================================================`);
    console.log(`  Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('[TEST ERROR]', err);
    process.exit(1);
  }
}

testSuite();
