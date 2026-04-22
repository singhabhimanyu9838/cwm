import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Trophy } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";
import SkeletonLoader from "@/components/SkeletonLoader";

const Videos = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos", "library"],
    queryFn: () => api("/videos"),
  });

  const categories = useMemo(() => {
    const cats = new Set(videos.map((v: any) => v.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [videos]);

  const filtered = useMemo(() => {
    return videos.filter((v: any) => {
      const matchSearch =
        v.title?.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase());

      const matchCat =
        activeCategory === "All" || v.category === activeCategory;

      return matchSearch && matchCat;
    });
  }, [videos, search, activeCategory]);

  return (
    <div className="min-h-screen pt-24 pb-10 animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Video Library
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of high-quality tutorials and project walkthroughs.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1 hidden lg:block">
              Filter:
            </span>
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <SkeletonLoader type="video" />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((v: any) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/10 rounded-2xl border border-dashed border-border mt-10">
            <p className="text-muted-foreground text-lg mb-2">No videos found matching your search</p>
            <p className="text-sm text-muted-foreground/60">Try different keywords or category filters</p>
            <Button 
              variant="link" 
              onClick={() => {setSearch(""); setActiveCategory("All");}}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;

