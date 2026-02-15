import { Link } from "react-router-dom";
import { ListVideo, ChevronRight } from "lucide-react";
import type { Playlist } from "@/types";

interface PlaylistWithExtras extends Playlist {
  thumbnail?: string | null;
  videoCount?: number;
}

const PlaylistCard = ({ playlist }: { playlist: PlaylistWithExtras }) => {
  return (
    <Link
      to={`/playlist/${playlist._id}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border
                 hover:border-primary/50 transition-all duration-300
                 hover:shadow-[var(--shadow-glow)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {playlist.thumbnail ? (
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-full h-full object-cover
                       group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          text-muted-foreground text-sm">
            No videos yet
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t
                        from-background/90 via-background/30 to-transparent" />

        {/* Badges */}
        <div className="absolute bottom-3 left-3 right-3
                        flex items-end justify-between">
          {playlist.category && (
            <span className="text-xs bg-primary/20 text-primary
                             px-2 py-0.5 rounded font-medium">
              {playlist.category}
            </span>
          )}

          <div className="flex items-center gap-1
                          bg-background/80 rounded px-2 py-1">
            <ListVideo className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-display text-foreground">
              {playlist.videoCount ?? 0} videos
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-foreground
                       group-hover:text-primary transition-colors
                       flex items-center gap-1">
          {playlist.title}
          <ChevronRight className="w-4 h-4 opacity-0
                                   group-hover:opacity-100 transition-opacity" />
        </h3>

        {playlist.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {playlist.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default PlaylistCard;
