'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Search, Filter, Plus, ExternalLink, Zap, Droplet, Truck, Plane, Trash, DollarSign, Loader2, RefreshCcw } from 'lucide-react'
import { formatNumber, formatDate, getScopeColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useActivities } from '@/lib/hooks'
import { Activity } from '@/lib/api'

const ACTIVITY_TYPES = [
  { value: 'all', label: 'All Types', icon: null, color: 'bg-gray-500' },
  { value: 'electricity', label: 'Electricity', icon: Zap, color: 'bg-yellow-500' },
  { value: 'diesel', label: 'Diesel', icon: Droplet, color: 'bg-blue-500' },
  { value: 'freight', label: 'Freight', icon: Truck, color: 'bg-purple-500' },
  { value: 'flight', label: 'Flight', icon: Plane, color: 'bg-sky-500' },
  { value: 'waste', label: 'Waste', icon: Trash, color: 'bg-red-500' },
  { value: 'spend', label: 'Spend', icon: DollarSign, color: 'bg-green-500' },
]

export default function Activities() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  
  // Use React Query hook
  const { data: activities, isLoading, isError, error, refetch } = useActivities()
  
  const filteredActivities = activities?.filter((activity) => {
    const matchesSearch = activity.activity_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.activity_type?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || activity.activity_type === selectedType
    return matchesSearch && matchesType
  }) || []
  
  const getActivityIcon = (type: string) => {
    const config = ACTIVITY_TYPES.find((t) => t.value === type)
    return config?.icon || Zap
  }
  
  const getActivityColor = (type: string) => {
    const config = ACTIVITY_TYPES.find((t) => t.value === type)
    return config?.color || 'bg-gray-500'
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
            <p className="text-gray-600 mt-1">Manage your canonical activity records</p>
          </div>
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Activity
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              
              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedType === type.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {type.icon && <type.icon className="w-4 h-4" />}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCcw className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load activities</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              We couldn't connect to the backend server. Please make sure the API is running.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        )}
        
        {/* Summary Stats & Table */}
        {!isLoading && !isError && activities && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardBody>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{activities.length}</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <p className="text-sm text-gray-600">Total Emissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatNumber(activities.reduce((sum, a) => sum + (a.emissions || 0), 0))} <span className="text-sm text-gray-500">tCO₂e</span>
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <p className="text-sm text-gray-600">Avg Confidence</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {activities.length > 0
                      ? (activities.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / activities.length * 100).toFixed(0)
                      : 0}%
                  </p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {activities.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length}
                  </p>
                </CardBody>
              </Card>
            </div>
            
            <Card>
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Scope
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Emissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredActivities.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                            No activities found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredActivities.map((activity) => {
                          const Icon = getActivityIcon(activity.activity_type)
                          return (
                            <tr
                              key={activity.activity_id}
                              className="hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => setSelectedActivity(activity)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', getActivityColor(activity.activity_type))}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.activity_id}</p>
                                    <p className="text-xs text-gray-500 capitalize">{activity.activity_type}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm font-medium text-gray-900">
                                  {formatNumber(activity.quantity)} {activity.unit}
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-900">{formatDate(activity.date)}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-900">{activity.region_state || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{activity.region_country}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className={cn('w-2 h-2 rounded-full', getScopeColor(activity.scope))} />
                                  <span className="text-sm text-gray-900">Scope {activity.scope}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatNumber(activity.emissions || 0)}
                                  <span className="text-xs text-gray-500 ml-1">tCO₂e</span>
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={(activity.confidence_score || 0) >= 0.8 ? 'success' : (activity.confidence_score || 0) >= 0.6 ? 'warning' : 'error'}
                                  size="sm"
                                >
                                  {((activity.confidence_score || 0) * 100).toFixed(0)}%
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedActivity(activity)
                                  }}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>
      
      {/* Activity Detail Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        size="lg"
      >
        {selectedActivity && (
          <>
            <ModalHeader onClose={() => setSelectedActivity(null)}>
              Activity Details
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Activity Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Activity ID</p>
                    <p className="text-base text-gray-900 mt-1">{selectedActivity.activity_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Type</p>
                    <p className="text-base text-gray-900 mt-1 capitalize">{selectedActivity.activity_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quantity</p>
                    <p className="text-base text-gray-900 mt-1">
                      {formatNumber(selectedActivity.quantity)} {selectedActivity.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-base text-gray-900 mt-1">{formatDate(selectedActivity.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedActivity.region_state}, {selectedActivity.region_country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scope</p>
                    <p className="text-base text-gray-900 mt-1">Scope {selectedActivity.scope}</p>
                  </div>
                </div>
                
                {/* Emissions */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Calculated Emissions</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatNumber(selectedActivity.emissions || 0)} <span className="text-lg">tCO₂e</span>
                  </p>
                </div>
                
                {/* Source Document */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Source Document</p>
                  {selectedActivity.source_document ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
                          📄
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedActivity.source_document}</p>
                          <p className="text-xs text-gray-500">View extraction details</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No source document attached (Manual Entry)</p>
                  )}
                </div>
                
                {/* Confidence Score */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Confidence Score</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${(selectedActivity.confidence_score || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {((selectedActivity.confidence_score || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                Close
              </Button>
              <Button variant="primary">
                View Calculation details
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </MainLayout>
  )
}
