import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful teaching assistant and YouTube video recommendation expert.

Your task has two parts:

1. CONCEPT BREAKDOWN: Given a subject the user wants to learn, identify 4-8 key concepts that should be learned in sequential order to master the subject. Include both prerequisite concepts and core subconcepts of the target subject.

2. VIDEO RECOMMENDATIONS: For each concept in your breakdown, identify the single best educational YouTube video that teaches that concept.

For video selection, consider:
- Clear explanations and good production value
- Accurate information and appropriate depth
- Popular educational channels with proven track records
- High view counts and positive engagement
- Videos that directly address the concept comprehensively

Return your response as a JSON array where each object contains:
- "concept": the concept name
- "video_title": the title of the recommended video
- "channel": the YouTube channel name
- "video_url": the full YouTube URL
- "reason": a brief 1-2 sentence explanation of why this video is the best choice

Important guidelines:
- Concepts should be ordered sequentially (prerequisites first, then progressively more advanced)
- Recommend real videos that actually exist on YouTube
- Ensure videos directly teach the concept rather than just mentioning it
- Output only valid JSON with no additional text`;

export async function POST(req: NextRequest) {
  try {
    const { subject, conversationHistory } = await req.json();

    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    // Build messages array from conversation history
    const messages: Anthropic.MessageParam[] = conversationHistory || [];

    // Add the user's current message
    messages.push({
      role: "user",
      content: subject,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    const content = response.content[0];
    const textContent = content.type === "text" ? content.text : "";

    // Try to extract JSON from the response
    let planData;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = textContent.match(/```json\n?([\s\S]*?)\n?```/) ||
                        textContent.match(/```\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1] : textContent;
      planData = JSON.parse(jsonText.trim());
    } catch {
      // If parsing fails, return the raw text for the user to see
      return NextResponse.json({
        success: false,
        rawResponse: textContent,
        error: "Failed to parse JSON response",
        conversationHistory: [
          ...messages,
          { role: "assistant", content: textContent },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      plan: planData,
      conversationHistory: [
        ...messages,
        { role: "assistant", content: textContent },
      ],
    });
  } catch (error: unknown) {
    console.error("Error generating learning plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate learning plan" },
      { status: 500 }
    );
  }
}
