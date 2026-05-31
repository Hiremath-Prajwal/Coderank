import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute - guards pages that need login.
 *
 * If the user is NOT logged in:
 *   → redirects them to /login
 *   → saves where they were trying to go (so we can redirect back after login)
 *
 * If the user IS logged in:
 *   → renders the protected page normally
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Save the page they tried to visit so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
