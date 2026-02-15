import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, BookOpen, Flame, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PlaylistCard from "@/components/PlaylistCard";
import DifficultyBadge from "@/components/DifficultyBadge";
import heroBg from "@/assets/hero-bg.jpg";
import { api } from "@/lib/api";

/* ---------------- helpers ---------------- */
const getLocalToday = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (LOCAL)

/* ---------------- component ---------------- */
const Index = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [potd, setPotd] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [vids, pls, allPotds] = await Promise.all([
          api("/videos?limit=8"),
          api("/playlists?limit=3"),
          api("/potd"),
        ]);

        setVideos(vids || []);
        setPlaylists(pls || []);

        const today = getLocalToday();
        const todayPotd =
          allPotds.find((p: any) => p.date === today) || allPotds[0] || null;

        setPotd(todayPotd);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
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
              className="bg-card border border-border rounded-xl p-5 text-center shadow-sm"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl font-display font-bold">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>



      {/* ================= POTD ================= */}
      {potd && (
        <section className="container mx-auto px-4 mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Flame className="w-6 h-6 text-destructive" />
              {potd.date === getLocalToday() ? "Today’s POTD" : "Latest POTD"}
            </h2>

            <Link to="/potd" className="text-sm text-primary hover:underline">
              View Archive <ArrowRight className="inline w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DifficultyBadge difficulty={potd.difficulty} />
              <span className="text-xs text-muted-foreground">{potd.date}</span>
            </div>

            <h3 className="text-xl font-display font-semibold">{potd.title}</h3>

            {potd.notes && (
              <p className="text-muted-foreground mt-1">{potd.notes}</p>
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
                <Link to="/potd">Watch</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ================= PLAYLISTS ================= */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">
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
          {playlists.map((pl) => (
            <PlaylistCard key={pl._id} playlist={pl} />
          ))}
        </div>
      </section>

      {/* ================= VIDEOS ================= */}
      <section className="container mx-auto px-4 mt-20 pb-16">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Latest Videos</h2>
          <Link to="/videos" className="text-sm text-primary hover:underline">
            View All <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      </section>

       <section className="container mx-auto px-4 mt-10">
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* ===== Desktop Banner ===== */}
          <img
            src="/codewithMIC3.png"
            alt="codestorywithMIC YouTube Banner"
            className="hidden md:block w-full h-[260px] object-cover"
          />

          {/* ===== Mobile Banner ===== */}
          <img
            src="/codewithMIC.png"
            alt="codestorywithMIC YouTube Banner"
            className="block md:hidden w-full h-[320px] object-cover"
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
