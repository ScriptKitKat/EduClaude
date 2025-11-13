import type { UIMessage } from "@ai-sdk/react"
import { User, Sparkles, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoEmbed } from "@/components/video-embed"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"

interface ChatMessageProps {
  message: UIMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  // Normalize content to string (handle both string and array formats)
  const getContentAsString = (content: string | Array<any> | undefined): string => {
    if (typeof content === "string") {
      return content
    }
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === "string") return part
          if (part && typeof part === "object" && "text" in part) return part.text
          if (part && typeof part === "object" && "content" in part) return part.content
          return ""
        })
        .join("")
    }
    return String(content || "")
  }

  // UIMessage uses 'display' property for the content in newer AI SDK versions
  const messageContent = (message as any).content || (message as any).display || ""
  const contentString = getContentAsString(messageContent)

  // Copy function
  const copyMessage = () => {
    navigator.clipboard.writeText(contentString)
      .then(() => {
        console.log('Message copied to clipboard')
        // You could add a toast notification here
      })
      .catch(err => {
        console.error('Failed to copy message:', err)
      })
  }

  // Extract YouTube video IDs from message content
  const videoMatches = contentString.match(/\[video:([^\]]+)\]/g) || []
  const videos = videoMatches.map((match) => match.replace(/\[video:|\]/g, ""))

  // Extract code blocks from message content
  const codeMatches = contentString.match(/```(\w+)?\n([\s\S]*?)```/g) || []
  const codeBlocks = codeMatches.map((match) => {
    const langMatch = match.match(/```(\w+)?\n/)
    const lang = langMatch?.[1] || "plaintext"
    const code = match.replace(/```(\w+)?\n|```/g, "")
    return { lang, code }
  })

  // Clean content (remove video and code block markers)
  const cleanContent = contentString
    .replace(/\[video:[^\]]+\]/g, "")
    .replace(/```(\w+)?\n[\s\S]*?```/g, "")

  return (
    <div className={cn("group flex gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
          isUser ? "bg-linear-to-br from-primary to-accent" : "bg-secondary",
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Sparkles className="h-5 w-5 text-secondary-foreground" />
        )}
      </div>

      {/* Message content */}
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={cn(
            "flex flex-col gap-4 rounded-3xl px-6 py-4 relative",
            isUser ? "bg-linear-to-br from-primary to-accent text-primary-foreground" : "glass",
          )}
        >
          {/* Copy button - appears on hover */}
          <Button
            variant="ghost"
            size="icon"
            onClick={copyMessage}
            className={cn(
              "absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser ? "hover:bg-white/20" : "hover:bg-black/10"
            )}
          >
            <Copy className="h-3 w-3" />
          </Button>

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
    </div>
  )
}
