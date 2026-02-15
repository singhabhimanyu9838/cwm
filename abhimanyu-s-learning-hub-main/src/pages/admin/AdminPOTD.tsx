import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Flame, Edit, Trash2 } from "lucide-react";

/* ================= HELPERS ================= */
const getTodayLocalDate = () =>
  new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (LOCAL)

/* ================= INITIAL STATE ================= */
const emptyPOTD = {
  title: "",
  difficulty: "Easy",
  notes: "",
  codeSolution: "",
  problemUrl: "",
  date: getTodayLocalDate(),
  videoId: "",
};

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

/* ================= COMPONENT ================= */
const AdminPOTD = () => {
  const [potds, setPotds] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyPOTD);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const [potdData, videoData] = await Promise.all([
        api("/potd"),
        api("/videos"),
      ]);
      setPotds(potdData || []);
      setVideos(videoData || []);
    } catch (err) {
      console.error("Failed to load POTD data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!form.title || !form.problemUrl || !form.date) {
      alert("Title, Date and Problem URL are required");
      return;
    }

    const payload = {
      title: form.title.trim(),
      difficulty: form.difficulty,
      notes: form.notes,
      codeSolution: form.codeSolution,
      problemUrl: form.problemUrl.trim(),
      date: form.date, // MANUAL DATE
      videoId: form.videoId || null,
    };

    try {
      setLoading(true);

      if (editingId) {
        await api(`/potd/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/potd", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm(emptyPOTD);
      setEditingId(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to save POTD");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const editPOTD = (p: any) => {
    setForm({
      title: p.title,
      difficulty: p.difficulty,
      notes: p.notes || "",
      codeSolution: p.codeSolution || "",
      problemUrl: p.problemUrl,
      date: p.date,
      videoId: p.videoId?._id || p.videoId || "",
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const deletePOTD = async (id: string) => {
    if (!confirm("Delete this POTD?")) return;

    try {
      await api(`/potd/${id}`, { method: "DELETE" });
      loadData();
    } catch {
      alert("Failed to delete POTD");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-destructive" />
        <h2 className="text-2xl font-display font-bold">
          Manage Problem of the Day
        </h2>
      </div>

      {/* FORM */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="font-display font-semibold">
          {editingId ? "✏️ Edit POTD" : "➕ Add New POTD"}
        </h3>

        <input
          placeholder="Problem Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={inputClass}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className={inputClass}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select
            value={form.videoId}
            onChange={(e) => setForm({ ...form, videoId: e.target.value })}
            className={inputClass}
          >
            <option value="">No Video Solution</option>
            {videos.map((v) => (
              <option key={v._id} value={v._id}>
                {v.title}
              </option>
            ))}
          </select>
        </div>

        <textarea
          rows={3}
          placeholder="Explanation / Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className={`${inputClass} resize-none`}
        />

        <textarea
          rows={4}
          placeholder="Code Solution"
          value={form.codeSolution}
          onChange={(e) => setForm({ ...form, codeSolution: e.target.value })}
          className={`${inputClass} font-mono`}
        />

        <input
          placeholder="Problem URL (LeetCode / GFG / Codeforces)"
          value={form.problemUrl}
          onChange={(e) => setForm({ ...form, problemUrl: e.target.value })}
          className={inputClass}
        />

        <Button className="w-full" onClick={submit} disabled={loading}>
          {loading
            ? "Saving..."
            : editingId
            ? "Update POTD"
            : "Add POTD"}
        </Button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold">📚 POTD Archive</h3>

        {potds.map((p) => (
          <div
            key={p._id}
            className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-primary/40"
          >
            <div>
              <p className="font-display font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.date} • {p.difficulty}
              </p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => editPOTD(p)}>
                <Edit className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deletePOTD(p._id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}

        {potds.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No POTD added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPOTD;
