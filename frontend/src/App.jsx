import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'

/**
 * App.jsx - defines all page routes.
 *
 * Routes:
 *   /           → redirects to /dashboard or /login based on auth state
 *   /login      → login page (redirects to /dashboard if already logged in)
 *   /register   → register page (redirects to /dashboard if already logged in)
 *   /dashboard  → main code editor page (protected - needs login)
 */
export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Root redirects based on login state */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />

      {/* Login page - if already logged in, go to dashboard */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Register page - if already logged in, go to dashboard */}
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Dashboard - protected, must be logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
