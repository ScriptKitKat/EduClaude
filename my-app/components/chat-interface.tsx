"use client"

import React, { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { PlanEditor } from "@/components/plan-editor"
import { MainVideoPlayer } from "@/components/main-video-player"
import { CodeEditor } from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Trash2, RotateCcw, Square, Sparkles, PanelRightClose, PanelRightOpen } from "lucide-react"
import { useEffect, useRef } from "react"

interface ConceptItem {
  concept: string
  video_title: string
  channel: string
  video_url: string
  reason: string
}

interface ChatInterfaceProps {
  onBack: () => void
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  // Use the chat hook
  const chatHelpers = useChat() as any // Type assertion to bypass strict typing issues

  // Extract properties safely
  const messages = chatHelpers.messages || []
  const isLoading = chatHelpers.isLoading || false

  // Manage input state locally since the hook might not provide it
  const [input, setInput] = useState("")

  // Plan creation state
  const [planMode, setPlanMode] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<ConceptItem[] | null>(null)
  const [planConversationHistory, setPlanConversationHistory] = useState<any[]>([])
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)

  // Finalized plan state (for sidebar)
  const [finalizedPlan, setFinalizedPlan] = useState<ConceptItem[] | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleToggleComplete = () => {
    const newCompleted = new Set(completedVideos)
    if (completedVideos.has(currentVideoIndex)) {
      newCompleted.delete(currentVideoIndex)
    } else {
      newCompleted.add(currentVideoIndex)
    }
    setCompletedVideos(newCompleted)
  }

  const goToPreviousConcept = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const goToNextConcept = () => {
    if (finalizedPlan && currentVideoIndex < finalizedPlan.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

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

  const generateLearningPlan = async (subject: string, feedback?: string) => {
    setIsGeneratingPlan(true)
    try {
      const userMessage = feedback
        ? `Please update the learning plan based on this feedback: ${feedback}`
        : subject

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: userMessage,
          conversationHistory: planConversationHistory,
        }),
      })

      const data = await response.json()

      if (data.success && data.plan) {
        setCurrentPlan(data.plan)
        setPlanConversationHistory(data.conversationHistory)
        setPlanMode(true)
      } else {
        // Handle error or show the raw response
        alert(data.error || 'Failed to generate plan. Please try again.')
      }
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Failed to generate learning plan. Please try again.')
    } finally {
      setIsGeneratingPlan(false)
    }
  }

  const handleRequestChanges = (feedback: string) => {
    if (input.trim()) {
      generateLearningPlan(input, feedback)
    }
  }

  const handleFinalizePlan = async (finalPlan: ConceptItem[]) => {
    // Add the finalized plan to the chat
    const planSummary = finalPlan.map((item, index) =>
      `${index + 1}. **${item.concept}**\n   📹 [${item.video_title}](${item.video_url}) by ${item.channel}\n   ${item.reason}`
    ).join('\n\n')

    const planMessage = `# Your Learning Plan\n\n${planSummary}\n\n---\n\nYour learning journey is ready! Check out the sidebar to watch videos and practice with coding problems. Let me know if you have any questions!`

    // Append the plan to the chat
    if (chatHelpers.append) {
      await chatHelpers.append({
        role: 'assistant',
        content: planMessage,
      })
    }

    // Set the finalized plan for the sidebar
    setFinalizedPlan(finalPlan)
    setCurrentVideoIndex(0)
    setSidebarOpen(true)

    // Reset plan mode
    setPlanMode(false)
    setCurrentPlan(null)
    setPlanConversationHistory([])
    setInput("")
  }

  const handleCancelPlan = () => {
    setPlanMode(false)
    setCurrentPlan(null)
    setPlanConversationHistory([])
  }

  const startPlanMode = () => {
    if (input.trim()) {
      generateLearningPlan(input)
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // If in plan mode and plan exists, show the plan editor
  if (planMode && currentPlan) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="glass border-b border-border/50 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleCancelPlan} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">Review Your Learning Plan</h2>
              <p className="text-sm text-muted-foreground">Customize your learning path</p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-6 py-8">
          <PlanEditor
            initialPlan={currentPlan}
            onFinalize={handleFinalizePlan}
            onCancel={handleCancelPlan}
            onRequestChanges={handleRequestChanges}
            isLoading={isGeneratingPlan}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
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
              {finalizedPlan && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2"
                >
                  {sidebarOpen ? (
                    <>
                      <PanelRightClose className="h-4 w-4" />
                      Hide Sidebar
                    </>
                  ) : (
                    <>
                      <PanelRightOpen className="h-4 w-4" />
                      Show Sidebar
                    </>
                  )}
                </Button>
              )}
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
          {/* Show video player if plan is finalized */}
          {finalizedPlan && finalizedPlan[currentVideoIndex] && (
            <MainVideoPlayer
              concept={finalizedPlan[currentVideoIndex]}
              currentIndex={currentVideoIndex}
              totalConcepts={finalizedPlan.length}
              onPrevious={goToPreviousConcept}
              onNext={goToNextConcept}
              isCompleted={completedVideos.has(currentVideoIndex)}
              onToggleComplete={handleToggleComplete}
            />
          )}

          {messages.length === 0 && !finalizedPlan && (
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
        <div className="mx-auto max-w-4xl space-y-3">
          {input.trim() && messages.length === 0 && (
            <div className="flex items-center justify-end">
              <Button
                onClick={startPlanMode}
                disabled={isGeneratingPlan}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingPlan ? "Generating Plan..." : "Create Learning Plan"}
              </Button>
            </div>
          )}
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading || isGeneratingPlan}
          />
        </div>
      </div>
      </div>

      {/* Sidebar */}
      {finalizedPlan && sidebarOpen && (
        <div className="w-96 border-l border-border/50 glass overflow-hidden flex flex-col">
          <div className="flex-1 p-4">
            <CodeEditor
              videoUrl={finalizedPlan[currentVideoIndex]?.video_url}
              key={currentVideoIndex}
            />
          </div>
        </div>
      )}
    </div>
  )
}
