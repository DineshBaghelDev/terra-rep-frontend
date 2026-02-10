'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronRight, ChevronDown, ExternalLink, Calculator } from 'lucide-react'
import { formatNumber, getScopeColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function Emissions() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['scope-1', 'scope-2', 'scope-3'])
  
  // Mock emissions data tree
  const emissionsTree = [
    {
      id: 'scope-1',
      name: 'Scope 1 - Direct Emissions',
      emissions: 340.2,
      percentage: 27,
      children: [
        { id: 'diesel', name: 'Diesel Combustion', emissions: 280.5, percentage: 82, activities: 12 },
        { id: 'gas', name: 'Natural Gas', emissions: 59.7, percentage: 18, activities: 5 },
      ],
    },
    {
      id: 'scope-2',
      name: 'Scope 2 - Indirect Emissions',
      emissions: 280.5,
      percentage: 23,
      children: [
        { id: 'electricity', name: 'Purchased Electricity', emissions: 280.5, percentage: 100, activities: 24 },
      ],
    },
    {
      id: 'scope-3',
      name: 'Scope 3 - Value Chain',
      emissions: 619.8,
      percentage: 50,
      children: [
        { id: 'freight', name: 'Freight & Logistics', emissions: 325.0, percentage: 52, activities: 18 },
        { id: 'flight', name: 'Business Travel', emissions: 216.0, percentage: 35, activities: 8 },
        { id: 'waste', name: 'Waste Disposal', emissions: 78.8, percentage: 13, activities: 6 },
      ],
    },
  ]
  
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    )
  }
  
  const [selectedCalculation, setSelectedCalculation] = useState<any>(null)
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emissions & Traceability</h1>
            <p className="text-gray-600 mt-1">Explore emission calculations with full transparency</p>
          </div>
          <Button variant="outline">
            Download Report
          </Button>
        </div>
        
        {/* Total Emissions Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardBody className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total GHG Emissions</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-gray-900">1,240.5</span>
                  <span className="text-2xl text-gray-600">tCO₂e</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">FY 2024 • Jan - Dec</p>
              </div>
              
              <div className="flex gap-8">
                {emissionsTree.map((scope, idx) => (
                  <div key={scope.id} className="text-center">
                    <div className={cn('w-16 h-16 rounded-full flex items-center justify-center mb-2', 
                      idx === 0 ? 'bg-blue-100' : idx === 1 ? 'bg-yellow-100' : 'bg-purple-100'
                    )}>
                      <span className="text-2xl font-bold text-gray-900">{scope.percentage}%</span>
                    </div>
                    <p className="text-xs text-gray-600">Scope {idx + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Emissions Breakdown Tree */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Breakdown</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {emissionsTree.map((scope, idx) => (
                <div key={scope.id} className="animate-slide-up">
                  {/* Scope Level */}
                  <button
                    onClick={() => toggleNode(scope.id)}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn('w-1 h-12 rounded', getScopeColor(idx + 1))} />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{scope.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {scope.children?.length || 0} categories • {scope.emissions.toFixed(1)} tCO₂e
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(scope.emissions)}</p>
                        <p className="text-xs text-gray-500">tCO₂e</p>
                      </div>
                      <Badge variant="default" size="md">
                        {scope.percentage}%
                      </Badge>
                      {expandedNodes.includes(scope.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {/* Activity Type Level */}
                  {expandedNodes.includes(scope.id) && scope.children && (
                    <div className="ml-8 mt-2 space-y-2">
                      {scope.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedCalculation(child)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Calculator className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{child.name}</p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {child.activities} activities
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatNumber(child.emissions)}
                              <span className="text-xs text-gray-500 ml-1">tCO₂e</span>
                            </p>
                            <Badge variant="default" size="sm">
                              {child.percentage}%
                            </Badge>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        
        {/* Calculation Transparency */}
        <Card>
          <CardHeader>
            <CardTitle>Calculation Transparency</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">ℹ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Audit Trail Available</p>
                    <p className="text-sm text-blue-800">
                      Every emission calculation is fully traceable to source documents and emission factors. 
                      Click on any category above to see the detailed calculation breakdown.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Sample Calculation */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-gray-900">Sample Calculation</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Formula:</p>
                  <div className="flex items-center gap-3 text-lg font-mono">
                    <span className="font-semibold text-primary">Emissions</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-gray-900">Quantity</span>
                    <span className="text-gray-400">×</span>
                    <span className="text-gray-900">Emission Factor</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Quantity</p>
                    <p className="text-xl font-bold text-gray-900">500 L</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Factor</p>
                    <p className="text-xl font-bold text-gray-900">2.655 kgCO₂e/L</p>
                    <p className="text-xs text-gray-500 mt-1">Tier A - India Diesel</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary">
                    <p className="text-xs text-gray-600 mb-1">Result</p>
                    <p className="text-xl font-bold text-primary">1,327.5 kgCO₂e</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Badge variant="success" size="sm">Confidence: 92%</Badge>
                  <Button variant="ghost" size="sm">
                    View Source Document
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
