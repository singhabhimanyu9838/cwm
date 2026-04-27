import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Play, Pencil, Trash2, Plus, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["DSA", "Web Development", "AI & GenAI", "Interview Prep", "Programming Languages", "DevOps", "System Design", "Projects"];

const emptyVideo = {
  title: "",
  youtubeId: "",
  description: "",
  category: "DSA",
  notesUrl: "",
  codeUrl: "",
  playlists: [],
  date: new Date().toISOString().split('T')[0],
};

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

const AdminVideos = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(emptyVideo);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const extractVideoId = (input: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[7].length === 11) ? match[7] : input;
  };

  const generateDescriptionFromTitle = (title: string) => {
    if (!title) return "";
    
    // Dynamic templates based on keywords
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("dsa") || lowerTitle.includes("algorithm") || lowerTitle.includes("leet") || lowerTitle.includes("gfg")) {
      return `Master Data Structures and Algorithms with this detailed session on ${title}. We'll break down the logic, complexity analysis, and step-by-step implementation to help you ace your interviews.`;
    }
    
    if (lowerTitle.includes("react") || lowerTitle.includes("next") || lowerTitle.includes("web") || lowerTitle.includes("js")) {
      return `Upgrade your web development skills with this hands-on tutorial on ${title}. We'll explore modern best practices, code structure, and real-world application building.`;
    }

    if (lowerTitle.includes("interview") || lowerTitle.includes("placement") || lowerTitle.includes("career")) {
      return `Prepare for your dream tech job with this deep dive into ${title}. We cover the most frequently asked questions and essential concepts to boost your confidence.`;
    }

    // Default professional template
    return `In this video, we explore ${title} in detail. We'll cover the core fundamentals, practical examples, and everything you need to master this topic with codewithMIC.`;
  };

  const fetchYoutubeMetadata = async () => {
    const videoId = extractVideoId(form.youtubeId);
    if (!videoId) {
      toast.error("Please enter a valid YouTube ID or URL");
      return;
    }

    setFetchingMetadata(true);
    try {
      const data = await api(`/youtube/metadata/${videoId}`);
      const fetchedTitle = data.title || form.title;
      setForm({
        ...form,
        youtubeId: videoId,
        title: fetchedTitle,
        description: generateDescriptionFromTitle(fetchedTitle),
        playlists: form.playlists, // keep existing playlists if any
      });
      toast.success("Video data fetched!");
    } catch (err) {
      toast.error("Could not fetch video data. Check the ID/URL.");
    } finally {
      setFetchingMetadata(false);
    }
  };

  /* ---------------- fetch ---------------- */
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["videos", "admin"],
    queryFn: () => api("/videos"),
  });

  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists", "admin-options"],
    queryFn: () => api("/playlists"),
  });

  /* ---------------- mutations ---------------- */
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        return api(`/videos/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        return api("/videos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(editingId ? "Video updated" : "Video added");
      setForm(emptyVideo);
      setEditingId(null);
    },
    onError: () => toast.error("Failed to save video"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/videos/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video deleted");
    },
    onError: () => toast.error("Failed to delete video"),
  });

  /* ---------------- handlers ---------------- */
  const handleSubmit = () => {
    if (!form.title || !form.youtubeId) {
      toast.error("Title and YouTube ID are required");
      return;
    }
    saveMutation.mutate(form);
  };

  const editVideo = (v: any) => {
    setForm({
      title: v.title,
      youtubeId: v.youtubeId,
      description: v.description || "",
      category: v.category || "DSA",
      notesUrl: v.notesUrl || "",
      codeUrl: v.codeUrl || "",
      playlists: v.playlists || (v.playlist ? [v.playlist._id || v.playlist] : []),
      date: v.date ? new Date(v.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setEditingId(v._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePlaylist = (id: string) => {
    const current = [...(form.playlists || [])];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setForm({ ...form, playlists: current });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* ---------------- FORM ---------------- */}
      <div className="bg-card border border-border rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-sm">
        {/* LEFT */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            {editingId ? (
              <Pencil className="w-4 h-4 text-primary" />
            ) : (
              <Plus className="w-4 h-4 text-primary" />
            )}
            <h2 className="text-xl font-display font-bold">
              {editingId ? "Edit Video" : "Add New Video"}
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
              Title
            </label>
            <input
              placeholder="e.g. Intro to React"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
              YouTube ID / Link
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Paste URL or ID"
                value={form.youtubeId}
                onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
                className={inputClass}
              />
              <Button 
                type="button"
                variant="secondary" 
                size="sm"
                onClick={fetchYoutubeMetadata}
                disabled={fetchingMetadata || !form.youtubeId}
                className="shrink-0"
              >
                {fetchingMetadata ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-1" />
                )}
                {fetchingMetadata ? "..." : "Fetch"}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
              Description
            </label>
            <textarea
              placeholder="Brief summary..."
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
                Video Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
              Add to Playlists (Select multiple)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto p-2 border border-border rounded-lg bg-secondary/20">
              {playlists.map((pl: any) => (
                <label 
                  key={pl._id} 
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    form.playlists?.includes(pl._id) 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-secondary border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={form.playlists?.includes(pl._id)}
                    onChange={() => togglePlaylist(pl._id)}
                  />
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    form.playlists?.includes(pl._id) ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {form.playlists?.includes(pl._id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-xs font-medium truncate">{pl.title}</span>
                </label>
              ))}
              {playlists.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic col-span-2 text-center py-2">
                  No playlists found. Create one first!
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
                Notes Link
              </label>
              <input
                placeholder="URL"
                value={form.notesUrl}
                onChange={(e) => setForm({ ...form, notesUrl: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
                Code Link
              </label>
              <input
                placeholder="GitHub URL"
                value={form.codeUrl}
                onChange={(e) => setForm({ ...form, codeUrl: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending
              ? "Saving..."
              : editingId
              ? "Update Video"
              : "Add Video"}
          </Button>

          {editingId && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEditingId(null);
                setForm(emptyVideo);
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {/* RIGHT – PREVIEW */}
        <div className="bg-secondary/40 border border-border rounded-xl p-4 flex flex-col">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2 text-sm">
            <Play className="w-4 h-4 text-primary" /> Preview
          </h3>

          <div className="flex-1 flex flex-col justify-center">
            {form.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${form.youtubeId}`}
                className="w-full aspect-video rounded-lg shadow-lg"
                allowFullScreen
              />
            ) : (
              <div className="aspect-video flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg bg-background/50 text-xs">
                Enter YouTube ID to see preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- LIST ---------------- */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          Content Library
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {videos.length}
          </span>
        </h2>

        {videosLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-secondary/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {videos.map((v: any) => (
              <div
                key={v._id}
                className="flex items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group"
              >
                {/* LEFT */}
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-12 h-8 bg-secondary rounded overflow-hidden flex-shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold truncate text-sm">
                      {v.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                      {v.playlists?.length > 0 
                        ? `${v.playlists.length} Playlists` 
                        : v.playlist ? "1 Playlist" : "Standalone"} • {v.category}
                    </p>
                  </div>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editVideo(v)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this video?"))
                        deleteMutation.mutate(v._id);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!videosLoading && videos.length === 0 && (
          <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
            No videos in the library yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideos;

