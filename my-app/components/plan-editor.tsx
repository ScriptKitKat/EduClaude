"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  Trash2,
  Edit,
  Check,
  X,
  Play,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface ConceptItem {
  concept: string;
  video_title: string;
  channel: string;
  video_url: string;
  reason: string;
}

interface PlanEditorProps {
  initialPlan: ConceptItem[];
  onFinalize: (plan: ConceptItem[]) => void;
  onCancel: () => void;
  onRequestChanges: (feedback: string) => void;
  isLoading?: boolean;
}

export function PlanEditor({
  initialPlan,
  onFinalize,
  onCancel,
  onRequestChanges,
  isLoading = false,
}: PlanEditorProps) {
  const [plan, setPlan] = useState<ConceptItem[]>(initialPlan);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ConceptItem | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...plan[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      const newPlan = [...plan];
      newPlan[editingIndex] = editForm;
      setPlan(newPlan);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleDelete = (index: number) => {
    setPlan(plan.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPlan = [...plan];
    [newPlan[index - 1], newPlan[index]] = [newPlan[index], newPlan[index - 1]];
    setPlan(newPlan);
  };

  const handleMoveDown = (index: number) => {
    if (index === plan.length - 1) return;
    const newPlan = [...plan];
    [newPlan[index], newPlan[index + 1]] = [newPlan[index + 1], newPlan[index]];
    setPlan(newPlan);
  };

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Edit Your Learning Plan
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and customize your learning path. You can edit, remove, or
            reorder concepts before finalizing.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {plan.map((item, index) => (
            <Card
              key={index}
              className="border border-border/50 hover:border-primary/30 transition-colors"
            >
              {editingIndex === index ? (
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Concept
                    </label>
                    <Input
                      value={editForm?.concept || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm!, concept: e.target.value })
                      }
                      placeholder="Concept name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Video Title
                    </label>
                    <Input
                      value={editForm?.video_title || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          video_title: e.target.value,
                        })
                      }
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Channel
                    </label>
                    <Input
                      value={editForm?.channel || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm!, channel: e.target.value })
                      }
                      placeholder="Channel name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Video URL
                    </label>
                    <Input
                      value={editForm?.video_url || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm!,
                          video_url: e.target.value,
                        })
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Reason
                    </label>
                    <Textarea
                      value={editForm?.reason || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm!, reason: e.target.value })
                      }
                      placeholder="Why this video?"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" variant="default">
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center justify-center h-6 w-6 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === plan.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.concept}</h3>

                      <div className="flex items-start gap-3">
                        {extractVideoId(item.video_url) && (
                          <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <img
                              src={`https://img.youtube.com/vi/${extractVideoId(
                                item.video_url
                              )}/mqdefault.jpg`}
                              alt={item.video_title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">
                            {item.video_title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.channel}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {plan.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No concepts in the plan. Add some or request changes from the AI.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-primary/20">
        <CardContent className="pt-6 space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Request Changes (Optional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., 'Add more beginner concepts' or 'Focus more on practical applications'"
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => onFinalize(plan)}
              disabled={plan.length === 0 || isLoading}
              className="flex-1 min-w-[200px]"
            >
              <Check className="w-4 h-4 mr-2" />
              Finalize & Start Learning
            </Button>
            {feedback.trim() && (
              <Button
                onClick={() => {
                  onRequestChanges(feedback);
                  setFeedback("");
                }}
                variant="outline"
                disabled={isLoading}
                className="flex-1 min-w-[200px]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? "Generating..." : "Request Changes"}
              </Button>
            )}
            <Button
              onClick={onCancel}
              variant="ghost"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
