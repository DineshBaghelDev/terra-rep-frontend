import axios from 'axios'
import { API_BASE_URL } from './constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if we are in the browser
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ==========================================
// Type Definitions
// ==========================================

export interface Activity {
  activity_id: string
  activity_type: string
  quantity: number
  unit: string
  date: string
  region_country: string
  region_state?: string
  scope: string | number
  source: string
  source_document?: string
  confidence_score: number
  emissions?: number
  notes?: string
}

export interface EmissionCalculation {
  activity_id: string
  emissions: number
  factor_id: string
  factor_value: number
  factor_unit: string
  factor_source: string
  factor_tier: string
  selection_method: string
  confidence_score: number
}

export interface Document {
  id: string
  filename: string
  file_type: string
  size?: string
  upload_date: string
  status: 'processing' | 'review' | 'approved' | 'failed'
  confidence_score?: number
  extracted_fields?: Record<string, any>
  progress?: number
}

export interface ComplianceRequirement {
  id: string
  framework: string
  section: string
  requirement: string
  status: 'complete' | 'incomplete' | 'partial'
  required_data: string[]
  available_data: string[]
  gap_explanation?: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  adjustments: {
    activity_type: string
    change_type: 'percentage' | 'absolute'
    change_value: number
  }[]
  baseline_emissions: number
  projected_emissions: number
  created_at: string
}

export interface CopilotResponse {
  answer: string
  confidence: number
  sources?: string[]
  timestamp: string
}

export interface DashboardStats {
  total_emissions: number
  activities_count: number
  compliance_score: number
  scope_breakdown: Record<string, number>
  emissions_trend: { date: string; value: number }[]
  top_contributors: { name: string; value: number }[]
}

// ==========================================
// API Functions
// ==========================================

export const activitiesApi = {
  list: async (params?: any) => {
    const response = await api.get<Activity[]>('/api/activities', { params })
    return response.data
  },
  create: async (data: Partial<Activity>) => {
    const response = await api.post<Activity>('/api/activities', data)
    return response.data
  },
  update: async (id: string, data: Partial<Activity>) => {
    const response = await api.put<Activity>(`/api/activities/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/activities/${id}`)
    return response.data
  },
}

export const documentsApi = {
  list: async () => {
    const response = await api.get<Document[]>('/api/documents')
    return response.data
  },
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<Document>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    })
    return response.data
  },
}

export const emissionsApi = {
  calculate: async (data: Partial<Activity>) => {
    const response = await api.post<EmissionCalculation>('/api/emissions/calculate', data)
    return response.data
  },
  getFactors: async (type?: string) => {
    const response = await api.get('/api/emissions/factors', { params: { type } })
    return response.data
  },
}

export const complianceApi = {
  assess: async (framework: string = 'brsr') => {
    const response = await api.post('/api/compliance/assess', { framework })
    return response.data
  },
}

export const copilotApi = {
  ask: async (question: string, context?: string) => {
    const response = await api.post<CopilotResponse>('/api/copilot/ask', { question, context })
    return response.data
  },
}

export const scenariosApi = {
  simulate: async (data: Partial<Scenario>) => {
    const response = await api.post<Scenario>('/api/scenarios/simulate', data)
    return response.data
  },
}

export const reportsApi = {
  generate: async (type: 'pdf' | 'excel', period?: string) => {
    const response = await api.post('/api/reports/generate', { type, period }, {
      responseType: 'blob',
    })
    return response.data
  },
}

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/api/dashboard/stats')
    return response.data
  },
}
