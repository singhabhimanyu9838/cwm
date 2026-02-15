import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ListVideo } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pl = await api(`/playlists/${id}`);
        const vids = await api(`/videos?playlist=${id}`);

        setPlaylist(pl);
        setVideos(vids);
      } catch {
        setPlaylist(null);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ---------------- loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading playlist...
        </p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Playlist not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Back */}
        <Link
          to="/playlists"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Playlists
        </Link>

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-display font-medium">
            {playlist.category}
          </span>

          <h1 className="text-3xl font-display font-bold text-foreground mt-2">
            {playlist.title}
          </h1>

          <p className="text-muted-foreground mt-3">
            {playlist.description}
          </p>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <ListVideo className="w-4 h-4 text-primary" />
            <span className="font-display">
              {videos.length} videos
            </span>
          </div>
        </div>

        {/* Videos */}
        <h2 className="text-xl font-display font-bold text-foreground mb-5">
          Videos in this Playlist
        </h2>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center mt-8">
            No videos yet in this playlist.
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
