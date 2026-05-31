import { useState } from 'react'
import { Terminal, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

/**
 * Navbar - top bar shown on every authenticated page.
 *
 * Shows:
 *   - CodeRank logo (left)
 *   - Username with dropdown (right)
 *   - Logout option in dropdown
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  return (
    <header className="h-14 bg-[#181825] border-b border-[#313244] flex items-center justify-between px-5 shrink-0 z-50">

      {/* ── Left: Logo ─────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
          <Terminal size={16} className="text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">CodeRank</span>
        <span className="text-xs text-[#45475a] bg-[#313244] px-2 py-0.5 rounded font-mono">v1.0</span>
      </div>

      {/* ── Right: User dropdown ───────────────────────── */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 text-sm text-[#cdd6f4] bg-[#313244] hover:bg-[#45475a]
                     px-3 py-2 rounded-lg border border-[#45475a] transition-colors"
        >
          {/* Avatar circle */}
          <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <span className="font-medium">{user?.username}</span>
          <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <>
            {/* Invisible overlay to close dropdown when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />

            <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#313244] border border-[#45475a]
                            rounded-xl shadow-xl z-50 fade-in overflow-hidden">
              {/* User info */}
              <div className="px-4 py-3 border-b border-[#45475a]">
                <p className="text-xs text-[#6c7086] mb-0.5">Signed in as</p>
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400
                           hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
