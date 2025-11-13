import { YoutubeTranscript } from 'youtube-transcript'

async function debugYoutubeTranscript() {
  try {
    console.log('=== YouTube Transcript Debug Test ===\n')

    // Test multiple video IDs
    const testVideos = [
      { id: 'dQw4w9WgXcQ', name: 'Rick Astley - Never Gonna Give You Up' },
      { id: 'jNQXAC9IVRw', name: 'First YouTube Video (Me at the zoo)' },
      { id: 'BaW_jenozKc', name: 'YouTube Rewind 2018' }
    ]

    for (const video of testVideos) {
      console.log(`Testing: ${video.name}`)
      console.log(`Video ID: ${video.id}`)

      try {
        const startTime = Date.now()
        const transcript = await YoutubeTranscript.fetchTranscript(video.id)
        const duration = Date.now() - startTime

        console.log(`  ✓ Request completed in ${duration}ms`)
        console.log(`  - Transcript segments: ${transcript.length}`)

        if (transcript.length > 0) {
          console.log(`  - First segment: "${transcript[0].text}"`)
          console.log(`  - Last segment: "${transcript[transcript.length - 1].text}"`)
          console.log(`  - Total text length: ${transcript.map(t => t.text).join(' ').length} characters`)
        } else {
          console.log('  ✗ WARNING: Empty transcript returned!')
        }
      } catch (error) {
        console.log(`  ✗ Error: ${error instanceof Error ? error.message : String(error)}`)
        if (error instanceof Error && error.stack) {
          console.log(`  Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`)
        }
      }

      console.log('')
    }

    // Check the library version and internals
    console.log('=== Library Information ===')
    const packageJson = require('./node_modules/youtube-transcript/package.json')
    console.log(`Package: ${packageJson.name}@${packageJson.version}`)
    console.log(`Description: ${packageJson.description}`)
    console.log('')

    // Test with URL instead of ID
    console.log('=== Testing with URL ===')
    try {
      const transcript = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      console.log(`✓ URL format works, segments: ${transcript.length}`)
    } catch (error) {
      console.log(`✗ URL format error: ${error instanceof Error ? error.message : String(error)}`)
    }

  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

debugYoutubeTranscript()
