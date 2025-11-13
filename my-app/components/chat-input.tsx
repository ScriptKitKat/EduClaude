"use client"

import type React from "react"

import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        value={input}
        onChange={handleInputChange}
        placeholder="What would you like to learn?"
        className="min-h-[60px] resize-none rounded-2xl border-border bg-background/50 px-4 py-3 focus-visible:ring-2 focus-visible:ring-primary"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim()}
        className="h-12 w-12 shrink-0 rounded-2xl"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}
