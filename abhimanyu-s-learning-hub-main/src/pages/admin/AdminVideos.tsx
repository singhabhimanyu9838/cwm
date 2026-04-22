import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Play, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const emptyVideo = {
  title: "",
  youtubeId: "",
  description: "",
  category: "",
  notesUrl: "",
  codeUrl: "",
  playlist: null,
};

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

const AdminVideos = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(emptyVideo);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      category: v.category || "",
      notesUrl: v.notesUrl || "",
      codeUrl: v.codeUrl || "",
      playlist: v.playlist?._id || v.playlist || null,
    });
    setEditingId(v._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              YouTube ID
            </label>
            <input
              placeholder="e.g. lAraRRlMZEU"
              value={form.youtubeId}
              onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
              className={inputClass}
            />
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
                Category
              </label>
              <input
                placeholder="DSA / Web"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
                Playlist
              </label>
              <select
                value={form.playlist || ""}
                onChange={(e) =>
                  setForm({ ...form, playlist: e.target.value || null })
                }
                className={inputClass}
              >
                <option value="">Standalone</option>
                {playlists.map((pl: any) => (
                  <option key={pl._id} value={pl._id}>
                    {pl.title}
                  </option>
                ))}
              </select>
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
                      {v.playlist ? "Playlist" : "Standalone"} • {v.category}
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

