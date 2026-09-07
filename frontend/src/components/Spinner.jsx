import React from 'react'

export default function Spinner({ label, size = 'md' }) {
  const dims = size === 'sm' ? 'h-4 w-4 border-2' : size === 'lg' ? 'h-10 w-10 border-4' : 'h-6 w-6 border-[3px]'
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-gray-500 dark:text-gray-400">
      <div className={`${dims} rounded-full border-indigo-600 dark:border-purple-500 border-t-transparent animate-spin`} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  )
}
