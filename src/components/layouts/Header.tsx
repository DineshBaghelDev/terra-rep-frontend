'use client'

import React from 'react'
import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-40">
      <div className="px-6 h-full flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search activities, documents..."
            icon={<Search className="w-4 h-4" />}
            className="bg-gray-50 border-0"
          />
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {/* Organization Selector */}
          <div className="px-3 py-1.5 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Acme Corp</p>
            <p className="text-xs text-gray-500">FY 2024</p>
          </div>
          
          {/* User Profile */}
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
