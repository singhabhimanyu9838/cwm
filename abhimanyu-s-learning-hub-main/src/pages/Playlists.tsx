import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard";
import { api } from "@/lib/api";

import { getYoutubeThumbnail } from "@/utils/youtube";




const Playlists = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await api("/playlists");
        setPlaylists(data || []);

        const uniqueCats = Array.from(
          new Set(
            (data || [])
              .map((pl: any) => pl.category)
              .filter(Boolean)
          )
        );
        setCategories(uniqueCats);
      } catch (err) {
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const filtered = playlists.filter((pl) => {
    const title = pl.title?.toLowerCase() || "";
    const matchSearch = title.includes(search.toLowerCase());

    const matchCat =
      activeCategory === "All" || pl.category === activeCategory;

    return matchSearch && matchCat;
  });

  /* ---------------- loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading playlists...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Playlists
        </h1>
        <p className="text-muted-foreground mb-8">
          Structured learning paths to master any topic.
        </p>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search playlists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Playlist Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((pl) => (
              <PlaylistCard key={pl._id} playlist={pl} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-12">
            No playlists found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Playlists;
