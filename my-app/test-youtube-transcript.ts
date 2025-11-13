import { YoutubeTranscript } from 'youtube-transcript'

async function testYoutubeTranscript() {
  try {
    console.log('Testing youtube-transcript API...')

    // Test with a popular video ID that should have captions
    const videoId = 'dQw4w9WgXcQ' // Never Gonna Give You Up - Rick Astley

    console.log(`Fetching transcript for video: ${videoId}`)
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)

    console.log(`✓ Successfully fetched transcript`)
    console.log(`  - Number of segments: ${transcript.length}`)
    console.log(`  - First segment: "${transcript[0].text}"`)
    console.log(`  - Duration: ${transcript[0].duration}s`)
    console.log(`  - Offset: ${transcript[0].offset}s`)

    // Test with language option
    console.log('\nTesting with language option...')
    const transcriptEN = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' })
    console.log(`✓ Successfully fetched English transcript`)
    console.log(`  - Number of segments: ${transcriptEN.length}`)

    // Test with invalid video ID
    console.log('\nTesting error handling with invalid video ID...')
    try {
      await YoutubeTranscript.fetchTranscript('invalid_id_xyz')
      console.log('✗ Should have thrown an error')
    } catch (error) {
      console.log(`✓ Correctly threw error: ${error instanceof Error ? error.message : error}`)
    }

    console.log('\n✓ All tests passed!')

  } catch (error) {
    console.error('✗ Test failed:', error)
    if (error instanceof Error) {
      console.error('  Error message:', error.message)
      console.error('  Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

testYoutubeTranscript()
