import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isAuthed, logout } from '../utils/auth'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 bg-gray-200 dark:bg-gradient-to-r dark:from-indigo-700 dark:to-purple-700 border border-gray-300 dark:border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <span
        className={`inline-flex items-center justify-center h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <span className="text-xs">🌙</span>
        ) : (
          <span className="text-xs">☀️</span>
        )}
      </span>
    </button>
  )
}

export default function Navbar(){
  const navigate = useNavigate()
  const location = useLocation()
  const handleLogout = ()=>{ logout(); navigate('/login') }
  const authed = isAuthed()
  const email = localStorage.getItem('email')

  const linkClass = (path) =>
    `text-sm font-medium transition ${location.pathname === path ? 'text-indigo-600 dark:text-purple-400' : 'text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-purple-400'}`

  return (
    <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm dark:shadow-purple-900/20 sticky top-0 z-10 border-b border-transparent dark:border-purple-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          AI Resume Analyzer
        </Link>
        <nav className="space-x-4 sm:space-x-6 flex items-center">
          {authed ? (
            <>
              <Link to="/" className={linkClass('/')}>Dashboard</Link>
              <Link to="/upload" className={linkClass('/upload')}>Upload</Link>
              <Link to="/jobs" className={linkClass('/jobs')}>Jobs</Link>
              <div className="hidden sm:block px-3 py-1 text-sm text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">{email}</div>
              <ThemeToggle />
              <button onClick={handleLogout} className="px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link to="/register" className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition">Register</Link>
              <ThemeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
