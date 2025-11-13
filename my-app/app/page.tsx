"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden gradient-bg">
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {!showChat ? (
          <Hero onStartLearning={() => setShowChat(true)} />
        ) : (
          <ChatInterface onBack={() => setShowChat(false)} />
        )}
      </main>
    </div>
  )
}
