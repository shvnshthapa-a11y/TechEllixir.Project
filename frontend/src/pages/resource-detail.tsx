import React, { useState } from "react";
import { useSearchParams, useParams, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Share2,
  Bookmark,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Send,
  Calendar,
  MapPin,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface ResourceData {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  fileFormat: string;
  difficulty: string;
  readTime: string;
  publishDate: string;
  author: string;
  image: string;
  techStack: string[];
  prerequisites: string[];
  deliverables: string[];
  executionSteps: { step: string; title: string; description: string }[];
  content: string[];
  eventInfo?: {
    date: string;
    time: string;
    location: string;
    speaker: string;
  };
}

const resourceCatalog: Record<string, ResourceData> = {
  "rag-blueprint": {
    id: "rag-blueprint",
    title: "The 2026 Enterprise AI & LLM Implementation Blueprint",
    category: "Whitepaper Blueprint",
    tag: "AI Architecture",
    description: "A complete 42-page technical guide on building low-latency Retrieval-Augmented Generation (RAG) pipelines, vector database optimization, and guardrail security.",
    fileFormat: "PDF Blueprint (4.2 MB)",
    difficulty: "Advanced",
    readTime: "18 min read",
    publishDate: "July 24, 2026",
    author: "Dr. Aris Thorne (Head of AI Engineering)",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200",
    techStack: ["Python 3.12", "FastAPI", "Qdrant Vector DB", "OpenAI API", "Cohere Re-ranker", "Docker"],
    prerequisites: [
      "Docker & Docker Compose v24+ installed locally",
      "Python 3.11+ environment with Pipenv or Poetry",
      "Valid OpenAI API key and Qdrant Cloud or self-hosted vector instance"
    ],
    deliverables: [
      "42-Page Enterprise Architecture Specification (PDF Report)",
      "Production-ready Docker Compose & Qdrant vector store YAML files",
      "FastAPI Hybrid Search Webhook Middleware with BM25 re-ranking",
      "Ragas automated accuracy benchmark validation script"
    ],
    executionSteps: [
      { step: "01", title: "Vector Database Initialization", description: "Spin up Qdrant vector database via Docker Compose with HNSW indexing enabled." },
      { step: "02", title: "Document Chunking & Token Overlap", description: "Execute Python ingestion pipeline partitioning documents into 512-token chunks with 50-token overlap." },
      { step: "03", title: "Hybrid Retrieval & Cohere Re-ranking", description: "Configure sparse BM25 keyword matching combined with bge-large-en dense embeddings." },
      { step: "04", title: "Security Guardrails & Deployment", description: "Apply zero-trust PII masking and prompt injection filtering before serving queries." }
    ],
    content: [
      "Executive Summary: Enterprise adoption of Large Language Models (LLMs) requires robust Retrieval-Augmented Generation (RAG) frameworks to eliminate hallucinations and enforce strict data privacy boundaries.",
      "1. Vector Database Architecture: Comparing Qdrant, Milvus, and Pinecone for multi-million vector indexing under sub-50ms query constraints.",
      "2. Chunking & Hybrid Search Strategies: Combining semantic dense retrieval (BGE-large) with sparse keyword search (BM25) to achieve 98.4% context recall precision.",
      "3. Real-Time Security Guardrails: Implementing zero-trust PII masking, prompt injection defense, and OWASP LLM Top 10 mitigation before passing context to foundation models.",
      "Key Takeaway: Scaling RAG systems requires decoupled indexing worker pools, asynchronous cache warming, and continuous evaluation using Ragas frameworks."
    ],
  },
  "microservices-guide": {
    id: "microservices-guide",
    title: "Zero-Trust Microservices & Kubernetes Security Handbook",
    category: "Technical Guide",
    tag: "DevOps",
    description: "Step-by-step architectural guide on implementing Istio service mesh, mTLS encryption, and automated CI/CD security scanning across distributed clusters.",
    fileFormat: "PDF & Code Repo (8.1 MB)",
    difficulty: "Intermediate",
    readTime: "24 min read",
    publishDate: "July 18, 2026",
    author: "Marcus Vance (Principal Cloud Architect)",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    techStack: ["Kubernetes 1.30", "Istio Ambient", "HashiCorp Vault", "Helm", "Terraform", "GitHub Actions"],
    prerequisites: [
      "Running Kubernetes cluster (minikube, EKS, or GKE)",
      "Helm 3.x cli installed with cluster-admin access",
      "Basic understanding of mTLS and X.509 certificate chains"
    ],
    deliverables: [
      "Complete Terraform manifests for EKS/GKE VPC isolation",
      "Istio Ambient Mesh configuration files with mutual TLS enforcement",
      "HashiCorp Vault dynamic secret injection pod templates",
      "Trivy vulnerability scanning GitHub Actions workflow"
    ],
    executionSteps: [
      { step: "01", title: "Cluster Provisioning with Terraform", description: "Deploy private VPC subnets with NAT gateways and strict ingress security rules." },
      { step: "02", title: "Istio Service Mesh Installation", description: "Install Istio ambient mesh to enable automatic pod-to-pod mTLS without heavy sidecars." },
      { step: "03", title: "Vault Dynamic Secrets Integration", description: "Connect HashiCorp Vault Agent Injector for zero-trust database credential generation." },
      { step: "04", title: "Continuous Compliance Auditing", description: "Run automated Kube-bench and Trivy vulnerability scans in CI/CD pipelines." }
    ],
    content: [
      "Executive Summary: Microservice security cannot rely solely on perimeter firewalls. A zero-trust network model requires cryptographic identity verification for every inter-service HTTP/gRPC invocation.",
      "1. Service Mesh Integration: Deploying Istio ambient mesh for automatic mTLS sidecar-less encryption and traffic management across multi-region Kubernetes clusters.",
      "2. Container Image Hardening: Using Distroless base images and automated Trivy vulnerability scanning within GitHub Actions pipelines.",
      "3. HashiCorp Vault Secrets Rotation: Dynamically injecting database credentials and TLS certificates into pod environments without storing secrets in version control."
    ],
  },
  "react-19-guide": {
    id: "react-19-guide",
    title: "Mastering React 19 & Server Components in Production",
    category: "Architecture Blueprint",
    tag: "React 19",
    description: "Deep dive into React 19 Server Actions, useActionState, optimistic updates, and bundling strategies for sub-100ms LCP web performance.",
    fileFormat: "Interactive Article",
    difficulty: "Intermediate",
    readTime: "12 min read",
    publishDate: "July 20, 2026",
    author: "Elena Rostova (Lead Frontend Architect)",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    techStack: ["React 19", "Next.js 15", "TypeScript 5.5", "Tailwind CSS v4", "Vite 6"],
    prerequisites: [
      "Node.js 20 LTS or Node.js 22+",
      "Familiarity with React Server Components (RSC) paradigm",
      "Existing React 18 codebase targeted for migration"
    ],
    deliverables: [
      "React 19 Migration Checklist & Codemod scripts",
      "Reusable useActionState & useOptimistic custom hook templates",
      "Tailwind v4 CSS @theme design token configuration file",
      "Webpack/Vite compiler optimization config for zero-bundle hooks"
    ],
    executionSteps: [
      { step: "01", title: "Dependencies & Codemod Upgrade", description: "Run automated React 19 codemod scripts to update ref props and context providers." },
      { step: "02", title: "React Compiler Enablement", description: "Configure the Babel / Vite React Compiler plugin to automate component memoization." },
      { step: "03", title: "Form Server Actions Refactoring", description: "Replace legacy Redux / Axios form handlers with native Server Actions & useActionState." },
      { step: "04", title: "Tailwind v4 CSS Directives", description: "Migrate tailwind.config.js to CSS-first @theme variables for faster HMR." }
    ],
    content: [
      "Executive Summary: React 19 redefines web application architecture by shifting component execution to the server by default. This eliminates heavy client-side JavaScript bundles and simplifies data mutation.",
      "1. Server Actions vs Client Fetching: How to write server-side mutation functions directly alongside UI components without boilerplate REST or GraphQL client code.",
      "2. Optimistic UI Updates with useOptimistic: Providing immediate zero-latency UI feedback to users while background mutations resolve across the network.",
      "3. Asset Loading & Preloading Optimization: Leveraging React 19's native stylesheet and script preloading hooks to eliminate layout shifts (CLS)."
    ],
  },
};

const defaultResource: ResourceData = {
  id: "default-resource",
  title: "TechEllixir Enterprise Architecture Asset",
  category: "Technical Blueprint",
  tag: "Architecture",
  description: "Comprehensive technical asset containing architectural blueprints, performance benchmarks, and deployment guidelines for enterprise software systems.",
  fileFormat: "PDF Asset (5.0 MB)",
  difficulty: "All Levels",
  readTime: "15 min read",
  publishDate: "July 2026",
  author: "TechEllixir Technical Editorial Board",
  image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
  techStack: ["TypeScript", "Docker", "Kubernetes", "PostgreSQL"],
  prerequisites: ["Standard cloud deployment environment", "Basic CLI experience"],
  deliverables: ["Comprehensive PDF Whitepaper", "Production deployment configuration files"],
  executionSteps: [
    { step: "01", title: "System Setup", description: "Prepare cluster and configure environment parameters." },
    { step: "02", title: "Deployment", description: "Deploy microservices and verify service health." }
  ],
  content: [
    "Executive Summary: Modern software systems require continuous architectural evolution to handle real-time AI workloads, cloud scaling, and strict security compliance.",
    "1. Architectural Fundamentals: Decoupling frontend presentation from backend microservices using event-driven message brokers.",
    "2. Security & Operations: Enforcing zero-trust encryption at rest and in transit across multi-cloud environments.",
    "3. Scalability Benchmarks: Achieving sub-100ms response times under high concurrent user load."
  ],
};

const ResourceDetailPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const resourceId = params.id || searchParams.get("id") || "rag-blueprint";

  const resource = resourceCatalog[resourceId] || defaultResource;

  const [emailInput, setEmailInput] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setDownloading(true);

    try {
      await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          resourceTitle: resource.title,
          fileFormat: resource.fileFormat,
        }),
      });
    } catch (err) {
      console.error("Resource download submission error:", err);
    }

    setDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setEmailInput("");
    }, 3500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] pt-28 pb-20 text-[#182033] dark:text-gray-100 transition-colors duration-300">
      <div className="container-shell max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          <NavLink to="/" className="hover:text-[#FF4D37] transition">Home</NavLink>
          <ChevronRight size={14} />
          <NavLink to="/resources" className="hover:text-[#FF4D37] transition">Resources Hub</NavLink>
          <ChevronRight size={14} />
          <span className="text-[#FF4D37] font-black">{resource.category}</span>
        </div>

        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="ghost-button px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Knowledge Hub
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`ghost-button px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                bookmarked ? "text-[#FF4D37]" : ""
              }`}
            >
              <Bookmark size={16} className={bookmarked ? "fill-current" : ""} />
              <span>{bookmarked ? "Saved" : "Save Asset"}</span>
            </button>

            <button
              onClick={handleShare}
              className="ghost-button px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={16} />
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="soft-card rounded-3xl overflow-hidden bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-xl">
          <div className="grid lg:grid-cols-12">
            
            {/* Left Header Info */}
            <div className="lg:col-span-7 p-8 sm:p-10 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] text-xs font-extrabold border border-orange-200 dark:border-slate-700">
                  {resource.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold">
                  #{resource.tag}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {resource.difficulty}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#182033] dark:text-white leading-tight">
                {resource.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {resource.description}
              </p>

              {/* Event Specific Info Banner if Event */}
              {resource.eventInfo && (
                <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 space-y-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
                  <div className="flex items-center gap-2 text-[#FF4D37] font-bold">
                    <Calendar size={15} /> Event Schedule: {resource.eventInfo.date} ({resource.eventInfo.time})
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={15} /> Location: {resource.eventInfo.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User size={15} /> Speaker: {resource.eventInfo.speaker}
                  </div>
                </div>
              )}

              {/* Author & Meta Bar */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-bold">
                  <User size={14} className="text-[#FF4D37]" /> {resource.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {resource.readTime}
                </span>
                <span>•</span>
                <span>{resource.publishDate}</span>
              </div>
            </div>

            {/* Right Cover Image */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182033]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white dark:lg:from-[#161c2a] lg:via-transparent lg:to-transparent"></div>
            </div>

          </div>
        </div>

        {/* Technology Stack & Deliverables Badges */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Tech Stack */}
          <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase text-[#FF4D37] tracking-wider flex items-center gap-2">
              <Cpu size={16} /> Technology Stack & Tools
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {resource.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 text-xs font-bold border border-gray-200 dark:border-slate-700"
                >
                  ⚡ {tech}
                </span>
              ))}
            </div>
          </div>

          {/* System Prerequisites */}
          <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase text-[#FF4D37] tracking-wider flex items-center gap-2">
              <Terminal size={16} /> System Prerequisites
            </h3>
            <ul className="space-y-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
              {resource.prerequisites.map((pre, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#FF4D37] font-black">•</span>
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Implementation Pipeline Stepper */}
        {resource.executionSteps && resource.executionSteps.length > 0 && (
          <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex items-center gap-2 text-sm font-black text-[#FF4D37] uppercase tracking-wider">
              <Layers size={18} /> Implementation Pipeline & Execution Steps
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {resource.executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xl font-black text-[#FF4D37] block">
                      {step.step}
                    </span>
                    <h4 className="text-xs font-bold text-[#182033] dark:text-white mt-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Breakdown & Access Sidebar Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Content Article Body */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Key Deliverables Card */}
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-sm font-black text-[#FF4D37] uppercase tracking-wider">
                <Sparkles size={18} /> Included Asset Deliverables
              </div>

              <div className="space-y-3">
                {resource.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs font-extrabold text-emerald-900 dark:text-emerald-300"
                  >
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Chapters */}
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-sm font-black text-[#FF4D37] uppercase tracking-wider">
                <FileText size={18} /> Detailed Content Chapters
              </div>

              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {resource.content.map((paragraph, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800 space-y-2"
                  >
                    <p className="font-medium">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Instant Download / Access Box */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="soft-card rounded-3xl p-6 bg-gradient-to-br from-orange-50/80 to-white dark:from-[#161c2a] dark:to-slate-900 border border-orange-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF4D37]">
                <Download size={16} /> Instant Asset Download
              </div>

              <h3 className="text-xl font-black text-[#182033] dark:text-white">
                {resource.eventInfo ? "Register / Access Event" : `Get ${resource.fileFormat}`}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter your work email address below to receive instant access to this asset in your inbox.
              </p>

              {downloadSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Access link sent! Check your inbox.</span>
                </div>
              )}

              <form onSubmit={handleDownloadSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Your Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={downloading}
                  className="brand-button w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {downloading ? "Processing..." : (resource.eventInfo ? "Register for Event" : "Get Instant Access Link")} <Send size={14} />
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] font-semibold text-gray-400">
                🔒 Free verified asset • Zero spam policy
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};

export default ResourceDetailPage;
