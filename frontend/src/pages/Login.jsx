import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { setAuth } from '../utils/auth'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setError(null)
    if(!email || !password) return setError('Please enter both email and password')
    setLoading(true)
    try{
      const token = btoa(`${email}:${password}`)
      // Validate credentials against a dedicated, lightweight auth-check
      // endpoint (doesn't depend on the AI service or any other feature).
      await axios.get('/api/user/me', { headers: { Authorization: `Basic ${token}` } })
      setAuth(token, email)
      navigate('/')
    }catch(err){
      console.error(err)
      if(err.code === 'ERR_NETWORK' || !err.response){
        setError('Cannot reach the backend. Make sure the server is running on port 8080.')
      } else if(err.response.status === 401){
        setError('Invalid email or password')
      } else {
        const msg = err.response?.data ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) : err.message
        setError('Login failed: ' + msg)
      }
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900/70 p-8 rounded-2xl shadow-xl dark:shadow-purple-950/40 border border-gray-100 dark:border-purple-900/30 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Welcome back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Log in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 focus:border-transparent transition"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 focus:border-transparent transition"
            placeholder="••••••••"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow hover:opacity-90 disabled:opacity-60 transition font-medium"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-purple-400 font-medium hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}
