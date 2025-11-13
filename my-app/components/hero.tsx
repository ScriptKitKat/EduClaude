"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroProps {
  onStartLearning: () => void
}

export function Hero({ onStartLearning }: HeroProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="glass mx-auto max-w-4xl rounded-3xl p-12 shadow-2xl">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-balance text-5xl font-bold tracking-tight md:text-7xl">Learn anything.</h1>

        {/* Subtitle */}
        <p className="mb-8 text-pretty text-xl text-muted-foreground md:text-2xl">
          Type what you want to learn, and we&apos;ll help you get started.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={onStartLearning}
          className="group rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105"
        >
          Start Learning
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>

        {/* Features */}
        <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
          <div className="rounded-2xl bg-secondary/50 p-6">
            <h3 className="mb-2 font-semibold text-secondary-foreground">Personalized Paths</h3>
            <p className="text-sm text-muted-foreground">Get structured learning plans tailored to your goals</p>
          </div>
          <div className="rounded-2xl bg-secondary/50 p-6">
            <h3 className="mb-2 font-semibold text-secondary-foreground">Video Resources</h3>
            <p className="text-sm text-muted-foreground">Curated YouTube videos to enhance your learning</p>
          </div>
          <div className="rounded-2xl bg-secondary/50 p-6">
            <h3 className="mb-2 font-semibold text-secondary-foreground">Interactive Coding</h3>
            <p className="text-sm text-muted-foreground">Practice code directly in the browser</p>
          </div>
        </div>
      </div>
    </div>
  )
}
