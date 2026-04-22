import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Flame,
  ExternalLink,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DifficultyBadge from "@/components/DifficultyBadge";
import { api } from "@/lib/api";
import SkeletonLoader from "@/components/SkeletonLoader";

const POTD = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: potds = [], isLoading } = useQuery({
    queryKey: ["potds", "archive"],
    queryFn: () => api("/potd"),
  });

  /* ================= DATE LOGIC (LOCAL TIME) ================= */
  const todayDate = new Date().toLocaleDateString("en-CA");

  const todayPotds = potds.filter((p: any) => p.date === todayDate);
  const previousPotds = potds.filter((p: any) => p.date !== todayDate);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-10 w-48 bg-secondary rounded-lg mb-4 animate-pulse" />
          <div className="h-6 w-72 bg-secondary/50 rounded-lg mb-10 animate-pulse" />
          <SkeletonLoader type="potd" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
            <Flame className="w-8 h-8 text-destructive animate-pulse" />
            Problem of the Day
          </h1>
          <p className="text-muted-foreground">
            Daily coding challenges to sharpen your technical skills.
          </p>
        </div>

        {/* ================= TODAY POTDs ================= */}
        {todayPotds.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Today’s Challenges
            </h2>

            <div className="space-y-6">
              {todayPotds.map((p: any) => (
                <div
                  key={p._id}
                  className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-xl hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <DifficultyBadge difficulty={p.difficulty} />
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                      Daily Match
                    </span>
                  </div>

                  <h3 className="text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>

                  {p.notes && (
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {p.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-2">
                    {p.problemUrl && (
                      <Button asChild variant="outline" className="rounded-xl px-6">
                        <a
                          href={p.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Problem
                        </a>
                      </Button>
                    )}

                    {p.videoId && (
                      <Button asChild className="rounded-xl px-6 bg-primary shadow-lg shadow-primary/20">
                        <Link to={`/video/${p.videoId._id}`}>
                          <Play className="w-4 h-4 mr-2 fill-current" />
                          Watch Video Solution
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PREVIOUS POTDs ================= */}
        <h2 className="text-xl font-display font-bold mb-6 text-muted-foreground">
          📚 Previous Archive
        </h2>

        {previousPotds.length > 0 ? (
          <div className="grid gap-3">
            {previousPotds.map((p: any) => (
              <div
                key={p._id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === p._id ? null : p._id)
                  }
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <DifficultyBadge difficulty={p.difficulty} />
                    <span className="font-display font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-2 py-1 rounded">
                      {p.date}
                    </span>
                  </div>

                  {expandedId === p._id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {expandedId === p._id && (
                  <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-border mb-4" />
                    {p.notes && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/50">
                        {p.notes}
                      </p>
                    )}

                    <div className="flex gap-3">
                      {p.problemUrl && (
                        <Button asChild variant="ghost" size="sm" className="h-9 hover:bg-primary/10">
                          <a
                            href={p.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Problem
                          </a>
                        </Button>
                      )}

                      {p.videoId && (
                        <Button asChild size="sm" className="h-9">
                          <Link to={`/video/${p.videoId._id}`}>
                            <Play className="w-4 h-4 mr-2" />
                            Solution
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No previous problems in the archive yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default POTD;

