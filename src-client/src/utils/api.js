import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      toast.error('Network error - please check your connection')
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
}

// Projects API
export const projectsAPI = {
  create: (projectData) => api.post('/projects', projectData),
  getAll: (params) => api.get('/projects', { params }),
  getApproved: (params) => api.get('/projects/all-approved', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  updateStatus: (id, statusData) => api.put(`/projects/${id}/status`, statusData),
  finalUpload: (id, documents) => api.put(`/projects/${id}/final-upload`, documents),
  delete: (id) => api.delete(`/projects/${id}`),
  // ADD NEW FUNCTION
  submitFinalDetails: (id, projectDetails) => 
    api.put(`/projects/${id}/final-details`, { projectDetails }),
}

// Users API
export const usersAPI = {
  getFaculty: () => api.get('/users/faculty'),
  getFacultyByDepartment: (department) => api.get(`/users/faculty/${department}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

// Upload API - Note: File uploads use direct axios calls for progress tracking
export const uploadAPI = {
  // This is just for reference, actual uploads use direct axios in components
  document: (formData) => api.post('/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export default api