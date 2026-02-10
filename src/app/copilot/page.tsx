'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Send, Bot, User, Shield, Sparkles, Loader2 } from 'lucide-react'
import { useAskCopilot } from '@/lib/hooks'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
}

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI ESG Copilot powered by Google Gemini. I can help explain your emissions data, identify gaps, answer questions about sustainability metrics, and provide strategic recommendations. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const askCopilot = useAskCopilot()
  
  const suggestedPrompts = [
    "Why is Scope 3 so high?",
    "What data is missing for BRSR?",
    "Explain emission calculations",
    "Identify emission hotspots",
    "How can I reduce emissions?",
    "What are my total emissions?",
  ]
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSend = async () => {
    if (!input.trim() || askCopilot.isPending) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    
    try {
      const response = await askCopilot.mutateAsync({
        question: userMessage.content,
        context: 'User is asking from the AI Copilot interface',
      })
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(response.timestamp),
        confidence: response.confidence,
        sources: response.sources,
      }
      
      setMessages((prev) => [...prev, aiMessage])
    } catch (error: any) {
      toast.error('Failed to get response from copilot')
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please make sure the backend server is running and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }
  
  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Trust Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-blue-900">
              <strong>Powered by Google Gemini 2.0 Flash.</strong> AI explains. Calculations are rule-based.
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>Real-time insights</span>
            </div>
          </div>
        </div>
        
        {/* Chat Container */}
        <Card className="flex-1 flex flex-col">
          <CardBody className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-slide-up ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className={`flex-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`inline-block max-w-[80%] rounded-2xl px-5 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Metadata for assistant messages */}
                    {message.role === 'assistant' && (message.confidence || message.sources) && (
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        {message.confidence && (
                          <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                        )}
                        {message.sources && message.sources.length > 0 && (
                          <span>Sources: {message.sources.join(', ')}</span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-1 text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {askCopilot.isPending && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggested Prompts (show only when no messages except welcome) */}
            {messages.filter(m => m.role === 'user').length === 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handlePromptClick(prompt)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about your emissions, compliance, or sustainability strategy..."
                  rows={2}
                  className="flex-1 resize-none"
                  disabled={askCopilot.isPending}
                />
                <Button
                  onClick={handleSend}
                  variant="primary"
                  disabled={!input.trim() || askCopilot.isPending}
                  className="h-auto px-6"
                >
                  {askCopilot.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
