const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('devtrack_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);

    // Handle 204 No Content
    if (res.status === 204) {
      return { success: true };
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.details = data?.errors;
      throw error;
    }

    return data;
  } catch (err) {
    // If the backend server is temporarily offline or unreachable
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const error = new Error('Backend server is offline. Please ensure Express is running on port 5000.');
      error.status = 503;
      throw error;
    }
    throw err;
  }
}

export const api = {
  // Auth API
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => request('/auth/me'),
  },

  // Projects API
  projects: {
    getAll: () => request('/projects'),
    getById: (id) => request(`/projects/${id}`),
    create: (body) => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  },

  // Tasks API
  tasks: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/tasks${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/tasks/${id}`),
    create: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },

  // Dashboard API
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getActivity: () => request('/dashboard/activity'),
  },

  // AI API
  ai: {
    chat: (body) => request('/ai/chat', { method: 'POST', body: JSON.stringify(body) }),
    getConversations: () => request('/ai/conversations'),
    getConversationById: (id) => request(`/ai/conversations/${id}`),
    deleteConversation: (id) => request(`/ai/conversations/${id}`, { method: 'DELETE' }),
  },
};
