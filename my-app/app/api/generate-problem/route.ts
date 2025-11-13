import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

/**
 * Extracts YouTube video ID from various URL formats
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * Generates a coding problem from a YouTube video transcript
 */
export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json()

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    // Extract video ID
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL or video ID' },
        { status: 400 }
      )
    }

    // Fetch transcript
    let transcript: string
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)
      transcript = transcriptData.map(item => item.text).join(' ')

      if (!transcript || transcript.trim().length === 0) {
        return NextResponse.json(
          { error: 'No transcript available for this video' },
          { status: 404 }
        )
      }
    } catch (transcriptError) {
      console.error('Transcript fetch error:', transcriptError)
      return NextResponse.json(
        { error: 'Failed to fetch video transcript. The video may not have captions available.' },
        { status: 404 }
      )
    }

    // Truncate transcript if too long (to stay within token limits)
    const maxTranscriptLength = 15000
    if (transcript.length > maxTranscriptLength) {
      transcript = transcript.substring(0, maxTranscriptLength) + '...'
    }

    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey })

    // Generate coding problem using Claude
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Based on the following YouTube video transcript, create a coding problem that helps someone learn the concepts discussed in the video.

Video Transcript:
${transcript}

Generate a Python coding problem with:
1. A clear problem description (as Python comments at the top)
2. Starter code below the description
3. The problem should be educational and related to the video content
4. Include function signature(s) and basic structure
5. Add helpful hints in comments if needed

Format the output as a complete Python file ready to use. Start the file with a comment block describing the problem, then provide the starter code.`
        }
      ]
    })

    // Extract the generated Python code
    const content = response.content[0]
    let pythonCode = ''

    if (content.type === 'text') {
      pythonCode = content.text

      // If Claude wrapped it in markdown code blocks, extract just the code
      const codeBlockMatch = pythonCode.match(/```python\n([\s\S]*?)\n```/)
      if (codeBlockMatch) {
        pythonCode = codeBlockMatch[1]
      }
    }

    return NextResponse.json({
      success: true,
      videoId,
      pythonFile: pythonCode,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    })

  } catch (error) {
    console.error('Generate problem error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate problem',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
