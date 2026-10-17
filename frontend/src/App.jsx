import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadResume from './pages/UploadResume'
import AnalyzeResults from './pages/AnalyzeResults'
import JobSearch from './pages/JobSearch'
import { isAuthed as checkAuthed } from './utils/auth'

// Checks the token on every render, so a fresh login (or logout) takes
// effect immediately instead of using a value captured when App mounted.
function RequireAuth({ children }){
  return checkAuthed() ? children : <Navigate to="/login" replace />
}

function Fallback(){
  return <Navigate to={checkAuthed() ? "/" : "/login"} replace />
}

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-300">
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<RequireAuth><UploadResume /></RequireAuth>} />
          <Route path="/analyze/:resumeId" element={<RequireAuth><AnalyzeResults /></RequireAuth>} />
          <Route path="/jobs" element={<RequireAuth><JobSearch /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<Fallback />} />
        </Routes>
      </main>
    </div>
  )
}
