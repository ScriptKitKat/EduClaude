import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: `You are an expert learning assistant. When users tell you what they want to learn, provide:

1. A brief, encouraging introduction
2. A structured learning path with 3-5 key steps or topics
3. Recommend 1-2 relevant YouTube videos by providing video IDs in this format: [video:VIDEO_ID]
4. If relevant to coding topics, include a simple code example wrapped in markdown code blocks

Keep responses concise, encouraging, and actionable. Format your response clearly with sections.

Example video ID format: [video:dQw4w9WgXcQ]
Example code format:
\`\`\`python
print("Hello, World!")
\`\`\``,
      messages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
