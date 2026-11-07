// DevTrack AI — Automated API Verification Suite
import crypto from 'crypto';
import { io } from 'socket.io-client';

const ROOT_URL = 'http://localhost:5000';
const BASE_URL = 'http://localhost:5000/api';
const RAZORPAY_TEST_SECRET = process.env.RAZORPAY_KEY_SECRET || 'devtrack_razorpay_secret_test_2026';

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

    // =========================================================================
    // 17. Server-Side Rendering (SSR) Route Verifications
    // =========================================================================
    console.log('\n--- Verifying Server-Side Rendering (SSR) ---');

    // 17.1 SSR Landing Page (GET /)
    const ssrLandingRes = await fetch(`${ROOT_URL}/`);
    const ssrLandingHtml = await ssrLandingRes.text();
    assert(ssrLandingRes.status === 200, `SSR GET / returned 200 OK`);
    assert(ssrLandingRes.headers.get('content-type')?.includes('text/html'), `SSR GET / returned text/html content-type`);
    assert(ssrLandingHtml.toLowerCase().includes('<!doctype html>'), `SSR HTML contains <!DOCTYPE html> preamble`);
    assert(ssrLandingHtml.includes('DevTrack AI'), `SSR pre-rendered HTML contains brand title 'DevTrack AI'`);
    assert(ssrLandingHtml.includes('window.__INITIAL_DATA__'), `SSR HTML contains server injected window.__INITIAL_DATA__`);
    assert(ssrLandingHtml.includes('hydrate-landing.js'), `SSR HTML references browser hydration bundle`);

    // 17.2 SSR Explore Projects Page (GET /explore)
    const ssrExploreRes = await fetch(`${ROOT_URL}/explore`);
    const ssrExploreHtml = await ssrExploreRes.text();
    assert(ssrExploreRes.status === 200, `SSR GET /explore returned 200 OK`);
    assert(ssrExploreHtml.includes('Explore Public Engineering Projects'), `SSR explore page pre-renders public catalog`);

    // 17.3 SSR Public Project Details (GET /p/proj-1)
    const ssrProjRes = await fetch(`${ROOT_URL}/p/proj-1`);
    const ssrProjHtml = await ssrProjRes.text();
    assert(ssrProjRes.status === 200, `SSR GET /p/proj-1 returned 200 OK`);
    assert(ssrProjHtml.includes('Public Showcase') || ssrProjHtml.includes('DevTrack'), `SSR project page pre-renders project showcase`);

    // =========================================================================
    // 18. Payment Gateway (Razorpay Test Mode) Verifications
    // =========================================================================
    console.log('\n--- Verifying Razorpay Payment Gateway ---');

    // 18.1 Fetch subscription plans (Public endpoint)
    const plansRes = await fetch(`${BASE_URL}/payment/plans`);
    const plansData = await plansRes.json();
    assert(plansRes.status === 200, `GET /api/payment/plans returned 200 OK`);
    const planList = Array.isArray(plansData.data) ? plansData.data : plansData.data?.plans || [];
    assert(Array.isArray(planList) && planList.length === 3, `Returned exactly 3 subscription tiers (Free, Pro, Premium)`);
    assert(planList.find(p => p.id === 'pro')?.price === 149, `Pro plan priced correctly at ₹149/mo`);

    // 18.2 Create order without authentication (Security check -> 401)
    const unauthOrderRes = await fetch(`${BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: 'pro' }),
    });
    assert(unauthOrderRes.status === 401, `POST /api/payment/create-order without auth rejected with 401 Unauthorized`);

    // 18.3 Create order with authenticated user
    const orderRes = await fetch(`${BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId: 'pro' }),
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201, `POST /api/payment/create-order returned 201 Created`);
    assert(!!orderData.data?.orderId, `Received Razorpay order ID: ${orderData.data?.orderId}`);
    assert(orderData.data?.amount === 14900, `Order amount in paise equals 14900 (₹149.00)`);
    const testOrderId = orderData.data?.orderId;

    // 18.4 Verify signature tampering rejection (Security check -> 400)
    const tamperedRes = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: testOrderId,
        razorpay_payment_id: 'pay_test_tampered_123',
        razorpay_signature: 'fake_tampered_signature_hex_000000000000000000000000',
      }),
    });
    assert(tamperedRes.status === 400, `Tampered payment signature correctly rejected with 400 Bad Request`);

    // 18.5 Verify valid HMAC-SHA256 signature (Server verification -> 200)
    const testPaymentId = `pay_test_${Date.now()}`;
    const validSignature = crypto
      .createHmac('sha256', RAZORPAY_TEST_SECRET)
      .update(`${testOrderId}|${testPaymentId}`)
      .digest('hex');

    const validVerifyRes = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: testOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: validSignature,
      }),
    });
    const validVerifyData = await validVerifyRes.json();
    assert(validVerifyRes.status === 200, `Valid HMAC-SHA256 signature verified with 200 OK`);
    assert(validVerifyData.data?.subscription?.plan === 'pro', `User subscription tier successfully updated to PRO`);
    assert(validVerifyData.data?.subscription?.status === 'ACTIVE', `Subscription status is ACTIVE`);

    // 18.6 Fetch active subscription status
    const subRes = await fetch(`${BASE_URL}/payment/subscription`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const subData = await subRes.json();
    assert(subRes.status === 200, `GET /api/payment/subscription returned 200 OK`);
    assert(subData.data?.subscription?.plan === 'pro', `Active subscription reflects PRO plan`);

    // 18.7 Record payment failure event
    const failRes = await fetch(`${BASE_URL}/payment/failure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: testOrderId,
        reason: 'Payment cancelled by user test',
      }),
    });
    assert(failRes.status === 200, `POST /api/payment/failure successfully logged failure record`);

    // =========================================================================
    // 19. Redis In-Memory Caching & Invalidation Verifications
    // =========================================================================
    console.log('\n--- Verifying Redis In-Memory Caching & Invalidation ---');

    // 19.1 Initial read results in Cache Miss (Cold Cache -> DB Fetch)
    const statsColdRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(statsColdRes.status === 200, `GET /api/dashboard/stats (cold) returned 200 OK`);
    assert(statsColdRes.headers.get('x-cache') === 'MISS', `First dashboard stats read returned X-Cache: MISS`);

    // 19.2 Immediate subsequent read results in Cache Hit (Warm Cache -> Redis)
    const statsWarmRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(statsWarmRes.status === 200, `GET /api/dashboard/stats (warm) returned 200 OK`);
    assert(statsWarmRes.headers.get('x-cache') === 'HIT', `Second dashboard stats read returned X-Cache: HIT`);

    // 19.3 Projects list caching: Miss then Hit
    const projColdRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(projColdRes.headers.get('x-cache') === 'MISS', `First projects read returned X-Cache: MISS`);

    const projWarmRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(projWarmRes.headers.get('x-cache') === 'HIT', `Second projects read returned X-Cache: HIT`);

    // 19.4 User isolation check: User B does NOT hit User A's cache
    const userBEmail = `student_b_${Date.now()}@university.edu`;
    const regBRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Taylor UserB',
        email: userBEmail,
        password: 'securePasswordB123!',
      }),
    });
    const regBData = await regBRes.json();
    const tokenB = regBData.data?.token;

    const userBStatsRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const userBStatsData = await userBStatsRes.json();
    assert(userBStatsRes.headers.get('x-cache') === 'MISS', `User B cold stats read returned X-Cache: MISS`);
    assert(userBStatsData.data?.totalProjects === 0, `User B data isolated (totalProjects is 0, not User A's count)`);

    // 19.5 Cache Invalidation on Mutation: Creating a Project invalidates caches
    const newProjRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Redis Cached Cache-Aside Architecture',
        description: 'Demonstrating automated cache invalidation on write mutations.',
        status: 'IN_PROGRESS',
      }),
    });
    const newProjData = await newProjRes.json();
    const newProjId = newProjData.data?.id;
    assert(newProjRes.status === 201, `POST /api/projects created project to test invalidation`);

    // Subsequent read of projects list MUST be a MISS (cache was invalidated)
    const projAfterMutateRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(projAfterMutateRes.headers.get('x-cache') === 'MISS', `Projects read after mutation returned X-Cache: MISS (Invalidated)`);

    // Subsequent read of dashboard stats MUST also be a MISS
    const statsAfterMutateRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(statsAfterMutateRes.headers.get('x-cache') === 'MISS', `Dashboard stats after project mutation returned X-Cache: MISS`);

    // Next read is warm again
    const statsReheatedRes = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(statsReheatedRes.headers.get('x-cache') === 'HIT', `Dashboard stats re-cached returning X-Cache: HIT`);

    // 19.6 Tasks list caching & mutation invalidation
    const taskColdRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(taskColdRes.headers.get('x-cache') === 'MISS', `Tasks read (cold) returned X-Cache: MISS`);

    const taskWarmRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(taskWarmRes.headers.get('x-cache') === 'HIT', `Tasks read (warm) returned X-Cache: HIT`);

    // Clean up created test project
    await fetch(`${BASE_URL}/projects/${newProjId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    // 19.7 Cache Telemetry & Stats endpoint
    const cacheStatsRes = await fetch(`${BASE_URL}/cache/stats`);
    const cacheStatsData = await cacheStatsRes.json();
    assert(cacheStatsRes.status === 200, `GET /api/cache/stats returned 200 OK`);
    assert(cacheStatsData.data?.stats?.hits >= 3, `Cache telemetry recorded multiple cache HITs (${cacheStatsData.data?.stats?.hits})`);
    assert(cacheStatsData.data?.stats?.invalidations >= 2, `Cache telemetry recorded cache invalidation events (${cacheStatsData.data?.stats?.invalidations})`);

    // =========================================================================
    // 20. WEBSOCKET REAL-TIME COMMUNICATION (SOCKET.IO)
    // =========================================================================
    console.log('\n--- Verifying WebSocket Real-Time Communication (Socket.IO) ---');

    // 20.1 Reject unauthorized connection (no token)
    const unauthErr = await new Promise((resolve) => {
      const s = io(ROOT_URL, { transports: ['websocket'], reconnection: false, timeout: 2000 });
      s.on('connect_error', (err) => { s.disconnect(); resolve(err.message); });
      s.on('connect', () => { s.disconnect(); resolve(null); });
    });
    assert(unauthErr && unauthErr.includes('Authentication error'), 'Unauthorized WebSocket connection correctly rejected');

    // 20.2 Reject connection with invalid token signature
    const invalidTokenErr = await new Promise((resolve) => {
      const s = io(ROOT_URL, { auth: { token: 'invalid.token.signature' }, transports: ['websocket'], reconnection: false, timeout: 2000 });
      s.on('connect_error', (err) => { s.disconnect(); resolve(err.message); });
      s.on('connect', () => { s.disconnect(); resolve(null); });
    });
    assert(invalidTokenErr && invalidTokenErr.includes('Authentication error'), 'Tampered token rejected with Authentication error');

    // 20.3 Connect User A and User B to Socket.IO
    const userASocket = io(ROOT_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
    });
    await new Promise((resolve, reject) => {
      userASocket.on('connect', resolve);
      userASocket.on('connect_error', reject);
    });
    assert(userASocket.connected, 'User A connected successfully to WebSocket server');

    const userBSocket = io(ROOT_URL, {
      auth: { token: tokenB },
      transports: ['websocket'],
      reconnection: false,
    });
    await new Promise((resolve, reject) => {
      userBSocket.on('connect', resolve);
      userBSocket.on('connect_error', reject);
    });
    assert(userBSocket.connected, 'User B connected successfully to WebSocket server');

    // 20.4 Multi-Client Event Dispatch & User-Specific Room Isolation
    let userBReceivedAny = false;
    userBSocket.on('task:created', () => { userBReceivedAny = true; });
    userBSocket.on('project:created', () => { userBReceivedAny = true; });

    // User A creates a project
    const pCreatedPromise = new Promise((resolve) => userASocket.once('project:created', resolve));
    const dashUpdatedPromise1 = new Promise((resolve) => userASocket.once('dashboard:updated', resolve));

    const wsProjRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'WebSocket Real-Time Architecture',
        description: 'Testing full-duplex Socket.IO events and room isolation.',
        status: 'IN_PROGRESS',
      }),
    });
    const wsProjData = await wsProjRes.json();
    const wsProjId = wsProjData.data?.id;

    const pCreatedPayload = await pCreatedPromise;
    await dashUpdatedPromise1;
    assert(pCreatedPayload?.data?.project?.id === wsProjId, `User A received real-time project:created event for ID: ${wsProjId}`);
    assert(userBReceivedAny === false, 'User B received zero events (User room isolation verified)');

    // User A creates a task
    const tCreatedPromise = new Promise((resolve) => userASocket.once('task:created', resolve));
    const wsTaskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Real-Time Task Synchronization',
        description: 'Verify instant UI sync across multiple tabs without refresh.',
        priority: 'HIGH',
        status: 'PENDING',
        projectId: wsProjId,
      }),
    });
    const wsTaskData = await wsTaskRes.json();
    const wsTaskId = wsTaskData.data?.id;

    const tCreatedPayload = await tCreatedPromise;
    assert(tCreatedPayload?.data?.task?.id === wsTaskId, `User A received real-time task:created event for ID: ${wsTaskId}`);

    // User A updates task status to COMPLETED
    const tStatusPromise = new Promise((resolve) => userASocket.once('task:status_changed', resolve));
    const tUpdatedPromise = new Promise((resolve) => userASocket.once('task:updated', resolve));

    await fetch(`${BASE_URL}/tasks/${wsTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });

    const tStatusPayload = await tStatusPromise;
    const tUpdatedPayload = await tUpdatedPromise;
    assert(tStatusPayload?.data?.task?.status === 'COMPLETED', 'User A received real-time task:status_changed event');
    assert(tUpdatedPayload?.data?.task?.id === wsTaskId, 'User A received real-time task:updated event');

    // User A updates project
    const pUpdatedPromise = new Promise((resolve) => userASocket.once('project:updated', resolve));
    await fetch(`${BASE_URL}/projects/${wsProjId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'WebSocket Real-Time Architecture (Renamed)' }),
    });
    const pUpdatedPayload = await pUpdatedPromise;
    assert(pUpdatedPayload?.data?.project?.title === 'WebSocket Real-Time Architecture (Renamed)', 'User A received real-time project:updated event');

    // User A deletes task
    const tDeletedPromise = new Promise((resolve) => userASocket.once('task:deleted', resolve));
    await fetch(`${BASE_URL}/tasks/${wsTaskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const tDeletedPayload = await tDeletedPromise;
    assert(tDeletedPayload?.data?.taskId === wsTaskId, 'User A received real-time task:deleted event');

    // User A deletes project
    const pDeletedPromise = new Promise((resolve) => userASocket.once('project:deleted', resolve));
    await fetch(`${BASE_URL}/projects/${wsProjId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const pDeletedPayload = await pDeletedPromise;
    assert(pDeletedPayload?.data?.projectId === wsProjId, 'User A received real-time project:deleted event');

    // 20.8 Socket.IO Telemetry API
    const socketStatsRes = await fetch(`${BASE_URL}/socket/stats`);
    const socketStatsData = await socketStatsRes.json();
    assert(socketStatsRes.status === 200, 'GET /api/socket/stats returned 200 OK');
    assert(socketStatsData.data?.activeConnections >= 2, `Socket telemetry active connections is >= 2 (${socketStatsData.data?.activeConnections})`);
    assert(socketStatsData.data?.eventsEmitted >= 6, `Socket telemetry events emitted is >= 6 (${socketStatsData.data?.eventsEmitted})`);

    // Clean up sockets
    userASocket.disconnect();
    userBSocket.disconnect();

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
