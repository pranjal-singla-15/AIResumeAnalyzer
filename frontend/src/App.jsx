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

export default function App(){
  const isAuthed = checkAuthed()
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={isAuthed ? <UploadResume /> : <Navigate to="/login" />} />
          <Route path="/analyze/:resumeId" element={isAuthed ? <AnalyzeResults /> : <Navigate to="/login" />} />
          <Route path="/jobs" element={isAuthed ? <JobSearch /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthed ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthed ? "/" : "/login"} />} />
        </Routes>
      </main>
    </div>
  )
}
