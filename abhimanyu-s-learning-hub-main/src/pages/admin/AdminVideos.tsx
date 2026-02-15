import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Play, Pencil, Trash2 } from "lucide-react";

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
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

const AdminVideos = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyVideo);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------- load ---------------- */
  const loadData = async () => {
    const vids = await api("/videos");
    const pls = await api("/playlists");
    setVideos(vids);
    setPlaylists(pls);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- submit ---------------- */
  const submit = async () => {
    if (!form.title || !form.youtubeId) return;

    if (editingId) {
      await api(`/videos/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await api("/videos", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setForm(emptyVideo);
    setEditingId(null);
    loadData();
  };

  /* ---------------- edit ---------------- */
  const editVideo = (v: any) => {
    setForm({
      title: v.title,
      youtubeId: v.youtubeId,
      description: v.description || "",
      category: v.category || "",
      notesUrl: v.notesUrl || "",
      codeUrl: v.codeUrl || "",
      playlist: v.playlist || null,
    });
    setEditingId(v._id);
  };

  /* ---------------- delete ---------------- */
  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await api(`/videos/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="space-y-10">
      {/* ---------------- FORM ---------------- */}
      <div className="bg-card border border-border rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {editingId ? "✏️ Edit Video" : "➕ Add Video"}
          </h2>

          <input
            placeholder="Video Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />

          <input
            placeholder="YouTube Video ID (e.g. lAraRRlMZEU)"
            value={form.youtubeId}
            onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
            className={inputClass}
          />

          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className={inputClass + " resize-none"}
          />

          <input
            placeholder="Category (DSA / Web / AI)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          />

          <input
            placeholder="Notes URL"
            value={form.notesUrl}
            onChange={(e) => setForm({ ...form, notesUrl: e.target.value })}
            className={inputClass}
          />

          <input
            placeholder="Code URL (GitHub)"
            value={form.codeUrl}
            onChange={(e) => setForm({ ...form, codeUrl: e.target.value })}
            className={inputClass}
          />

          <select
            value={form.playlist || ""}
            onChange={(e) =>
              setForm({ ...form, playlist: e.target.value || null })
            }
            className={inputClass}
          >
            <option value="">Standalone Video</option>
            {playlists.map((pl) => (
              <option key={pl._id} value={pl._id}>
                {pl.title}
              </option>
            ))}
          </select>

          <Button className="w-full" onClick={submit}>
            {editingId ? "Update Video" : "Add Video"}
          </Button>
        </div>

        {/* RIGHT – PREVIEW */}
        <div className="bg-background border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Play className="w-4 h-4 text-primary" /> Preview
          </h3>

          {form.youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${form.youtubeId}`}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-muted-foreground border rounded-lg">
              Enter YouTube ID
            </div>
          )}
        </div>
      </div>

      {/* ---------------- LIST ---------------- */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">📚 All Videos</h2>

        {videos.length === 0 && (
          <p className="text-muted-foreground">No videos added yet.</p>
        )}

        {videos.map((v) => (
          <div
            key={v._id}
            className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4"
          >
            {/* LEFT */}
            <div className="min-w-0">
              <p className="font-medium truncate">{v.title}</p>
              <p className="text-xs text-muted-foreground">
                {v.playlist ? "Playlist Video" : "Standalone"} • {v.category}
              </p>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => editVideo(v)}>
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteVideo(v._id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminVideos;
