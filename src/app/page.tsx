'use client'

import React from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CircularProgress } from '@/components/ui/Progress'
import { 
  TrendingDown, 
  TrendingUp, 
  Upload, 
  FileText, 
  AlertCircle,
  Leaf,
  Zap,
  Truck,
  Cloud,
  Loader2
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { useDashboardStats } from '@/lib/hooks'

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600">Please make sure the backend server is running.</p>
          <p className="text-sm text-gray-500 mt-2">Expected at: http://localhost:8000</p>
        </div>
      </MainLayout>
    )
  }

  const kpis = [
    {
      title: 'Total Emissions',
      value: formatNumber(stats?.total_emissions || 0, 1),
      unit: 'kg CO₂e',
      change: -8.2,
      icon: Cloud,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Compliance Score',
      value: formatNumber(stats?.compliance_score || 0, 0),
      unit: '%',
      change: 12,
      icon: Leaf,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Data Quality',
      value: formatNumber(stats?.data_quality_score || 0, 0),
      unit: '%',
      change: 3,
      icon: FileText,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Total Activities',
      value: formatNumber(stats?.total_activities || 0, 0),
      unit: 'activities',
      change: 5,
      icon: Upload,
      color: 'text-yellow-600 bg-yellow-50',
    },
  ]

  const scopeBreakdown = [
    { 
      scope: 1, 
      name: 'Direct', 
      value: stats?.scope_breakdown?.scope_1 || 0, 
      percentage: stats?.total_emissions ? Math.round((stats.scope_breakdown?.scope_1 || 0) / stats.total_emissions * 100) : 0, 
      color: 'bg-blue-500' 
    },
    { 
      scope: 2, 
      name: 'Indirect', 
      value: stats?.scope_breakdown?.scope_2 || 0, 
      percentage: stats?.total_emissions ? Math.round((stats.scope_breakdown?.scope_2 || 0) / stats.total_emissions * 100) : 0, 
      color: 'bg-yellow-500' 
    },
    { 
      scope: 3, 
      name: 'Value Chain', 
      value: stats?.scope_breakdown?.scope_3 || 0, 
      percentage: stats?.total_emissions ? Math.round((stats.scope_breakdown?.scope_3 || 0) / stats.total_emissions * 100) : 0, 
      color: 'bg-purple-500' 
    },
  ]
  
  const recentActivities = [
    { id: 1, type: 'Electricity Bill', date: '2 hours ago', status: 'approved', icon: Zap },
    { id: 2, type: 'Freight Invoice', date: '5 hours ago', status: 'review', icon: Truck },
    { id: 3, type: 'Diesel Receipt', date: '1 day ago', status: 'approved', icon: Cloud },
  ]
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your ESG overview.</p>
          </div>
          <Badge variant="info" size="md">
            Q3 2024
          </Badge>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <Card key={kpi.title} hover className="animate-slide-up">
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${kpi.color}`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
                    <span className="text-sm text-gray-500">{kpi.unit}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scope Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Emissions by Scope</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-8">
                {/* Donut Chart Visualization */}
                <div className="relative">
                  <CircularProgress value={88} size={180} strokeWidth={20} color="success" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">1,240</span>
                    <span className="text-sm text-gray-500">tCO₂e</span>
                  </div>
                </div>
                
                {/* Breakdown List */}
                <div className="flex-1 space-y-4">
                  {scopeBreakdown.map((scope) => (
                    <div key={scope.scope}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${scope.color}`} />
                          <span className="text-sm font-medium text-gray-700">
                            Scope {scope.scope} - {scope.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatNumber(scope.value)} tCO₂e
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${scope.color} transition-all duration-500`}
                          style={{ width: `${scope.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
          
          {/* Compliance Readiness */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Readiness</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <CircularProgress value={88} size={140} strokeWidth={12} color="success" />
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Ready for BRSR reporting
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">BRSR</span>
                    <Badge variant="success" size="sm">88%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">GHG Protocol</span>
                    <Badge variant="success" size="sm">92%</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">CSRD</span>
                    <Badge variant="warning" size="sm">74%</Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <button className="text-sm text-primary hover:text-primary-dark font-medium">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Badge 
                      variant={activity.status === 'approved' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                    Upload Document
                  </p>
                </button>
                
                <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                  <Leaf className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                    Run Scenario
                  </p>
                </button>
                
                <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                  <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                    Generate Report
                  </p>
                </button>
                
                <button className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                  <AlertCircle className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                    Ask AI Copilot
                  </p>
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
