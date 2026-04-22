import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Code, ExternalLink, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();

  /* ---------------- fetch ---------------- */
  const { data: video, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: () => api(`/videos/${id}`),
    enabled: !!id,
  });

  /* ---------------- loading ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-4 w-32 bg-secondary rounded animate-pulse mb-6" />
          <div className="aspect-video w-full bg-secondary rounded-xl animate-pulse mb-8" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="h-4 w-full bg-secondary/50 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-secondary/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- not found ---------------- */
  if (!video) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Youtube className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Video tutorial not found.</p>
          <Link to="/videos" className="text-primary hover:underline mt-2 inline-block">
            View all videos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back */}
        <Link
          to="/videos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Library
        </Link>

        {/* PLAYER */}
        <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/50 mb-8 ring-4 ring-primary/5">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* INFO */}
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
              {video.title}
            </h1>
            
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] uppercase font-black bg-secondary text-muted-foreground px-2 py-0.5 rounded tracking-widest">
                {video.category || "General"}
              </span>
              <span className="text-xs text-muted-foreground">
                • {video.playlist?.title || "Standalone Lesson"}
              </span>
            </div>
          </div>

          {video.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-4 pt-4">
            {video.notesUrl && (
              <Button asChild variant="secondary" className="rounded-xl px-6 border border-border/50 hover:bg-secondary">
                <a
                  href={video.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-4 h-4 mr-2 text-primary" /> 
                  Study Notes
                </a>
              </Button>
            )}

            {video.codeUrl && (
              <Button asChild variant="secondary" className="rounded-xl px-6 border border-border/50 hover:bg-secondary">
                <a
                  href={video.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code className="w-4 h-4 mr-2 text-primary" /> 
                  Source Code
                </a>
              </Button>
            )}

            <Button asChild variant="outline" className="rounded-xl px-6">
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-4 h-4 mr-2" /> 
                Open in YouTube
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

