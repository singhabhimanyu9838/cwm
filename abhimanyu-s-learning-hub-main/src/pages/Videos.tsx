import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";

const Videos = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vids = await api("/videos");

        // 👉 OPTIONAL: show ONLY standalone videos
        // const standalone = vids.filter((v: any) => !v.playlist);
        // setVideos(standalone);

        setVideos(vids);

        const uniqueCats = Array.from(
          new Set(
            vids
              .map((v: any) => v.category)
              .filter(Boolean)
          )
        );
        setCategories(uniqueCats);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = videos.filter((v) => {
    const matchSearch =
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase());

    const matchCat =
      activeCategory === "All" || v.category === activeCategory;

    return matchSearch && matchCat;
  });

  /* ---------------- loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading videos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          All Videos
        </h1>
        <p className="text-muted-foreground mb-8">
          Browse all tutorials, courses, and project walkthroughs.
        </p>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search videos..."
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

        {/* Videos Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-12">
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Videos;
