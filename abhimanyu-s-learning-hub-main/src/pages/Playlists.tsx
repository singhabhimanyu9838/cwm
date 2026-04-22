import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Library } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard";
import { api } from "@/lib/api";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";

const Playlists = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ["playlists", "public-list"],
    queryFn: () => api("/playlists"),
  });

  const categories = useMemo(() => {
    const cats = new Set(playlists.map((pl: any) => pl.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [playlists]);

  const filtered = useMemo(() => {
    return playlists.filter((pl: any) => {
      const title = pl.title?.toLowerCase() || "";
      const matchSearch = title.includes(search.toLowerCase());

      const matchCat =
        activeCategory === "All" || pl.category === activeCategory;

      return matchSearch && matchCat;
    });
  }, [playlists, search, activeCategory]);

  return (
    <div className="min-h-screen pt-24 pb-10 animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
            <Library className="w-8 h-8 text-primary" />
            Learning Paths
          </h1>
          <p className="text-muted-foreground">
            Structured collections of videos to help you master specific domains.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search playlists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
             <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1 hidden lg:block">
              Course Type:
            </span>
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-display font-medium transition-all ${
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

        {/* Playlist Grid */}
        {isLoading ? (
          <SkeletonLoader type="playlist" />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pl: any) => (
              <PlaylistCard key={pl._id} playlist={pl} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/10 rounded-2xl border border-dashed border-border mt-10">
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Library className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg mb-2 font-display font-semibold">No playlists found</p>
            <p className="text-sm text-muted-foreground/60">Try searching for a different topic or clearing filters</p>
            <Button 
              variant="outline" 
              onClick={() => {setSearch(""); setActiveCategory("All");}}
              className="mt-6 rounded-xl"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlists;

