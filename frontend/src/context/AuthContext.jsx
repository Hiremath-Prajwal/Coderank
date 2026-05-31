import { createContext, useContext, useState } from 'react'

// ── Create the context ──────────────────────────────────────────
// This context holds auth state available to ALL components
const AuthContext = createContext(null)

// ── Keys used in localStorage ───────────────────────────────────
const TOKEN_KEY = 'coderank_token'
const USER_KEY  = 'coderank_user'

/**
 * AuthProvider - wraps the whole app and provides auth state.
 *
 * Any component can call useAuth() to get:
 *   user           - { username, email } or null
 *   isAuthenticated - true if logged in
 *   login(data)    - saves token + user, marks as authenticated
 *   logout()       - clears token + user
 *   getToken()     - returns the JWT string for API calls
 */
export function AuthProvider({ children }) {

  // Load saved user from localStorage on first render
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  // True if both token and user are present
  const isAuthenticated = Boolean(token && user)

  // Called after successful login or register
  const login = (authData) => {
    const { token, username, email } = authData
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify({ username, email }))
    setToken(token)
    setUser({ username, email })
  }

  // Called when user clicks logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  // Returns the raw JWT string (used by axios interceptor)
  const getToken = () => localStorage.getItem(TOKEN_KEY)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Custom hook for easy access ─────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
