# Generate Coding Problem from YouTube Video

This feature allows you to generate coding problems from YouTube videos using their transcripts.

## Setup

1. Make sure you have a `.env.local` file in the `my-app` directory with:
```
CLAUDE_API_KEY=your_api_key_here
```

2. Dependencies are already installed (`youtube-transcript` and `@anthropic-ai/sdk`)

## API Endpoint

### POST `/api/generate-problem`

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "VIDEO_ID",
  "pythonFile": "# Problem Description\n# ...\n\ndef solution():\n    pass",
  "usage": {
    "inputTokens": 1234,
    "outputTokens": 567
  }
}
```

## Usage Examples

### 1. Using the API directly

```typescript
const response = await fetch('/api/generate-problem', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
})

const data = await response.json()
console.log(data.pythonFile) // Python code with problem and starter code
```

### 2. Using the utility function

```typescript
import { generateProblemFromVideo } from '@/lib/generate-problem'

const result = await generateProblemFromVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

if (result.success) {
  console.log(result.pythonFile)
  // Save to file or display to user
} else {
  console.error(result.error)
}
```

### 3. Using cURL

```bash
curl -X POST http://localhost:3000/api/generate-problem \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Supported URL Formats

- Full URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short URL: `https://youtu.be/VIDEO_ID`
- Embed URL: `https://www.youtube.com/embed/VIDEO_ID`
- Video ID only: `VIDEO_ID`

## Output Format

The API returns a single Python file with:

1. **Problem Description** - Multi-line comment at the top explaining the problem
2. **Starter Code** - Function signatures and basic structure to get started
3. **Helpful Hints** - Additional comments to guide the solution

Example output:
```python
"""
Problem: Implement a Binary Search Algorithm

Based on the video about binary search, implement a function that searches
for a target value in a sorted array using the binary search algorithm.

The function should return the index of the target if found, or -1 if not found.

Hints:
- Use two pointers: left and right
- Calculate the middle index
- Compare the middle value with the target
- Adjust the search range based on the comparison
"""

def binary_search(arr: list[int], target: int) -> int:
    """
    Perform binary search on a sorted array.

    Args:
        arr: Sorted list of integers
        target: Value to search for

    Returns:
        Index of target if found, -1 otherwise
    """
    # Your code here
    pass


# Test cases
if __name__ == "__main__":
    test_arr = [1, 3, 5, 7, 9, 11, 13]
    print(binary_search(test_arr, 7))  # Expected: 3
    print(binary_search(test_arr, 6))  # Expected: -1
```

## Error Handling

Common errors:

- **Invalid YouTube URL**: Returns 400 status
- **No transcript available**: Returns 404 status (video may not have captions)
- **API key not configured**: Returns 500 status
- **Transcript fetch failed**: Returns 404 status

## Notes

- Videos must have captions/transcripts available
- Transcripts are truncated to 15,000 characters to stay within token limits
- The generated problem is educational and based on the video content
- Responses typically take 5-15 seconds depending on transcript length
