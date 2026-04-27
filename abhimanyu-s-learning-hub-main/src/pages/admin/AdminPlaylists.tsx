import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ListVideo, Plus, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const emptyPlaylist = {
  title: "",
  description: "",
  category: "",
  thumbnail: "",
  date: new Date().toISOString().split('T')[0],
};

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

const AdminPlaylists = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(emptyPlaylist);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      setForm({ ...form, thumbnail: data.url });
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- fetch ---------------- */
  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ["playlists", "admin"],
    queryFn: () => api("/playlists"),
  });

  /* ---------------- mutations ---------------- */
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        return api(`/playlists/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        return api("/playlists", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success(editingId ? "Playlist updated" : "Playlist created");
      setForm(emptyPlaylist);
      setEditingId(null);
    },
    onError: () => toast.error("Failed to save playlist"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/playlists/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast.success("Playlist deleted");
    },
    onError: () => toast.error("Failed to delete playlist"),
  });

  /* ---------------- handlers ---------------- */
  const handleSubmit = () => {
    if (!form.title) {
      toast.error("Playlist title is required");
      return;
    }
    saveMutation.mutate(form);
  };

  const editPlaylist = (pl: any) => {
    setForm({
      title: pl.title,
      description: pl.description || "",
      category: pl.category || "",
      thumbnail: pl.thumbnail || "",
      date: pl.date ? new Date(pl.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setEditingId(pl._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* ---------- FORM ---------- */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5 max-w-xl shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          {editingId ? (
            <Pencil className="w-4 h-4 text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-primary" />
          )}
          <h2 className="text-xl font-display font-bold">
            {editingId ? "Edit Playlist" : "Create Playlist"}
          </h2>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
            Title
          </label>
          <input
            placeholder="e.g. Master React in 30 Days"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
            Description
          </label>
          <textarea
            placeholder="What is this playlist about?"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
              Category
            </label>
            <input
              placeholder="DSA / Web / AI"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">
              Playlist Date
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
            Playlist Thumbnail
          </label>
          
          <div className="flex flex-col gap-3">
            {/* Preview & Link Input */}
            <div className="flex gap-4 items-start">
              <div className="w-24 aspect-video bg-secondary rounded-lg border border-border overflow-hidden flex items-center justify-center shrink-0">
                {form.thumbnail ? (
                  <img src={form.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <input
                  placeholder="Paste image URL here..."
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  className={inputClass}
                />
                <p className="text-[9px] text-muted-foreground">
                  Paste a URL or upload an image below
                </p>
              </div>
            </div>

            {/* Upload Button */}
            <label className="relative flex items-center justify-center gap-2 w-full h-10 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {uploading ? "Uploading..." : "Upload from Computer"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending
              ? "Saving..."
              : editingId
              ? "Update Playlist"
              : "Create Playlist"}
          </Button>

          {editingId && (
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyPlaylist);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* ---------- LIST ---------- */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          Collections
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {playlists.length}
          </span>
        </h2>

        {playlistsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-secondary/50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {playlists.map((pl: any) => (
              <div
                key={pl._id}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ListVideo className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">
                      {pl.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                      {pl.category || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editPlaylist(pl)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (
                        confirm(
                          "Delete this playlist? Videos will remain standalone."
                        )
                      )
                        deleteMutation.mutate(pl._id);
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

        {!playlistsLoading && playlists.length === 0 && (
          <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
            No playlists created yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlaylists;

