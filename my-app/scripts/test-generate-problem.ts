/**
 * Test script for generate-problem API
 * Run with: npx tsx scripts/test-generate-problem.ts
 */

const API_URL = 'http://localhost:3000/api/generate-problem'

// Example YouTube URLs to test
const TEST_VIDEOS = [
  'https://www.youtube.com/watch?v=8hly31xKli0', // Python tutorial example
  'dQw4w9WgXcQ', // Direct video ID
]

async function testGenerateProblem(videoUrl: string) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing with video: ${videoUrl}`)
  console.log('='.repeat(60))

  try {
    const startTime = Date.now()

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl }),
    })

    const data = await response.json()
    const elapsed = Date.now() - startTime

    if (!response.ok) {
      console.error('❌ Error:', data.error)
      if (data.details) {
        console.error('Details:', data.details)
      }
      return
    }

    console.log('✅ Success!')
    console.log(`Video ID: ${data.videoId}`)
    console.log(`Time taken: ${elapsed}ms`)
    console.log(`Tokens used: ${data.usage.inputTokens} in, ${data.usage.outputTokens} out`)
    console.log('\n--- Generated Python File ---\n')
    console.log(data.pythonFile)
    console.log('\n--- End of File ---\n')

  } catch (error) {
    console.error('❌ Request failed:', error instanceof Error ? error.message : error)
  }
}

async function main() {
  console.log('🧪 Testing Generate Problem API')
  console.log('Make sure the Next.js dev server is running on port 3000!\n')

  // Test with the first video
  await testGenerateProblem(TEST_VIDEOS[0])

  // Uncomment to test more videos
  // for (const video of TEST_VIDEOS) {
  //   await testGenerateProblem(video)
  // }
}

main()
