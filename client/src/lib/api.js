import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — auto-attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roadsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('roadsync_token');
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// ---- Auth API ----
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// ---- Users API ----
export const usersAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getLeaderboard: (limit = 10) => api.get('/api/users/leaderboard', { params: { limit } }),
};

// ---- Parking API ----
export const parkingAPI = {
  getSpots: () => api.get('/api/parking/spots'),
  getNearby: (lat, lng, radius = 5000) =>
    api.get('/api/parking/nearby', { params: { lat, lng, radius } }),
  getSpot: (id) => api.get(`/api/parking/spots/${id}`),
  book: (data) => api.post('/api/parking/book', data),
  getBookings: () => api.get('/api/parking/bookings'),
  cancelBooking: (id) => api.put(`/api/parking/bookings/${id}`),
};

// ---- Emissions API ----
export const emissionsAPI = {
  calculate: (data) => api.post('/api/emissions/calculate', data),
  getHistory: (page = 1, limit = 20) =>
    api.get('/api/emissions/history', { params: { page, limit } }),
  getSummary: () => api.get('/api/emissions/summary'),
};

// ---- Crime Reports API ----
export const crimesAPI = {
  report: (formData) => api.post('/api/crimes/report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyReports: () => api.get('/api/crimes/my-reports'),
};

// ---- Chat API ----
export const chatAPI = {
  sendMessage: (message, sessionId) =>
    api.post('/api/chat/message', { message, sessionId }),
  getHistory: (sessionId) =>
    api.get('/api/chat/history', { params: { sessionId } }),
  clearHistory: (sessionId) =>
    api.delete('/api/chat/history', { params: { sessionId } }),
};

export default api;
