'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/Progress'
import { CheckCircle, XCircle, AlertCircle, Shield, FileText, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

const FRAMEWORKS = [
  { id: 'brsr', name: 'BRSR', fullName: 'Business Responsibility & Sustainability Reporting', score: 88 },
  { id: 'ghg', name: 'GHG Protocol', fullName: 'Greenhouse Gas Protocol', score: 92 },
  { id: 'csrd', name: 'CSRD', fullName: 'Corporate Sustainability Reporting Directive', score: 74 },
]

export default function Compliance() {
  const [selectedFramework, setSelectedFramework] = useState('brsr')
  
  const framework = FRAMEWORKS.find((f) => f.id === selectedFramework)!
  
  // Mock requirements
  const requirements = [
    {
      id: 1,
      section: 'Section A: General Disclosures',
      requirement: 'Details of business activities',
      status: 'complete' as const,
      required_data: ['Company info', 'Business operations'],
      available_data: ['Company info', 'Business operations'],
    },
    {
      id: 2,
      section: 'Section B: Management & Process Disclosures',
      requirement: 'Policy and management processes',
      status: 'complete' as const,
      required_data: ['ESG policies', 'Management structure'],
      available_data: ['ESG policies', 'Management structure'],
    },
    {
      id: 3,
      section: 'Section C: Principle-wise Performance',
      requirement: 'GHG Emissions (Scope 1 & 2)',
      status: 'complete' as const,
      required_data: ['Scope 1 data', 'Scope 2 data'],
      available_data: ['Scope 1 data', 'Scope 2 data'],
    },
    {
      id: 4,
      section: 'Section C: Principle-wise Performance',
      requirement: 'GHG Emissions (Scope 3)',
      status: 'partial' as const,
      required_data: ['Upstream emissions', 'Downstream emissions', 'Employee commute'],
      available_data: ['Upstream emissions', 'Downstream emissions'],
      gap_explanation: 'Missing employee commute data',
    },
    {
      id: 5,
      section: 'Section C: Principle-wise Performance',
      requirement: 'Water consumption details',
      status: 'incomplete' as const,
      required_data: ['Water withdrawal', 'Water discharge', 'Water consumption'],
      available_data: [],
      gap_explanation: 'No water consumption data uploaded',
    },
    {
      id: 6,
      section: 'Section C: Principle-wise Performance',
      requirement: 'Waste management',
      status: 'partial' as const,
      required_data: ['Hazardous waste', 'Non-hazardous waste', 'Recycling rates'],
      available_data: ['Non-hazardous waste'],
      gap_explanation: 'Missing hazardous waste and recycling data',
    },
  ]
  
  const completeCount = requirements.filter((r) => r.status === 'complete').length
  const partialCount = requirements.filter((r) => r.status === 'partial').length
  const incompleteCount = requirements.filter((r) => r.status === 'incomplete').length
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'incomplete':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-200 bg-green-50'
      case 'partial':
        return 'border-yellow-200 bg-yellow-50'
      case 'incomplete':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Engine</h1>
            <p className="text-gray-600 mt-1">Framework readiness and gap analysis</p>
          </div>
          <Button variant="primary">
            <Download className="w-5 h-5 mr-2" />
            Export Evidence Pack
          </Button>
        </div>
        
        {/* Framework Selector */}
        <div className="flex gap-3">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setSelectedFramework(fw.id)}
              className={cn(
                'flex-1 p-6 rounded-xl border-2 transition-all',
                selectedFramework === fw.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{fw.name}</h3>
                <Badge
                  variant={fw.score >= 80 ? 'success' : fw.score >= 60 ? 'warning' : 'error'}
                  size="md"
                >
                  {fw.score}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 text-left">{fw.fullName}</p>
            </button>
          ))}
        </div>
        
        {/* Readiness Score & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Score */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Readiness Score</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center py-6">
                <CircularProgress
                  value={framework.score}
                  size={160}
                  strokeWidth={12}
                  color={framework.score >= 80 ? 'success' : framework.score >= 60 ? 'warning' : 'error'}
                />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  {framework.score >= 80
                    ? 'Ready for reporting'
                    : framework.score >= 60
                    ? 'Minor gaps remain'
                    : 'Significant gaps'}
                </p>
              </div>
            </CardBody>
          </Card>
          
          {/* Status Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Requirements Status</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900 mb-1">{completeCount}</p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-xl">
                  <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900 mb-1">{partialCount}</p>
                  <p className="text-sm text-gray-600">Partial</p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-xl">
                  <XCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900 mb-1">{incompleteCount}</p>
                  <p className="text-sm text-gray-600">Incomplete</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Overall Progress</p>
                <div className="flex gap-1">
                  {requirements.map((req) => (
                    <div
                      key={req.id}
                      className={cn(
                        'flex-1 h-2 rounded-full',
                        req.status === 'complete' ? 'bg-green-500' :
                        req.status === 'partial' ? 'bg-yellow-500' :
                        'bg-red-500'
                      )}
                    />
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Requirements Checklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Requirements Checklist</CardTitle>
              <Button variant="ghost" size="sm">
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'p-5 rounded-lg border-2 transition-all hover:shadow-sm',
                    getStatusColor(req.status)
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-0.5">
                      {getStatusIcon(req.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{req.section}</p>
                          <h4 className="font-semibold text-gray-900">{req.requirement}</h4>
                        </div>
                        <Badge
                          variant={
                            req.status === 'complete' ? 'success' :
                            req.status === 'partial' ? 'warning' :
                            'error'
                          }
                          size="sm"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      
                      {/* Data Requirements */}
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Required Data:</p>
                          <div className="space-y-1">
                            {req.required_data.map((data, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={cn(
                                  'w-1.5 h-1.5 rounded-full',
                                  req.available_data.includes(data) ? 'bg-green-500' : 'bg-gray-300'
                                )} />
                                <span className="text-xs text-gray-700">{data}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {req.gap_explanation && (
                          <div>
                            <p className="text-xs text-gray-600 mb-2">Gap Explanation:</p>
                            <p className="text-xs text-gray-700">{req.gap_explanation}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Resolve Gap
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
