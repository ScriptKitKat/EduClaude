"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConceptItem {
  concept: string;
  video_title: string;
  channel: string;
  video_url: string;
  reason: string;
}

interface ConceptNavigatorProps {
  plan: ConceptItem[];
  currentIndex: number;
  onConceptSelect: (index: number) => void;
  completedConcepts?: Set<number>;
}

export function ConceptNavigator({
  plan,
  currentIndex,
  onConceptSelect,
  completedConcepts = new Set(),
}: ConceptNavigatorProps) {
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <Card className="glass border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Learning Path</CardTitle>
        <p className="text-xs text-muted-foreground">
          {plan.length} concepts • {completedConcepts.size} completed
        </p>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {plan.map((item, index) => {
          const itemVideoId = extractVideoId(item.video_url);
          const isCompleted = completedConcepts.has(index);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => onConceptSelect(index)}
              className={cn(
                "w-full flex items-start gap-3 p-2 rounded-lg transition-colors text-left",
                isCurrent
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted border border-transparent"
              )}
            >
              <div className="relative flex-shrink-0 w-16 h-10 rounded overflow-hidden bg-muted">
                {itemVideoId ? (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${itemVideoId}/mqdefault.jpg`}
                      alt={item.video_title}
                      className="w-full h-full object-cover"
                    />
                    {!isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <PlayCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium line-clamp-2 flex-1">
                    {index + 1}. {item.concept}
                  </p>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {item.channel}
                </p>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
