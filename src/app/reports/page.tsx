'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'
import { FileText, Download, Eye, Settings, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const REPORT_TEMPLATES = [
  {
    id: 'brsr',
    name: 'BRSR Report',
    description: 'Business Responsibility & Sustainability Report for SEBI',
    sections: ['General Disclosures', 'Management Processes', 'Performance Metrics'],
    estimatedPages: 45,
    thumbnail: '📊',
  },
  {
    id: 'ghg',
    name: 'GHG Inventory',
    description: 'Comprehensive Greenhouse Gas emissions inventory',
    sections: ['Scope 1 Emissions', 'Scope 2 Emissions', 'Scope 3 Emissions', 'Methodology'],
    estimatedPages: 28,
    thumbnail: '🌍',
  },
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'High-level ESG performance summary for leadership',
    sections: ['Key Metrics', 'Trends', 'Highlights', 'Recommendations'],
    estimatedPages: 12,
    thumbnail: '📈',
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Build your own report with selected data points',
    sections: ['Customizable'],
    estimatedPages: 0,
    thumbnail: '⚙️',
  },
]

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [reportConfig, setReportConfig] = useState({
    dateRange: 'FY2024',
    format: 'pdf',
    includedSections: [] as string[],
  })
  
  // Mock generated reports
  const generatedReports = [
    {
      id: '1',
      name: 'BRSR_Report_FY2024.pdf',
      template: 'BRSR Report',
      generatedDate: '2024-02-10T14:30:00',
      status: 'completed' as const,
      size: '2.4 MB',
      pages: 45,
    },
    {
      id: '2',
      name: 'GHG_Inventory_Q3_2024.pdf',
      template: 'GHG Inventory',
      generatedDate: '2024-02-08T10:15:00',
      status: 'completed' as const,
      size: '1.8 MB',
      pages: 28,
    },
    {
      id: '3',
      name: 'Executive_Summary_Jan24.pdf',
      template: 'Executive Summary',
      generatedDate: '2024-01-31T16:45:00',
      status: 'generating' as const,
      progress: 67,
      size: 'Calculating...',
      pages: 12,
    },
  ]
  
  const handleGenerateReport = (template: any) => {
    setSelectedTemplate(template)
    setReportConfig({
      ...reportConfig,
      includedSections: template.sections,
    })
    setIsConfigOpen(true)
  }
  
  const handleGenerate = () => {
    console.log('Generating report:', selectedTemplate, reportConfig)
    setIsConfigOpen(false)
    // Handle report generation
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
            <p className="text-gray-600 mt-1">Generate compliance reports and export data</p>
          </div>
        </div>
        
        {/* Report Templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REPORT_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                hover
                className="cursor-pointer transition-all hover:shadow-float"
                onClick={() => handleGenerateReport(template)}
              >
                <CardBody className="text-center">
                  <div className="text-6xl mb-4">{template.thumbnail}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Sections:</span>
                      <span className="font-semibold">{template.sections.length}</span>
                    </div>
                    {template.estimatedPages > 0 && (
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Est. Pages:</span>
                        <span className="font-semibold">{template.estimatedPages}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="primary" className="w-full" size="sm">
                    Generate Report
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Generated Reports */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Reports</h2>
          <Card>
            <CardBody>
              {generatedReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No reports generated yet</p>
                  <p className="text-sm text-gray-500 mt-1">Select a template above to generate your first report</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {report.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {report.template} • Generated {new Date(report.generatedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={report.status === 'completed' ? 'success' : 'info'}
                            size="sm"
                          >
                            {report.status === 'completed' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ready
                              </>
                            ) : (
                              'Generating'
                            )}
                          </Badge>
                        </div>
                        
                        {/* Progress (for generating) */}
                        {report.status === 'generating' && report.progress !== undefined && (
                          <div className="mb-2">
                            <Progress value={report.progress} showLabel size="sm" color="primary" />
                          </div>
                        )}
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span>{report.size}</span>
                          <span>•</span>
                          <span>{report.pages} pages</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      {report.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="primary" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      {/* Report Configuration Modal */}
      <Modal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        size="lg"
      >
        {selectedTemplate && (
          <>
            <ModalHeader onClose={() => setIsConfigOpen(false)}>
              Configure {selectedTemplate.name}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Period
                  </label>
                  <select
                    value={reportConfig.dateRange}
                    onChange={(e) => setReportConfig({ ...reportConfig, dateRange: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="FY2024">FY 2024 (Jan - Dec 2024)</option>
                    <option value="Q4_2023">Q4 2023 (Oct - Dec 2023)</option>
                    <option value="Q3_2023">Q3 2023 (Jul - Sep 2023)</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="flex gap-3">
                    {['pdf', 'excel', 'json'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setReportConfig({ ...reportConfig, format })}
                        className={cn(
                          'flex-1 px-4 py-3 rounded-lg border-2 transition-all',
                          reportConfig.format === format
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <p className="text-sm font-semibold text-gray-900 uppercase">{format}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Include Sections
                  </label>
                  <div className="space-y-2">
                    {selectedTemplate.sections.map((section: string) => (
                      <label
                        key={section}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={reportConfig.includedSections.includes(section)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReportConfig({
                                ...reportConfig,
                                includedSections: [...reportConfig.includedSections, section],
                              })
                            } else {
                              setReportConfig({
                                ...reportConfig,
                                includedSections: reportConfig.includedSections.filter((s) => s !== section),
                              })
                            }
                          }}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-900">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleGenerate}>
                Generate Report
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </MainLayout>
  )
}
