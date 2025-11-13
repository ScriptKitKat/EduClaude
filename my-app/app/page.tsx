"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { ChatInterface } from "@/components/chat-interface"
import { Sidebar } from "@/components/sidebar"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1 overflow-hidden md:ml-64">
        {!showChat ? (
          <Hero onStartLearning={() => setShowChat(true)} />
        ) : (
          <ChatInterface onBack={() => setShowChat(false)} />
        )}
      </main>
    </div>
  )
}
