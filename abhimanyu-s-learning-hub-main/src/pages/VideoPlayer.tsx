import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await api(`/videos/${id}`);
        setVideo(data);
      } catch {
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  /* ---------------- loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading video...
        </p>
      </div>
    );
  }

  /* ---------------- not found ---------------- */
  if (!video) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Back */}
        <Link
          to="/videos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Videos
        </Link>

        {/* PLAYER */}
        <div className="aspect-video rounded-xl overflow-hidden bg-card border border-border mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* INFO */}
        <h1 className="text-2xl font-display font-bold text-foreground">
          {video.title}
        </h1>

        {video.description && (
          <p className="text-muted-foreground mt-3 max-w-3xl">
            {video.description}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 mt-6">
          {video.notesUrl && (
            <Button asChild variant="outline" size="sm">
              <a
                href={video.notesUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="w-4 h-4 mr-2" /> Notes
              </a>
            </Button>
          )}

          {video.codeUrl && (
            <Button asChild variant="outline" size="sm">
              <a
                href={video.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code className="w-4 h-4 mr-2" /> Code
              </a>
            </Button>
          )}

          <Button asChild variant="outline" size="sm">
            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" /> YouTube
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
