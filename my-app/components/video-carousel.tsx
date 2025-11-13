"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConceptItem {
  concept: string;
  video_title: string;
  channel: string;
  video_url: string;
  reason: string;
}

interface VideoCarouselProps {
  plan: ConceptItem[];
  currentIndex: number;
  onVideoSelect: (index: number) => void;
  completedVideos?: Set<number>;
}

export function VideoCarousel({
  plan,
  currentIndex,
  onVideoSelect,
  completedVideos = new Set(),
}: VideoCarouselProps) {
  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onVideoSelect(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < plan.length - 1) {
      onVideoSelect(currentIndex + 1);
    }
  };

  const currentVideo = plan[currentIndex];
  const videoId = currentVideo ? extractVideoId(currentVideo.video_url) : null;

  return (
    <div className="h-full flex flex-col gap-3">
      <Card className="glass border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Learning Path</CardTitle>
          <p className="text-xs text-muted-foreground">
            Concept {currentIndex + 1} of {plan.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Video */}
          {currentVideo && (
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={currentVideo.video_title}
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

              <div>
                <h3 className="font-semibold text-sm mb-1">{currentVideo.concept}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {currentVideo.video_title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  by {currentVideo.channel}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-2">
                <Button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  onClick={goToNext}
                  disabled={currentIndex === plan.length - 1}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Video List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground px-2">All Concepts</p>
            {plan.map((item, index) => {
              const itemVideoId = extractVideoId(item.video_url);
              const isCompleted = completedVideos.has(index);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={() => onVideoSelect(index)}
                  className={cn(
                    "w-full flex items-start gap-3 p-2 rounded-lg transition-colors text-left",
                    isCurrent
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted border border-transparent"
                  )}
                >
                  <div className="relative flex-shrink-0 w-20 h-12 rounded overflow-hidden bg-muted">
                    {itemVideoId ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${itemVideoId}/mqdefault.jpg`}
                          alt={item.video_title}
                          className="w-full h-full object-cover"
                        />
                        {!isCurrent && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-white" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
