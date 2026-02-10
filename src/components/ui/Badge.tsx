import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}) => {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'processing' | 'review' | 'approved' | 'failed' | 'complete' | 'incomplete' | 'partial'
  size?: 'sm' | 'md'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    processing: { variant: 'info' as const, label: 'Processing', icon: '⏳' },
    review: { variant: 'warning' as const, label: 'Review', icon: '👁️' },
    approved: { variant: 'success' as const, label: 'Approved', icon: '✓' },
    failed: { variant: 'error' as const, label: 'Failed', icon: '✗' },
    complete: { variant: 'success' as const, label: 'Complete', icon: '✓' },
    incomplete: { variant: 'error' as const, label: 'Incomplete', icon: '✗' },
    partial: { variant: 'warning' as const, label: 'Partial', icon: '~' },
  }
  
  const config = statusConfig[status]
  
  return (
    <Badge variant={config.variant} size={size}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  )
}
