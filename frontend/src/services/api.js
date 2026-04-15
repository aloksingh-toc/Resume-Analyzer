import axios from 'axios'

const API_BASE = '/api/resume'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s timeout for AI processing
})

export const analyzeResume = async (file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
  return response.data
}

export const getHistory = async () => {
  const response = await api.get('/history')
  return response.data
}

export const getAnalysisById = async (id) => {
  const response = await api.get(`/${id}`)
  return response.data
}
