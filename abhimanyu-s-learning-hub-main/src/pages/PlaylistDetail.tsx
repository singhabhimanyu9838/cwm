import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ListVideo, Layers } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();

  /* ---------------- fetch ---------------- */
  const { data: playlist, isLoading: plLoading } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => api(`/playlists/${id}`),
    enabled: !!id,
  });

  const { data: videos = [], isLoading: vidsLoading } = useQuery({
    queryKey: ["playlist-videos", id],
    queryFn: () => api(`/videos?playlist=${id}`),
    enabled: !!id,
  });

  const isLoading = plLoading || vidsLoading;

  /* ---------------- loading ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-4 w-32 bg-secondary rounded animate-pulse mb-8" />
          <div className="space-y-4 mb-12">
            <div className="h-4 w-20 bg-primary/20 rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="h-6 w-full bg-secondary/50 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-secondary/40 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Playlist not found.</p>
          <Link to="/playlists" className="text-primary hover:underline mt-2 inline-block">
            Browse all playlists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back */}
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Collections
        </Link>

        {/* Header */}
        <div className="mb-12 max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-3 py-1 rounded-full tracking-wider">
              {playlist.category}
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60">
              Structured Path
            </span>
          </div>

          <h1 className="text-4xl font-display font-bold text-foreground mt-2 leading-tight">
            {playlist.title}
          </h1>

          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {playlist.description}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
              <ListVideo className="w-4 h-4 text-primary" />
              <span>{videos.length} Professional Modules</span>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-display font-bold text-foreground">
              Course Content
            </h2>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Step-by-Step
            </span>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((v: any) => (
                <VideoCard key={v._id} video={v} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-secondary/10 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No modules have been added to this path yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;

