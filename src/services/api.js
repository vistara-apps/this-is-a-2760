// API Configuration and Base Service
import axios from 'axios'

// Environment variables (these would be set in production)
const API_CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-key',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-key',
  X_API_BEARER_TOKEN: import.meta.env.VITE_X_API_BEARER_TOKEN || 'your-x-bearer-token'
}

// Create axios instances for different services
export const supabaseApi = axios.create({
  baseURL: `${API_CONFIG.SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': API_CONFIG.SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const xApi = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    'Authorization': `Bearer ${API_CONFIG.X_API_BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

// Error handling interceptor
const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    switch (status) {
      case 401:
        throw new Error('Authentication failed. Please check your credentials.')
      case 403:
        throw new Error('Access forbidden. Please check your permissions.')
      case 404:
        throw new Error('Resource not found.')
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.')
      case 500:
        throw new Error('Server error. Please try again later.')
      default:
        throw new Error(data?.message || `Request failed with status ${status}`)
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.')
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred.')
  }
}

// Add error interceptors to all API instances
[supabaseApi, openaiApi, xApi].forEach(api => {
  api.interceptors.response.use(
    response => response,
    error => handleApiError(error)
  )
})

export { API_CONFIG }
