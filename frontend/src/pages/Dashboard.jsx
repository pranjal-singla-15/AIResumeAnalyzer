import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'

function ScoreBadge({ score }) {
  if (score === null || score === undefined) {
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Not analyzed</span>
  }
  const color = score >= 75 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>ATS {score}</span>
}

export default function Dashboard(){
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  const loadResumes = async () => {
    setLoading(true)
    setError(null)
    try{
      const res = await api.get('/api/resume')
      setResumes(res.data || [])
    }catch(err){
      console.error(err)
      setError('Could not load your resumes right now.')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ loadResumes() }, [])

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this resume? This cannot be undone.')) return
    setDeletingId(id)
    try{
      await api.delete(`/api/resume/${id}`)
      setResumes(prev => prev.filter(r => r.id !== id))
    }catch(err){
      console.error(err)
      alert('Could not delete resume.')
    }finally{
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {email ? `Welcome back, ${email.split('@')[0]}` : 'Welcome back'}
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your job search.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Upload Resume</h3>
              <p className="text-sm text-gray-500">Get your ATS score, strengths & improvements.</p>
            </div>
            <span className="text-2xl">📤</span>
          </div>
          <Link to="/upload" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow text-sm font-medium hover:opacity-90 transition">
            Upload now
          </Link>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Search Jobs</h3>
              <p className="text-sm text-gray-500">Find roles that match your skills & location.</p>
            </div>
            <span className="text-2xl">🔍</span>
          </div>
          <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow text-sm font-medium hover:opacity-90 transition">
            Search jobs
          </Link>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Resumes on file</h3>
              <p className="text-sm text-gray-500">Total resumes you've uploaded.</p>
            </div>
            <span className="text-2xl">📄</span>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-indigo-600">{loading ? '—' : resumes.length}</div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Resumes</h2>

        {loading && <Spinner label="Loading your resumes..." />}

        {!loading && error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {!loading && !error && resumes.length === 0 && (
          <EmptyState
            icon="📄"
            title="No resumes yet"
            subtitle="Upload your first resume to get an ATS score, strengths, improvements and job recommendations tailored to you."
            action={<Link to="/upload" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow font-medium hover:opacity-90 transition">Upload Resume</Link>}
          />
        )}

        {!loading && !error && resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col justify-between hover:shadow-xl transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">📄</span>
                    <ScoreBadge score={r.atsScore} />
                  </div>
                  <p className="font-medium text-gray-800 truncate" title={r.fileName}>{r.fileName}</p>
                  {r.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded {new Date(r.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/analyze/${r.id}`)}
                    className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    {r.atsScore ? 'View Analysis' : 'Analyze'}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deletingId === r.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
