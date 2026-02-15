import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ListVideo } from "lucide-react";

const emptyPlaylist = {
  title: "",
  description: "",
  category: "",
};

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

const AdminPlaylists = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyPlaylist);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------- LOAD ---------------- */
  const loadPlaylists = async () => {
    const data = await api("/playlists");
    setPlaylists(data);
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    if (!form.title) return;

    if (editingId) {
      await api(`/playlists/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await api("/playlists", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setForm(emptyPlaylist);
    setEditingId(null);
    loadPlaylists();
  };

  /* ---------------- EDIT ---------------- */
  const editPlaylist = (pl: any) => {
    setForm({
      title: pl.title,
      description: pl.description || "",
      category: pl.category || "",
    });
    setEditingId(pl._id);
  };

  /* ---------------- DELETE ---------------- */
  const deletePlaylist = async (id: string) => {
    if (!confirm("Delete this playlist? Videos will remain standalone.")) return;
    await api(`/playlists/${id}`, { method: "DELETE" });
    loadPlaylists();
  };

  return (
    <div className="space-y-10">
      {/* ---------- FORM ---------- */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-xl">
        <h2 className="text-xl font-bold">
          {editingId ? "✏️ Edit Playlist" : "➕ Create Playlist"}
        </h2>

        <input
          placeholder="Playlist Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
        />

        <textarea
          placeholder="Playlist Description"
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

        <Button className="w-full" onClick={submit}>
          {editingId ? "Update Playlist" : "Create Playlist"}
        </Button>
      </div>

      {/* ---------- LIST ---------- */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">📚 All Playlists</h2>

        {playlists.length === 0 && (
          <p className="text-muted-foreground">No playlists created yet.</p>
        )}

        {playlists.map((pl) => (
          <div
            key={pl._id}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4"
          >
            {/* LEFT */}
            <div>
              <p className="font-medium">{pl.title}</p>
              <p className="text-xs text-muted-foreground">
                {pl.category || "Uncategorized"}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => editPlaylist(pl)}
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deletePlaylist(pl._id)}
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

export default AdminPlaylists;
