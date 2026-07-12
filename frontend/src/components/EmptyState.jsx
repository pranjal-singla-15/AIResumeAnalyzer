import React from 'react'

export default function EmptyState({ icon = '📄', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white/60 rounded-2xl border border-dashed border-gray-300">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
