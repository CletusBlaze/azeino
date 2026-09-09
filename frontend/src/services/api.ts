const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  // Conversations
  getConversations: () => request('/api/conversations'),
  createConversation: (title?: string) => request('/api/conversations', { method: 'POST', body: JSON.stringify({ title }) }),
  getConversation: (id: string) => request(`/api/conversations/${id}`),
  updateConversation: (id: string, data: object) => request(`/api/conversations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteConversation: (id: string) => request(`/api/conversations/${id}`, { method: 'DELETE' }),

  // Messages
  sendMessage: (conversationId: string, data: { message: string; fileId?: string; contextHint?: string; personalization?: string }) =>
    request(`/api/messages/${conversationId}/messages`, { method: 'POST', body: JSON.stringify(data) }),

  // Files
  uploadFile: (file: File) => {
    const token = localStorage.getItem('access_token');
    const form = new FormData();
    form.append('file', file);
    return fetch(`${API_URL}/api/files/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then((r) => r.json());
  },
  getFiles: () => request('/api/files'),
  deleteFile: (id: string) => request(`/api/files/${id}`, { method: 'DELETE' }),

  // Memory
  getMemory: () => request('/api/memory'),
  deleteMemory: (id: string) => request(`/api/memory/${id}`, { method: 'DELETE' }),

  // Usage
  getUsage: () => request('/api/usage'),

  // Images
  getImages: () => request('/api/images'),
};
