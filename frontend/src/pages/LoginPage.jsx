import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Loader, Terminal } from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * LoginPage - lets existing users sign in.
 *
 * Flow:
 *   1. User fills username + password
 *   2. Frontend validates (not empty)
 *   3. POST /auth/login sent to backend
 *   4. Backend returns { token, username, email }
 *   5. Token saved to localStorage via AuthContext.login()
 *   6. User redirected to /dashboard
 */
export default function LoginPage() {
  const [form, setForm]               = useState({ username: '', password: '' })
  const [errors, setErrors]           = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]         = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  // After login, go back to where the user was trying to go
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  // ── Simple client-side validation ──────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = 'Username is required'
    if (!form.password)        errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error for this field as user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await authService.login(form)
      login(data)
      toast.success(`Welcome back, ${data.username}!`)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">

        {/* ── Logo ─────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-3">
            <Terminal size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CodeRank</h1>
          <p className="text-[#6c7086] text-sm mt-1">Online Code Execution Platform</p>
        </div>

        {/* ── Card ─────────────────────────────────────── */}
        <div className="panel p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-[#cdd6f4] mb-1.5">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-[#cdd6f4] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className={`input-field pr-11 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#585b70] hover:text-[#cdd6f4] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* General error (wrong credentials) */}
            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit button */}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading
                ? <><Loader size={16} className="spin" /> Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>

          {/* Link to register */}
          <p className="text-center text-sm text-[#6c7086] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
