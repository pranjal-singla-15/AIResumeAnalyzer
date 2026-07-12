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
      <form onSubmit={submit} className="space-y-5 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-1 text-sm">Log in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}
