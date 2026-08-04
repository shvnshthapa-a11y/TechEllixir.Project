import { useEffect, useMemo, useState, useRef } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
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
  Send,
  Users,
  Briefcase,
  Settings,
  AlertCircle,
  Radio,
  Plus,
  Edit2,
  BookOpen,
  FolderPlus,
  Layers,
  Menu,
  X,
  Database,
  MessageSquare,
  Building2,
  UserCheck,
  Star,
  ArrowLeft,
  Eye,
  Sparkles,
  Target,
} from "lucide-react";
import {
  adminLogin,
  deleteQuery,
  getAdminQueries,
  type ContactQuery,
  type QueryStatus,
  updateQueryStatus,
} from "../lib/api";

type AdminTab =
  | "overview"
  | "queries"
  | "internships"
  | "users"
  | "services_cms"
  | "resources_cms"
  | "careers_cms"
  | "testimonials_cms"
  | "industries_cms"
  | "team_cms"
  | "process_cms"
  | "whychoseus_cms"
  | "about_cms"
  | "database"
  | "settings";

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "inactive";
  createdAt: string;
}

interface PortalSettings {
  maintenanceMode: boolean;
  announcementBanner: string;
  allowRegistrations: boolean;
  updatedBy: string;
}

interface ServiceCmsItem {
  id: string;
  title: string;
  category: string;
  description: string;
  note?: string;
  detailedOverview?: string;
  highlights?: any;
  subServices?: any;
  processSteps?: any;
  keyOutcomes?: any;
  techStack?: any;
}

interface ResourceCmsItem {
  id: string;
  title: string;
  category: string;
  categoryLabel?: string;
  slug?: string;
  image?: string;
  metaTitle?: string;
  readTime: string;
  fileFormat?: string;
  author?: string;
  authorRole?: string;
  description: string;
  summary?: string;
  takeaways?: any;
  date?: string;
}

interface CareerCmsItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  duration: string;
  stipend?: string;
  mode?: string;
  desc: string;
  detailedCurriculum?: string;
  requirements?: string;
}

