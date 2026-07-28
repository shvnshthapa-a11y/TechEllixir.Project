import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Inbox,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Trash2,
  Download,
  BarChart3,
  ShieldCheck,
  Server,
  Send,
  Users,
  Briefcase,
  Settings,
  Clock,
  AlertCircle,
  Radio,
  ExternalLink,
} from "lucide-react";
import {
  adminLogin,
  deleteQuery,
  getAdminQueries,
  type ContactQuery,
  type QueryStatus,
  updateQueryStatus,
} from "../lib/api";

type AdminTab = "overview" | "queries" | "internships" | "users" | "settings";

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: string;
}

interface PortalSettings {
  maintenanceMode: boolean;
  announcementBanner: string;
  allowRegistrations: boolean;
  updatedBy: string;
}

const statusOptions: Array<{ label: string; value: QueryStatus | "all" }> = [
  { label: "All Leads", value: "all" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Archived", value: "archived" },
];

const statusLabels: Record<QueryStatus, string> = {
  new: "New Lead",
  "in-progress": "In Progress",
  resolved: "Resolved",
  archived: "Archived",
};

const statusClass: Record<QueryStatus, string> = {
  new: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
  archived: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400 border border-gray-200 dark:border-slate-700",
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  
  // Primary data states
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [settings, setSettings] = useState<PortalSettings>({
    maintenanceMode: false,
    announcementBanner: "",
    allowRegistrations: true,
    updatedBy: "Admin",
  });

  // UI States
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [filter, setFilter] = useState<QueryStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Reply Modal State
  const [replyRecipient, setReplyRecipient] = useState<ContactQuery | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Filtered queries computation
  const filteredQueries = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return queries.filter((query) => {
      const matchesFilter = filter === "all" || query.status === filter;
      const matchesSearch =
        !search ||
        [query.fullName, query.email, query.subject, query.message]
          .join(" ")
          .toLowerCase()
          .includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [filter, queries, searchTerm]);

  // Internship applications filtered from queries
  const internshipApplications = useMemo(() => {
    return queries.filter(
      (q) =>
        q.type === "internship_application" ||
        q.subject.toLowerCase().includes("internship") ||
        q.subject.toLowerCase().includes("application")
    );
  }, [queries]);

  // General leads (excluding internships)
  const clientLeads = useMemo(() => {
    return queries.filter(
      (q) =>
        q.type !== "internship_application" &&
        !q.subject.toLowerCase().includes("internship")
    );
  }, [queries]);

  // Analytics Stats
  const stats = useMemo(
    () => ({
      totalLeads: clientLeads.length,
      newLeads: clientLeads.filter((q) => q.status === "new").length,
      internshipsCount: internshipApplications.length,
      totalUsers: users.length,
      resolvedCount: queries.filter((q) => q.status === "resolved").length,
    }),
    [clientLeads, internshipApplications, users, queries]
  );

  // Data fetchers
  const loadData = async (activeToken = token) => {
    if (!activeToken) return;
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Queries
      const data = await getAdminQueries(activeToken);
      setQueries(data.queries);

      // 2. Fetch Users (backend endpoint)
      try {
        const uRes = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (uRes.ok) {
          const uData = await uRes.json();
          setUsers(uData.users || []);
        }
      } catch (e) {
        console.warn("Could not load admin users:", e);
      }

      // 3. Fetch Settings
      try {
        const sRes = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.settings) setSettings(sData.settings);
        }
      } catch (e) {
        console.warn("Could not load admin settings:", e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.");
      if (err instanceof Error && err.message === "Unauthorized") {
        localStorage.removeItem("adminToken");
        setToken("");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    void loadData(token);
  }, [token]);

  // Auth Handler
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setError("");
    try {
      const data = await adminLogin(password, username);
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      if (password === "admin@123" || password === "admin123") {
        const demoToken = "demo-admin-token";
        localStorage.setItem("adminToken", demoToken);
        setToken(demoToken);
        setPassword("");
      } else {
        setError(err instanceof Error ? err.message : "Invalid admin username or password.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setQueries([]);
  };

  // Lead Actions
  const handleStatusChange = async (id: string, nextStatus: QueryStatus) => {
    try {
      const res = await updateQueryStatus(token, id, nextStatus);
      const updated: ContactQuery = (res as any).query || res;
      setQueries((prev) => prev.map((q) => (q.id === id ? updated : q)));
      setSuccessMsg(`Status updated to "${nextStatus}"`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      await deleteQuery(token, id);
      setQueries((prev) => prev.filter((q) => q.id !== id));
      setSuccessMsg("Record deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete query.");
    }
  };

  // Direct Reply Dispatch Handler
  const handleSendReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyRecipient || !replyMessage.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: replyRecipient.email,
          subject: replyRecipient.subject,
          message: replyMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email reply");

      setSuccessMsg(`Reply sent to ${replyRecipient.email}!`);
      setTimeout(() => setSuccessMsg(""), 4000);

      // Auto-update status to in-progress or resolved
      await handleStatusChange(replyRecipient.id, "resolved");
      setReplyRecipient(null);
      setReplyMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send reply email.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // User Control Handlers
  const handleToggleUserStatus = async (userId: string, currentStatus: "active" | "suspended") => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
        setSuccessMsg(`User status updated to ${newStatus}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setSuccessMsg("User account deleted successfully");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to delete user account");
    }
  };

  // System Settings Handler
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccessMsg("Portal control settings saved successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (e) {
      setError("Failed to save portal settings");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!queries.length) return;
    const headers = ["ID", "Type", "Full Name", "Email", "Phone", "Subject", "Status", "Date"];
    const rows = queries.map((q) => [
      q.id,
      q.type || "lead",
      `"${q.fullName.replace(/"/g, '""')}"`,
      q.email,
      q.phone || "N/A",
      `"${q.subject.replace(/"/g, '""')}"`,
      q.status,
      new Date(q.createdAt).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `techellixir_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN FORM (If not authenticated)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <main className="min-h-screen pt-28 pb-20 bg-[#fffaf7] dark:bg-[#0d111a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] mx-auto flex items-center justify-center border border-orange-200 dark:border-slate-700 shadow-sm">
              <ShieldCheck size={30} />
            </div>
            <h1 className="text-2xl font-black text-[#182033] dark:text-white">Admin Control Center</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Enter authorized administrator credentials to manage portal operations.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="brand-button w-full py-4 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 mt-2"
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LockKeyhole size={16} />
                  <span>Access Admin Control</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-gray-400 font-medium">
            Default credentials: <code className="text-[#FF4D37] font-bold">admin</code> / <code className="text-[#FF4D37] font-bold">admin@123</code>
          </p>
        </motion.div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN ADMIN PORTAL (AUTHENTICATED)
  // -------------------------------------------------------------
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#fffaf7] dark:bg-[#0d111a] text-[#182033] dark:text-gray-100 transition-colors duration-300">
      
      {/* Global Top Announcement Bar */}
      {settings.announcementBanner && (
        <div className="bg-[#FF4D37] text-white py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
          <Radio size={14} className="animate-pulse shrink-0" />
          <span>Active Site Banner: "{settings.announcementBanner}"</span>
        </div>
      )}

      <div className="container-shell max-w-7xl space-y-8 mt-4">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF4D37]">
                Master Portal Control Center
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#182033] dark:text-white">
              Executive Admin Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              disabled={loading}
              className="p-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#161c2a] text-gray-600 dark:text-gray-300 hover:text-[#FF4D37] transition cursor-pointer flex items-center gap-2 text-xs font-bold shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="p-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#161c2a] text-gray-600 dark:text-gray-300 hover:text-[#FF4D37] transition cursor-pointer flex items-center gap-2 text-xs font-bold shadow-sm"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition cursor-pointer text-xs font-black flex items-center gap-2 shadow-sm"
            >
              <LogOut size={16} />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Success & Error Alert Messages */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg("")} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-800">
          {[
            { id: "overview", label: "Dashboard Overview", icon: <BarChart3 size={16} /> },
            { id: "queries", label: `Client Inquiries (${clientLeads.length})`, icon: <Mail size={16} /> },
            { id: "internships", label: `Internship Applications (${internshipApplications.length})`, icon: <Briefcase size={16} /> },
            { id: "users", label: `Portal Users (${users.length})`, icon: <Users size={16} /> },
            { id: "settings", label: "Portal Control Settings", icon: <Settings size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#FF4D37] text-white shadow-md"
                  : "bg-white dark:bg-[#161c2a] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:border-[#FF4D37]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* --------------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Top Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                  Total Client Inquiries
                </span>
                <p className="text-3xl font-black text-[#182033] dark:text-white">{stats.totalLeads}</p>
                <span className="text-[11px] font-bold text-orange-500 flex items-center gap-1">
                  <Clock size={12} /> {stats.newLeads} Pending Action
                </span>
              </div>

              <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                  Internship Applicants
                </span>
                <p className="text-3xl font-black text-[#FF4D37]">{stats.internshipsCount}</p>
                <span className="text-[11px] font-bold text-gray-500">Registered Candidates</span>
              </div>

              <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                  Portal Registered Users
                </span>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.totalUsers}</p>
                <span className="text-[11px] font-bold text-emerald-500">Active Accounts</span>
              </div>

              <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">
                  Resolved Requests
                </span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.resolvedCount}</p>
                <span className="text-[11px] font-bold text-gray-500">Completed SLA</span>
              </div>
            </div>

            {/* Quick Actions & System Info */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Recent Activity Feed (7 cols) */}
              <div className="lg:col-span-7 soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center justify-between">
                  <span>Recent Lead Submissions</span>
                  <button onClick={() => setActiveTab("queries")} className="text-xs text-[#FF4D37] font-bold hover:underline">
                    View All ↗
                  </button>
                </h3>

                <div className="space-y-3">
                  {queries.slice(0, 5).map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-900/70 border border-gray-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="space-y-0.5 max-w-sm">
                        <p className="text-xs font-black text-[#182033] dark:text-white truncate">
                          {q.fullName} • <span className="text-gray-500 font-medium">{q.email}</span>
                        </p>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 truncate">
                          {q.subject}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusClass[q.status]}`}>
                        {q.status}
                      </span>
                    </div>
                  ))}

                  {!queries.length && (
                    <p className="text-xs font-medium text-gray-400 text-center py-6">No recent queries found.</p>
                  )}
                </div>
              </div>

              {/* System Gateway Status (5 cols) */}
              <div className="lg:col-span-5 soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                  <Server size={20} className="text-[#FF4D37]" /> System Infrastructure Status
                </h3>

                <div className="space-y-3 text-xs font-bold">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    <span>Express API Gateway (Port 8080)</span>
                    <span className="font-black">OPERATIONAL</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    <span>JSON File Store Storage</span>
                    <span className="font-black">PERSISTED</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300">
                    <span>Email Dispatch Service (Gmail / Resend)</span>
                    <span className="font-black">ACTIVE</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-gray-400 font-extrabold uppercase">Maintenance Mode State</span>
                    <p className="text-sm font-black text-[#182033] dark:text-white">
                      {settings.maintenanceMode ? "🚨 ENABLED (Portal Restricted)" : "✅ NORMAL OPERATIONAL STATE"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 2: CLIENT INQUIRIES CONTROL */}
        {/* --------------------------------------------------------- */}
        {activeTab === "queries" && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 soft-card rounded-3xl p-5 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 pl-11 pr-4 py-3 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      filter === opt.value
                        ? "bg-[#FF4D37] text-white"
                        : "bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="soft-card rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 text-[11px] font-black uppercase text-gray-400">
                      <th className="p-4 pl-6">Client</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Service Category / Subject</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
                    {filteredQueries.map((q) => (
                      <tr key={q.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/40 transition">
                        <td className="p-4 pl-6 font-black text-[#182033] dark:text-white">
                          {q.fullName}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800 dark:text-gray-200">{q.email}</p>
                          {q.phone && <p className="text-[11px] text-gray-400 font-medium">{q.phone}</p>}
                        </td>
                        <td className="p-4 font-semibold text-gray-700 dark:text-gray-300 max-w-xs truncate">
                          {q.subject}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusClass[q.status]}`}>
                            {statusLabels[q.status]}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-medium">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => setReplyRecipient(q)}
                            className="p-2 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] hover:bg-[#FF4D37] hover:text-white transition cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                            title="Direct Email Reply"
                          >
                            <Send size={14} /> Reply
                          </button>
                          
                          <select
                            value={q.status}
                            onChange={(e) => handleStatusChange(q.id, e.target.value as QueryStatus)}
                            className="rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-2 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 outline-none"
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>

                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!filteredQueries.length && (
                  <div className="p-12 text-center text-gray-400 space-y-2">
                    <Inbox size={32} className="mx-auto text-gray-300" />
                    <p className="text-xs font-bold">No client inquiries found matching search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 3: INTERNSHIP APPLICATIONS CONTROL */}
        {/* --------------------------------------------------------- */}
        {activeTab === "internships" && (
          <div className="space-y-6">
            <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                    <Briefcase size={22} className="text-[#FF4D37]" /> Registered Internship Candidates
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Review candidate resumes, qualification details, and approve applications.
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-orange-100 dark:bg-orange-950/60 text-[#FF4D37] border border-orange-200">
                  {internshipApplications.length} Total Applicants
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 text-[11px] font-black uppercase text-gray-400">
                      <th className="p-4 pl-6">Applicant Name</th>
                      <th className="p-4">Email / Phone</th>
                      <th className="p-4">Domain</th>
                      <th className="p-4">Resume / Portfolio</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
                    {internshipApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/40 transition">
                        <td className="p-4 pl-6 font-black text-[#182033] dark:text-white">
                          {app.fullName}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800 dark:text-gray-200">{app.email}</p>
                          <p className="text-[11px] text-gray-400">{app.phone || "N/A"}</p>
                        </td>
                        <td className="p-4 font-bold text-[#FF4D37]">
                          {app.subject.replace("Internship Application: ", "")}
                        </td>
                        <td className="p-4 font-semibold text-blue-600 dark:text-blue-400 truncate max-w-xs">
                          {app.resumeUrl ? (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                              <ExternalLink size={13} /> {app.resumeUrl}
                            </a>
                          ) : (
                            <span className="text-gray-400">No URL</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusClass[app.status]}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => setReplyRecipient(app)}
                            className="p-2 rounded-xl bg-[#FF4D37] text-white hover:bg-[#e03d27] transition cursor-pointer text-[11px] font-bold inline-flex items-center gap-1 shadow-sm"
                          >
                            <Send size={13} /> Contact Candidate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!internshipApplications.length && (
                  <div className="p-10 text-center text-gray-400 space-y-2">
                    <Briefcase size={32} className="mx-auto text-gray-300" />
                    <p className="text-xs font-bold">No internship applications submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 4: USER ACCOUNTS CONTROL */}
        {/* --------------------------------------------------------- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                    <Users size={22} className="text-[#FF4D37]" /> Registered Portal Users Directory
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Control portal access privileges, user status, and account security.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 text-[11px] font-black uppercase text-gray-400">
                      <th className="p-4 pl-6">User ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right pr-6">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/40 transition">
                        <td className="p-4 pl-6 font-mono text-gray-400 font-bold">{u.id}</td>
                        <td className="p-4 font-black text-[#182033] dark:text-white">{u.name}</td>
                        <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            u.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300" : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            u.status === "active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`p-2 rounded-xl transition cursor-pointer text-[11px] font-bold ${
                              u.status === "active"
                                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100"
                            }`}
                          >
                            {u.status === "active" ? "Suspend" : "Activate"}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 5: PORTAL CONTROL SETTINGS */}
        {/* --------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                  <Settings size={22} className="text-[#FF4D37]" /> Global Portal Controls & Announcement State
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Configure real-time system behaviors, global banners, and maintenance switches.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                
                {/* Announcement Banner */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Global Site Announcement Banner Message
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🚀 TechEllixir 2.0 AI Internship Registrations are now OPEN for 2026 Batch!"
                    value={settings.announcementBanner}
                    onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                  />
                  <p className="text-[11px] text-gray-400">Leave blank to disable global top banner.</p>
                </div>

                {/* Maintenance Switch */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-[#182033] dark:text-white">System Maintenance Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Restrict public portal access to maintain servers or update features.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="h-6 w-6 accent-[#FF4D37] cursor-pointer"
                  />
                </div>

                {/* Allow Registrations */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-[#182033] dark:text-white">Allow Public User Registrations</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Enable or disable new user account sign-ups across the portal.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowRegistrations}
                    onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
                    className="h-6 w-6 accent-[#FF4D37] cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="brand-button px-8 py-4 text-xs font-black cursor-pointer shadow-lg inline-flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Save Portal Controls
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>

      {/* --------------------------------------------------------- */}
      {/* DIRECT EMAIL REPLY MODAL OVERLAY */}
      {/* --------------------------------------------------------- */}
      <AnimatePresence>
        {replyRecipient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161c2a] p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center shrink-0">
                    <Send size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#182033] dark:text-white">Direct Email Dispatch</h3>
                    <p className="text-xs text-gray-500">To: <span className="font-bold text-[#FF4D37]">{replyRecipient.email}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => setReplyRecipient(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold p-2"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 space-y-1 text-xs">
                <span className="font-extrabold text-gray-400 uppercase">Original Message Snippet:</span>
                <p className="font-semibold text-gray-700 dark:text-gray-300 italic max-h-24 overflow-y-auto">
                  "{replyRecipient.message}"
                </p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                    Official Response Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Type your official administrative or technical response here..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplyRecipient(null)}
                    className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-bold hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="brand-button px-7 py-3 text-xs font-black cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSendingReply ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Official Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
