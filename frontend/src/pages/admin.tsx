import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
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
  UserCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import {
  adminLogin,
  deleteQuery,
  getAdminQueries,
  type ContactQuery,
  type QueryStatus,
  updateQueryStatus,
} from "../lib/api";

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

type AdminTab = "queries" | "analytics" | "system";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [password, setPassword] = useState("");
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [filter, setFilter] = useState<QueryStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("queries");

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

  const stats = useMemo(
    () => ({
      total: queries.length,
      new: queries.filter((q) => q.status === "new").length,
      inProgress: queries.filter((q) => q.status === "in-progress").length,
      resolved: queries.filter((q) => q.status === "resolved").length,
      demoRequests: queries.filter((q) => q.subject.toLowerCase().includes("demo") || q.subject.toLowerCase().includes("request")).length,
    }),
    [queries]
  );

  const loadQueries = async (activeToken = token) => {
    if (!activeToken) return;
    setLoading(true);
    setError("");
    try {
      const data = await getAdminQueries(activeToken);
      setQueries(data.queries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load queries.");
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
    let ignore = false;
    void getAdminQueries(token)
      .then((data) => {
        if (!ignore) setQueries(data.queries);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Unable to load queries.");
          if (err instanceof Error && err.message === "Unauthorized") {
            localStorage.removeItem("adminToken");
            setToken("");
          }
        }
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setError("");
    try {
      const data = await adminLogin(password);
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setQueries([]);
  };

  const handleStatusChange = async (id: string, status: QueryStatus) => {
    const data = await updateQueryStatus(token, id, status);
    setQueries((current) =>
      current.map((query) => (query.id === id ? data.query : query))
    );
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    await deleteQuery(token, id);
    setQueries((current) => current.filter((query) => query.id !== id));
  };

  // CSV Export Feature
  const exportToCSV = () => {
    if (queries.length === 0) return;
    const headers = ["ID", "Full Name", "Email", "Subject", "Status", "Created At", "Message"];
    const rows = queries.map((q) => [
      q.id,
      `"${q.fullName.replace(/"/g, '""')}"`,
      `"${q.email.replace(/"/g, '""')}"`,
      `"${q.subject.replace(/"/g, '""')}"`,
      q.status,
      q.createdAt,
      `"${q.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `techellixir-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login Screen
  if (!token) {
    return (
      <main className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] pt-32 pb-20 text-[#182033] dark:text-gray-100 transition-colors duration-300">
        <div className="container-shell">
          <div className="soft-card mx-auto max-w-md rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] mb-4">
              <LockKeyhole size={32} />
            </div>
            <h1 className="section-title mt-4 text-center text-3xl font-black">
              Admin Portal
            </h1>
            <p className="section-copy mt-2 text-center text-xs sm:text-sm">
              Sign in to manage lead inquiries, demo requests, and system analytics.
            </p>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  placeholder="admin"
                  defaultValue="admin"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-sm font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  placeholder="admin@123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="brand-button w-full py-4 text-xs font-bold whitespace-nowrap cursor-pointer shadow-lg disabled:opacity-60"
              >
                {authLoading ? "Authenticating..." : "Sign In to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] pt-28 pb-20 text-[#182033] dark:text-gray-100 transition-colors duration-300">
      <div className="container-shell max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow">ADMIN DASHBOARD</span>
            </div>
            <h1 className="section-title mt-2 text-3xl sm:text-4xl font-black">
              Lead & System Control Center
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={queries.length === 0}
              className="ghost-button px-4 py-2.5 text-xs font-bold cursor-pointer flex items-center gap-2"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={() => loadQueries()}
              className="ghost-button px-4 py-2.5 text-xs font-bold cursor-pointer flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="brand-button px-5 py-2.5 text-xs font-bold cursor-pointer flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Leads</span>
              <Inbox className="text-[#FF4D37]" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-[#182033] dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Contact & Demo Submissions</p>
          </div>

          <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Inquiries</span>
              <Mail className="text-amber-500" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-400">{stats.new}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Pending Follow-up</p>
          </div>

          <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demo Requests</span>
              <Sparkles className="text-[#FF4D37]" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-[#FF4D37]">{stats.demoRequests}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Service Consultations</p>
          </div>

          <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resolved</span>
              <CheckCircle2 className="text-emerald-500" size={22} />
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.resolved}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1">Completed Leads</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("queries")}
            className={`px-6 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === "queries"
                ? "border-[#FF4D37] text-[#FF4D37]"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <Inbox size={16} /> Lead Inquiries ({filteredQueries.length})
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === "analytics"
                ? "border-[#FF4D37] text-[#FF4D37]"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <BarChart3 size={16} /> Analytics & Performance
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`px-6 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === "system"
                ? "border-[#FF4D37] text-[#FF4D37]"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <Server size={16} /> System & Mailer Config
          </button>
        </div>

        {/* TAB 1: QUERIES MANAGEMENT */}
        {activeTab === "queries" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="soft-card rounded-3xl p-5 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 pl-11 pr-4 py-3 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                    placeholder="Search by name, email, subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                        filter === option.value
                          ? "bg-[#FF4D37] text-white shadow-md"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            {/* Queries List */}
            <div className="space-y-4">
              {loading ? (
                <div className="soft-card flex items-center justify-center gap-3 rounded-3xl p-12 text-gray-500 font-semibold text-sm bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
                  <Loader2 className="animate-spin text-[#FF4D37]" size={22} />
                  Loading lead submissions from backend...
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="soft-card rounded-3xl p-12 text-center bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
                  <Inbox className="mx-auto text-[#FF4D37] mb-3" size={36} />
                  <h3 className="text-xl font-black text-[#182033] dark:text-white">
                    No lead inquiries found
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Submissions from the Contact form or Demo Request buttons will appear here.
                  </p>
                </div>
              ) : (
                filteredQueries.map((query) => (
                  <article
                    key={query.id}
                    className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-black text-[#182033] dark:text-white">
                            {query.subject}
                          </h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass[query.status]}`}>
                            {statusLabels[query.status]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-[#FF4D37]">
                          <UserCheck size={14} />
                          <span>{query.fullName}</span>
                          <span className="text-gray-400">•</span>
                          <a
                            href={`mailto:${query.email}`}
                            className="text-gray-600 dark:text-gray-300 hover:underline flex items-center gap-1"
                          >
                            <Mail size={13} /> {query.email}
                          </a>
                        </div>

                        <div className="rounded-2xl bg-gray-50 dark:bg-slate-900/80 p-4 border border-gray-100 dark:border-slate-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {query.message}
                        </div>

                        <p className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> Received: {new Date(query.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Action Controls */}
                      <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col min-w-44">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Change Status
                          </label>
                          <select
                            value={query.status}
                            onChange={(e) => handleStatusChange(query.id, e.target.value as QueryStatus)}
                            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                          >
                            <option value="new">New Lead</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        <a
                          href={`mailto:${query.email}?subject=Re: ${encodeURIComponent(query.subject)}`}
                          className="brand-button py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Send size={14} /> Reply Email
                        </a>

                        <button
                          onClick={() => handleDelete(query.id)}
                          className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/40 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS & INSIGHTS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-[#182033] dark:text-white mb-2">
                Lead Conversion & Metrics Overview
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Real-time breakdown of client inquiries and demo requests.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-gray-400 uppercase">Resolution Rate</span>
                  <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Queries marked as resolved</p>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-gray-400 uppercase">High Intent Demos</span>
                  <h4 className="text-3xl font-black text-[#FF4D37] mt-2">
                    {stats.total > 0 ? Math.round((stats.demoRequests / stats.total) * 100) : 0}%
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Targeted demo request inquiries</p>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-gray-400 uppercase">Average Response Time</span>
                  <h4 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">&lt; 2 Hours</h4>
                  <p className="text-xs text-gray-500 mt-1">Automated mailer dispatch SLA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM & MAILER CONFIG */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white">
                    Mailer & Backend Status
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Configured environment services and email dispatchers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 size={16} />
                    <span>Gmail SMTP Dispatcher</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                    Configured via <code>GMAIL_USER</code> in <code>backend/.env</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/30">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    <CheckCircle2 size={16} />
                    <span>Resend API Gateway</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                    Configured via <code>RESEND_API_KEY</code> in <code>backend/.env</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
