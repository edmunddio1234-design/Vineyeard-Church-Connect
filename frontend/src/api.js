const API_URL = import.meta.env.VITE_API_URL || '';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json()),

  register: (name, email, password) =>
    fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    }).then((r) => r.json()),

  // Members
  getMembers: (params = '') =>
    fetch(`${API_URL}/api/members?${params}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  getMember: (id) =>
    fetch(`${API_URL}/api/members/${id}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  // Profile
  getProfile: () =>
    fetch(`${API_URL}/api/profile`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  updateProfile: (data) =>
    fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // Messages
  getConversations: () =>
    fetch(`${API_URL}/api/messages`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  getMessages: (userId) =>
    fetch(`${API_URL}/api/messages/conversation/${userId}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  sendMessage: (toId, text) =>
    fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ to_user_id: toId, text }),
    }).then((r) => r.json()),

  // Connections
  getConnections: () =>
    fetch(`${API_URL}/api/connections`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  sendConnection: (toId) =>
    fetch(`${API_URL}/api/connections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ to_user_id: toId }),
    }).then((r) => r.json()),

  acceptConnection: (id) =>
    fetch(`${API_URL}/api/connections/${id}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then((r) => r.json()),

  declineConnection: (id) =>
    fetch(`${API_URL}/api/connections/${id}/decline`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then((r) => r.json()),

  // Jobs
  getJobs: (params = '') =>
    fetch(`${API_URL}/api/jobs?${params}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  createJob: (data) =>
    fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // Prayer
  getPrayers: (params = '') =>
    fetch(`${API_URL}/api/prayer?${params}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  createPrayer: (data) =>
    fetch(`${API_URL}/api/prayer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  prayForRequest: (id) =>
    fetch(`${API_URL}/api/prayer/${id}/pray`, {
      method: 'POST',
      headers: getHeaders(),
    }).then((r) => r.json()),

  markAnswered: (id) =>
    fetch(`${API_URL}/api/prayer/${id}/answer`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then((r) => r.json()),

  addPrayerResponse: (id, text) =>
    fetch(`${API_URL}/api/prayer/${id}/responses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),

  getPrayerResponses: (id) =>
    fetch(`${API_URL}/api/prayer/${id}/responses`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  // Gallery
  getGalleryPosts: (params = '') =>
    fetch(`${API_URL}/api/gallery?${params}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  createGalleryPost: (data) =>
    fetch(`${API_URL}/api/gallery`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  likeGalleryPost: (id) =>
    fetch(`${API_URL}/api/gallery/${id}/like`, {
      method: 'POST',
      headers: getHeaders(),
    }).then((r) => r.json()),

  getGalleryComments: (id) =>
    fetch(`${API_URL}/api/gallery/${id}/comments`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  addGalleryComment: (id, text) =>
    fetch(`${API_URL}/api/gallery/${id}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),

  // Suggestions
  getSuggestions: (params = '') =>
    fetch(`${API_URL}/api/suggestions?${params}`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  createSuggestion: (data) =>
    fetch(`${API_URL}/api/suggestions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  voteSuggestion: (id) =>
    fetch(`${API_URL}/api/suggestions/${id}/vote`, {
      method: 'POST',
      headers: getHeaders(),
    }).then((r) => r.json()),

  getSuggestionComments: (id) =>
    fetch(`${API_URL}/api/suggestions/${id}/comments`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  addSuggestionComment: (id, text) =>
    fetch(`${API_URL}/api/suggestions/${id}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),

  // Notifications
  getNotifications: () =>
    fetch(`${API_URL}/api/notifications`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  getUnreadCount: () =>
    fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: getHeaders(),
    }).then((r) => r.json()),

  markNotificationRead: (id) =>
    fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then((r) => r.json()),

  markAllNotificationsRead: () =>
    fetch(`${API_URL}/api/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then((r) => r.json()),
};
