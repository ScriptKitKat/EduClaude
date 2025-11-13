"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";

interface ConceptItem {
  concept: string;
  video_title: string;
  channel: string;
  video_url: string;
  reason: string;
}

interface MainVideoPlayerProps {
  concept: ConceptItem;
  currentIndex: number;
  totalConcepts: number;
  onPrevious: () => void;
  onNext: () => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export function MainVideoPlayer({
  concept,
  currentIndex,
  totalConcepts,
  onPrevious,
  onNext,
  isCompleted = false,
  onToggleComplete,
}: MainVideoPlayerProps) {
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(concept.video_url);

  return (
    <Card className="glass border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Concept {currentIndex + 1} of {totalConcepts}
              </span>
              {isCompleted && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl mb-2">{concept.concept}</CardTitle>
            <p className="text-sm text-muted-foreground">{concept.video_title}</p>
            <p className="text-xs text-muted-foreground mt-1">by {concept.channel}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(concept.video_url, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Watch on YouTube
            </Button>
            {onToggleComplete && (
              <Button
                variant={isCompleted ? "outline" : "default"}
                size="sm"
                onClick={onToggleComplete}
              >
                {isCompleted ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={concept.video_title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Invalid video URL</p>
            </div>
          )}
        </div>

        {/* Video Description */}
        {concept.reason && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Why this video?</p>
            <p className="text-sm text-muted-foreground">{concept.reason}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous Concept
          </Button>
          <Button
            onClick={onNext}
            disabled={currentIndex === totalConcepts - 1}
            variant="default"
            size="lg"
            className="flex-1"
          >
            Next Concept
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
