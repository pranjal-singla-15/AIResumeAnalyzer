import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import ScoreRing from '../components/ScoreRing'
import JobCard from '../components/JobCard'
import EmptyState from '../components/EmptyState'

export default function AnalyzeResults(){
  const { resumeId } = useParams()

  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobsError, setJobsError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.post(`/api/resume/${resumeId}/analyze`)
        if (cancelled) return
        setAnalysis(res.data)
        if (res.data?.skills) {
          localStorage.setItem('lastResumeSkills', JSON.stringify(res.data.skills))
        }
        fetchRecommendedJobs(res.data)
      } catch (err) {
        console.error(err)
        if (cancelled) return
        if (err.code === 'ERR_NETWORK' || !err.response) {
          setError('Cannot reach the backend. Make sure the server is running.')
        } else {
          setError('Could not analyze this resume. The AI service may be unavailable right now.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const fetchRecommendedJobs = async (analysisData) => {
      setJobsLoading(true)
      setJobsError(null)
      try {
        const query = analysisData?.recommendedRoles?.[0]
          || analysisData?.skills?.[0]
          || 'software developer'
        
        // Use the new combined search and match endpoint
        if (analysisData?.skills?.length > 0) {
          const res = await api.post('/jobs/search-with-match', {
            query: `${query} jobs`,
            resumeSkills: analysisData.skills
          })
          const jobsWithMatch = res.data?.jobsWithMatch || []
          setJobs(jobsWithMatch)
          // Matches are already included in the jobsWithMatch objects
        } else {
          // No skills, use regular search — backend may return jobsWithMatch as well
          const searchRes = await api.get('/jobs/search', { params: { query: `${query} jobs` } })
          const jobsWithMatch = searchRes.data?.jobsWithMatch || searchRes.data?.jobs || []
          setJobs(jobsWithMatch)
        }
      } catch (err) {
        console.error(err)
        setJobsError('Could not fetch job recommendations right now.')
      } finally {
        setJobsLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [resumeId])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card><Spinner label="Analyzing your resume with AI..." size="lg" /></Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <Link to="/" className="mt-4 inline-block px-4 py-2 bg-indigo-600 dark:bg-purple-600 text-white rounded-lg text-sm font-medium">
              Back to Dashboard
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col items-center text-center">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">ATS Score</h3>
            <ScoreRing score={analysis?.atsScore ?? 0} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">How well your resume passes automated screening</p>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Card title="Detected Skills">
            <div className="flex flex-wrap gap-2">
              {analysis?.skills?.length ? analysis.skills.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 rounded-full text-sm font-medium">{s}</span>
              )) : <p className="text-gray-500 dark:text-gray-400 text-sm">No skills detected.</p>}
            </div>

            {analysis?.recommendedRoles?.length > 0 && (
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedRoles.map((r, i) => (
                    <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 rounded-full text-sm font-medium">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="✅ Strengths">
          {analysis?.strengths?.length ? (
            <ul className="space-y-2">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">●</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 dark:text-gray-400 text-sm">No strengths identified.</p>}
        </Card>

        <Card title="💡 Improvements">
          {analysis?.improvements?.length ? (
            <ul className="space-y-2">
              {analysis.improvements.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-amber-500 dark:text-amber-400 mt-0.5">●</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 dark:text-gray-400 text-sm">No improvements suggested.</p>}
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recommended Jobs for You</h2>

        {jobsLoading && <Spinner label="Finding jobs that match your profile..." />}

        {!jobsLoading && jobsError && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-lg text-sm">{jobsError}</div>
        )}

        {!jobsLoading && !jobsError && jobs.length === 0 && (
          <EmptyState icon="💼" title="No job recommendations found" subtitle="Try searching manually from the Job Search page." />
        )}

        {!jobsLoading && jobs.length > 0 && (
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
    </div>
  )
}
