import React, { useState } from 'react'
import api from '../utils/api'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import JobCard from '../components/JobCard'
import EmptyState from '../components/EmptyState'

const SUGGESTIONS = [
  'Software developer jobs in Bengaluru',
  'Data analyst jobs in Delhi',
  'Frontend developer jobs remote',
  'Product manager jobs in Mumbai',
]

export default function JobSearch(){
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const hasSkills = !!localStorage.getItem('lastResumeSkills')

  const runSearch = async (q) => {
    const searchQuery = (q ?? query).trim()
    if (!searchQuery) return setError('Please enter a search query.')
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const skillsRaw = localStorage.getItem('lastResumeSkills')
      const skills = skillsRaw ? JSON.parse(skillsRaw) : null

      // Use the new combined search and match endpoint
      if (skills && skills.length > 0) {
        const res = await api.post('/jobs/search-with-match', {
          query: searchQuery,
          resumeSkills: skills
        })
        const jobsWithMatch = res.data?.jobsWithMatch || []
        setJobs(jobsWithMatch)
        // Since matches are already included in jobsWithMatch, we'll handle this differently in JobCard
        } else {
         // No skills, use regular search — backend now returns jobsWithMatch when possible
         const res = await api.get('/jobs/search', { params: { query: searchQuery } })
         const jobsWithMatch = res.data?.jobsWithMatch || res.data?.jobs || []
         setJobs(jobsWithMatch)
       }
    } catch (err) {
      console.error(err)
      setError('Job search failed. Please try again in a moment.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    runSearch()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Search Jobs</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {hasSkills
            ? "We'll show your profile match % for each result, based on your last analyzed resume."
            : 'Analyze a resume first to see profile match % alongside search results.'}
        </p>
      </div>

      <Card>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 focus:border-transparent transition"
            placeholder="e.g. software developer jobs in Bengaluru"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {!searched && (
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setQuery(s); runSearch(s) }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </Card>

      {loading && <Spinner label="Searching for jobs..." />}

      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-lg text-sm">{error}</div>
      )}

      {!loading && !error && searched && jobs.length === 0 && (
        <EmptyState icon="🔎" title="No jobs found" subtitle="Try a different query, e.g. add a role and a city." />
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, i) => {
            // Extract match data if available
            const match = job.matchPercentage !== undefined ? {
              matchPercentage: job.matchPercentage,
              matchedSkills: job.matchedSkills,
              missingSkills: job.missingSkills,
              summary: job.summary
            } : null
            return (
              <JobCard key={job.jobId || i} job={job} match={match} />
            )
          })}
        </div>
      )}
    </div>
  )
}
