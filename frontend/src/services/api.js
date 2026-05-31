import axios from 'axios'

/**
 * api.js - All HTTP calls to the Spring Boot backend are here.
 *
 * We use Axios with an interceptor that automatically:
 *   - Adds "Authorization: Bearer <token>" to every request
 *   - Redirects to /login if the server returns 401 (token expired)
 *
 * The baseURL is empty because vite.config.js proxies /auth and /api
 * to http://localhost:8080 automatically during development.
 */

// ── Create the Axios instance ───────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// ── Request interceptor ─────────────────────────────────────────
// Runs before every request - attaches the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('coderank_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ────────────────────────────────────────
// Runs after every response - handles 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, clear storage and go to login
    if (error.response?.status === 401) {
      localStorage.removeItem('coderank_token')
      localStorage.removeItem('coderank_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth API calls ──────────────────────────────────────────────
export const authService = {
  // POST /auth/register  →  { username, email, password }
  register: (data) => api.post('/auth/register', data),

  // POST /auth/login  →  { username, password }
  login: (data) => api.post('/auth/login', data),
}

// ── Code Execution API calls ────────────────────────────────────
export const executionService = {
  // POST /api/execute  →  { language, code, input }
  execute: (data) => api.post('/api/execute', data),

  // GET /api/executions/history
  getHistory: () => api.get('/api/executions/history'),
}

export default api
