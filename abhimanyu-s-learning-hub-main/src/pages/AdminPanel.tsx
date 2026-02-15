import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import AdminVideos from "./admin/AdminVideos";
import AdminPlaylists from "./admin/AdminPlaylists";
import AdminPOTD from "./admin/AdminPOTD";

import {
  LayoutDashboard,
  Video,
  ListVideo,
  Flame,
  MessageSquare,
  Users,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

/* ---------------- tabs ---------------- */
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "videos", label: "Videos", icon: Video },
  { id: "playlists", label: "Playlists", icon: ListVideo },
  { id: "potd", label: "POTD", icon: Flame },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
];

/* ---------------- main ---------------- */
const AdminPanel = () => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your content and view analytics
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="border-border text-foreground hover:bg-secondary font-display"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "videos" && <AdminVideos />}
        {activeTab === "playlists" && <AdminPlaylists />}
        {activeTab === "potd" && <AdminPOTD />}
        {activeTab === "feedback" && <FeedbackTab />}
      </div>
    </div>
  );
};

/* ---------------- dashboard ---------------- */
const DashboardTab = () => {
  const [stats, setStats] = useState({
    videos: 0,
    playlists: 0,
    potd: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/admin/stats")
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Videos", value: stats.videos, icon: Video },
    { label: "Playlists", value: stats.playlists, icon: ListVideo },
    { label: "POTDs", value: stats.potd, icon: Flame },
    { label: "Users", value: stats.users, icon: Users },
  ];

  if (loading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors"
          >
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-foreground">
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card border border-border rounded-xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-3">
          Quick Info
        </h3>
        <p className="text-sm text-muted-foreground">
          All content is stored in MongoDB. Any changes made in the admin
          panel reflect instantly on the website.
        </p>
      </div>
    </div>
  );
};

/* ---------------- feedback ---------------- */
const FeedbackTab = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/feedback")
      .then((data) => setMessages(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading feedback...</p>;
  }

  return (
    <div>
      <h3 className="font-display font-semibold text-foreground mb-4">
        Feedback Messages ({messages.length})
      </h3>

      {messages.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No feedback received yet.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-medium text-foreground text-sm">
                  {msg.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {msg.email}
              </p>
              <p className="text-sm text-foreground">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
