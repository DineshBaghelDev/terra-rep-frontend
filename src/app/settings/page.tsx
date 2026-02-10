'use client'

import React from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Building2, Calendar, MapPin, Users, Key, Link as LinkIcon } from 'lucide-react'

export default function Settings() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your organization and user settings</p>
        </div>
        
        {/* Organization Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Organization Name" defaultValue="Acme Corporation" icon={<Building2 className="w-4 h-4" />} />
                <Input label="Industry" defaultValue="Manufacturing" icon={<Building2 className="w-4 h-4" />} />
                <Input label="Fiscal Year Start" defaultValue="January" icon={<Calendar className="w-4 h-4" />} />
                <Input label="Default Region" defaultValue="India - Maharashtra" icon={<MapPin className="w-4 h-4" />} />
              </div>
              <div className="flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { name: 'John Doe', email: 'john@acme.com', role: 'Admin' },
                { name: 'Jane Smith', email: 'jane@acme.com', role: 'Editor' },
                { name: 'Bob Johnson', email: 'bob@acme.com', role: 'Viewer' },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        
        {/* API & Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>API & Integrations</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    defaultValue="sk_live_xxxxxxxxxxxxxxxx"
                    icon={<Key className="w-4 h-4" />}
                    className="flex-1"
                    readOnly
                  />
                  <Button variant="outline">Generate New</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <Input
                  placeholder="https://your-app.com/webhook"
                  icon={<LinkIcon className="w-4 h-4" />}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
