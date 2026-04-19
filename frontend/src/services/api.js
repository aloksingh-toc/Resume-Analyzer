import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api/resume'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  withCredentials: true,
})

const authApi = axios.create({
  baseURL: '/api/auth',
  timeout: 10000,
  withCredentials: true,
})

let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    return Promise.reject(err)
  }
)

export const analyzeResume = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getHistory = async (page = 0, size = 10) => {
  const response = await api.get(`/history?page=${page}&size=${size}`)
  return response.data
}

export const getAnalysisById = async (id) => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const login = async (username, password) => {
  const response = await authApi.post('/login', { username, password })
  return response.data
}

export const logout = async () => {
  await authApi.post('/logout')
}

export const getMe = async () => {
  const response = await authApi.get('/me')
  return response.data
}
