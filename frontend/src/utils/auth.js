export function setAuth(token, email){
  localStorage.setItem('auth', token)
  if(email) localStorage.setItem('email', email)
}

export function getAuthToken(){
  return localStorage.getItem('auth')
}

export function getAuthHeader(){
  const t = getAuthToken()
  return t ? { Authorization: `Basic ${t}` } : {}
}

export function logout(){
  localStorage.removeItem('auth')
  localStorage.removeItem('email')
}

export function isAuthed(){
  return !!getAuthToken()
}
