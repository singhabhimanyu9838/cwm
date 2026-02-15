import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const POTD = () => {
  const [potds, setPotds] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/potd")
      .then((data) => {
        setPotds(data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading problems...
        </p>
      </div>
    );
  }

  /* ================= DATE LOGIC ================= */
 /* ================= DATE LOGIC (LOCAL TIME) ================= */
const todayDate = new Date().toLocaleDateString("en-CA");

const todayPotds = potds.filter((p) => p.date === todayDate);
const previousPotds = potds.filter((p) => p.date !== todayDate);


  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* HEADER */}
        <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
          <Flame className="w-7 h-7 text-destructive" />
          Problem of the Day
        </h1>
        <p className="text-muted-foreground mb-8">
          Daily coding challenges to sharpen your skills.
        </p>

        {/* ================= TODAY POTDs ================= */}
        {todayPotds.length > 0 && (
          <>
            <h2 className="text-xl font-display font-bold mb-4">
              🔥 Today’s Problems
            </h2>

            <div className="space-y-6 mb-10">
              {todayPotds.map((p) => (
                <div
                  key={p._id}
                  className="bg-card border-2 border-primary/40 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DifficultyBadge difficulty={p.difficulty} />
                    <span className="text-xs text-primary font-semibold">
                      TODAY
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">{p.title}</h3>

                  {p.notes && (
                    <p className="text-muted-foreground mt-3">{p.notes}</p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-5">
                    {p.problemUrl && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={p.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Problem
                        </a>
                      </Button>
                    )}

                    {p.videoId && (
                      <Button asChild size="sm">
                        <Link to={`/video/${p.videoId._id}`}>
                          <Play className="w-4 h-4 mr-1" />
                          Watch Solution
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= PREVIOUS POTDs ================= */}
        <h2 className="text-xl font-display font-bold mb-4">
          📚 Previous Problems
        </h2>

        <div className="space-y-3">
          {previousPotds.map((p) => (
            <div
              key={p._id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === p._id ? null : p._id)
                }
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <DifficultyBadge difficulty={p.difficulty} />
                  <span className="font-display font-semibold">{p.title}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {p.date}
                  </span>
                </div>

                {expandedId === p._id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedId === p._id && (
                <div className="px-4 pb-4">
                  {p.notes && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {p.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {p.problemUrl && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={p.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Problem
                        </a>
                      </Button>
                    )}

                    {p.videoId && (
                      <Button asChild size="sm">
                        <Link to={`/video/${p.videoId._id}`}>
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {previousPotds.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No previous problems yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default POTD;
