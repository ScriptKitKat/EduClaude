# Interactive Learning Features

## Overview
EduClaude now features a complete interactive learning environment with personalized learning paths, video recommendations, and a live code editor.

## Complete User Journey

### 1. Enter Learning Topic
User types what they want to learn (e.g., "Python programming")

### 2. Generate Learning Plan
Click "Create Learning Plan" button → AI generates a structured learning path with:
- 4-8 sequential concepts
- YouTube video for each concept
- Explanation for each video choice

### 3. Review & Edit Plan
Interactive plan editor allows:
- ✏️ Edit any concept or video
- 🗑️ Remove concepts
- ⬆️⬇️ Reorder concepts
- 💬 Request changes from AI with feedback
- 🔄 Iterative refinement until satisfied

### 4. Finalize & Start Learning
Click "Finalize & Start Learning" → Unlocks interactive sidebar with:
- 📺 **Video Carousel**: Watch concept videos
- 💻 **Code Editor**: Practice with auto-generated problems
- ✅ **Progress Tracking**: Mark concepts as completed

## Interactive Sidebar Components

### Video Carousel

**Features:**
- Embedded YouTube player
- Concept list with thumbnails
- Navigation buttons (Previous/Next)
- Click any concept to jump to it
- Progress indicators (✓ for completed)
- Current video highlighting

**UI Elements:**
- Video title and channel name
- Concept description
- Concept number (e.g., "Concept 3 of 8")
- Scrollable list of all concepts

### Code Editor (Monaco Editor)

**Features:**
- Full-featured Python editor
- Syntax highlighting
- Auto-completion
- Line numbers
- Dark theme

**Actions:**
- ▶️ **Run Code**: Execute Python code in Modal sandbox
- 🔄 **New Problem**: Generate fresh problem from current video
- 💾 **Download**: Save code as .py file

**Tabs:**
- **Editor Tab**: Write and edit code
- **Output Tab**: View execution results
  - Success/Error indicators
  - Standard output
  - Error messages with stack traces
  - Execution time

### Problem Generation

When a new concept is selected:
1. Extracts video transcript automatically
2. Sends to Claude AI with prompt
3. Generates custom coding problem based on video content
4. Provides starter code with comments
5. Loads into editor ready to solve

**Example Generated Problem:**
```python
"""
Problem: Understanding List Comprehensions

Based on the video about Python list comprehensions,
write a function that uses list comprehension to
filter and transform data.

Your task:
1. Create a function that takes a list of numbers
2. Return only the even numbers
3. Square each even number
4. Return the result as a new list

Example:
  Input: [1, 2, 3, 4, 5, 6]
  Output: [4, 16, 36]
"""

def process_numbers(numbers):
    # Your code here
    pass

# Test your function
result = process_numbers([1, 2, 3, 4, 5, 6])
print(f"Result: {result}")
```

## Code Execution Flow

```
1. User writes code in Monaco Editor
   ↓
2. Clicks "Run Code"
   ↓
3. Frontend sends code to /api/execute-code
   ↓
4. Next.js API routes to Modal
   ↓
5. Modal executes in sandboxed container
   ↓
6. Results streamed back to frontend
   ↓
7. Display in Output tab with formatting
```

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Your Learning Journey            [Hide Sidebar]     │
├─────────────────────────────────┬───────────────────────────┤
│                                 │  📺 Video Carousel        │
│  Chat Messages                  │  ┌─────────────────────┐ │
│  ┌──────────────────────┐       │  │  [Concept 1/8]      │ │
│  │ AI: Your learning    │       │  │  ┌───────────────┐  │ │
│  │ plan is ready!       │       │  │  │  YouTube      │  │ │
│  └──────────────────────┘       │  │  │  Video        │  │ │
│                                 │  │  └───────────────┘  │ │
│  ┌──────────────────────┐       │  │  [Prev] [Next]      │ │
│  │ User: Explain X      │       │  │                     │ │
│  └──────────────────────┘       │  │  • Concept 1 ✓      │ │
│                                 │  │  • Concept 2 (now)  │ │
│  ┌──────────────────────┐       │  │  • Concept 3        │ │
│  │ AI: Here's how...    │       │  └─────────────────────┘ │
│  └──────────────────────┘       │                          │
│                                 │  💻 Code Editor          │
│                                 │  ┌─────────────────────┐ │
├─────────────────────────────────┤  │ [Editor] [Output]   │ │
│  Input: Ask me anything...  [▶]│  │  1 | def solve():   │ │
└─────────────────────────────────┤  │  2 |   # code      │ │
                                  │  │  3 |   pass        │ │
                                  │  │                     │ │
                                  │  │  [Run] [Download]   │ │
                                  │  └─────────────────────┘ │
                                  └──────────────────────────┘
