'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Upload, FileText, Download, Eye, Trash2, RefreshCw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useDocuments, useUploadDocument } from '@/lib/hooks'
import { Document } from '@/lib/api'

export default function DataIngestion() {
  const [activeTab, setActiveTab] = useState<'processing' | 'review' | 'archived'>('processing')
  const [dragActive, setDragActive] = useState(false)
  
  // Hooks
  const { data: documents, isLoading, isError, refetch } = useDocuments()
  const uploadDocument = useUploadDocument()
  
  const filteredDocuments = documents?.filter((doc) => {
    // Map backend status to tabs
    if (activeTab === 'processing') return doc.status === 'processing' || doc.status === 'failed'
    if (activeTab === 'review') return doc.status === 'review'
    if (activeTab === 'archived') return doc.status === 'approved'
    return true
  }) || []
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      try {
        await uploadDocument.mutateAsync(file)
      } catch (error) {
        console.error('Upload failed', error)
      }
    }
  }
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        await uploadDocument.mutateAsync(file)
      } catch (error) {
        console.error('Upload failed', error)
      }
    }
  }
  
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('csv') || type.includes('excel')) return '📊'
    return '📁'
  }
  
  const getStatusBadge = (status: string) => {
     switch(status) {
       case 'processing': return <Badge variant="warning">Processing</Badge>
       case 'review': return <Badge variant="warning">Needs Review</Badge>
       case 'approved': return <Badge variant="success">Approved</Badge>
       case 'failed': return <Badge variant="error">Failed</Badge>
       default: return <Badge variant="default">{status}</Badge>
     }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Ingestion</h1>
            <p className="text-gray-600 mt-1">Upload and manage your source documents</p>
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.csv,.xlsx"
              disabled={uploadDocument.isPending}
            />
            <label htmlFor="file-upload">
              <Button variant="primary" size="lg" as="span" className="cursor-pointer">
                {uploadDocument.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Upload className="w-5 h-5 mr-2" />}
                {uploadDocument.isPending ? 'Uploading...' : 'Upload Documents'}
              </Button>
            </label>
          </div>
        </div>
        
        {/* Upload Area */}
        <Card className={cn(
          "border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300",
          uploadDocument.isPending ? "opacity-50 pointer-events-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        >
          <CardBody className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Drop files here to upload</h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-sm">
              Support for PDF bills (electricity, fuel) and CSV logs (travel, freight). 
              Max file size 10MB.
            </p>
            <label htmlFor="file-upload">
              <span className="text-primary font-medium hover:text-primary-dark cursor-pointer">
                or browse from computer
              </span>
            </label>
          </CardBody>
        </Card>
        
        {/* Processing Queue / History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px px-6">
              {[
                { id: 'processing', label: 'Processing Queue' },
                { id: 'review', label: 'Needs Review' },
                { id: 'archived', label: 'Archived / Processed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "ml-2 py-0.5 px-2 rounded-full text-xs",
                    activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
                  )}>
                    {documents?.filter(d => {
                      if (tab.id === 'processing') return d.status === 'processing' || d.status === 'failed'
                      if (tab.id === 'review') return d.status === 'review'
                      if (tab.id === 'archived') return d.status === 'approved'
                      return false
                    }).length || 0}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="divide-y divide-gray-200">
             {isLoading ? (
               <div className="py-12 flex justify-center">
                 <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
               </div>
             ) : filteredDocuments.length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center text-center">
                 <FileText className="w-12 h-12 text-gray-300 mb-3" />
                 <p className="text-gray-900 font-medium">No documents found</p>
                 <p className="text-gray-500 text-sm mt-1">Upload a file to get started</p>
               </div>
             ) : (
               filteredDocuments.map((doc) => (
                 <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                   <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                     {getFileIcon(doc.file_type || 'unknown')}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3">
                       <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
                       {getStatusBadge(doc.status)}
                     </div>
                     <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                       <span>{doc.size || 'Unknown size'}</span>
                       <span>•</span>
                       <span>Uploaded {formatDateTime(doc.upload_date)}</span>
                       {doc.confidence_score !== undefined && (
                         <>
                           <span>•</span>
                           <span className={doc.confidence_score > 0.8 ? "text-green-600" : "text-yellow-600"}>
                             {Math.round(doc.confidence_score * 100)}% confidence
                           </span>
                         </>
                       )}
                     </div>
                   </div>
                   
                   {doc.status === 'processing' && (
                     <div className="w-32">
                       <Progress value={doc.progress || 50} className="h-2" />
                       <p className="text-xs text-gray-500 mt-1 text-right">{doc.progress || 50}%</p>
                     </div>
                   )}
                   
                   <div className="flex items-center gap-2">
                     {doc.status !== 'processing' && (
                       <Button variant="ghost" size="sm">
                         <Eye className="w-4 h-4" />
                       </Button>
                     )}
                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
