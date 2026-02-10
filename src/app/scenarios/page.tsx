'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { RotateCcw, Play, Save, TrendingDown, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function Scenarios() {
  const [scenarioName, setScenarioName] = useState('')
  const [adjustments, setAdjustments] = useState([
    { id: 1, name: 'Electricity Reduction', type: 'electricity', value: 0, unit: '%' },
    { id: 2, name: 'Diesel to CNG', type: 'diesel', value: 0, unit: '%' },
    { id: 3, name: 'Freight Optimization', type: 'freight', value: 0, unit: '%' },
    { id: 4, name: 'Renewable Energy', type: 'renewable', value: 0, unit: '%' },
  ])
  
  const baselineEmissions = 1240.5
  
  const calculateProjectedEmissions = () => {
    let reduction = 0
    adjustments.forEach((adj) => {
      if (adj.type === 'electricity') reduction += (280.5 * adj.value) / 100
      if (adj.type === 'diesel') reduction += (280.5 * adj.value) / 100
      if (adj.type === 'freight') reduction += (325.0 * adj.value) / 100
      if (adj.type === 'renewable') reduction += (280.5 * adj.value) / 100
    })
    return baselineEmissions - reduction
  }
  
  const projectedEmissions = calculateProjectedEmissions()
  const reductionPercentage = ((baselineEmissions - projectedEmissions) / baselineEmissions) * 100
  const complianceImprovement = Math.min(reductionPercentage * 0.5, 12)
  
  const handleSliderChange = (id: number, value: number) => {
    setAdjustments((prev) =>
      prev.map((adj) => (adj.id === id ? { ...adj, value } : adj))
    )
  }
  
  const handleReset = () => {
    setAdjustments((prev) => prev.map((adj) => ({ ...adj, value: 0 })))
  }
  
  const savedScenarios = [
    { id: 1, name: 'Aggressive Reduction', reduction: 35, date: '2024-02-05' },
    { id: 2, name: 'Moderate Path', reduction: 20, date: '2024-02-03' },
    { id: 3, name: 'Quick Wins', reduction: 12, date: '2024-01-28' },
  ]
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scenario Simulator</h1>
            <p className="text-gray-600 mt-1">Model emission reduction scenarios for decision support</p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardBody>
              <p className="text-sm font-medium text-gray-600 mb-2">Baseline Emissions</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(baselineEmissions)}
                <span className="text-lg text-gray-600 ml-2">tCO₂e</span>
              </p>
            </CardBody>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardBody>
              <p className="text-sm font-medium text-gray-600 mb-2">Projected Emissions</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-green-600">
                  {formatNumber(projectedEmissions)}
                  <span className="text-lg ml-2">tCO₂e</span>
                </p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-lg font-semibold">{reductionPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardBody>
              <p className="text-sm font-medium text-gray-600 mb-2">Compliance Impact</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-purple-600">
                  +{complianceImprovement.toFixed(0)}%
                </p>
                <Badge variant="success" size="sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Better
                </Badge>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Builder */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Build Your Scenario</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {adjustments.map((adjustment) => (
                  <div key={adjustment.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {adjustment.name}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={adjustment.value}
                          onChange={(e) => handleSliderChange(adjustment.id, Number(e.target.value))}
                          className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-center text-sm font-semibold"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-600">{adjustment.unit}</span>
                      </div>
                    </div>
                    
                    <input
                      type="range"
                      value={adjustment.value}
                      onChange={(e) => handleSliderChange(adjustment.id, Number(e.target.value))}
                      min="0"
                      max="100"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    
                    {adjustment.value > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Impact:</span>
                        <span className="font-semibold text-green-600">
                          -{formatNumber(
                            adjustment.type === 'electricity' ? (280.5 * adjustment.value) / 100 :
                            adjustment.type === 'diesel' ? (280.5 * adjustment.value) / 100 :
                            adjustment.type === 'freight' ? (325.0 * adjustment.value) / 100 :
                            (280.5 * adjustment.value) / 100
                          )} tCO₂e
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Input
                  placeholder="Scenario name (optional)"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="mb-4"
                />
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    <Save className="w-5 h-5 mr-2" />
                    Save Scenario
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Play className="w-5 h-5 mr-2" />
                    Run Analysis
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Comparison Chart & History */}
          <div className="space-y-6">
            {/* Before/After Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Comparison</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {/* Baseline Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Baseline</span>
                      <span className="text-sm font-semibold text-gray-900">{formatNumber(baselineEmissions)}</span>
                    </div>
                    <div className="h-8 bg-blue-500 rounded-lg" />
                  </div>
                  
                  {/* Projected Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Projected</span>
                      <span className="text-sm font-semibold text-green-600">{formatNumber(projectedEmissions)}</span>
                    </div>
                    <div
                      className="h-8 bg-green-500 rounded-lg transition-all duration-500"
                      style={{ width: `${(projectedEmissions / baselineEmissions) * 100}%` }}
                    />
                  </div>
                  
                  {/* Reduction Amount */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Reduction</span>
                      <span className="text-lg font-bold text-primary">
                        {formatNumber(baselineEmissions - projectedEmissions)} tCO₂e
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            {/* Saved Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Scenarios</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {savedScenarios.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No saved scenarios yet
                    </p>
                  ) : (
                    savedScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{scenario.name}</p>
                          <Badge variant="success" size="sm">
                            -{scenario.reduction}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{scenario.date}</p>
                      </button>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
