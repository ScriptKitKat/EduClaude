"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw, Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeEditorProps {
  videoUrl?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string;
  execution_time: number;
}

export function CodeEditor({ videoUrl, initialCode = "", onCodeChange }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "output">("editor");

  // Generate problem from video on mount or when videoUrl changes
  useEffect(() => {
    if (videoUrl && !initialCode) {
      generateProblem(videoUrl);
    }
  }, [videoUrl]);

  const generateProblem = async (url: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url }),
      });

      const data = await response.json();

      if (data.success && data.pythonFile) {
        setCode(data.pythonFile);
        onCodeChange?.(data.pythonFile);
      } else {
        setOutput({
          success: false,
          output: "",
          error: data.error || "Failed to generate problem",
          execution_time: 0,
        });
        setActiveTab("output");
      }
    } catch (error) {
      console.error("Error generating problem:", error);
      setOutput({
        success: false,
        output: "",
        error: "Failed to generate problem. Please try again.",
        execution_time: 0,
      });
      setActiveTab("output");
    } finally {
      setIsGenerating(false);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput({
        success: false,
        output: "",
        error: "Please write some code first",
        execution_time: 0,
      });
      setActiveTab("output");
      return;
    }

    setIsExecuting(true);
    setActiveTab("output");
    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setOutput(result);
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput({
        success: false,
        output: "",
        error: "Failed to execute code. Please try again.",
        execution_time: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    if (videoUrl) {
      generateProblem(videoUrl);
    } else {
      setCode("");
      setOutput(null);
      onCodeChange?.("");
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "problem.py";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="glass border-primary/20 flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Python Editor</CardTitle>
            <div className="flex items-center gap-2">
              {videoUrl && (
                <Button
                  onClick={() => generateProblem(videoUrl)}
                  disabled={isGenerating}
                  size="sm"
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      New Problem
                    </>
                  )}
                </Button>
              )}
              <Button onClick={downloadCode} size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={executeCode}
                disabled={isExecuting || !code.trim()}
                size="sm"
                className="font-medium"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Run Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="output">
                Output
                {output && (
                  <span className="ml-2">
                    {output.success ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0 border-0 p-0 flex-1 flex flex-col">
              {isGenerating ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Generating problem from video...</p>
                  </div>
                </div>
              ) : (
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: "on",
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="output" className="mt-0 border-0 p-4 flex-1 flex flex-col overflow-hidden">
              {!output && !isExecuting && (
                <div className="flex items-center justify-center flex-1">
                  <p className="text-sm text-muted-foreground">
                    Run your code to see the output here
                  </p>
                </div>
              )}

              {isExecuting && (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Executing code...</p>
                  </div>
                </div>
              )}

              {output && !isExecuting && (
                <div className="space-y-3 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {output.success ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-500">Success</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-500">Error</span>
                        </>
                      )}
                    </div>
                    {output.execution_time > 0 && (
                      <span className="text-xs text-muted-foreground">
                        Executed in {output.execution_time.toFixed(3)}s
                      </span>
                    )}
                  </div>

                  {output.output && (
                    <div>
                      <p className="text-sm font-medium mb-2">Output:</p>
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        {output.output}
                      </pre>
                    </div>
                  )}

                  {output.error && (
                    <div>
                      <p className="text-sm font-medium mb-2 text-red-500">Error:</p>
                      <pre className="bg-red-950/20 border border-red-500/20 p-3 rounded text-sm overflow-x-auto text-red-400">
                        {output.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
