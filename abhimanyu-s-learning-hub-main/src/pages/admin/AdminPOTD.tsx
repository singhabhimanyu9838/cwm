import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Flame, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

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
  "w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

/* ================= COMPONENT ================= */
const AdminPOTD = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<any>(emptyPOTD);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ================= FETCH DATA ================= */
  const { data: potds = [], isLoading: potdsLoading } = useQuery({
    queryKey: ["potd", "admin"],
    queryFn: () => api("/potd"),
  });

  const { data: videos = [] } = useQuery({
    queryKey: ["videos", "admin-options"],
    queryFn: () => api("/videos"),
  });

  /* ================= MUTATIONS ================= */
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        return api(`/potd/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        return api("/potd", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potd"] });
      toast.success(editingId ? "POTD updated" : "POTD added");
      setForm(emptyPOTD);
      setEditingId(null);
    },
    onError: () => toast.error("Failed to save POTD"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/potd/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["potd"] });
      toast.success("POTD deleted");
    },
    onError: () => toast.error("Failed to delete POTD"),
  });

  /* ================= HANDLERS ================= */
  const handleSubmit = () => {
    if (!form.title || !form.problemUrl || !form.date) {
      toast.error("Title, Date and Problem URL are required");
      return;
    }

    saveMutation.mutate({
      ...form,
      title: form.title.trim(),
      problemUrl: form.problemUrl.trim(),
      videoId: form.videoId || null,
    });
  };

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

  /* ================= UI ================= */
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-destructive" />
          <h2 className="text-2xl font-display font-bold">Manage POTD</h2>
        </div>
        {editingId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingId(null);
              setForm(emptyPOTD);
            }}
          >
            Cancel Edit
          </Button>
        )}
      </div>

      {/* FORM */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 mb-2">
          {editingId ? (
            <Edit className="w-4 h-4 text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-primary" />
          )}
          <h3 className="font-display font-semibold">
            {editingId ? "Edit Problem" : "Add New Problem"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">
              Title
            </label>
            <input
              placeholder="e.g. Two Sum"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className={inputClass}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">
              Video Solution
            </label>
            <select
              value={form.videoId}
              onChange={(e) => setForm({ ...form, videoId: e.target.value })}
              className={inputClass}
            >
              <option value="">No Video Solution</option>
              {videos.map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">
            Notes / Explanation
          </label>
          <textarea
            rows={3}
            placeholder="Brief explanation of the logic..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">
            Code Solution
          </label>
          <textarea
            rows={4}
            placeholder="Clean code..."
            value={form.codeSolution}
            onChange={(e) => setForm({ ...form, codeSolution: e.target.value })}
            className={`${inputClass} font-mono`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground ml-1">
            Problem URL
          </label>
          <input
            placeholder="Link to LeetCode, GFG, etc."
            value={form.problemUrl}
            onChange={(e) => setForm({ ...form, problemUrl: e.target.value })}
            className={inputClass}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending
            ? "Saving..."
            : editingId
            ? "Update POTD"
            : "Add POTD"}
        </Button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          Archive
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {potds.length}
          </span>
        </h3>

        {potdsLoading ? (
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
            {potds.map((p: any) => (
              <div
                key={p._id}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group"
              >
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {p.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.date} • {p.difficulty}
                  </p>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editPOTD(p)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this POTD?"))
                        deleteMutation.mutate(p._id);
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

        {!potdsLoading && potds.length === 0 && (
          <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
            No POTD added yet. Start by adding one above.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPOTD;

