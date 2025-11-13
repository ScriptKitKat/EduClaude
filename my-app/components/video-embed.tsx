"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoEmbedProps {
  videoId: string
}

export function VideoEmbed({ videoId }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl bg-muted">
      {!isLoaded ? (
        <button onClick={() => setIsLoaded(true)} className="group relative flex w-full items-center justify-center">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
          />
          <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 transition-transform group-hover:scale-110">
            <Play className="ml-1 h-8 w-8 fill-primary-foreground text-primary-foreground" />
          </div>
        </button>
      ) : (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  )
}
