import { Link } from "react-router-dom";
import { Play, FileText, Code } from "lucide-react";
import type { Video } from "@/types";

const VideoCard = ({ video }: { video: Video }) => {
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <Link
      to={`/video/${video._id}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs font-display px-2 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {video.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          {video.category && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
              {video.category}
            </span>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {video.notesUrl && (
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            {video.codeUrl && (
              <Code className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
