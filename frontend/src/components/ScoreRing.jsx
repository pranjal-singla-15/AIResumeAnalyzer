import React from 'react'

import { useTheme } from '../context/ThemeContext'

export default function ScoreRing({ score = 0, size = 140 }) {
  const { theme } = useTheme()
  const clamped = Math.max(0, Math.min(100, score))
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  const color =
    clamped >= 75 ? '#16a34a' : clamped >= 50 ? '#d97706' : '#dc2626'
  const trackColor = theme === 'dark' ? '#2e2244' : '#e5e7eb'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{Math.round(clamped)}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">/ 100</span>
      </div>
    </div>
  )
}
