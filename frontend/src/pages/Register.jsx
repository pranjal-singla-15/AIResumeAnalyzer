import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setError(null)
    if(!username || !email || !password) return setError('All fields are required')
    setLoading(true)
    try{
      await axios.get('/api/public/health')
    }catch(err){
      setLoading(false)
      setError('Backend not reachable. Make sure the server is running on port 8080.')
      return
    }
    try{
      await axios.post('/api/public/create-user',{username,email,password})
      navigate('/login')
    }catch(err){
      console.error(err)
      const msg = err.response?.data ? (typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data)) : err.message
      setError('Registration failed: ' + msg)
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900/70 p-8 rounded-2xl shadow-xl dark:shadow-purple-950/40 border border-gray-100 dark:border-purple-900/30 transition-colors duration-300">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Create your account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Start analyzing your resume in minutes</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500 focus:border-transparent transition"
            placeholder="yourname"
            value={username}
            onChange={e=>setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500 focus:border-transparent transition"
            placeholder="you@example.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500 focus:border-transparent transition"
            placeholder="••••••••"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-lg shadow hover:opacity-90 disabled:opacity-60 transition font-medium"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 dark:text-teal-400 font-medium hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}
