import React, { useState } from "react";
import { useSearchParams, NavLink, useNavigate } from "react-router-dom";
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
  content: string[];
  eventInfo?: {
    date: string;
    time: string;
    location: string;
    speaker: string;
  };
}

const resourceCatalog: Record<string, ResourceData> = {
  // 1. Blueprints & Resources
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
    content: [
      "Executive Summary: React 19 redefines web application architecture by shifting component execution to the server by default. This eliminates heavy client-side JavaScript bundles and simplifies data mutation.",
      "1. Server Actions vs Client Fetching: How to write server-side mutation functions directly alongside UI components without boilerplate REST or GraphQL client code.",
      "2. Optimistic UI Updates with useOptimistic: Providing immediate zero-latency UI feedback to users while background mutations resolve across the network.",
      "3. Asset Loading & Preloading Optimization: Leveraging React 19's native stylesheet and script preloading hooks to eliminate layout shifts (CLS)."
    ],
  },
  "fintech-security": {
    id: "fintech-security",
    title: "Architecting PCI-DSS & HIPAA Compliant Cloud Systems",
    category: "Case Study",
    tag: "FinTech",
    description: "How TechEllixir modernized a global payment gateway to achieve sub-50ms transaction latency while maintaining 100% compliance audit readiness.",
    fileFormat: "PDF Whitepaper (3.8 MB)",
    difficulty: "Advanced",
    readTime: "15 min read",
    publishDate: "July 12, 2026",
    author: "Sarah Jenkins (Security & Compliance Director)",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200",
    content: [
      "Executive Summary: Modernizing financial software requires balancing strict regulatory compliance (PCI-DSS 4.0) with real-time transaction processing speeds.",
      "1. Tokenization & Vault Architecture: Isolating primary account numbers (PAN) inside specialized HSM-backed vaults while exposing safe token identifiers to application services.",
      "2. Immutable Audit Logging: Streaming transaction audit logs into write-once-read-many (WORM) storage with cryptographic hash verification.",
      "3. 99.999% Availability Setup: Multi-region active-active database replication using Amazon Aurora Global Databases."
    ],
  },

  // 2. Blogs & Articles
  "blog-rag-vs-finetuning": {
    id: "blog-rag-vs-finetuning",
    title: "Why Fine-Tuning LLMs Fails Without Proper RAG Architecture",
    category: "Blog Article",
    tag: "AI Architecture",
    description: "Many enterprises rush to fine-tune open-weight models on proprietary data, only to suffer from hallucination and high retraining costs. Here is why RAG is the true foundation.",
    fileFormat: "Article & Code Snippets",
    difficulty: "Intermediate",
    readTime: "6 min read",
    publishDate: "July 18, 2026",
    author: "Avneesh Singh (Lead AI Architect)",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200",
    content: [
      "When engineering AI applications for businesses, data freshness and factual accuracy are paramount. Fine-tuning alters model weights but does not guarantee memory precision. Retrieval-Augmented Generation (RAG) acts as an external search index that injects exact context into prompts in real time.",
      "1. Memory vs Knowledge Indexing: Fine-tuning stores information implicitly across billions of weights, making updates expensive. RAG stores information in external vector indices (Qdrant, Pinecone) where document updates take milliseconds.",
      "2. Hybrid Search Benchmarks: By combining dense vector embeddings (BGE-large) with sparse BM25 keyword matching and Cohere re-ranking, domain context precision reaches 98.4% without model retraining.",
      "Conclusion: Use RAG for factual data retrieval and reserve fine-tuning for altering tone, domain terminology, or specialized JSON output formatting."
    ],
  },
  "blog-react19-migration": {
    id: "blog-react19-migration",
    title: "Migrating Production Enterprise Apps to React 19 & Tailwind v4",
    category: "Blog Article",
    tag: "Web Engineering",
    description: "A practical walkthrough on upgrading large codebase repositories to React 19, taking advantage of the new React Compiler and CSS-first Tailwind configuration.",
    fileFormat: "Technical Article",
    difficulty: "Intermediate",
    readTime: "8 min read",
    publishDate: "July 10, 2026",
    author: "Rudra Pratap Singh (Senior Frontend Engineer)",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    content: [
      "React 19 brings automatic memoization and server actions out of the box, eliminating manual useMemo and useCallback clutter. Paired with Tailwind v4's CSS-first theme configuration, bundle size decreases significantly while build speeds double.",
      "1. Removing Boilerplate Hooks: React 19 Compiler automatically optimizes component render trees, reducing unnecessary re-renders without developer intervention.",
      "2. CSS-First Theme Tokens with Tailwind v4: Switching from javascript tailwind.config.js to pure CSS @theme rules streamlines CSS parsing and speeds up Vite dev server HMR time by 45%.",
      "3. Transition Hooks & Async State: Handling form pending states with useActionState cleanly decouples server submissions from local UI component state."
    ],
  },
  "blog-n8n-python": {
    id: "blog-n8n-python",
    title: "Building Resilient AI Workflows With Self-Hosted n8n & Python",
    category: "Blog Article",
    tag: "DevOps & Automation",
    description: "How to automate multi-step invoice approvals and customer ticket classification using self-hosted n8n nodes and custom Python webhooks.",
    fileFormat: "Automation Blueprint",
    difficulty: "Intermediate",
    readTime: "7 min read",
    publishDate: "June 28, 2026",
    author: "Priya Sharma (Automation Engineer)",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
    content: [
      "No-code and low-code workflow orchestration engines have matured for enterprise operations. By combining n8n's visual node graph with custom Python microservices, engineers can build fault-tolerant pipelines.",
      "1. Orchestration vs Execution: Let n8n handle cron triggers, webhooks, and third-party integrations (Slack, Gmail, HubSpot) while Python microservices handle heavy ML data transformation.",
      "2. Handling Rate Limits & Retries: Implementing exponential backoff on n8n HTTP Request nodes to ensure 100% message delivery during high traffic bursts."
    ],
  },

  // 3. News & Press
  "news-ai-partner": {
    id: "news-ai-partner",
    title: "TechEllixir Recognized as Top AI Solutions Provider 2026",
    category: "Press Release",
    tag: "Company Milestone",
    description: "TechEllixir has been honored as one of the leading enterprise AI and data automation solution partners for delivering custom LLM and RAG platforms across APAC.",
    fileFormat: "Official Announcement",
    difficulty: "General",
    readTime: "4 min read",
    publishDate: "July 15, 2026",
    author: "TechEllixir Corporate Communications",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200",
    content: [
      "NOIDA, INDIA — TechEllixir today announced its inclusion in the 2026 Global AI & Data Excellence list. Recognized for its practical engineering approach and high client satisfaction rates across healthcare, fintech, and retail industries, TechEllixir continues to empower businesses with cutting-edge software solutions.",
      "TechEllixir's AI engineering lab has successfully delivered over 45 enterprise RAG pipelines, sub-second predictive analytics models, and cloud modernization projects in the past 12 months.",
      "Managing Director Statement: 'This recognition highlights our team's relentless focus on technical precision, rapid delivery, and tangible business outcomes for our global enterprise partners.'"
    ],
  },
  "news-v2-framework": {
    id: "news-v2-framework",
    title: "TechEllixir Unveils Enterprise AI Agent Framework v2.0",
    category: "Press Release",
    tag: "Product Launch",
    description: "The upgraded AI Agent Framework v2.0 introduces multi-modal document processing, automated fallback routing, and zero-trust data encryption for cloud workloads.",
    fileFormat: "Product Release Note",
    difficulty: "General",
    readTime: "5 min read",
    publishDate: "June 30, 2026",
    author: "TechEllixir AI Research Division",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    content: [
      "TechEllixir's AI engineering team has released version 2.0 of its internal AI Agent Framework. The release features native support for multi-vector retrieval, automated sub-agent task delegation, and built-in token optimization controls.",
      "Key Upgrades in v2.0:",
      "• Multi-Modal Document Parsing: Process scanned PDFs, hand-signed forms, and complex multi-column invoices automatically.",
      "• Zero-Trust Encryption: All vector embeddings and prompt payloads are encrypted at rest with AES-256 and HMAC authorization."
    ],
  },
  "news-regional-expansion": {
    id: "news-regional-expansion",
    title: "TechEllixir Expands Regional R&D Hub in Noida Tech Sector",
    category: "Press Release",
    tag: "Expansion",
    description: "To support growing demand for custom AI software and data engineering services, TechEllixir opens a state-of-the-art R&D center in Noida, Uttar Pradesh.",
    fileFormat: "Corporate Release",
    difficulty: "General",
    readTime: "3 min read",
    publishDate: "June 12, 2026",
    author: "TechEllixir Public Relations",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
    content: [
      "TechEllixir's expansion in Noida doubles its dedicated engineering space, establishing specialized labs for Generative AI prototyping, high-concurrency cloud benchmarking, and client co-creation workshops.",
      "The new facility will house 80+ senior full-stack developers, AI researchers, and cloud security architects dedicated to enterprise product delivery."
    ],
  },

  // 4. Events & Webinars
  "event-llm-masterclass": {
    id: "event-llm-masterclass",
    title: "Live Masterclass: Building & Scaling Enterprise RAG Applications",
    category: "Virtual Summit & Webinar",
    tag: "Webinar",
    description: "Join our live 90-minute hands-on masterclass as we code a production-ready RAG application live, from document chunking strategies to vector indexing and Cohere reranking.",
    fileFormat: "Live Stream & Recording",
    difficulty: "Intermediate to Advanced",
    readTime: "90 min live webinar",
    publishDate: "August 12, 2026",
    author: "Avneesh Singh (Head of AI Architecture)",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200",
    eventInfo: {
      date: "August 12, 2026",
      time: "4:00 PM - 5:30 PM IST",
      location: "Online (Zoom & YouTube Live)",
      speaker: "Avneesh Singh (Head of AI Architecture)",
    },
    content: [
      "Agenda & Key Highlights:",
      "1. Chunking Strategies: Fixed-size vs Semantic vs Markdown header parsing for multi-page PDF documents.",
      "2. Vector Database Benchmarks: Comparing Pinecone, Qdrant, and pgvector performance under 100+ QPS query load.",
      "3. Implementing Hybrid Search: Combining BM25 sparse keyword matching with dense neural vector embeddings.",
      "4. Live Interactive Q&A: Direct Q&A with senior AI engineers and cloud architects."
    ],
  },
  "event-n8n-workshop": {
    id: "event-n8n-workshop",
    title: "Hands-on Workshop: Automating Business Ops with n8n & OpenAI",
    category: "Virtual Workshop",
    tag: "Hands-on Lab",
    description: "An interactive technical workshop designed for IT leads and developers wanting to automate document processing, lead qualification, and CRM synchronization without custom servers.",
    fileFormat: "Virtual Interactive Lab",
    difficulty: "Intermediate",
    readTime: "120 min workshop",
    publishDate: "August 26, 2026",
    author: "Priya Sharma (Senior Automation Specialist)",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200",
    eventInfo: {
      date: "August 26, 2026",
      time: "3:00 PM - 5:00 PM IST",
      location: "Online Virtual Lab",
      speaker: "Priya Sharma (Senior Automation Specialist)",
    },
    content: [
      "Hands-on Lab Agenda:",
      "1. Setting up self-hosted n8n instances on Docker in under 10 minutes.",
      "2. Connecting OpenAI Vision API to extract structured JSON data from invoice attachments.",
      "3. Building automatic Slack alert triggers and PostgreSQL sync workflows."
    ],
  },
  "event-cloud-summit-recording": {
    id: "event-cloud-summit-recording",
    title: "Keynote: Zero-Trust Security Patterns for Cloud-Native AI Apps",
    category: "Conference Keynote",
    tag: "Recorded Video",
    description: "Watch the recorded keynote from the Global Cloud Security Summit detailing PII isolation protocols, API gateway rate limiting, and encrypted vector database storage.",
    fileFormat: "On-Demand Video (HD)",
    difficulty: "Advanced",
    readTime: "45 min video",
    publishDate: "July 04, 2026",
    author: "TechEllixir Cyber Security Lab",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200",
    eventInfo: {
      date: "July 04, 2026 (Recorded)",
      time: "On-Demand Stream",
      location: "TechEllixir Engineering Video Hub",
      speaker: "TechEllixir Security Engineering Team",
    },
    content: [
      "Keynote Topics:",
      "1. PII Masking & Tokenization Protocols for AI Prompt Guardrails.",
      "2. API Gateway Hardening & Automated Rate Limiting with Redis.",
      "3. Encrypted Vector Database Storage at Rest and in Transit."
    ],
  },
};

