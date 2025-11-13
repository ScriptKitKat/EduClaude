/**
 * Client-side utility to generate coding problems from YouTube videos
 */

export interface GenerateProblemResponse {
  success: boolean
  videoId?: string
  pythonFile?: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
  error?: string
  details?: string
}

/**
 * Generates a coding problem from a YouTube video URL
 *
 * @param videoUrl - YouTube video URL or video ID
 * @returns Python file content with problem description and starter code
 */
export async function generateProblemFromVideo(
  videoUrl: string
): Promise<GenerateProblemResponse> {
  try {
    const response = await fetch('/api/generate-problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate problem')
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
