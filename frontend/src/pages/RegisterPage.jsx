import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Loader, Terminal } from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'

/* ──────────────────────────────────────────────────────────
   Reusable Field Component
────────────────────────────────────────────────────────── */
function Field({
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  error,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#cdd6f4] mb-1.5">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`input-field ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />

      {error && (
        <p className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Register Page
────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  /* ────────────────────────────────────────────────────────
     Validation
  ──────────────────────────────────────────────────────── */
  const validate = () => {
    const errs = {}

    if (!form.username.trim()) {
      errs.username = 'Username is required'
    } else if (form.username.length < 3) {
      errs.username = 'Username must be at least 3 characters'
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email'
    }

    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    return errs
  }

  /* ────────────────────────────────────────────────────────
     Handle Input Change
  ──────────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  /* ────────────────────────────────────────────────────────
     Handle Submit
  ──────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const { data } = await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
      })

      login(data)

      toast.success('Account created successfully 🚀')

      navigate('/dashboard')
    } catch (err) {
      const serverErrors = err.response?.data

      if (
        serverErrors &&
        typeof serverErrors === 'object' &&
        !serverErrors.message
      ) {
        setErrors(serverErrors)
      } else {
        const message =
          serverErrors?.message ||
          'Registration failed. Please try again.'

        toast.error(message)

        setErrors({
          general: message,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  /* ────────────────────────────────────────────────────────
     UI
  ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-3">
            <Terminal size={24} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            CodeRank
          </h1>

          <p className="text-[#6c7086] text-sm mt-1">
            Create your account
          </p>
        </div>

        {/* Card */}
        <div className="panel p-8">
          <h2 className="text-lg font-semibold text-white mb-6">
            New Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <Field
              name="username"
              label="Username"
              placeholder="e.g. john_doe"
              autoComplete="username"
              value={form.username}
              error={errors.username}
              onChange={handleChange}
            />

            {/* Email */}
            <Field
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              error={errors.email}
              onChange={handleChange}
            />

            {/* Password */}
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
                  className={`input-field pr-11 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#585b70] hover:text-[#cdd6f4]"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <Field
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
            />

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {loading ? (
                <>
                  <Loader size={16} className="spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-[#6c7086] mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}