```

## Key Interactions

### Sidebar Toggle
- **Button**: "Hide/Show Sidebar" in header
- **Behavior**: Smoothly shows/hides sidebar
- **Persists**: Sidebar state maintained during session

### Video Navigation
- **Click concept**: Jump to that video immediately
- **Arrows**: Previous/Next in sequence
- **Auto-load**: New problem generated for each video

### Code Execution
- **Real-time**: Results appear as they come
- **Loading states**: Animated spinners during execution
- **Error handling**: Friendly error messages

### Progress Tracking
- **Completion marks**: Check concepts as done
- **Visual feedback**: Green checkmarks on completed items
- **Persistence**: Progress saved in session state

## API Endpoints

### POST `/api/generate-plan`
Generate learning plan from subject

**Request:**
```json
{
  "subject": "machine learning",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "plan": [
    {
      "concept": "Python Basics",
      "video_title": "Python in 100 Seconds",
      "channel": "Fireship",
      "video_url": "https://youtube.com/watch?v=...",
      "reason": "Concise overview..."
    }
  ],
  "conversationHistory": [...]
}
```

### POST `/api/generate-problem`
Generate coding problem from video

**Request:**
```json
{
  "videoUrl": "https://youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "abc123",
  "pythonFile": "# Problem description\ndef solve():\n    pass"
}
```

### POST `/api/execute-code`
Execute Python code in Modal sandbox

**Request:**
```json
{
  "code": "print('Hello, World!')"
}
```

**Response:**
```json
{
  "success": true,
  "output": "Hello, World!\n",
  "error": "",
  "execution_time": 0.012
}
```

## Component Hierarchy

```
app/page.tsx
└── ChatInterface
    ├── PlanEditor (conditional - plan creation)
    │   ├── Card (plan items)
    │   ├── Edit forms
    │   └── Feedback input
    │
    └── Main Layout (after finalization)
        ├── Main Content
        │   ├── Header with controls
        │   ├── Message area
        │   └── Input area
        │
        └── Sidebar (conditional)
            ├── VideoCarousel
            │   ├── Video player (iframe)
            │   ├── Navigation buttons
            │   └── Concept list
            │
            └── CodeEditor
                ├── Monaco Editor
                ├── Tabs (Editor/Output)
                └── Action buttons
```

## State Management

### Chat Interface State
- `messages`: Chat history
- `input`: Current input text
- `isLoading`: AI response loading
- `planMode`: Plan creation active
- `currentPlan`: Plan being edited
- `finalizedPlan`: Locked-in learning plan
- `currentVideoIndex`: Active video in carousel
- `completedVideos`: Set of finished concepts
- `sidebarOpen`: Sidebar visibility

### Plan Editor State
- `plan`: Editable concept list
- `editingIndex`: Currently editing item
- `editForm`: Edit form data
- `feedback`: User feedback for AI

### Code Editor State
- `code`: Current code in editor
- `output`: Execution results
- `isExecuting`: Code running
- `isGenerating`: Problem generating
- `activeTab`: Editor or Output view

## Styling

### Theme
- **Colors**: Primary accent, muted backgrounds
- **Effects**: Glassmorphism, subtle shadows
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding/margins

### Responsive Design
- Sidebar: Fixed 384px width (w-96)
- Main content: Flexible width
- Collapse sidebar on smaller screens (future)

### Animations
- Smooth transitions
- Loading spinners
- Hover effects
- Slide animations

## Future Enhancements

### Planned Features
- ✅ Save learning progress to database
- ✅ Resume learning sessions
- ✅ Export progress reports
- ✅ Share learning plans
- ✅ Community-created plans
- ✅ More language support (JavaScript, etc.)
- ✅ Test case validation
- ✅ Hints and solutions
- ✅ Peer code review
- ✅ Achievement badges

### Technical Improvements
- WebSocket for real-time execution
- Code formatting (Prettier)
- Debugger integration
- Git integration for saving code
- Collaborative coding features

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Focus indicators
- ARIA labels

## Performance

- Lazy loading of Monaco Editor
- Efficient state updates
- Memoized components
- Optimized re-renders
- Code splitting

## Security

- Sandboxed code execution (Modal)
- Input sanitization
- Rate limiting (future)
- User authentication (future)
- XSS prevention

## Getting Started

1. **Create a plan**: Type what you want to learn
2. **Click "Create Learning Plan"**
3. **Edit and finalize** the plan
4. **Watch videos** in the carousel
5. **Solve problems** in the code editor
6. **Run code** to test your solutions
7. **Move to next concept** when ready
8. **Repeat** until mastery!

Enjoy your personalized learning journey! 🚀
