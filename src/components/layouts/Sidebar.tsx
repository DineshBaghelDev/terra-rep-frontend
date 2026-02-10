'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Upload, 
  ListChecks, 
  LineChart, 
  Shield, 
  MessageSquare, 
  Sparkles, 
  FileText,
  Settings,
  Leaf
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Data Ingestion', href: '/data-ingestion', icon: Upload },
  { name: 'Activities', href: '/activities', icon: ListChecks },
  { name: 'Emissions', href: '/emissions', icon: LineChart },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'AI Copilot', href: '/copilot', icon: MessageSquare },
  { name: 'Scenarios', href: '/scenarios', icon: Sparkles },
  { name: 'Reports', href: '/reports', icon: FileText },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CarbonOS</h1>
            <p className="text-xs text-gray-500">ESG Operating System</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Settings */}
      <div className="p-3 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
