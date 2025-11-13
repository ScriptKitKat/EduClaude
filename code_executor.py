"""
Modal-based Code Executor
Provides sandboxed code execution for Python.
"""

import modal
import sys
import io
import traceback
from typing import Dict, Any
from pydantic import BaseModel

# Create Modal app
app = modal.App("code-executor")

# Define the sandbox image with necessary packages
image = modal.Image.debian_slim().pip_install([
    "numpy",
    "pandas",
    "matplotlib",
    "requests",
])

# Web image for HTTP endpoints
web_image = modal.Image.debian_slim().pip_install([
    "fastapi[all]",
])


@app.function(
    image=image,
    timeout=30,  # 30 second timeout
    memory=1024,  # 1GB memory limit
)
def execute_code(code: str) -> Dict[str, Any]:
    """
    Execute Python code in a sandboxed environment.

    Args:
        code: The Python code to execute

    Returns:
        Dictionary containing:
        - success: Boolean indicating if execution succeeded
        - output: Standard output from the code
        - error: Error messages if any
        - execution_time: Time taken to execute in seconds
    """
    import time

    result = {
        "success": False,
        "output": "",
        "error": "",
        "execution_time": 0
    }

    start_time = time.time()

    try:
        result = _execute_python(code)
        result["execution_time"] = time.time() - start_time

    except Exception as e:
        result["error"] = f"Execution failed: {str(e)}"
        result["execution_time"] = time.time() - start_time

    return result


def _execute_python(code: str) -> Dict[str, Any]:
    """Execute Python code in a restricted environment."""
    result = {"success": False, "output": "", "error": ""}

    old_stdout = sys.stdout
    old_stderr = sys.stderr
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()

    try:
        sys.stdout = stdout_capture
        sys.stderr = stderr_capture

        # Create restricted globals with safe builtins
        safe_globals = {
            "__builtins__": {
                "print": print,
                "len": len,
                "range": range,
                "str": str,
                "int": int,
                "float": float,
                "list": list,
                "dict": dict,
                "tuple": tuple,
                "set": set,
                "bool": bool,
                "abs": abs,
                "max": max,
                "min": min,
                "sum": sum,
                "sorted": sorted,
                "enumerate": enumerate,
                "zip": zip,
                "map": map,
                "filter": filter,
                "type": type,
                "isinstance": isinstance,
                "hasattr": hasattr,
                "getattr": getattr,
                "setattr": setattr,
                "dir": dir,
                "help": help,
                "__import__": __import__,
                "ValueError": ValueError,
                "TypeError": TypeError,
                "KeyError": KeyError,
                "IndexError": IndexError,
                "AttributeError": AttributeError,
                "NameError": NameError,
                "ZeroDivisionError": ZeroDivisionError,
                "Exception": Exception,
            },
            "__name__": "__main__"
        }

        # Add safe standard library modules
        for module_name in ["math", "random", "json", "datetime", "time", "re", "os", "sys"]:
            try:
                safe_globals[module_name] = __import__(module_name)
            except ImportError:
                pass

        # Add optional scientific packages
        for module_name, alias in [("numpy", "np"), ("pandas", "pd")]:
            try:
                mod = __import__(module_name)
                safe_globals[module_name] = mod
                safe_globals[alias] = mod
            except ImportError:
                pass

        # Try to add matplotlib
        try:
            safe_globals["matplotlib"] = __import__("matplotlib")
            safe_globals["plt"] = __import__("matplotlib.pyplot")
        except ImportError:
            pass

        exec(code, safe_globals)

        result["output"] = stdout_capture.getvalue()
        error_output = stderr_capture.getvalue()

        if error_output:
            result["error"] = error_output
        else:
            result["success"] = True

    except Exception as e:
        result["error"] = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    return result


# Pydantic model for API requests
class CodeRequest(BaseModel):
    code: str


# HTTP endpoint
@app.function(image=web_image)
@modal.web_endpoint(method="POST")
async def api_execute(request: CodeRequest):
    """
    HTTP endpoint for Python code execution.

    POST /api_execute
    {
        "code": "print('Hello, World!')"
    }
    """
    if not request.code:
        return {"error": "No code provided", "success": False}

    result = await execute_code.remote.aio(request.code)
    return result


# CLI for local testing
if __name__ == "__main__":
    # Test Python execution
    print("Testing Python execution...")
    test_code = """
print("Hello from Modal!")
import math
print(f"Pi = {math.pi:.2f}")
for i in range(3):
    print(f"Count: {i}")
"""

    result = execute_code.local(test_code)
    print(f"Success: {result['success']}")
    print(f"Output:\n{result['output']}")
    if result['error']:
        print(f"Error: {result['error']}")
    print(f"Time: {result['execution_time']:.3f}s")
