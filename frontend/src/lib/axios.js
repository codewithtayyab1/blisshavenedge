import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

// Attach admin JWT to every request that has a token in storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bhe_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
