const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    return null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  analyze: (payload) => request('/api/v1/analyze', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getProgress: () => request('/api/v1/progress'),

  getRoadmap: () => request('/api/v1/roadmap'),

  completeItem: (id) => request(`/api/v1/progress/${id}/complete`, {
    method: 'POST'
  }),

  getProfile: () => request('/api/v1/profile'),

  saveProfile: (payload) => request('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
};
