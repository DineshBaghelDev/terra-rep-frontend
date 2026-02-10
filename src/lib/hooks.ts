/**
 * React hooks for API integration
 * Using React Query for data fetching, caching, and synchronization
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  activitiesApi,
  documentsApi,
  emissionsApi,
  complianceApi,
  copilotApi,
  scenariosApi,
  reportsApi,
  dashboardApi,
  Activity,
  CopilotResponse,
  Scenario,
} from './api'

// ========================================
// Dashboard Hooks
// ========================================

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// ========================================
// Activities Hooks
// ========================================

export function useActivities(params?: {
  skip?: number
  limit?: number
  activity_type?: string
  scope?: string
}) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => activitiesApi.list(params),
  })
}

export function useActivity(activityId: string) {
  return useQuery({
    queryKey: ['activities', activityId],
    queryFn: () => activitiesApi.get(activityId),
    enabled: !!activityId,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['emissions'] })
      toast.success('Activity created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create activity')
    },
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activitiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['emissions'] })
      toast.success('Activity deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete activity')
    },
  })
}

// ========================================
// Documents Hooks
// ========================================

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.list,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: documentsApi.upload,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(
        `Successfully extracted ${data.activities_extracted} activities from ${data.filename}`
      )
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to upload document')
    },
  })
}

// ========================================
// Emissions Hooks
// ========================================

export function useEmissionsCalculation(activityIds?: string[]) {
  return useQuery({
    queryKey: ['emissions', 'calculate', activityIds],
    queryFn: () => emissionsApi.calculate(activityIds),
  })
}

// ========================================
// Compliance Hooks
// ========================================

export function useComplianceAssessment() {
  return useQuery({
    queryKey: ['compliance', 'assess'],
    queryFn: complianceApi.assess,
  })
}

// ========================================
// AI Copilot Hooks
// ========================================

export function useAskCopilot() {
  return useMutation({
    mutationFn: ({ question, context }: { question: string; context?: string }) =>
      copilotApi.ask(question, context),
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to get answer from copilot')
    },
  })
}

export function useHotspots(topN: number = 5) {
  return useQuery({
    queryKey: ['copilot', 'hotspots', topN],
    queryFn: () => copilotApi.getHotspots(topN),
  })
}

export function useRecommendations(budgetRange?: string) {
  return useQuery({
    queryKey: ['copilot', 'recommendations', budgetRange],
    queryFn: () => copilotApi.getRecommendations(budgetRange),
  })
}

// ========================================
// Scenarios Hooks
// ========================================

export function useSimulateScenario() {
  return useMutation({
    mutationFn: scenariosApi.simulate,
    onSuccess: () => {
      toast.success('Scenario simulated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to simulate scenario')
    },
  })
}

// ========================================
// Reports Hooks
// ========================================

export function useGenerateReports() {
  return useMutation({
    mutationFn: reportsApi.generate,
    onSuccess: () => {
      toast.success('Reports generated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to generate reports')
    },
  })
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: reportsApi.download,
    onSuccess: (blob, filename) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Report downloaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to download report')
    },
  })
}
