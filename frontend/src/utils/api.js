import axios from 'axios'
import { getAuthHeader, logout } from './auth'

const api = axios.create({
  baseURL: '/',
})

api.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeader() }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
