import React from 'react'

export default function JobCard({ job, match }) {
  const matchColor = match?.matchPercentage >= 75
    ? 'bg-green-100 text-green-700'
    : match?.matchPercentage >= 50
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700'

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col hover:shadow-xl transition">
      <div className="flex items-start gap-3">
        {job.companyLogo ? (
          <img src={job.companyLogo} alt={job.company} className="w-11 h-11 rounded-lg object-contain border border-gray-100 flex-shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
            {job.company?.[0]?.toUpperCase() || 'J'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate" title={job.title}>{job.title}</p>
          <p className="text-sm text-gray-500 truncate">{job.company}</p>
        </div>
        {match?.matchPercentage !== undefined && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${matchColor}`}>
            {Math.round(match.matchPercentage)}% match
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
        {job.location && <span className="px-2 py-1 bg-gray-100 rounded-full">📍 {job.location}</span>}
        {job.employmentType && <span className="px-2 py-1 bg-gray-100 rounded-full">🕒 {job.employmentType}</span>}
        {job.postedAt && <span className="px-2 py-1 bg-gray-100 rounded-full">🗓 {job.postedAt}</span>}
      </div>

      {job.description && (
        <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>
      )}

      {match?.matchedSkills?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Matched skills</p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">{s}</span>
            ))}
          </div>
        </div>
      )}

      {match?.missingSkills?.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-500 mb-1">Skills to build</p>
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">{s}</span>
            ))}
          </div>
        </div>
      )}

      {job.applyLink && (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Apply Now
        </a>
      )}
    </div>
  )
}