const statusOptions: Array<{ label: string; value: QueryStatus | "all" }> = [
  { label: "All Status", value: "all" },
  { label: "Not Started", value: "not_started" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

export const statusLabels: Record<string, string> = {
  not_started: "Not Started",
  pending: "Pending",
  completed: "Completed",
  new: "Not Started",
  "in-progress": "Pending",
  in_progress: "Pending",
  resolved: "Completed",
  archived: "Completed",
};

const statusClass: Record<string, string> = {
  not_started: "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
  new: "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700",
  "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
  archived: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700",
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");

  // Primary data states
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [servicesCms, setServicesCms] = useState<ServiceCmsItem[]>([]);
  const [resourcesCms, setResourcesCms] = useState<ResourceCmsItem[]>([]);
  const [careersCms, setCareersCms] = useState<CareerCmsItem[]>([]);
  const [testimonialsCms, setTestimonialsCms] = useState<any[]>([]);
  const [industriesCms, setIndustriesCms] = useState<any[]>([]);
  const [teamCms, setTeamCms] = useState<any[]>([]);
  const [processCms, setProcessCms] = useState<any[]>([]);
  const [whychoseusCms, setWhychoseusCms] = useState<any[]>([]);
  const [aboutCms, setAboutCms] = useState<any[]>([]);
  const [dbStatsData, setDbStatsData] = useState<any>(null);
  const [settings, setSettings] = useState<PortalSettings>({
    maintenanceMode: false,
    announcementBanner: "",
    allowRegistrations: true,
    updatedBy: "Admin",
  });

  // UI States
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Edit / Create CMS Modals
  const [editingService, setEditingService] = useState<Partial<ServiceCmsItem> | null>(null);
  const [editingResource, setEditingResource] = useState<Partial<ResourceCmsItem> | null>(null);
  const [editingCareer, setEditingCareer] = useState<Partial<CareerCmsItem> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [editingIndustry, setEditingIndustry] = useState<any | null>(null);
  const [editingTeam, setEditingTeam] = useState<any | null>(null);
  const [editingProcess, setEditingProcess] = useState<any | null>(null);
  const [editingWhychoseus, setEditingWhychoseus] = useState<any | null>(null);
  const [editingAbout, setEditingAbout] = useState<any | null>(null);
  const [contentPreviewMode, setContentPreviewMode] = useState<"edit" | "preview">("edit");
  const resourceContentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // User Creation modal state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  const handleFormatResourceText = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = resourceContentTextareaRef.current;
    const currentText = editingResource?.summary || "";

    if (!textarea) {
      const gap = currentText && !currentText.endsWith("\n") ? "\n" : "";
      setEditingResource({
        ...editingResource,
        summary: currentText + gap + prefix + placeholder + suffix,
      });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = currentText.substring(start, end);

    const insertedText = selected || placeholder;
    const newText = currentText.substring(0, start) + prefix + insertedText + suffix + currentText.substring(end);

    setEditingResource({
      ...editingResource,
      summary: newText,
    });

    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + insertedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 10);
  };

  // Filtered queries (Contact Form & Client Inquiries ONLY)
  const filteredQueries = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return queries.filter((query) => {
      const isInternship =
        query.type === "internship_application" ||
        (query.subject || "").toLowerCase().includes("internship");
      if (isInternship) return false;

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

  // Internship applications
  const internshipApplications = useMemo(() => {
    return queries.filter(
      (q) =>
        q.type === "internship_application" ||
        q.subject.toLowerCase().includes("internship") ||
        q.subject.toLowerCase().includes("application")
    );
  }, [queries]);

  // Client Leads
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
      newLeads: clientLeads.filter((q) => q.status === "not_started" || q.status === "pending" || (q.status as string) === "new").length,
      internshipsCount: internshipApplications.length,
      totalUsers: users.length,
      resolvedCount: queries.filter((q) => q.status === "completed" || (q.status as string) === "resolved").length,
    }),
    [clientLeads, internshipApplications, users, queries]
  );

  // Data Fetchers
  const loadData = async (activeToken = token) => {
    if (!activeToken) return;
    setLoading(true);
    setError("");
    try {
      // 1. Queries
      try {
        const data = await getAdminQueries(activeToken);
        setQueries(Array.isArray(data.queries) ? data.queries : []);
      } catch (e) {
        console.warn("Queries fetch fallback:", e);
      }

      // 2. Users
      try {
        const uRes = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (uRes.ok) {
          const uData = await uRes.json();
          setUsers(Array.isArray(uData.users) ? uData.users : []);
        }
      } catch (e) {}

      // 3. Settings
      try {
        const sRes = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.settings) setSettings(sData.settings);
        }
      } catch (e) {}

      // 4. Services CMS
      try {
        const srvRes = await fetch("/api/admin/cms/services", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (srvRes.ok) {
          const srvData = await srvRes.json();
          setServicesCms(Array.isArray(srvData.items) ? srvData.items : []);
        }
      } catch (e) {}

      // 5. Resources CMS
      try {
        const resRes = await fetch("/api/admin/cms/resources", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (resRes.ok) {
          const resData = await resRes.json();
          setResourcesCms(Array.isArray(resData.items) ? resData.items : []);
        }
      } catch (e) {}

      // 6. Careers CMS
      try {
        const carRes = await fetch("/api/admin/cms/careers", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (carRes.ok) {
          const carData = await carRes.json();
          setCareersCms(Array.isArray(carData.items) ? carData.items : []);
        }
      } catch (e) {}

      // 7. Testimonials CMS
      try {
        const tstRes = await fetch("/api/admin/cms/testimonials", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (tstRes.ok) {
          const tstData = await tstRes.json();
          setTestimonialsCms(Array.isArray(tstData.items) ? tstData.items : []);
        }
      } catch (e) {}

      // 8. Industries CMS
      try {
        const indRes = await fetch("/api/admin/cms/industries", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (indRes.ok) {
          const indData = await indRes.json();
          setIndustriesCms(Array.isArray(indData.items) ? indData.items : []);
        }
      } catch (e) {}

      // 9. Team CMS
      try {
        const tmRes = await fetch("/api/admin/cms/team", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (tmRes.ok) {
          const tmData = await tmRes.json();
          setTeamCms(Array.isArray(tmData.items) ? tmData.items : []);
        }
      } catch (e) {}

      // 10. Process CMS
      try {
        const prcRes = await fetch("/api/admin/cms/process", { headers: { Authorization: `Bearer ${activeToken}` } });
        if (prcRes.ok) {
          const prcData = await prcRes.json();
          setProcessCms(Array.isArray(prcData.items) ? prcData.items : []);
        }
      } catch (e) {}

      // 11. WhyChooseUs CMS
      try {
        const wcuRes = await fetch("/api/admin/cms/whychoseus", { headers: { Authorization: `Bearer ${activeToken}` } });
        if (wcuRes.ok) {
          const wcuData = await wcuRes.json();
          setWhychoseusCms(Array.isArray(wcuData.items) ? wcuData.items : []);
        }
      } catch (e) {}

      // 12. About CMS
      try {
        const abtRes = await fetch("/api/admin/cms/about", { headers: { Authorization: `Bearer ${activeToken}` } });
        if (abtRes.ok) {
          const abtData = await abtRes.json();
          setAboutCms(Array.isArray(abtData.items) ? abtData.items : []);
        }
      } catch (e) {}

      // 13. Database Stats
      try {
        const dbRes = await fetch("/api/admin/db/stats", {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          setDbStatsData(dbData.stats);
        }
      } catch (e) {}
    } catch (err) {
      console.warn("Admin loadData error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh DB stats + all sidebar state arrays so they stay in sync
  const refreshStats = async () => {
    if (!token) return;
    try {
      // Refresh DB stats
      const dbRes = await fetch("/api/admin/db/stats", { headers: { Authorization: `Bearer ${token}` } });
      if (dbRes.ok) { const d = await dbRes.json(); setDbStatsData(d.stats); }
      // Refresh all list state arrays
      const [indRes, usrRes, srvRes, resRes, carRes, tstRes] = await Promise.all([
        fetch("/api/admin/cms/industries", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/cms/services", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/cms/resources", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/cms/careers", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin/cms/testimonials", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (indRes.ok) { const d = await indRes.json(); setIndustriesCms(Array.isArray(d.items) ? d.items : []); }
      if (usrRes.ok) { const d = await usrRes.json(); setUsers(Array.isArray(d.users) ? d.users : []); }
      if (srvRes.ok) { const d = await srvRes.json(); setServicesCms(Array.isArray(d.items) ? d.items : []); }
      if (resRes.ok) { const d = await resRes.json(); setResourcesCms(Array.isArray(d.items) ? d.items : []); }
      if (carRes.ok) { const d = await carRes.json(); setCareersCms(Array.isArray(d.items) ? d.items : []); }
      if (tstRes.ok) { const d = await tstRes.json(); setTestimonialsCms(Array.isArray(d.items) ? d.items : []); }
    } catch (e) { console.warn("refreshStats error:", e); }
  };

  useEffect(() => {
    if (!token) return;
    void loadData(token);
  }, [token]);

  // Auto-refresh DB stats whenever the database tab is opened
  useEffect(() => {
    if (activeTab === "database" && token) {
      void refreshStats();
    }
  }, [activeTab]);

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

  // Lead Status Change
  const handleStatusChange = async (id: string, nextStatus: QueryStatus) => {
    try {
      setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, status: nextStatus } : q)));
      const res = await updateQueryStatus(token, id, nextStatus);
      const updated: ContactQuery = (res as any).query || res;
      if (updated && updated.id) {
        setQueries((prev) => prev.map((q) => (q.id === id ? updated : q)));
      }
      setSuccessMsg(`Status updated to "${statusLabels[nextStatus] || nextStatus}"`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    setQueries((prev) => prev.filter((q) => q.id !== id));
    try {
      await deleteQuery(token, id);
      setSuccessMsg("Record deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.warn("Delete query API call completed:", err);
    }
  };

  // Reply Handler
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

      setSuccessMsg(`Reply dispatched to ${replyRecipient.email}!`);
      setTimeout(() => setSuccessMsg(""), 4000);

      await handleStatusChange(replyRecipient.id, "completed");
      setReplyRecipient(null);
      setReplyMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send reply email.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // User Handlers
  const handleToggleUserRole = async (userItem: PortalUser) => {
    const newRole = userItem.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${userItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userItem.id ? { ...u, role: newRole } : u));
        setSuccessMsg(`User role updated to ${newRole}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to update user role");
    }
  };

  const handleToggleUserStatus = async (userItem: PortalUser) => {
    const newStatus = userItem.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/users/${userItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userItem.id ? { ...u, status: newStatus } : u));
        setSuccessMsg(`User status updated to ${newStatus}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this user account?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id && u.email !== id));
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.users || data.items) {
        setUsers(data.users || data.items);
      }
      setSuccessMsg("User removed successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("User deletion completed:", e);
    }
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      setError("Please fill in name, email, and password.");
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || [data.user, ...users]);
        setIsAddUserOpen(false);
        setNewUserForm({ name: "", email: "", password: "", role: "user", status: "active" });
        setSuccessMsg("User account created successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.error || "Failed to create user account.");
      }
    } catch (e) {
      setError("Failed to create user account.");
    }
  };

  // CMS Handlers: Services
  const handleSaveServiceCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    const isEdit = Boolean(editingService.id);
    const endpoint = isEdit ? `/api/admin/cms/services/${editingService.id}` : "/api/admin/cms/services";
    const method = isEdit ? "PATCH" : "POST";

    const title = editingService.title.trim();
    const category = editingService.category || "Core Software Engineering";

    let highlightsArr = typeof editingService.highlights === "string" ? editingService.highlights.split(",").map((s: string) => s.trim()).filter(Boolean) : (editingService.highlights || []);
    let subServicesArr = typeof editingService.subServices === "string" ? editingService.subServices.split(",").map((s: string) => s.trim()).filter(Boolean) : (editingService.subServices || []);
    let processStepsArr = typeof editingService.processSteps === "string" ? editingService.processSteps.split(",").map((s: string) => s.trim()).filter(Boolean) : (editingService.processSteps || []);
    let keyOutcomesArr = typeof editingService.keyOutcomes === "string" ? editingService.keyOutcomes.split(",").map((s: string) => s.trim()).filter(Boolean) : (editingService.keyOutcomes || []);
    let techStackArr = typeof editingService.techStack === "string" ? editingService.techStack.split(",").map((s: string) => s.trim()).filter(Boolean) : (editingService.techStack || []);

    if (highlightsArr.length === 0) {
      highlightsArr = ["React 19 & Next.js", "Node.js & Microservices", "Scalable Enterprise Apps"];
    }
    if (subServicesArr.length === 0) {
      subServicesArr = [
        `Custom ${title} Solutions`,
        "Frontend & UI Engineering (React/Next.js)",
        "Backend & RESTful APIs (Node.js)",
        "Database Architecture & Optimization",
        "Performance Tuning & SEO Hardening",
        "API Integration & Webhooks",
        "Single Page Applications (SPA)",
        "Maintenance & SLA Support"
      ];
    }
    if (processStepsArr.length === 0) {
      processStepsArr = [
        "1. Discovery & Technical Architecture Audit",
        "2. UI/UX Wireframing & Database Schema Design",
        "3. Full-Stack Agile Development & Automated CI/CD",
        "4. Performance Tuning, Security Audit & Production Launch"
      ];
    }
    if (keyOutcomesArr.length === 0) {
      keyOutcomesArr = [
        "Sub-100ms LCP Page Load Speeds",
        "99.9% Production Server Uptime",
        "SEO-Optimized SSR Architecture",
        "OWASP Security Hardened APIs"
      ];
    }
    if (techStackArr.length === 0) {
      techStackArr = ["React 19", "Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker"];
    }

    const payload = {
      ...editingService,
      title,
      category,
      description: editingService.description?.trim() || `We build modern, high-performance ${title} with clean architecture, reliable APIs, and lightning-fast load times.`,
      note: editingService.note?.trim() || `We deliver native-grade ${title} with clean frontend architecture, enterprise backend systems, and 99.9% production uptime SLA.`,
      detailedOverview: editingService.detailedOverview?.trim() || `We engineer enterprise ${title} built for extreme speed, search visibility, and fault tolerance. Using React 19, Next.js, and Node.js microservices, we build platforms that process millions of requests while providing smooth user flows.`,
      highlights: highlightsArr,
      subServices: subServicesArr,
      processSteps: processStepsArr,
      keyOutcomes: keyOutcomesArr,
      techStack: techStackArr,
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setServicesCms(data.items);
        setEditingService(null);
        setSuccessMsg(isEdit ? "Service updated successfully!" : "New Service added to portal!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save service");
    }
  };

  const handleDeleteServiceCms = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this service?")) return;
    setServicesCms((prev) => prev.filter((s) => s.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/services/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        setServicesCms(data.items);
      }
      setSuccessMsg("Service removed");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("Service deletion completed:", e);
    }
  };

  // CMS Handlers: Resources
  const handleSaveResourceCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editingResource.title) return;

    const isEdit = Boolean(editingResource.id);
    const endpoint = isEdit ? `/api/admin/cms/resources/${editingResource.id}` : "/api/admin/cms/resources";
    const method = isEdit ? "PATCH" : "POST";

    const title = editingResource.title.trim();
    const slug = editingResource.slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = editingResource.category || "Resources & Blueprints";
    const categoryLabel = editingResource.categoryLabel || category;
    const author = editingResource.author?.trim() || "Shivansh Thapa";

    const payload = {
      ...editingResource,
      title,
      slug,
      category,
      categoryLabel,
      author,
      description: editingResource.description?.trim() || editingResource.title,
      summary: editingResource.summary?.trim() || editingResource.description || editingResource.title,
      takeaways: typeof editingResource.takeaways === "string" ? editingResource.takeaways.split(",").map((s: string) => s.trim()).filter(Boolean) : (editingResource.takeaways || []),
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setResourcesCms(data.items);
        setEditingResource(null);
        setSuccessMsg(isEdit ? "Resource article updated!" : "New Resource article published!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save resource");
    }
  };

  const handleDeleteResourceCms = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    setResourcesCms((prev) => prev.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/resources/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        setResourcesCms(data.items);
      }
      setSuccessMsg("Resource deleted");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("Resource deletion completed:", e);
    }
  };

  // CMS Handlers: Careers
  const handleSaveCareerCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCareer || !editingCareer.title) return;

    const isEdit = Boolean(editingCareer.id);
    const endpoint = isEdit ? `/api/admin/cms/careers/${editingCareer.id}` : "/api/admin/cms/careers";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingCareer),
      });
      const data = await res.json();
      if (res.ok) {
        setCareersCms(data.items);
        setEditingCareer(null);
        setSuccessMsg(isEdit ? "Internship Domain updated!" : "New Internship Domain added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save career domain");
    }
  };

  const handleDeleteCareerCms = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this domain?")) return;
    setCareersCms((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/careers/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        setCareersCms(data.items);
      }
      setSuccessMsg("Domain removed");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("Domain deletion completed:", e);
    }
  };

  // Settings Handler
  // CMS Handlers: Testimonials
  const handleSaveTestimonialCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name) return;
    const isEdit = Boolean(editingTestimonial.id);
    const endpoint = isEdit ? `/api/admin/cms/testimonials/${editingTestimonial.id}` : "/api/admin/cms/testimonials";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingTestimonial),
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonialsCms(data.items);
        setEditingTestimonial(null);
        setSuccessMsg(isEdit ? "Testimonial updated!" : "Testimonial added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save testimonial");
    }
  };

  const handleDeleteTestimonialCms = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setTestimonialsCms((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/testimonials/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        setTestimonialsCms(data.items);
      }
      setSuccessMsg("Testimonial deleted");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("Testimonial deletion completed:", e);
    }
  };

  // CMS Handlers: Industries
  const handleSaveIndustryCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingIndustry || !editingIndustry.title) return;
    const isEdit = Boolean(editingIndustry.id && industriesCms.some((i) => i.id === editingIndustry.id));
    const endpoint = isEdit ? `/api/admin/cms/industries/${editingIndustry.id}` : "/api/admin/cms/industries";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingIndustry),
      });
      const data = await res.json();
      if (res.ok) {
        setIndustriesCms(Array.isArray(data.items) ? data.items : industriesCms);
        setEditingIndustry(null);
        setSuccessMsg(isEdit ? "Industry vertical updated!" : "New Industry vertical added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setError(data.error || "Failed to save industry vertical");
      }
    } catch (e) {
      setError("Failed to save industry vertical");
    }
  };

  const handleDeleteIndustryCms = async (id: string) => {
    if (!window.confirm("Delete this industry vertical?")) return;
    setIndustriesCms((prev) => prev.filter((i) => i.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/industries/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        setIndustriesCms(data.items);
      }
      setSuccessMsg("Industry vertical deleted");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("Industry vertical deletion completed:", e);
    }
  };

  // CMS Handlers: Team
  const handleSaveTeamCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTeam || !editingTeam.name) return;
    const isEdit = Boolean(editingTeam.id);
    const endpoint = isEdit ? `/api/admin/cms/team/${editingTeam.id}` : "/api/admin/cms/team";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingTeam),
      });
      const data = await res.json();
      if (res.ok) {
        setTeamCms(data.items);
        setEditingTeam(null);
        setSuccessMsg(isEdit ? "Team member updated!" : "New Team member added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save team member");
    }
  };

  const handleDeleteTeamCms = async (id: string) => {
    if (!window.confirm("Delete this team member?")) return;
    setTeamCms((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/team/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        setTeamCms(data.items);
      }
      setSuccessMsg("Team member removed");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.warn("Team member deletion completed:", e);
    }
  };

  // CMS Handlers: Process
  const handleSaveProcessCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProcess || !editingProcess.title) return;
    const isEdit = Boolean(editingProcess.id);
    const endpoint = isEdit ? `/api/admin/cms/process/${editingProcess.id}` : "/api/admin/cms/process";
    const method = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingProcess),
      });
      const data = await res.json();
      if (res.ok) {
        setProcessCms(data.items);
        setEditingProcess(null);
        setSuccessMsg(isEdit ? "Process step updated!" : "Process step added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save process step");
    }
  };

  const handleDeleteProcessCms = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this process step?")) return;
    setProcessCms((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/process/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) setProcessCms(data.items);
    } catch (e) {
      console.warn("Process step deletion completed:", e);
    }
  };

  // CMS Handlers: WhyChooseUs
  const handleSaveWhychoseusCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingWhychoseus || !editingWhychoseus.title) return;
    const isEdit = Boolean(editingWhychoseus.id);
    const endpoint = isEdit ? `/api/admin/cms/whychoseus/${editingWhychoseus.id}` : "/api/admin/cms/whychoseus";
    const method = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingWhychoseus),
      });
      const data = await res.json();
      if (res.ok) {
        setWhychoseusCms(data.items);
        setEditingWhychoseus(null);
        setSuccessMsg(isEdit ? "Feature updated!" : "Feature added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save feature");
    }
  };

  const handleDeleteWhychoseusCms = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feature card?")) return;
    setWhychoseusCms((prev) => prev.filter((w) => w.id !== id));
    try {
      const res = await fetch(`/api/admin/cms/whychoseus/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) setWhychoseusCms(data.items);
    } catch (e) {
      console.warn("WhyChooseUs deletion completed:", e);
    }
  };

  // CMS Handlers: About
  const handleSaveAboutCms = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingAbout || !editingAbout.title) return;
    const isEdit = Boolean(editingAbout.id);
    const endpoint = isEdit ? `/api/admin/cms/about/${editingAbout.id}` : "/api/admin/cms/about";
    const method = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingAbout),
      });
      const data = await res.json();
      if (res.ok) {
        setAboutCms(data.items);
        setEditingAbout(null);
        setSuccessMsg(isEdit ? "Company metric/principle updated!" : "Added!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (e) {
      setError("Failed to save metric");
    }
  };

  const handleDeleteAboutCms = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this metric/principle item?")) return;
    try {
      const res = await fetch(`/api/admin/cms/about/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAboutCms(data.items);
    } catch (e) {
      setError("Failed to delete item");
    }
  };

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
      setError("Failed to save settings");
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
  // LOGIN SCREEN
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
            <h1 className="text-2xl font-black text-[#182033] dark:text-white">Admin Master Console</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Enter authorized administrator credentials to unlock full portal control.
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
                  <span>Unlock Admin Master Console</span>
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

  // Navigation Items array
  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: <BarChart3 size={18} /> },
    { id: "queries", label: "Client Inquiries", badge: clientLeads.length, icon: <Mail size={18} /> },
    { id: "internships", label: "Internship Applications", badge: internshipApplications.length, icon: <Briefcase size={18} /> },
    { id: "users", label: "Portal User Directory", badge: users.length, icon: <Users size={18} /> },
    { id: "services_cms", label: "Manage Services", badge: servicesCms.length, icon: <Layers size={18} /> },
    { id: "resources_cms", label: "Manage Resources", badge: resourcesCms.length, icon: <BookOpen size={18} /> },
    { id: "careers_cms", label: "Manage Careers", badge: careersCms.length, icon: <FolderPlus size={18} /> },
    { id: "testimonials_cms", label: "Manage Testimonials", badge: testimonialsCms.length, icon: <MessageSquare size={18} /> },
    { id: "industries_cms", label: "Manage Industries", badge: industriesCms.length, icon: <Building2 size={18} /> },
    { id: "database", label: "Database Explorer", icon: <Database size={18} /> },
  ];

  // -------------------------------------------------------------
  // MAIN ADMIN CONSOLE WITH SIDEBAR LAYOUT
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] text-[#182033] dark:text-gray-100 transition-colors duration-300 flex">
      
      {/* --------------------------------------------------------- */}
      {/* LEFT SIDEBAR NAVIGATION */}
      {/* --------------------------------------------------------- */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-[#161c2a] border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 shadow-xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Admin Brand Logo & Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FF4D37] text-white flex items-center justify-center font-black shadow-md">
                TE
              </div>
              <div>
                <h2 className="text-sm font-black text-[#182033] dark:text-white leading-tight">
                  TechEllixir
                </h2>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#FF4D37]">
                  Master Admin Console
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block px-3 mb-2">
              Console Navigation
            </span>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as AdminTab);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                  activeTab === item.id
                    ? "bg-[#FF4D37] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-orange-50/50 dark:hover:bg-slate-900 hover:text-[#FF4D37]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === item.id ? "bg-white text-[#FF4D37]" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Exit */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-3 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
              A
            </div>
            <div className="space-y-0.5 truncate">
              <p className="text-xs font-black text-[#182033] dark:text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-400 truncate">admin@techellixir.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --------------------------------------------------------- */}
      {/* RIGHT MAIN CONTENT AREA */}
      {/* --------------------------------------------------------- */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Sticky Header Bar & Global Announcement Wrapper */}
        <div className="sticky top-0 z-30 shrink-0">
          {/* Global Site Announcement Banner */}
          {settings.announcementBanner && (
            <div className="bg-[#FF4D37] text-white py-2 px-6 text-xs font-bold flex items-center justify-between gap-3 shadow-md border-b border-orange-600/30">
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <Radio size={14} className="animate-pulse shrink-0 text-white" />
                <span className="truncate">Active Site Announcement: <strong>"{settings.announcementBanner}"</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, announcementBanner: "" })}
                className="text-white/90 hover:text-white hover:bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Top Header Bar */}
          <header className="bg-white/90 dark:bg-[#161c2a]/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-300"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-black text-[#182033] dark:text-white capitalize">
                {activeTab.replace("_cms", "").replace("_", " ")}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadData()}
                disabled={loading}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#161c2a] text-gray-600 dark:text-gray-300 hover:text-[#FF4D37] transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Sync Data</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#161c2a] text-gray-600 dark:text-gray-300 hover:text-[#FF4D37] transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </header>
        </div>

        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto max-w-7xl">
          
          {/* Success / Error Alerts */}
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
                <button onClick={() => setSuccessMsg("")} className="text-xs text-gray-400">✕</button>
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
                <button onClick={() => setError("")} className="text-xs text-gray-400">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --------------------------------------------------------- */}
          {/* TAB: OVERVIEW */}
          {/* --------------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">Total Client Leads</span>
                  <p className="text-3xl font-black text-[#182033] dark:text-white">{stats.totalLeads}</p>
                  <span className="text-[11px] font-bold text-orange-500">{stats.newLeads} Pending Action</span>
                </div>
                <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">Internship Applicants</span>
                  <p className="text-3xl font-black text-[#FF4D37]">{stats.internshipsCount}</p>
                  <span className="text-[11px] font-bold text-gray-500">Candidate Registrations</span>
                </div>
                <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">Portal Users</span>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.totalUsers}</p>
                  <span className="text-[11px] font-bold text-emerald-500">Active Accounts</span>
                </div>
                <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">CMS Managed Items</span>
                  <p className="text-3xl font-black text-purple-600 dark:text-purple-400">{servicesCms.length + resourcesCms.length + careersCms.length}</p>
                  <span className="text-[11px] font-bold text-gray-500">Services, Blogs & Careers</span>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CLIENT INQUIRIES */}
          {/* --------------------------------------------------------- */}
          {activeTab === "queries" && (
            <div className="space-y-6">
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

              <div className="soft-card rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 text-[11px] font-black uppercase text-gray-400">
                        <th className="p-4 pl-6">Client</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Service Category / Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredQueries.map((q) => (
                        <tr key={q.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/40 transition">
                          <td className="p-4 pl-6 font-black text-[#182033] dark:text-white">{q.fullName}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-800 dark:text-gray-200">{q.email}</p>
                            {q.phone && <p className="text-[11px] text-gray-400">{q.phone}</p>}
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="font-bold text-[#FF4D37] truncate">{q.subject}</p>
                            <p className="text-[11px] text-gray-500 truncate">{q.message}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={(q.status as string) === "new" ? "not_started" : ((q.status as string) === "in-progress" || (q.status as string) === "in_progress" ? "pending" : ((q.status as string) === "resolved" ? "completed" : (q.status || "not_started")))}
                              onChange={(e) => handleStatusChange(q.id, e.target.value as QueryStatus)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer border ${statusClass[q.status] || statusClass.not_started}`}
                            >
                              <option value="not_started">Not Started</option>
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button
                              onClick={() => setReplyRecipient(q)}
                              className="p-2 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] hover:bg-[#FF4D37] hover:text-white transition cursor-pointer font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Send size={13} /> Reply
                            </button>
                            <button
                              onClick={() => handleDeleteQuery(q.id)}
                              className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
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
          {/* TAB: INTERNSHIP APPLICATIONS */}
          {/* --------------------------------------------------------- */}
          {activeTab === "internships" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                    <Briefcase size={22} className="text-[#FF4D37]" /> Manage Internship Applications
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Review student candidate registrations, applied domain choices, and resume profiles.
                  </p>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidate or domain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  />
                </div>
              </div>

              <div className="soft-card rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 text-[11px] font-black uppercase text-gray-400">
                        <th className="p-4 pl-6">Candidate Name</th>
                        <th className="p-4">Contact Email & Phone</th>
                        <th className="p-4">Applied Training Domain</th>
                        <th className="p-4">Submission Date</th>
                        <th className="p-4">Application Status</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {internshipApplications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-gray-400 font-bold">
                            No internship applications found yet. Candidate registrations will appear here.
                          </td>
                        </tr>
                      ) : (
                        internshipApplications
                          .filter((app) =>
                            searchTerm
                              ? app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                app.subject.toLowerCase().includes(searchTerm.toLowerCase())
                              : true
                          )
                          .map((app) => (
                            <tr key={app.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/40 transition">
                              <td className="p-4 pl-6 font-black text-[#182033] dark:text-white">
                                {app.fullName}
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-gray-800 dark:text-gray-200">{app.email}</p>
                                {app.phone && <p className="text-[11px] text-gray-400">{app.phone}</p>}
                              </td>
                              <td className="p-4">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 dark:bg-slate-800 text-[#FF4D37] inline-block">
                                  {app.subject.replace("Internship Registration:", "").trim()}
                                </span>
                              </td>
                              <td className="p-4 text-gray-500 font-semibold text-[11px]">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <select
                                  value={(app.status as string) === "new" ? "not_started" : ((app.status as string) === "in-progress" || (app.status as string) === "in_progress" ? "pending" : ((app.status as string) === "resolved" ? "completed" : (app.status || "not_started")))}
                                  onChange={(e) => handleStatusChange(app.id, e.target.value as QueryStatus)}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer border ${statusClass[app.status] || statusClass.not_started}`}
                                >
                                  <option value="not_started">Not Started</option>
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                              <td className="p-4 pr-6 text-right space-x-2">
                                <button
                                  onClick={() => setReplyRecipient(app)}
                                  className="p-2 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] hover:bg-[#FF4D37] hover:text-white transition cursor-pointer font-bold text-[11px] inline-flex items-center gap-1"
                                >
                                  <Send size={13} /> Reply Candidate
                                </button>
                                <button
                                   onClick={() => handleStatusChange(app.id, app.status === "completed" ? "pending" : "completed")}
                                   className="p-2 rounded-xl text-emerald-600 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition cursor-pointer font-bold text-[11px]"
                                 >
                                   {app.status === "completed" ? "Mark Pending" : "Complete"}
                                 </button>
                                <button
                                  onClick={() => handleDeleteQuery(app.id)}
                                  className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: PORTAL USER DIRECTORY */}
          {/* --------------------------------------------------------- */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                    <Users size={22} className="text-[#FF4D37]" /> Registered Portal Users Directory
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Manage administrative roles, access privileges, and user account statuses.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative max-w-xs w-full">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by user name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                    />
                  </div>
                  <button
                    onClick={() => setIsAddUserOpen(true)}
                    className="brand-button px-4 py-2.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Plus size={16} /> Add User Account
                  </button>
                </div>
              </div>

              {/* Add User Modal */}
              {isAddUserOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                      <h4 className="text-lg font-black text-[#182033] dark:text-white flex items-center gap-2">
                        <UserCheck size={20} className="text-[#FF4D37]" /> Create New User Account
                      </h4>
                      <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg">
                        <X size={18} />
                      </button>
                    </div>
                    <form onSubmit={handleCreateUser} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rudra Pratap Singh"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-[#FF4D37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="user@example.com"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-[#FF4D37] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Password</label>
                        <input
                          type="text"
                          required
                          placeholder="Password (e.g. user@123)"
                          value={newUserForm.password}
                          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-[#FF4D37] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Role</label>
                          <select
                            value={newUserForm.role}
                            onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-[#FF4D37] outline-none"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Status</label>
                          <select
                            value={newUserForm.status}
                            onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-[#FF4D37] outline-none"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddUserOpen(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="brand-button px-5 py-2 text-xs font-bold cursor-pointer"
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="soft-card rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 text-[11px] font-black uppercase text-gray-400">
                        <th className="p-4 pl-6">User Account</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Access Role</th>
                        <th className="p-4">Account Status</th>
                        <th className="p-4 text-right pr-6">Management Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-gray-400 font-bold">
                            No registered users found.
                          </td>
                        </tr>
                      ) : (
                        users
                          .filter((u) =>
                            searchTerm
                              ? u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                u.email.toLowerCase().includes(searchTerm.toLowerCase())
                              : true
                          )
                          .map((u) => (
                            <tr key={u.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-900/40 transition">
                              <td className="p-4 pl-6 font-black text-[#182033] dark:text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4D37] to-amber-500 text-white font-black flex items-center justify-center text-xs">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{u.name}</span>
                              </td>
                              <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                                {u.email}
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                  u.role === "admin"
                                    ? "bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400"
                                    : "bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                }`}>
                                  {u.role || "User"}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                  u.status === "active"
                                    ? "bg-emerald-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400"
                                }`}>
                                  {u.status || "Active"}
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-right space-x-2">
                                <button
                                  onClick={() => handleToggleUserRole(u)}
                                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-[#FF4D37] transition cursor-pointer font-bold text-[11px]"
                                >
                                  Make {u.role === "admin" ? "User" : "Admin"}
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-[#FF4D37] transition cursor-pointer font-bold text-[11px]"
                                >
                                  {u.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS SERVICES MANAGEMENT */}
          {/* --------------------------------------------------------- */}
          {activeTab === "services_cms" && (
            editingService ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditingService(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Services List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {editingService.id ? "Edit Service Mode" : "New Service Creator"}
                  </span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                        <Layers size={22} className="text-[#FF4D37]" />
                        {editingService.id ? `Edit Service: ${editingService.title || "Untitled"}` : "Create Technical Service"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Configure service metadata, sub-services, and detailed click page views.</p>
                    </div>

                    <form onSubmit={handleSaveServiceCms} className="space-y-4 text-xs">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Service Title</label>
                          <input type="text" required placeholder="e.g. Web Development" value={editingService.title || ""} onChange={(e) => setEditingService({ ...editingService, title: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Category Tag</label>
                          <select
                            value={editingService.category || "Core Software Engineering"}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                            className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37] text-xs cursor-pointer"
                          >
                            <option value="Core Software Engineering">Core Software Engineering</option>
                            <option value="AI & Data Solutions">AI & Data Solutions</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Card Teaser Summary (Main Card View)</label>
                        <textarea rows={2} placeholder="Brief summary displayed on main service card..." value={editingService.description || ""} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Highlight Banner Note</label>
                        <input type="text" placeholder="e.g. High-performance architecture with 99.9% SLA..." value={editingService.note || ""} onChange={(e) => setEditingService({ ...editingService, note: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Detailed Technical Overview (Frontend Modal Click View)</label>
                        <textarea rows={4} placeholder="Full in-depth technical overview when user clicks to explore..." value={editingService.detailedOverview || ""} onChange={(e) => setEditingService({ ...editingService, detailedOverview: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Top Key Highlights (Comma-separated)</label>
                        <input type="text" placeholder="React 19 & Next.js, Node.js & APIs, Scalable Web Apps" value={Array.isArray(editingService.highlights) ? editingService.highlights.join(", ") : (editingService.highlights || "")} onChange={(e) => setEditingService({ ...editingService, highlights: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Sub-Services Offered (Comma-separated)</label>
                        <textarea rows={2} placeholder="Custom Web Apps, RESTful APIs, E-Commerce, PWA, SEO Optimization" value={Array.isArray(editingService.subServices) ? editingService.subServices.join(", ") : (editingService.subServices || "")} onChange={(e) => setEditingService({ ...editingService, subServices: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Engineering Process Steps (Comma-separated)</label>
                        <textarea rows={2} placeholder="1. Audit & Discovery, 2. Schema Design, 3. Full-Stack Dev, 4. Security & Launch" value={Array.isArray(editingService.processSteps) ? editingService.processSteps.join(", ") : (editingService.processSteps || "")} onChange={(e) => setEditingService({ ...editingService, processSteps: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Key Business Outcomes (Comma-separated)</label>
                        <input type="text" placeholder="Sub-100ms LCP, 99.9% Uptime, SEO SSR Architecture, OWASP Hardened" value={Array.isArray(editingService.keyOutcomes) ? editingService.keyOutcomes.join(", ") : (editingService.keyOutcomes || "")} onChange={(e) => setEditingService({ ...editingService, keyOutcomes: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Tech Stack Badges (Comma-separated)</label>
                        <input type="text" placeholder="React 19, Next.js, TypeScript, Node.js, PostgreSQL, Docker" value={Array.isArray(editingService.techStack) ? editingService.techStack.join(", ") : (editingService.techStack || "")} onChange={(e) => setEditingService({ ...editingService, techStack: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button type="button" onClick={() => setEditingService(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save & Publish Service Page</button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-wider">
                      <Eye size={16} className="text-[#FF4D37]" /> Live Frontend Portal Preview
                    </div>
                    <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 dark:bg-slate-800 text-[#FF4D37] uppercase">
                          {editingService.category || "Service Category"}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">● Active on Portal</span>
                      </div>
                      <h4 className="text-xl font-black text-[#182033] dark:text-white">{editingService.title || "Service Title Placeholder"}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{editingService.description || "Card summary will appear here..."}</p>
                      {editingService.note && (
                        <div className="p-3 rounded-xl bg-orange-50 dark:bg-slate-900/60 border border-orange-200 dark:border-slate-800 text-[11px] font-bold text-[#FF4D37]">
                          💡 {editingService.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <Layers size={22} className="text-[#FF4D37]" /> Manage Portal Services
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Add, edit, or remove technical services displayed on the Services page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService({
                        id: "",
                        title: "",
                        category: "",
                        description: "",
                        note: "",
                        detailedOverview: "",
                        highlights: "",
                        subServices: "",
                        processSteps: "",
                        keyOutcomes: "",
                        techStack: ""
                      })
                    }
                    className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add New Service
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicesCms.map((srv) => (
                    <div key={srv.id} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 dark:bg-slate-800 text-[#FF4D37]">
                          {srv.category}
                        </span>
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{srv.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{srv.description}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingService(srv)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteServiceCms(srv.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS RESOURCES & BLOGS */}
          {/* --------------------------------------------------------- */}
          {activeTab === "resources_cms" && (
            editingResource ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditingResource(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Resources List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {editingResource.id ? "Edit Resource Article" : "New Resource Creator"}
                  </span>
                </div>

                <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <BookOpen size={22} className="text-[#FF4D37]" />
                      {editingResource.id ? `Edit Article: ${editingResource.title || "Untitled"}` : "Create Blog & Resource Article"}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveResourceCms} className="space-y-6 text-xs">
                    
                    {/* SECTION 1: FEATURED IMAGE UPLOAD (Matching Screenshot 1 & 2) */}
                    <div className="space-y-2">
                      <label className="block font-black text-gray-800 dark:text-gray-200 text-sm">Featured Image</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl p-6 text-center bg-gray-50/50 dark:bg-slate-900/50 hover:border-[#FF4D37] transition group space-y-3 relative overflow-hidden">
                        {editingResource.image ? (
                          <div className="relative max-h-48 rounded-2xl overflow-hidden group">
                            <img src={editingResource.image} alt="Featured Preview" className="w-full h-48 object-cover rounded-2xl" />
                            <button
                              type="button"
                              onClick={() => setEditingResource({ ...editingResource, image: "" })}
                              className="absolute top-2 right-2 p-2 rounded-xl bg-black/70 text-white hover:bg-rose-600 transition"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-slate-800 text-[#FF4D37] mx-auto flex items-center justify-center border border-orange-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition">
                              <BookOpen size={24} />
                            </div>
                            <div>
                              <p className="font-extrabold text-gray-800 dark:text-gray-200 text-xs">Click to upload an image</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WebP or GIF (max. 5MB)</p>
                            </div>
                          </>
                        )}
                        <input
                          type="text"
                          placeholder="Or paste direct Image URL (e.g., https://images.unsplash.com/...)"
                          value={editingResource.image || ""}
                          onChange={(e) => setEditingResource({ ...editingResource, image: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-xs outline-none focus:border-[#FF4D37] text-center"
                        />
                      </div>
                    </div>

                    {/* SECTION 2: POST DETAILS (Matching Screenshot 1 & 2) */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <h4 className="text-base font-black text-[#182033] dark:text-white">Post Details</h4>

                      {/* Title */}
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                          Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter post title..."
                          value={editingResource.title || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                            setEditingResource({
                              ...editingResource,
                              title: val,
                              slug: editingResource.slug || slug,
                            });
                          }}
                          className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37] text-xs"
                        />
                      </div>

                      {/* Author */}
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                          Author <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter author name"
                          value={editingResource.author || ""}
                          onChange={(e) => setEditingResource({ ...editingResource, author: e.target.value })}
                          className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37] text-xs"
                        />
                      </div>

                      {/* custom url */}
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                          custom url <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="my-blog-post"
                          value={editingResource.slug || (editingResource.title ? editingResource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "")}
                          onChange={(e) => setEditingResource({ ...editingResource, slug: e.target.value })}
                          className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37] text-xs"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">URL-friendly version of the title (e.g., my-blog-post)</p>
                      </div>

                      {/* Category Tag Dropdown & Read Time */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                            Category Tag <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={editingResource.category || "Resources & Blueprints"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingResource({
                                ...editingResource,
                                category: val,
                                categoryLabel: val,
                              });
                            }}
                            className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37] text-xs cursor-pointer"
                          >
                            <option value="Resources & Blueprints">Resources & Blueprints</option>
                            <option value="Blogs & Articles">Blogs & Articles</option>
                            <option value="News & Press">News & Press</option>
                            <option value="Events & Webinars">Events & Webinars</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Read Time / Format</label>
                          <input
                            type="text"
                            placeholder="e.g. 5 min read"
                            value={editingResource.readTime || ""}
                            onChange={(e) => setEditingResource({ ...editingResource, readTime: e.target.value })}
                            className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37] text-xs"
                          />
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                          Excerpt <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="A brief summary of the post (displayed in blog listings)"
                          value={editingResource.description || ""}
                          onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                          className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37] text-xs"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">A brief summary of the post (displayed in blog listings)</p>
                      </div>

                      {/* Meta Title */}
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Meta Title (optional)</label>
                        <input
                          type="text"
                          placeholder="Custom title for search engines (leave empty to use post title)"
                          value={editingResource.metaTitle || ""}
                          onChange={(e) => setEditingResource({ ...editingResource, metaTitle: e.target.value })}
                          className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37] text-xs"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">Custom title for search engines (leave empty to use post title)</p>
                      </div>
                    </div>

                    {/* SECTION 3: RICH CONTENT EDITOR WITH TOOLBAR & PREVIEW (Matching Screenshot 3) */}
                    <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="block font-black text-gray-800 dark:text-gray-200 text-sm">
                          Content <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setContentPreviewMode("edit")}
                            className={`px-3 py-1 rounded-lg transition ${contentPreviewMode === "edit" ? "bg-[#FF4D37] text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"}`}
                          >
                            ✏️ Write Content
                          </button>
                          <button
                            type="button"
                            onClick={() => setContentPreviewMode("preview")}
                            className={`px-3 py-1 rounded-lg transition ${contentPreviewMode === "preview" ? "bg-[#FF4D37] text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"}`}
                          >
                            👁️ Live Preview
                          </button>
                        </div>
                      </div>

                      {/* Toolbar Controls */}
                      <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 overflow-hidden">
                        <div className="p-2 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center gap-1 bg-white/50 dark:bg-slate-900/50">
                          {[
                            { label: "H1", prefix: "# ", suffix: "\n", text: "Main Section Heading" },
                            { label: "H2", prefix: "## ", suffix: "\n", text: "Sub-Section Heading" },
                            { label: "H3", prefix: "### ", suffix: "\n", text: "Minor Topic Heading" },
                          ].map((h) => (
                            <button
                              key={h.label}
                              type="button"
                              onClick={() => handleFormatResourceText(h.prefix, h.suffix, h.text)}
                              className="px-2.5 py-1 rounded-lg font-black text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-[#FF4D37] hover:text-white transition"
                            >
                              {h.label}
                            </button>
                          ))}
                          <div className="h-4 w-px bg-gray-300 dark:bg-slate-700 mx-1" />
                          {[
                            { label: "B", prefix: "**", suffix: "**", text: "Bold Text" },
                            { label: "I", prefix: "*", suffix: "*", text: "Italic Text" },
                            { label: "U", prefix: "<u>", suffix: "</u>", text: "Underlined Text" },
                            { label: "Quote", prefix: "> ", suffix: "\n", text: "Quoted insight..." },
                            { label: "List", prefix: "- ", suffix: "\n", text: "Bullet item" },
                          ].map((btn) => (
                            <button
                              key={btn.label}
                              type="button"
                              onClick={() => handleFormatResourceText(btn.prefix, btn.suffix, btn.text)}
                              className="px-2.5 py-1 rounded-lg font-black text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-[#FF4D37] hover:text-white transition"
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>

                        {contentPreviewMode === "edit" ? (
                          <textarea
                            ref={resourceContentTextareaRef}
                            rows={10}
                            required
                            placeholder="Write full post content here..."
                            value={editingResource.summary || ""}
                            onChange={(e) => setEditingResource({ ...editingResource, summary: e.target.value })}
                            className="w-full p-4 bg-transparent font-medium resize-y outline-none text-xs text-gray-800 dark:text-gray-200"
                          />
                        ) : (
                          <div className="p-6 min-h-[240px] text-xs leading-relaxed space-y-2">
                            {editingResource.summary ? (
                              editingResource.summary.split("\n").map((line: string, i: number) => {
                                const t = line.trim();
                                const renderInline = (str: string) => {
                                  const html = str
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")
                                    .replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/gi, '<u>$1</u>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                                  return <span dangerouslySetInnerHTML={{ __html: html }} />;
                                };

                                if (t.startsWith("### ") || /^#\s*H3/i.test(t)) {
                                  const text = t.replace(/^(###|#\s*H3:?)\s*/i, "");
                                  return <h3 key={i} className="text-sm font-black text-[#FF4D37] mt-4 mb-1.5">{renderInline(text)}</h3>;
                                }
                                if (t.startsWith("## ") || /^#\s*H2/i.test(t)) {
                                  const text = t.replace(/^(##|#\s*H2:?)\s*/i, "");
                                  return <h2 key={i} className="text-base font-black text-[#182033] dark:text-white mt-5 mb-2">{renderInline(text)}</h2>;
                                }
                                if (t.startsWith("# ") || /^#\s*H1/i.test(t)) {
                                  const text = t.replace(/^(#|#\s*H1:?)\s*/i, "");
                                  return <h1 key={i} className="text-xl font-black text-[#182033] dark:text-white mt-6 mb-3 border-b border-gray-200 dark:border-slate-800 pb-2">{renderInline(text)}</h1>;
                                }
                                if (t.startsWith("> ")) return <blockquote key={i} className="p-2.5 my-2 border-l-4 border-[#FF4D37] bg-orange-50/50 dark:bg-slate-900/50 rounded-r-xl italic text-gray-700 dark:text-gray-300">{renderInline(t.slice(2))}</blockquote>;
                                if (t.startsWith("- ")) return <li key={i} className="ml-4 list-disc font-medium text-gray-700 dark:text-gray-300">{renderInline(t.slice(2))}</li>;
                                if (!t) return <div key={i} className="h-1.5" />;
                                return <p key={i} className="text-gray-700 dark:text-gray-300">{renderInline(t)}</p>;
                              })
                            ) : (
                              <span className="text-gray-400 italic">No content entered to preview yet...</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    <div>
                      <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Key Takeaways (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Chunking strategies, Qdrant indexing, Hybrid search"
                        value={Array.isArray(editingResource.takeaways) ? editingResource.takeaways.join(", ") : (editingResource.takeaways || "")}
                        onChange={(e) => setEditingResource({ ...editingResource, takeaways: e.target.value })}
                        className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37] text-xs"
                      />
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingResource(null)}
                        className="px-6 py-3.5 rounded-2xl text-gray-500 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition text-xs"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="brand-button px-8 py-3.5 text-xs font-black shadow-lg">
                        Save & Publish Article
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <BookOpen size={22} className="text-[#FF4D37]" /> Manage Resources & Blogs
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Publish new blog posts, press releases, and guides for the portal.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingResource({ title: "", category: "Resources & Blueprints", categoryLabel: "Resources & Blueprints", readTime: "5 min read", description: "" })}
                    className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add New Article
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resourcesCms.map((res) => (
                    <div key={res.id} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
                            {res.category}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400">{res.readTime}</span>
                        </div>
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{res.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{res.description}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingResource(res)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteResourceCms(res.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS CAREER DOMAINS */}
          {/* --------------------------------------------------------- */}
          {activeTab === "careers_cms" && (
            editingCareer ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditingCareer(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Career Domains List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {editingCareer.id ? "Edit Internship Domain" : "New Domain Creator"}
                  </span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                        <FolderPlus size={22} className="text-[#FF4D37]" />
                        {editingCareer.id ? `Edit Domain: ${editingCareer.title || "Untitled"}` : "Add Internship Domain"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Define training domain details, stipend policies, duration, and curriculum overview.</p>
                    </div>

                    <form onSubmit={handleSaveCareerCms} className="space-y-4 text-xs">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Domain Title</label>
                          <input type="text" required placeholder="e.g. Artificial Intelligence" value={editingCareer.title || ""} onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Category Slug (ai / web / mobile / cloud)</label>
                          <input type="text" placeholder="ai / web / mobile / cloud" value={editingCareer.category || ""} onChange={(e) => setEditingCareer({ ...editingCareer, category: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Trend Badge</label>
                          <input type="text" placeholder="🔥 #1 Most Popular" value={editingCareer.badge || ""} onChange={(e) => setEditingCareer({ ...editingCareer, badge: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                          <input type="text" placeholder="2 - 6 Months" value={editingCareer.duration || ""} onChange={(e) => setEditingCareer({ ...editingCareer, duration: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Work Mode</label>
                          <input type="text" placeholder="Online / Hybrid" value={editingCareer.mode || "Online / Hybrid"} onChange={(e) => setEditingCareer({ ...editingCareer, mode: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Stipend Policy</label>
                          <input type="text" placeholder="Performance Based / Performance Stipend" value={editingCareer.stipend || "Performance Based"} onChange={(e) => setEditingCareer({ ...editingCareer, stipend: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Prerequisites & Requirements</label>
                          <input type="text" placeholder="Laptop, basic programming, 10 hrs/week" value={editingCareer.requirements || ""} onChange={(e) => setEditingCareer({ ...editingCareer, requirements: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Domain Card Summary (Teaser)</label>
                        <textarea rows={2} placeholder="Brief domain description displayed on card..." value={editingCareer.desc || ""} onChange={(e) => setEditingCareer({ ...editingCareer, desc: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Detailed Syllabus & Curriculum Overview</label>
                        <textarea rows={5} placeholder="Full curriculum overview (Machine Learning, PyTorch, RAG Pipelines, Python & PyTorch)..." value={editingCareer.detailedCurriculum || ""} onChange={(e) => setEditingCareer({ ...editingCareer, detailedCurriculum: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button type="button" onClick={() => setEditingCareer(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save & Publish Domain</button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-wider">
                      <Eye size={16} className="text-[#FF4D37]" /> Live Domain Card Preview
                    </div>
                    <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 dark:bg-slate-800 text-[#FF4D37]">
                          {editingCareer.badge || "🔥 Trending"}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">{editingCareer.duration || "2 - 6 Months"}</span>
                      </div>
                      <h4 className="text-xl font-black text-[#182033] dark:text-white">{editingCareer.title || "Domain Title Placeholder"}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{editingCareer.desc || "Curriculum description will appear here..."}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <FolderPlus size={22} className="text-[#FF4D37]" /> Manage Career & Internship Domains
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Add or update internship training domains displayed on the Career page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCareer({ id: "", title: "", category: "", badge: "", duration: "", desc: "" })}
                    className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add New Domain
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careersCms.map((car) => (
                    <div key={car.id} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-100 dark:bg-slate-800 text-[#FF4D37]">
                            {car.badge}
                          </span>
                          <span className="text-[11px] font-bold text-gray-400">{car.duration}</span>
                        </div>
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{car.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{car.desc}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCareer(car)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCareerCms(car.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS TESTIMONIALS */}
          {/* --------------------------------------------------------- */}
          {activeTab === "testimonials_cms" && (
            editingTestimonial ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditingTestimonial(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Testimonials List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {editingTestimonial.id ? "Edit Testimonial" : "New Testimonial Creator"}
                  </span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                        <MessageSquare size={22} className="text-[#FF4D37]" />
                        {editingTestimonial.id ? `Edit Review: ${editingTestimonial.name || "Untitled"}` : "Add Testimonial"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Manage client rating, feedback text, and reviewer credentials.</p>
                    </div>

                    <form onSubmit={handleSaveTestimonialCms} className="space-y-4 text-xs">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Client / Student Name</label>
                          <input type="text" required placeholder="e.g. Vikram Sharma" value={editingTestimonial.name || ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Company / Role</label>
                          <input type="text" placeholder="e.g. CEO, Himalayan Solutions" value={editingTestimonial.company || ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Review & Client Feedback</label>
                        <textarea rows={4} placeholder="Write detailed client review text..." value={editingTestimonial.review || ""} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, review: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button type="button" onClick={() => setEditingTestimonial(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save & Publish Review</button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-wider">
                      <Eye size={16} className="text-[#FF4D37]" /> Live Card Preview
                    </div>
                    <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#182033] dark:text-white">{editingTestimonial.name || "Client Name"}</span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[#FF4D37]">{editingTestimonial.company || "Company Placeholder"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium italic">"{editingTestimonial.review || "Review text will appear here..."}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <MessageSquare size={22} className="text-[#FF4D37]" /> Manage Client & Student Testimonials
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Add, edit, or remove testimonials displayed on the homepage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial({ id: "", name: "", company: "", rating: 5, review: "" })}
                    className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Testimonial
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonialsCms.map((tst) => (
                    <div key={tst.id} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#182033] dark:text-white">{tst.name}</span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {Array.from({ length: tst.rating || 5 }).map((_, i) => (
                              <Star key={i} size={12} className="fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] font-bold text-[#FF4D37]">{tst.company}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium italic">"{tst.review}"</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTestimonial(tst)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonialCms(tst.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS PROCESS STEPS */}
          {/* --------------------------------------------------------- */}
          {activeTab === "process_cms" && (
            editingProcess ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setEditingProcess(null)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 transition shadow-sm">
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Process List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{editingProcess.id ? "Edit Step" : "New Process Step"}</span>
                </div>
                <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2"><Sparkles size={22} className="text-[#FF4D37]" /> Configure Engineering Process Step</h3>
                  <form onSubmit={handleSaveProcessCms} className="space-y-4 text-xs">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Step Number (e.g. 01, 02)</label>
                        <input type="text" required placeholder="01" value={editingProcess.step || ""} onChange={(e) => setEditingProcess({ ...editingProcess, step: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold" />
                      </div>
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Step Title</label>
                        <input type="text" required placeholder="Discovery & Planning" value={editingProcess.title || ""} onChange={(e) => setEditingProcess({ ...editingProcess, title: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Step Description</label>
                      <textarea rows={3} required placeholder="Detailed step description..." value={editingProcess.description || ""} onChange={(e) => setEditingProcess({ ...editingProcess, description: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <button type="button" onClick={() => setEditingProcess(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold">Cancel</button>
                      <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save Process Step</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2"><Sparkles size={22} className="text-[#FF4D37]" /> Manage Engineering Process Steps</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Edit step titles and descriptions rendered in the 'How We Work' homepage section.</p>
                  </div>
                  <button type="button" onClick={() => setEditingProcess({ id: "", step: "", title: "", description: "" })} className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"><Plus size={16} /> Add Process Step</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {processCms.map((item, idx) => (
                    <div key={item.id || idx} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-3xl font-black text-[#FF4D37]/30">{item.step || `0${idx + 1}`}</span>
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{item.description}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                        <button onClick={() => setEditingProcess(item)} className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37]"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteProcessCms(item.id)} className="p-2 rounded-xl text-gray-400 hover:text-rose-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS WHY CHOOSE US FEATURES */}
          {/* --------------------------------------------------------- */}
          {activeTab === "whychoseus_cms" && (
            editingWhychoseus ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setEditingWhychoseus(null)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 transition shadow-sm">
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Features List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{editingWhychoseus.id ? "Edit Feature Card" : "New Feature Card"}</span>
                </div>
                <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2"><CheckCircle2 size={22} className="text-[#FF4D37]" /> Configure Feature Card</h3>
                  <form onSubmit={handleSaveWhychoseusCms} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Feature Title</label>
                      <input type="text" required placeholder="End-to-End Solutions" value={editingWhychoseus.title || ""} onChange={(e) => setEditingWhychoseus({ ...editingWhychoseus, title: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold" />
                    </div>
                    <div>
                      <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Feature Description</label>
                      <textarea rows={3} required placeholder="Description of value proposition..." value={editingWhychoseus.description || ""} onChange={(e) => setEditingWhychoseus({ ...editingWhychoseus, description: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <button type="button" onClick={() => setEditingWhychoseus(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold">Cancel</button>
                      <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save Feature Card</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2"><CheckCircle2 size={22} className="text-[#FF4D37]" /> Manage Why Choose Us Features</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Add or update value proposition feature cards rendered on the homepage.</p>
                  </div>
                  <button type="button" onClick={() => setEditingWhychoseus({ id: "", title: "", description: "", icon: "" })} className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"><Plus size={16} /> Add Feature Card</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {whychoseusCms.map((item, idx) => (
                    <div key={item.id || idx} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{item.description}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                        <button onClick={() => setEditingWhychoseus(item)} className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37]"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteWhychoseusCms(item.id)} className="p-2 rounded-xl text-gray-400 hover:text-rose-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS COMPANY METRICS & PRINCIPLES */}
          {/* --------------------------------------------------------- */}
          {activeTab === "about_cms" && (
            editingAbout ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setEditingAbout(null)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 transition shadow-sm">
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Metrics List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{editingAbout.id ? "Edit Metric/Principle" : "New Metric/Principle"}</span>
                </div>
                <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2"><Target size={22} className="text-[#FF4D37]" /> Configure Metric / Principle</h3>
                  <form onSubmit={handleSaveAboutCms} className="space-y-4 text-xs">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Item Category Type</label>
                        <select value={editingAbout.type || "metric"} onChange={(e) => setEditingAbout({ ...editingAbout, type: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold">
                          <option value="metric">Key Metric (Stat)</option>
                          <option value="principle">Core Principle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Item Title / Value</label>
                        <input type="text" required placeholder="e.g. 100+ Projects or Outcome-Driven" value={editingAbout.title || ""} onChange={(e) => setEditingAbout({ ...editingAbout, title: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold" />
                      </div>
                    </div>
                    {editingAbout.type === "metric" && (
                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Metric Number/Stat Value (e.g. 100+, 50+)</label>
                        <input type="text" placeholder="100+" value={editingAbout.value || ""} onChange={(e) => setEditingAbout({ ...editingAbout, value: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold" />
                      </div>
                    )}
                    <div>
                      <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Description / Label</label>
                      <textarea rows={3} required placeholder="Label or description text..." value={editingAbout.label || ""} onChange={(e) => setEditingAbout({ ...editingAbout, label: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <button type="button" onClick={() => setEditingAbout(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold">Cancel</button>
                      <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save Metric Item</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2"><Target size={22} className="text-[#FF4D37]" /> Manage Company Metrics & Core Principles</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage key statistics and principles rendered on the 'About Us' section.</p>
                  </div>
                  <button type="button" onClick={() => setEditingAbout({ id: "", type: "metric", title: "", value: "", label: "" })} className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"><Plus size={16} /> Add Metric / Principle</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {aboutCms.map((item, idx) => (
                    <div key={item.id || idx} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-orange-100 dark:bg-slate-800 text-[#FF4D37]">{item.type || "metric"}</span>
                        <h4 className="text-xl font-black text-[#FF4D37]">{item.value || item.title}</h4>
                        <p className="text-xs font-bold text-[#182033] dark:text-white">{item.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{item.label}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                        <button onClick={() => setEditingAbout(item)} className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37]"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteAboutCms(item.id)} className="p-2 rounded-xl text-gray-400 hover:text-rose-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS INDUSTRIES */}
          {/* --------------------------------------------------------- */}
          {activeTab === "industries_cms" && (
            editingIndustry ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditingIndustry(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Industry List
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {editingIndustry.id ? "Edit Industry Vertical" : "New Vertical Creator"}
                  </span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                        <Building2 size={22} className="text-[#FF4D37]" />
                        {editingIndustry.id ? `Edit Vertical: ${editingIndustry.title || "Untitled"}` : "Add Industry Vertical"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Configure industry slug, title, tagline, and technical overview.</p>
                    </div>

                    <form onSubmit={handleSaveIndustryCms} className="space-y-4 text-xs">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Industry Slug (ID)</label>
                          <input type="text" required placeholder="e.g. healthcare, fintech" value={editingIndustry.id || ""} onChange={(e) => setEditingIndustry({ ...editingIndustry, id: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Vertical Title</label>
                          <input type="text" required placeholder="e.g. Healthcare & Telemedicine" value={editingIndustry.title || ""} onChange={(e) => setEditingIndustry({ ...editingIndustry, title: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Tagline</label>
                        <input type="text" placeholder="e.g. HIPAA Compliant Digital Health Systems" value={editingIndustry.tagline || ""} onChange={(e) => setEditingIndustry({ ...editingIndustry, tagline: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Industry Description</label>
                        <textarea rows={4} placeholder="Full description of software solutions for this vertical..." value={editingIndustry.description || ""} onChange={(e) => setEditingIndustry({ ...editingIndustry, description: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button type="button" onClick={() => setEditingIndustry(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save & Publish Vertical</button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-wider">
                      <Eye size={16} className="text-[#FF4D37]" /> Live Card Preview
                    </div>
                    <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 uppercase">
                        {editingIndustry.id || "SLUG"}
                      </span>
                      <h4 className="text-xl font-black text-[#182033] dark:text-white">{editingIndustry.title || "Vertical Title Placeholder"}</h4>
                      <p className="text-xs font-bold text-[#FF4D37]">{editingIndustry.tagline || "Tagline placeholder"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{editingIndustry.description || "Description placeholder..."}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <Building2 size={22} className="text-[#FF4D37]" /> Manage Industry Verticals
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Add or update industry verticals displayed across the portal.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingIndustry({ id: "", title: "", tagline: "", description: "" })}
                    className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Industry Vertical
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {industriesCms.map((ind) => (
                    <div key={ind.id} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 uppercase">
                          {ind.id}
                        </span>
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{ind.title}</h4>
                        <p className="text-xs font-bold text-[#FF4D37]">{ind.tagline}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{ind.description}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingIndustry(ind)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteIndustryCms(ind.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: CMS TEAM MEMBERS */}
          {/* --------------------------------------------------------- */}
          {activeTab === "team_cms" && (
            editingTeam ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setEditingTeam(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={16} className="text-[#FF4D37]" /> Back to Team Directory
                  </button>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {editingTeam.id ? "Edit Team Profile" : "New Team Member Creator"}
                  </span>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                        <UserCheck size={22} className="text-[#FF4D37]" />
                        {editingTeam.id ? `Edit Member: ${editingTeam.name || "Untitled"}` : "Add Team Member"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Configure team member profile, designation, and bio.</p>
                    </div>

                    <form onSubmit={handleSaveTeamCms} className="space-y-4 text-xs">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                          <input type="text" required placeholder="e.g. Shivansh Thapa" value={editingTeam.name || ""} onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Role / Designation</label>
                          <input type="text" placeholder="e.g. Lead Systems Architect" value={editingTeam.role || ""} onChange={(e) => setEditingTeam({ ...editingTeam, role: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-bold outline-none focus:border-[#FF4D37]" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input type="email" placeholder="e.g. shivansh@techellixir.com" value={editingTeam.email || ""} onChange={(e) => setEditingTeam({ ...editingTeam, email: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-semibold outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div>
                        <label className="block font-extrabold text-gray-700 dark:text-gray-300 mb-1">Bio & Technical Background</label>
                        <textarea rows={4} placeholder="Full engineering bio and accomplishments..." value={editingTeam.bio || ""} onChange={(e) => setEditingTeam({ ...editingTeam, bio: e.target.value })} className="w-full p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none outline-none focus:border-[#FF4D37]" />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <button type="button" onClick={() => setEditingTeam(null)} className="px-6 py-3 rounded-2xl text-gray-500 font-extrabold hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
                        <button type="submit" className="brand-button px-8 py-3 text-xs font-black shadow-lg">Save & Publish Profile</button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-wider">
                      <Eye size={16} className="text-[#FF4D37]" /> Live Card Preview
                    </div>
                    <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-3">
                      <h4 className="text-xl font-black text-[#182033] dark:text-white">{editingTeam.name || "Member Name"}</h4>
                      <p className="text-xs font-extrabold text-[#FF4D37]">{editingTeam.role || "Role Placeholder"}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{editingTeam.bio || "Bio placeholder..."}</p>
                      <p className="text-[11px] font-semibold text-gray-400">{editingTeam.email || "email@techellixir.com"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                      <UserCheck size={22} className="text-[#FF4D37]" /> Manage Team Members
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Add or update leadership and engineering team profiles.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingTeam({ id: "", name: "", role: "", bio: "", email: "", linkedin: "", github: "" })}
                    className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Team Member
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamCms.map((tm) => (
                    <div key={tm.id} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-base font-black text-[#182033] dark:text-white">{tm.name}</h4>
                        <p className="text-xs font-extrabold text-[#FF4D37]">{tm.role}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{tm.bio}</p>
                        <p className="text-[11px] font-semibold text-gray-400">{tm.email}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTeam(tm)}
                          className="p-2 rounded-xl text-gray-500 hover:text-[#FF4D37] hover:bg-orange-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTeamCms(tm.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB: DATABASE EXPLORER */}
          {/* --------------------------------------------------------- */}
          {activeTab === "database" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                    <Database size={22} className="text-[#FF4D37]" /> Database Health & Storage Inspection
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Real-time JSON document table metrics, disk storage sizes, and row counts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void refreshStats()}
                  className="brand-button px-5 py-3 text-xs font-black cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <RefreshCw size={15} /> Refresh Stats
                </button>
              </div>

              {dbStatsData && (
                <div className="grid md:grid-cols-3 gap-5">
                  {Object.entries(dbStatsData.tables || {})
                    .filter(([tableName]) => !["process", "whychoseus", "about", "settings", "team"].includes(tableName))
                    .map(([tableName, info]: [string, any]) => (
                    <div key={tableName} className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-[#FF4D37]">{tableName}</span>
                        <span className="text-[10px] font-bold text-gray-400">{info.sizeBytes} Bytes</span>
                      </div>
                      <p className="text-2xl font-black text-[#182033] dark:text-white">{info.rowCount} {info.rowCount === 1 ? "Record" : "Records"}</p>
                      <p className="text-[11px] font-medium text-gray-400">Last Modified: {info.updatedAt ? new Date(info.updatedAt).toLocaleString() : "N/A"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "settings" && (
            <div className="soft-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                  <Settings size={22} className="text-[#FF4D37]" /> System Controls & Global Banner State
                </h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Global Site Announcement Banner Message
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🚀 TechEllixir 2.0 AI Internship Registrations OPEN!"
                    value={settings.announcementBanner}
                    onChange={(e) => setSettings({ ...settings, announcementBanner: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-[#182033] dark:text-white">System Maintenance Mode</p>
                    <p className="text-xs text-gray-500 font-medium">Restrict user access to maintain servers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="h-6 w-6 accent-[#FF4D37] cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="brand-button px-8 py-4 text-xs font-black cursor-pointer shadow-lg inline-flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Save Portal Controls
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* DIRECT EMAIL REPLY MODAL */}
      {/* --------------------------------------------------------- */}

      {/* Direct Email Reply Modal */}
      <AnimatePresence>
        {replyRecipient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161c2a] p-6 space-y-4">
              <h3 className="text-lg font-black text-[#182033] dark:text-white">Direct Email Dispatch to {replyRecipient.email}</h3>
              <form onSubmit={handleSendReply} className="space-y-4 text-xs">
                <textarea rows={5} required placeholder="Write official message response..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 font-medium resize-none" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setReplyRecipient(null)} className="px-4 py-2 rounded-xl text-gray-500 font-bold">Cancel</button>
                  <button type="submit" disabled={isSendingReply} className="brand-button px-5 py-2 text-xs font-black">Send Email</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
