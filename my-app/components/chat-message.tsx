import type { Message } from "@ai-sdk/react"
import { User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoEmbed } from "@/components/video-embed"
import { CodeBlock } from "@/components/code-block"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  // Extract YouTube video IDs from message content
  const videoMatches = message.content.match(/\[video:([^\]]+)\]/g)
  const videos = videoMatches?.map((match) => match.replace(/\[video:|\]/g, "")) || []

  // Extract code blocks from message content
  const codeMatches = message.content.match(/```(\w+)?\n([\s\S]*?)```/g)
  const codeBlocks =
    codeMatches?.map((match) => {
      const langMatch = match.match(/```(\w+)?\n/)
      const lang = langMatch?.[1] || "plaintext"
      const code = match.replace(/```(\w+)?\n|```/g, "")
      return { lang, code }
    }) || []

  // Clean content (remove video and code block markers)
  const cleanContent = message.content.replace(/\[video:[^\]]+\]/g, "").replace(/```(\w+)?\n[\s\S]*?```/g, "")

  return (
    <div className={cn("flex gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
          isUser ? "bg-gradient-to-br from-primary to-accent" : "bg-secondary",
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Sparkles className="h-5 w-5 text-secondary-foreground" />
        )}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-4 rounded-3xl px-6 py-4",
          isUser ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "glass",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{cleanContent}</p>

        {/* Video embeds */}
        {videos.length > 0 && (
          <div className="space-y-4">
            {videos.map((videoId, index) => (
              <VideoEmbed key={index} videoId={videoId} />
            ))}
          </div>
        )}

        {/* Code blocks */}
        {codeBlocks.length > 0 && (
          <div className="space-y-4">
            {codeBlocks.map((block, index) => (
              <CodeBlock key={index} code={block.code} language={block.lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
