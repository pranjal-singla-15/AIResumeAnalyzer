import React from 'react'

export default function Card({title, children}){
  return (
    <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-xl dark:shadow-purple-950/40 p-6 border border-gray-100 dark:border-purple-900/30 transition-colors duration-300">
      {title && <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">{title}</h3>}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  )
}
