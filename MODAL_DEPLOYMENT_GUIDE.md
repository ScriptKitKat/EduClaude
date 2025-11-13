# Modal Code Executor Deployment Guide

## Overview
This guide will help you deploy the Python code executor to Modal, enabling students to run Python code directly from the learning interface.

## Prerequisites

1. **Modal Account**: Sign up at [modal.com](https://modal.com)
2. **Modal CLI**: Install the Modal client library
3. **Python**: Python 3.8 or higher

## Step 1: Install Modal

```bash
pip install modal
```

## Step 2: Authenticate with Modal

```bash
modal token new
```

This will open a browser window to authenticate. Follow the prompts to create your token.

## Step 3: Deploy the Code Executor

Navigate to the project root directory and deploy:

```bash
cd C:\Users\mrunu\Code\EduClaude
modal deploy code_executor.py
```

You should see output like:
```
✓ Created objects.
├── 🔨 Created mount /code_executor.py
├── 🔨 Created function execute_code.
├── 🔨 Created web function api_execute => https://your-username--code-executor-api-execute.modal.run
└── 🔨 Created app code-executor.
```

## Step 4: Get Your API Endpoint URL

After deployment, Modal will provide a URL for the `api_execute` function. It will look like:

```
https://your-username--code-executor-api-execute.modal.run
```

Copy this URL!

## Step 5: Update Environment Variables

Add the Modal URL to your `.env.local` file:

```bash
cd my-app
```

Edit `.env.local` and add:

```
MODAL_EXECUTE_URL=https://your-username--code-executor-api-execute.modal.run
```

## Step 6: Restart Your Development Server

```bash
npm run dev
```

## Testing the Deployment

### Test 1: Direct Modal Test
You can test the Modal function directly:

```bash
modal run code_executor.py
```

This will run the test code in the `if __name__ == "__main__"` block.

### Test 2: Web Endpoint Test
Test the HTTP endpoint with curl:

```bash
curl -X POST https://your-username--code-executor-api-execute.modal.run \
  -H "Content-Type: application/json" \
  -d '{"code":"print(\"Hello from Modal!\")"}'
```

Expected response:
```json
{
  "success": true,
  "output": "Hello from Modal!\n",
  "error": "",
  "execution_time": 0.001
}
```

### Test 3: In-App Test
1. Create a learning plan
2. Finalize the plan
3. The sidebar should appear with a video carousel and code editor
4. Click "Run Code" in the editor
5. You should see the output in the Output tab

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTP POST
         │
┌────────▼────────┐
│  /api/execute-  │
│     code        │ (Next.js API Route)
└────────┬────────┘
         │
         │ HTTP POST
         │
┌────────▼────────┐
│  Modal Service  │
│ code_executor.py│ (Sandboxed Python)
└─────────────────┘
```

## Features

### Code Execution
- **Sandboxed Environment**: Code runs in isolated Modal containers
- **Timeout Protection**: 30-second execution limit
- **Memory Limits**: 1GB RAM per execution
- **Safe Builtins**: Restricted Python environment with safe operations

### Supported Packages
The executor includes:
- `numpy` - Numerical computing
- `pandas` - Data manipulation
- `matplotlib` - Plotting (basic)
- `requests` - HTTP requests

### Security
- No file system access
- No network access (except for pre-installed packages)
- Limited builtins to prevent dangerous operations
- Automatic timeout and memory limits

## Troubleshooting

### Error: "Modal deployment URL not configured"
**Solution**: Make sure you've set `MODAL_EXECUTE_URL` in `.env.local` and restarted the dev server.

### Error: "Failed to execute code"
**Possible causes**:
1. Modal service is not deployed or stopped
2. Modal URL is incorrect
3. Network issues

**Solution**:
- Redeploy: `modal deploy code_executor.py`
- Check the URL in Modal dashboard
- Test the endpoint directly with curl

### Code Times Out
**Solution**:
- Optimize your code
- Check for infinite loops
- The default timeout is 30 seconds (configurable in `code_executor.py`)

### Package Not Available
**Solution**:
Add the package to the `image` definition in `code_executor.py`:

```python
image = modal.Image.debian_slim().pip_install([
    "numpy",
    "pandas",
    "matplotlib",
    "requests",
    "your-package-here",  # Add here
])
```

Then redeploy:
```bash
modal deploy code_executor.py
```

## Monitoring

### View Logs
```bash
modal app logs code-executor
```

### View Active Functions
```bash
modal app list
```

### Stop the App
```bash
modal app stop code-executor
```

## Cost Information

Modal offers a free tier with:
- 30 free GPU hours/month
- $0.000175/sec for CPU after free tier

For this use case (code execution), costs are minimal since:
- No GPU is used
- Execution is typically < 1 second
- You only pay when code actually runs

## Development Workflow

### Local Testing
Edit `code_executor.py` and test locally:

```bash
python code_executor.py
```

### Deploy Changes
```bash
modal deploy code_executor.py
```

### View in Dashboard
Visit [modal.com/apps](https://modal.com/apps) to see:
- Deployment status
- Recent executions
- Logs and metrics
- Usage statistics

## Next Steps

1. ✅ Deploy code executor to Modal
2. ✅ Set `MODAL_EXECUTE_URL` in `.env.local`
3. ✅ Restart dev server
4. ✅ Test code execution
5. 🎉 Start learning with interactive coding!

## Support

- Modal Docs: https://modal.com/docs
- Modal Discord: https://discord.gg/modal
- EduClaude Issues: https://github.com/your-repo/issues
