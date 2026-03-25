import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

type FilterMode = "unread" | "all" | "archived";

const NotificationsPage = () => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterMode>("unread");
  const [archivedIds, setArchivedIds] = useState<string[]>([]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "#00E676";
      case "urgent":
        return "#FF4444";
      case "offer":
        return "#FFB74D";
      default:
        return "#64B5F6";
    }
  };

  const filtered = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read && !archivedIds.includes(n.id));
    }
    if (filter === "archived") {
      return notifications.filter((n) => archivedIds.includes(n.id));
    }
    return notifications.filter((n) => !archivedIds.includes(n.id));
  }, [notifications, archivedIds, filter]);

  const archiveNotification = (id: string) => {
    if (!archivedIds.includes(id)) {
      setArchivedIds((prev) => [...prev, id]);
    }
  };

  return (
    <main className="min-h-screen w-full pt-20 pb-8 px-4" style={{ background: "#0f0f0f" }}>
      <section className="max-w-[980px] mx-auto">
        <header className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ border: "1px solid #333333", color: "#FFFFFF", background: "#1a1a1a" }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-[32px] leading-tight font-bold" style={{ color: "#FFFFFF" }}>
                Alerts & Notifications
              </h1>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              style={{ border: "1px solid #333333", color: "#B0B0B0", background: "#1a1a1a" }}
            >
              Clear All
            </button>
          )}
        </header>

        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {[
            { key: "unread", label: "Unread" },
            { key: "all", label: "All" },
            { key: "archived", label: "Archived" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as FilterMode)}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all"
              style={{
                border: "1px solid #333333",
                background: filter === item.key ? "#FFC107" : "#1a1a1a",
                color: filter === item.key ? "#1a1a1a" : "#FFFFFF",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="pt-14">
            <EmptyState
              title="No alerts in this view"
              subtitle="Switch filters or wait for the next update from bookings and services."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const accent = getTypeColor(n.type);

              return (
                <article
                  key={n.id}
                  className="rounded-xl p-4"
                  style={{
                    border: "1px solid #333333",
                    borderLeft: `4px solid ${accent}`,
                    background: "#1a1a1a",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-base font-semibold" style={{ color: "#FFFFFF" }}>
                      {n.title}
                    </h3>
                    <span className="text-xs" style={{ color: "#808080" }}>
                      {n.time}
                    </span>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "#B0B0B0" }}>
                    {n.message}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (!n.read) markNotificationRead(n.id);
                        if (n.action) navigate(n.action);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: "linear-gradient(135deg, #FFC107 0%, #FFB300 100%)",
                        color: "#1a1a1a",
                      }}
                    >
                      {n.actionLabel || "View"}
                    </button>

                    <button
                      onClick={() => archiveNotification(n.id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      style={{
                        background: "transparent",
                        border: "1px solid #333333",
                        color: "#B0B0B0",
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default NotificationsPage;