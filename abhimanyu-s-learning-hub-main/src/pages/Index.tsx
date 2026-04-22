import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Play, BookOpen, Flame, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PlaylistCard from "@/components/PlaylistCard";
import DifficultyBadge from "@/components/DifficultyBadge";
import heroBg from "@/assets/hero-bg.jpg";
import { api } from "@/lib/api";
import {
  VideoCardSkeleton,
  PlaylistCardSkeleton,
  POTDSkeleton,
} from "@/components/SkeletonLoader";

/* ---------------- helpers ---------------- */
const getLocalToday = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (LOCAL)

/* ---------------- component ---------------- */
const Index = () => {
  // Fetch Videos
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["videos", "home"],
    queryFn: () => api("/videos?limit=8"),
  });

  // Fetch Playlists
  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ["playlists", "home"],
    queryFn: () => api("/playlists?limit=3"),
  });

  // Fetch Today's POTD (Optimized endpoint)
  const { data: potd, isLoading: potdLoading } = useQuery({
    queryKey: ["potd", "today"],
    queryFn: () => api("/potd/today"),
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/85" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
              Master Tech with{" "}
              <span className="text-gradient">codestorywithMIC</span>
            </h1>

            <p className="text-lg text-white/70 mt-4 max-w-xl">
              Learn DSA, Web Dev & more. Watch videos, read notes, solve daily
              problems.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild size="lg">
                <Link to="/playlists">
                  <Play className="w-4 h-4 mr-2" /> Browse Playlists
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link to="/potd">
                  <Flame className="w-4 h-4 mr-2" /> POTD
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="container mx-auto px-4 mt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Videos", value: "120+", icon: Play },
            { label: "Playlists", value: "12", icon: BookOpen },
            { label: "Daily Problems", value: "300+", icon: Flame },
            { label: "Projects", value: "25+", icon: Code2 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 text-center shadow-sm hover:border-primary/20 transition-colors"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= POTD ================= */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2 text-foreground">
            <Flame className="w-6 h-6 text-destructive" />
            POTD
          </h2>

          <Link to="/potd" className="text-sm text-primary hover:underline">
            View Archive <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>

        {potdLoading ? (
          <POTDSkeleton />
        ) : potd ? (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <DifficultyBadge difficulty={potd.difficulty} />
              <span className="text-xs text-muted-foreground">{potd.date}</span>
            </div>

            <h3 className="text-xl font-display font-semibold text-foreground">
              {potd.title}
            </h3>

            {potd.notes && (
              <p className="text-muted-foreground mt-1 line-clamp-2">
                {potd.notes}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <Button asChild variant="outline" size="sm">
                <a
                  href={potd.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Problem
                </a>
              </Button>

              <Button asChild size="sm">
                <Link to="/potd">Watch Solution</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">
            No POTD available for today.
          </div>
        )}
      </section>

      {/* ================= PLAYLISTS ================= */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Featured Playlists
          </h2>
          <Link
            to="/playlists"
            className="text-sm text-primary hover:underline"
          >
            View All <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlistsLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => <PlaylistCardSkeleton key={i} />)
            : playlists.map((pl: any) => (
                <PlaylistCard key={pl._id} playlist={pl} />
              ))}
        </div>
      </section>

      {/* ================= VIDEOS ================= */}
      <section className="container mx-auto px-4 mt-20 pb-16">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Latest Videos
          </h2>
          <Link to="/videos" className="text-sm text-primary hover:underline">
            View All <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videosLoading
            ? Array(8)
                .fill(0)
                .map((_, i) => <VideoCardSkeleton key={i} />)
            : videos.map((v: any) => <VideoCard key={v._id} video={v} />)}
        </div>
      </section>

      {/* ================= YOUTUBE BANNER ================= */}
      <section className="container mx-auto px-4 mt-10">
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-md">
          {/* ===== Desktop Banner ===== */}
          <img
            src="/codewithMIC3.png"
            alt="codestorywithMIC YouTube Banner"
            className="hidden md:block w-full h-[260px] object-cover"
            loading="lazy"
          />

          {/* ===== Mobile Banner ===== */}
          <img
            src="/codewithMIC.png"
            alt="codestorywithMIC YouTube Banner"
            className="block md:hidden w-full h-[320px] object-cover"
            loading="lazy"
          />

          {/* ===== Overlay ===== */}
          <div className="absolute inset-0 bg-black/45 flex items-center">
            <div className="px-6 md:px-10 max-w-xl">
              <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                codestorywithMIC
              </h3>

              <p className="text-sm md:text-base text-white/80 mt-1">
                Daily DSA • Web Dev • AI • Interview Prep
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <Button asChild size="sm">
                  <a
                    href="https://www.youtube.com/@codestorywithMIC"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Subscribe
                  </a>
                </Button>

                <Button asChild variant="outline" size="sm">
                  <Link to="/videos">Watch Videos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

