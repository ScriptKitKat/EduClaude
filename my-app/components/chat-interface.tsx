"use client"

import React, { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Trash2, RotateCcw, Square } from "lucide-react"
import { useEffect, useRef } from "react"

interface ChatInterfaceProps {
  onBack: () => void
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  // Use the chat hook
  const chatHelpers = useChat({
    api: "/api/chat",
  }) as any // Type assertion to bypass strict typing issues

  // Extract properties safely
  const messages = chatHelpers.messages || []
  const isLoading = chatHelpers.isLoading || false

  // Manage input state locally since the hook might not provide it
  const [input, setInput] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("") // Clear input immediately for better UX

    try {
      // Try different methods to send the message based on what's available
      if (chatHelpers.append) {
        await chatHelpers.append({
          role: "user",
          content: message,
        })
      } else if (chatHelpers.handleSubmit) {
        // Create a mock event for the original handleSubmit if it exists
        const mockEvent = {
          preventDefault: () => {},
          target: { elements: { message: { value: message } } }
        }
        await chatHelpers.handleSubmit(mockEvent)
      } else {
        // Fallback: make direct API call
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: message }]
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to send message')
        }
        // The response should be handled by the chat hook
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setInput(message) // Restore input on error
    }
  }

  // Additional helper functions you can implement
  const clearChat = () => {
    if (chatHelpers.setMessages) {
      chatHelpers.setMessages([])
    } else {
      window.location.reload()
    }
  }

  const copyMessage = (messageContent: string) => {
    navigator.clipboard.writeText(messageContent)
      .then(() => {
        console.log('Message copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy message:', err)
      })
  }

  const exportChatHistory = () => {
    const chatHistory = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content || msg.display || '',
      timestamp: new Date().toISOString()
    }))
    
    const dataStr = JSON.stringify(chatHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const regenerateResponse = () => {
    if (chatHelpers.reload) {
      chatHelpers.reload()
    }
  }

  const stopGeneration = () => {
    if (chatHelpers.stop) {
      chatHelpers.stop()
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="glass border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">Your Learning Journey</h2>
              <p className="text-sm text-muted-foreground">Ask me anything you want to learn</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopGeneration}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateResponse}
              disabled={messages.length === 0}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Regenerate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportChatHistory}
              disabled={messages.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">What would you like to learn today?</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["Python programming", "Guitar basics", "AI ethics", "Web development"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-transparent"
                      onClick={() => {
                        setInput(`I want to learn ${suggestion}`)
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message: any) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="glass border-t border-border/50 px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