const defaultResource: ResourceData = {
  id: "default-resource",
  title: "TechEllixir Enterprise Engineering & AI Blueprint",
  category: "Blueprint Asset",
  tag: "Architecture",
  description: "Comprehensive technical asset containing architectural blueprints, performance benchmarks, and deployment guidelines for enterprise software systems.",
  fileFormat: "PDF Asset (5.0 MB)",
  difficulty: "All Levels",
  readTime: "15 min read",
  publishDate: "July 2026",
  author: "TechEllixir Technical Editorial Team",
  image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
  content: [
    "Executive Summary: Modern software systems require continuous architectural evolution to handle real-time AI workloads, cloud scaling, and strict security compliance.",
    "1. Architectural Fundamentals: Decoupling frontend presentation from backend microservices using event-driven message brokers.",
    "2. Security & Operations: Enforcing zero-trust encryption at rest and in transit across multi-cloud environments.",
    "3. Scalability Benchmarks: Achieving sub-100ms response times under high concurrent user load."
  ],
};

const ResourceDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resourceId = searchParams.get("id") || "rag-blueprint";

  const resource = resourceCatalog[resourceId] || defaultResource;

  // Download Form State
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
          <NavLink to="/resources" className="hover:text-[#FF4D37] transition">Resources</NavLink>
          <ChevronRight size={14} />
          <span className="text-[#FF4D37] font-black">{resource.category}</span>
        </div>

        {/* Back Link & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="ghost-button px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Resources
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
            
            {/* Left Header info */}
            <div className="lg:col-span-7 p-8 sm:p-10 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] text-xs font-extrabold border border-orange-200 dark:border-slate-700">
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

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
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

              {/* Author & Meta */}
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

        {/* Content & Instant Access Box Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Content Article Body */}
          <div className="lg:col-span-8 space-y-6">
            <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 text-sm font-black text-[#FF4D37] uppercase tracking-wider">
                <FileText size={18} /> Detailed Content Breakdown
              </div>

              <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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
                <Download size={16} /> Instant Access & Registration
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
