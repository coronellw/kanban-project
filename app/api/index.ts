import axios from "axios"

export const kanbanApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Add response interceptor to handle authentication errors
kanbanApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid session
      localStorage.removeItem('K-TOKEN')
      delete kanbanApi.defaults.headers.common['Authorization']
      
      // Redirect to login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)
