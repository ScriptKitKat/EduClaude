# Learning Plan Feature

## Overview
The learning plan feature creates a personalized, structured learning path with YouTube video recommendations based on any subject the user wants to learn.

## How It Works

### 1. User Input
When a user types a subject they want to learn into the chat interface (e.g., "I want to learn Python programming"), a "Create Learning Plan" button appears above the input box.

### 2. Plan Generation
Clicking the button triggers a conversation with Claude (via Anthropic API) that:
- Identifies 4-8 key concepts needed to master the subject
- Orders them sequentially (prerequisites first, then progressively advanced)
- Recommends the best educational YouTube video for each concept
- Provides reasoning for each video recommendation

### 3. Interactive Editing
The user is presented with a plan editor interface where they can:
- **Edit** any concept or video recommendation
- **Remove** concepts they don't need
- **Reorder** concepts using up/down arrows
- **Request changes** by providing feedback to Claude
- **Preview** video thumbnails and details

### 4. Back-and-Forth Refinement
Users can request changes from Claude by typing feedback like:
- "Add more beginner concepts"
- "Focus more on practical applications"
- "Replace concept 3 with something about testing"

Claude will revise the plan based on the feedback, maintaining conversation context.

### 5. Finalization
Once satisfied, users click "Finalize & Start Learning" which:
- Adds the complete plan to the chat history
- Formats it with clickable YouTube links
- Transitions to normal chat mode for learning

## Technical Implementation

### API Route
**File:** `app/api/generate-plan/route.ts`
- Accepts subject and conversation history
- Uses Claude 3.5 Sonnet with custom system prompt
- Returns structured JSON with concept/video data
- Maintains conversation state for iterative refinement

### Plan Editor Component
**File:** `components/plan-editor.tsx`
- Rich editing interface with drag/drop ordering
- Inline editing for all fields
- Video thumbnail previews
- Feedback input for requesting changes

### Chat Interface Integration
**File:** `components/chat-interface.tsx`
- Detects when to show "Create Learning Plan" button
- Manages plan mode state
- Handles plan generation and refinement
- Integrates finalized plan into chat history

### UI Components Created
- `components/ui/card.tsx` - Card layout components
- `components/ui/input.tsx` - Text input component

## Usage Example

1. User types: "machine learning fundamentals"
2. Clicks "Create Learning Plan"
3. Claude generates a plan with concepts like:
   - Python Basics
   - Linear Algebra Foundations
   - Introduction to Neural Networks
   - etc.
4. User reviews, maybe removes "Python Basics" (already knows it)
5. User requests: "Add more about supervised learning"
6. Claude updates the plan
7. User clicks "Finalize & Start Learning"
8. Plan appears in chat with all video links
9. User can now ask questions about any concept

## Environment Setup

Requires either:
- `ANTHROPIC_API_KEY` environment variable, OR
- `CLAUDE_API_KEY` environment variable

## Key Features

- **Intelligent Concept Breakdown:** Claude identifies the right learning path
- **Curated Video Recommendations:** Real, high-quality YouTube videos
- **Iterative Refinement:** Back-and-forth conversation to perfect the plan
- **Full Editing Control:** Manual editing of any aspect of the plan
- **Seamless Integration:** Plan flows naturally into the learning conversation

## Future Enhancements

Possible additions:
- Save/load previous learning plans
- Progress tracking through concepts
- Quiz generation for each concept
- Code challenges tied to video concepts
- Community-shared learning plans
