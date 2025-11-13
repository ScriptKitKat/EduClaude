import { streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: `
System Prompt: You are a helpful teaching assistant. Give back structured breakdowns of subjects that a user wants to learn including supplemental concepts that they need to be familiar with along with subconcepts of the larger target subject.

Given this user subject {SUBJECT}, return a set of 4 - 8 concepts that the should learn in sequential order to learn the full subject. Return only a javascript array containing the concepts. Do not return a preamble or conclusion. ONLY return the javascript array.`,
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
