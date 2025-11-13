import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * Executes Python code using the Modal code executor
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    // Get Modal deployment URL from environment
    const modalUrl = process.env.MODAL_EXECUTE_URL;

    if (!modalUrl) {
      // Fallback: Try to import and run locally if Modal is not deployed
      return NextResponse.json(
        {
          error: "Modal deployment URL not configured. Please deploy code_executor.py to Modal and set MODAL_EXECUTE_URL environment variable.",
          success: false
        },
        { status: 500 }
      );
    }

    // Call the Modal API endpoint
    const response = await fetch(modalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error || "Failed to execute code",
          success: false,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      {
        error: "Failed to execute code",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
