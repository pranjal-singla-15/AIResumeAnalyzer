import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function UploadResume(){
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const pickFile = (f) => {
    setError(null)
    if(!f) return
    if(f.type !== 'application/pdf'){
      setError('Only PDF files are supported.')
      return
    }
    setFile(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const upload = async () => {
    if(!file) return setError('Please choose a PDF resume first.')
    setUploading(true)
    setError(null)
    try{
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/api/resume/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const resumeId = res.data?.id
      if(resumeId){
        navigate(`/analyze/${resumeId}`)
      } else {
        navigate('/')
      }
    }catch(err){
      console.error(err)
      const msg = err.response?.data?.message || err.response?.data || err.message
      setError(typeof msg === 'string' ? msg : 'Upload failed. Please try again.')
    }finally{
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Upload your resume</h1>
        <p className="text-gray-500 mt-1 text-sm">PDF only. We'll extract the text and run it through our AI analyzer.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div
          onDragOver={(e)=>{ e.preventDefault(); setDragActive(true) }}
          onDragLeave={()=> setDragActive(false)}
          onDrop={onDrop}
          onClick={()=> inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e)=> pickFile(e.target.files?.[0])}
          />
          <div className="text-4xl mb-3">{file ? '📄' : '📁'}</div>
          {file ? (
            <>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB — click to change</p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-700">Drag & drop your resume here</p>
              <p className="text-xs text-gray-500 mt-1">or click to browse (PDF only)</p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <button
          onClick={upload}
          disabled={uploading || !file}
          className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg shadow hover:opacity-90 disabled:opacity-50 transition font-medium"
        >
          {uploading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </div>
    </div>
  )
}
