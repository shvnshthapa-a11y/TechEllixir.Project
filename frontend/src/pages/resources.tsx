import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Code2,
  Brain,
  Download,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Terminal,
  BarChart2,
  ShieldCheck,
  Building2,
  Newspaper,
  Calendar,
  User,
  Video,
  MapPin,
  FileText,
  Bookmark,
  Share2,
  Layers,
  Star,
} from "lucide-react";

// Types
type SectionTab = "resources" | "blogs" | "news" | "events";

interface ResourceItem {
  id: string;
  title: string;
  category: "whitepaper" | "casestudy" | "guide" | "template";
  categoryLabel: string;
  icon: React.ReactNode;
  tag: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  fileFormat: string;
  downloadsCount: string;
  description: string;
  summary: string;
  takeaways: string[];
  featured?: boolean;
}

interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  tag: string;
  likes: number;
  featured?: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  source: string;
  summary: string;
  fullStory: string;
}

interface EventItem {
  id: string;
  title: string;
  type: "Webinar" | "Workshop" | "Conference" | "Live Demo";
  date: string;
  time: string;
  location: string;
  speaker: string;
  speakerTitle: string;
  description: string;
  topics: string[];
  status: "Upcoming" | "Past Recording";
  seatsLeft?: number;
}

// 1. Resources Mock Data
const resourcesList: ResourceItem[] = [
  {
    id: "ai-enterprise-guide",
    title: "The 2026 Enterprise AI & LLM Implementation Blueprint",
    category: "whitepaper",
    categoryLabel: "Whitepapers & E-Books",
    icon: <Brain size={24} className="text-[#FF4D37]" />,
    tag: "AI Architecture",
    difficulty: "Advanced",
    readTime: "15 min read",
    fileFormat: "PDF (3.2 MB)",
    downloadsCount: "4,820 downloads",
    featured: true,
    description: "A comprehensive executive guide on deploying Retrieval-Augmented Generation (RAG), fine-tuning LLMs, and setting up secure MLOps pipelines inside regulated enterprise cloud infrastructure.",
    summary: "This blueprint bridges the gap between proof-of-concept AI experiments and mission-critical production deployments. It covers vector database selection, latency optimization, data privacy compliance, cost control strategies, and real-world fallback mechanisms.",
    takeaways: [
      "Step-by-step RAG architecture comparing Pinecone, Qdrant, and pgvector",
      "Token usage cost-containment strategies for enterprise LLM APIs",
      "Data sandboxing and PII redaction protocols for AI agent workflows",
      "Continuous model evaluation & hallucination benchmark frameworks"
    ]
  },
  {
    id: "fintech-bi-casestudy",
    title: "How Real-Time Analytics Accelerated Financial Reporting by 10x",
    category: "casestudy",
    categoryLabel: "Case Studies",
    icon: <BarChart2 size={24} className="text-[#FF4D37]" />,
    tag: "FinTech & Analytics",
    difficulty: "Intermediate",
    readTime: "8 min read",
    fileFormat: "Case Study PDF",
    downloadsCount: "2,410 downloads",
    description: "Discover how TechEllixir transformed a multi-currency fintech platform's legacy batch pipeline into a sub-second SQL analytics dashboard using Power BI and Snowflake.",
    summary: "By migrating legacy ETL jobs to streaming ELT pipelines, the client reduced end-of-month reconciliation times from 48 hours to under 15 minutes while improving data accuracy across 1.2M daily transactions.",
    takeaways: [
      "Architecting automated ELT pipelines with Snowflake & dbt",
      "Building high-concurrency Power BI dashboards with DirectQuery optimization",
      "Automating audit logging and financial compliance verification"
    ]
  },
  {
    id: "modern-fullstack-starter",
    title: "Production React 19 & Node.js Microservices Architecture Starter",
    category: "template",
    categoryLabel: "Templates & Code",
    icon: <Code2 size={24} className="text-[#FF4D37]" />,
    tag: "Developer Template",
    difficulty: "Intermediate",
    readTime: "Code Repo",
    fileFormat: "GitHub Zip",
    downloadsCount: "6,150 downloads",
    description: "Clean code starter repository featuring React 19, TypeScript, Tailwind CSS v4, Docker Compose, JWT authentication, and structured Express microservices.",
    summary: "Skip weeks of boilerplate configuration. This starter pack includes production-ready Docker containers, ESLint/Prettier rules, automated GitHub Actions CI/CD workflows, and API rate limiting out of the box.",
    takeaways: [
      "Pre-configured TypeScript strict mode & path aliases",
      "Ready-to-use JWT authentication & Refresh Token rotation",
      "Dockerized development and production build configurations"
    ]
  },
  {
    id: "n8n-automation-guide",
    title: "Mastering Autonomous Business Automation with n8n & AI",
    category: "guide",
    categoryLabel: "Developer Guides",
    icon: <Terminal size={24} className="text-[#FF4D37]" />,
    tag: "Workflow Automation",
    difficulty: "Beginner",
    readTime: "12 min read",
    fileFormat: "Interactive Guide",
    downloadsCount: "3,190 downloads",
    description: "Learn how to build self-healing business automation workflows connecting CRM systems, Slack, email parsing, and custom AI agents using n8n and Python webhooks.",
    summary: "An end-to-end tutorial for automation engineers looking to automate complex cross-platform business workflows. Includes copy-paste JSON workflow nodes and error handling best practices.",
    takeaways: [
      "Setting up self-hosted n8n instances on AWS Lightsail / Docker",
      "Parsing unstructured email attachments with OpenAI Vision & OCR",
      "Building webhook retry logic and Slack alert notifications"
    ]
  },
  {
    id: "cloud-security-checklist",
    title: "The Ultimate Cloud Security & Compliance Audit Checklist",
    category: "template",
    categoryLabel: "Templates & Checklists",
    icon: <ShieldCheck size={24} className="text-[#FF4D37]" />,
    tag: "Cyber Security",
    difficulty: "Advanced",
    readTime: "5 min audit",
    fileFormat: "Interactive Sheet",
    downloadsCount: "5,300 downloads",
    description: "A 50-point security audit checklist for AWS, GCP, and Azure cloud environments covering IAM policies, network isolation, encryption at rest, and secret management.",
    summary: "Ensure your cloud infrastructure adheres to SOC2, ISO 27001, and HIPAA compliance baselines. Used internally by TechEllixir senior DevOps engineers before production releases.",
    takeaways: [
      "IAM principal least-privilege policy verification steps",
      "Automated vulnerability scanning with Trivy and SonarQube",
      "Encrypted backup & multi-region disaster recovery test protocols"
    ]
  },
  {
    id: "healthcare-ai-ocr",
    title: "Intelligent Document Processing (OCR + AI) in Healthcare",
    category: "casestudy",
    categoryLabel: "Case Studies",
    icon: <Building2 size={24} className="text-[#FF4D37]" />,
    tag: "Healthcare & AI",
    difficulty: "Intermediate",
    readTime: "10 min read",
    fileFormat: "Case Study PDF",
    downloadsCount: "1,980 downloads",
    description: "How an automated AI document processing system eliminated manual data entry for 50,000+ patient records and claim forms with 99.4% precision.",
    summary: "Learn how modern OCR models combined with specialized medical LLMs extract structured JSON schemas from handwritten doctor notes, invoices, and diagnostic insurance forms automatically.",
    takeaways: [
      "Fine-tuning Tesseract and AWS Textract for medical jargon",
      "HIPAA-compliant data encryption in transit and at rest",
      "Human-in-the-loop validation dashboards for edge-case review"
    ]
  }
];

// 2. Blogs Data
const blogsList: BlogItem[] = [
  {
    id: "blog-rag-vs-finetuning",
    title: "Why Fine-Tuning LLMs Fails Without Proper RAG Architecture",
    excerpt: "Many enterprises rush to fine-tune open-weight models on proprietary data, only to suffer from hallucination and high retraining costs. Here is why RAG is the true foundation.",
    content: "When engineering AI applications for businesses, data freshness and factual accuracy are paramount. Fine-tuning alters model weights but does not guarantee memory precision. Retrieval-Augmented Generation (RAG) acts as an external search index that injects exact context into prompts in real time. In this technical deep dive, we compare dense vector embeddings vs hybrid keyword retrieval (BM25 + HNSW) and demonstrate how reranking with Cohere improves accuracy by 34%.",
    author: "Avneesh Singh",
    role: "Lead AI Architect",
    date: "July 18, 2026",
    readTime: "6 min read",
    tag: "AI Architecture",
    likes: 142,
    featured: true
  },
  {
    id: "blog-react19-migration",
    title: "Migrating Production Enterprise Apps to React 19 & Tailwind v4",
    excerpt: "A practical walkthrough on upgrading large codebase repositories to React 19, taking advantage of the new React Compiler and CSS-first Tailwind configuration.",
    content: "React 19 brings automatic memoization and server actions out of the box, eliminating manual useMemo and useCallback clutter. Paired with Tailwind v4's CSS-first theme configuration, bundle size decreases significantly while build speeds double. We share real metrics and common pitfalls from migrating client dashboards.",
    author: "Rudra Pratap Singh",
    role: "Senior Frontend Engineer",
    date: "July 10, 2026",
    readTime: "8 min read",
    tag: "Web Engineering",
    likes: 98
  },
  {
    id: "blog-n8n-python",
    title: "Building Resilient AI Workflows With Self-Hosted n8n & Python",
    excerpt: "How to automate multi-step invoice approvals and customer ticket classification using self-hosted n8n nodes and custom Python webhooks.",
    content: "No-code and low-code workflow orchestration engines have matured for enterprise operations. By combining n8n's visual node graph with custom Python microservices, engineers can build fault-tolerant pipelines that gracefully handle API rate limits, retry failed requests, and log events into centralized databases.",
    author: "Priya Sharma",
    role: "Automation Engineer",
    date: "June 28, 2026",
    readTime: "7 min read",
    tag: "DevOps & Automation",
    likes: 85
  }
];

// 3. News Data
const newsList: NewsItem[] = [
  {
    id: "news-ai-partner",
    title: "TechEllixir Recognized as Top AI Solutions Provider 2026",
    category: "Company Milestone",
    date: "July 15, 2026",
    source: "TechEllixir Press",
    summary: "TechEllixir has been honored as one of the leading enterprise AI and data automation solution partners for delivering custom LLM and RAG platforms across APAC.",
    fullStory: "NOIDA, INDIA — TechEllixir today announced its inclusion in the 2026 Global AI & Data Excellence list. Recognized for its practical engineering approach and high client satisfaction rates across healthcare, fintech, and retail industries, TechEllixir continues to empower businesses with cutting-edge software solutions."
  },
  {
    id: "news-v2-framework",
    title: "TechEllixir Unveils Enterprise AI Agent Framework v2.0",
    category: "Product Launch",
    date: "June 30, 2026",
    source: "Product Release",
    summary: "The upgraded AI Agent Framework v2.0 introduces multi-modal document processing, automated fallback routing, and zero-trust data encryption for cloud workloads.",
    fullStory: "TechEllixir's AI engineering team has released version 2.0 of its internal AI Agent Framework. The release features native support for multi-vector retrieval, automated sub-agent task delegation, and built-in token optimization controls."
  },
  {
    id: "news-regional-expansion",
    title: "TechEllixir Expands Regional R&D Hub in Noida Tech Sector",
    category: "Expansion",
    date: "June 12, 2026",
    source: "Corporate News",
    summary: "To support growing demand for custom AI software and data engineering services, TechEllixir opens a state-of-the-art R&D center in Noida, Uttar Pradesh.",
    fullStory: "TechEllixir's expansion in Noida doubles its dedicated engineering space, establishing specialized labs for Generative AI prototyping, high-concurrency cloud benchmarking, and client co-creation workshops."
  }
];

// 4. Events Data
const eventsList: EventItem[] = [
  {
    id: "event-llm-masterclass",
    title: "Live Masterclass: Building & Scaling Enterprise RAG Applications",
    type: "Webinar",
    date: "August 12, 2026",
    time: "4:00 PM - 5:30 PM IST",
    location: "Online (Zoom & YouTube Live)",
    speaker: "Avneesh Singh",
    speakerTitle: "Head of AI Architecture, TechEllixir",
    description: "Join our live 90-minute hands-on masterclass as we code a production-ready RAG application live, from document chunking strategies to vector indexing and Cohere reranking.",
    topics: [
      "Chunking strategies: Fixed-size vs Semantic vs Markdown headers",
      "Benchmarking Pinecone vs Qdrant vs pgvector",
      "Implementing hybrid search (BM25 + Dense embeddings)",
      "Live Q&A session with senior AI engineers"
    ],
    status: "Upcoming",
    seatsLeft: 42
  },
  {
    id: "event-n8n-workshop",
    title: "Hands-on Workshop: Automating Business Ops with n8n & OpenAI",
    type: "Workshop",
    date: "August 26, 2026",
    time: "3:00 PM - 5:00 PM IST",
    location: "Online Virtual Lab",
    speaker: "Priya Sharma",
    speakerTitle: "Senior Automation Specialist",
    description: "An interactive technical workshop designed for IT leads and developers wanting to automate document processing, lead qualification, and CRM synchronization without custom servers.",
    topics: [
      "Setting up self-hosted n8n instances in under 10 minutes",
      "Connecting OpenAI Vision API for invoice data extraction",
      "Building webhook alerts and database sync workflows"
    ],
    status: "Upcoming",
    seatsLeft: 18
  },
  {
    id: "event-cloud-summit-recording",
    title: "Keynote: Zero-Trust Security Patterns for Cloud-Native AI Apps",
    type: "Conference",
    date: "July 04, 2026",
    time: "Recorded (On-Demand)",
    location: "On-Demand Video Recording",
    speaker: "TechEllixir Security Lab",
    speakerTitle: "Cloud & Cyber Security Team",
    description: "Watch the recorded keynote from the Global Cloud Security Summit detailing PII isolation protocols, API gateway rate limiting, and encrypted vector database storage.",
    topics: [
      "PII masking & tokenization techniques",
      "Zero-trust API key management for LLM APIs",
      "SOC2 compliance readiness checklist"
    ],
    status: "Past Recording"
  }
];

const popularTags = [
  "All Topics",
  "AI Architecture",
  "RAG & LLM",
  "Web Engineering",
  "DevOps & Automation",
  "FinTech & Analytics",
  "Cyber Security"
];

const Resources = () => {
  // Navigation & Search States
  const [activeTab, setActiveTab] = useState<SectionTab>("resources");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string>("All Topics");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Bookmarking / Likes State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedBlogs, setLikedBlogs] = useState<Record<string, number>>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Modals
  const [activeModalResource, setActiveModalResource] = useState<ResourceItem | null>(null);
  const [activeModalBlog, setActiveModalBlog] = useState<BlogItem | null>(null);
  const [activeModalNews, setActiveModalNews] = useState<NewsItem | null>(null);
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

  // Form states
  const [emailInput, setEmailInput] = useState<string>("");
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [eventRegSuccess, setEventRegSuccess] = useState<boolean>(false);

  // Sub-categories for Resources
  const categories = [
    { id: "all", label: "All Assets" },
    { id: "whitepaper", label: "Whitepapers" },
    { id: "casestudy", label: "Case Studies" },
    { id: "guide", label: "Guides" },
    { id: "template", label: "Templates" },
  ];

  // Toggle Bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle Like
  const handleLikeBlog = (id: string, currentLikes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedBlogs((prev) => ({
      ...prev,
      [id]: (prev[id] || currentLikes) + 1,
    }));
  };

  // Filtered Resources
  const filteredResources = resourcesList.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesTag = activeTag === "All Topics" || item.tag.toLowerCase().includes(activeTag.toLowerCase());
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  // Filtered Blogs
  const filteredBlogs = blogsList.filter((blog) => {
    const matchesTag = activeTag === "All Topics" || blog.tag.toLowerCase().includes(activeTag.toLowerCase());
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Filtered Events
  const filteredEvents = eventsList.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredResource = resourcesList.find((r) => r.featured) || resourcesList[0];

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    try {
      await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          resourceTitle: activeModalResource?.title || "Enterprise Technical Asset",
          fileFormat: activeModalResource?.fileFormat || "PDF Blueprint",
        }),
      });
    } catch (err) {
      console.error("Resource download submission error:", err);
    }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setEmailInput("");
      setActiveModalResource(null);
    }, 2500);
  };

  const handleEventRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setEventRegSuccess(true);
    setTimeout(() => {
      setEventRegSuccess(false);
      setEmailInput("");
      setActiveModalEvent(null);
    }, 2200);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 bg-[#fffaf7] dark:bg-[#0d111a] min-h-screen text-[#182033] dark:text-gray-100 transition-colors duration-300">
      
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden py-10 lg:py-14">
        <div className="container-shell text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow justify-center">
              <Sparkles size={16} /> KNOWLEDGE HUB & COMMUNITY ASSETS
            </span>
            <h1 className="section-title mt-4 text-4xl sm:text-5xl lg:text-6xl font-black">
              TechEllixir <span className="text-[#FF4D37]">Resource Hub</span>
            </h1>
            <p className="section-copy mt-4 text-base sm:text-lg max-w-2xl mx-auto">
              Explore enterprise whitepapers, AI implementation blueprints, engineering blogs, company news, and live webinars.
            </p>
          </motion.div>

          {/* 2. Interactive Metrics Counter Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            <div className="soft-card p-4 rounded-2xl text-center border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
              <h4 className="text-xl font-black text-[#FF4D37]">50+</h4>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Tech Blueprints</p>
            </div>
            <div className="soft-card p-4 rounded-2xl text-center border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
              <h4 className="text-xl font-black text-[#FF4D37]">25k+</h4>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Asset Downloads</p>
            </div>
            <div className="soft-card p-4 rounded-2xl text-center border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
              <h4 className="text-xl font-black text-[#FF4D37]">100%</h4>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Free Access</p>
            </div>
            <div className="soft-card p-4 rounded-2xl text-center border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
              <h4 className="text-xl font-black text-[#FF4D37]">4.9/5</h4>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Developer Rating</p>
            </div>
          </motion.div>

          {/* 3. Main Pill Tab Navigation (Requested UI Feature) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex justify-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-gray-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-2 shadow-lg backdrop-blur-md">
              <button
                onClick={() => setActiveTab("resources")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === "resources"
                    ? "bg-[#FF4D37] text-white shadow-md scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <FileText size={16} /> Resources & Blueprints
              </button>

              <button
                onClick={() => setActiveTab("blogs")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === "blogs"
                    ? "bg-[#FF4D37] text-white shadow-md scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <BookOpen size={16} /> Blogs & Articles
              </button>

              <button
                onClick={() => setActiveTab("news")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === "news"
                    ? "bg-[#FF4D37] text-white shadow-md scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Newspaper size={16} /> News & Press
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === "events"
                    ? "bg-[#FF4D37] text-white shadow-md scale-105"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Calendar size={16} /> Events & Webinars
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-shell max-w-7xl mx-auto space-y-10">

        {/* 4. Universal Search & Topic Chips */}
        <div className="soft-card rounded-3xl p-6 bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search across blueprints, blogs, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/80 pl-10 pr-10 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Popular Topics Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
                <Layers size={14} /> Topic:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeTag === tag
                      ? "bg-[#FF4D37] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TAB 1: RESOURCES & BLUEPRINTS */}
        {activeTab === "resources" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Sub-Category Filter Buttons */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[#182033] dark:bg-white text-white dark:text-[#182033] shadow-md"
                        : "bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-[#FF4D37]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 hidden sm:block">
                Showing {filteredResources.length} Assets
              </span>
            </div>

            {/* Featured Resource Banner */}
            {selectedCategory === "all" && !searchQuery && activeTag === "All Topics" && (
              <div className="relative rounded-3xl overflow-hidden border border-[#ffd5ca] dark:border-slate-800 bg-gradient-to-br from-[#FFF5F2] via-white to-[#FFF0EC] dark:from-[#161c2a] dark:via-[#131924] dark:to-[#1a2234] p-8 lg:p-12 shadow-xl">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#FF4D37] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        Featured Blueprint
                      </span>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-bold">
                        {featuredResource.difficulty} Level
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <BookOpen size={14} /> {featuredResource.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-[#182033] dark:text-white">
                      {featuredResource.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                      {featuredResource.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4 items-center">
                      <button
                        onClick={() => {
                          window.location.href = `/resources/detail?id=${featuredResource.id}`;
                        }}
                        className="brand-button px-6 py-3.5 text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg"
                      >
                        <Download size={16} /> Download Free Blueprint ({featuredResource.fileFormat})
                      </button>

                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        🔥 {featuredResource.downloadsCount}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center">
                    <div className="soft-card p-6 rounded-3xl w-full max-w-sm text-center border border-[#ffd8ce] dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 shadow-md">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] mb-4">
                        <Brain size={36} />
                      </div>
                      <h4 className="font-extrabold text-sm text-[#182033] dark:text-white">
                        Format: {featuredResource.fileFormat}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Free instant access • PDF & Code
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Grid */}
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => {
                    window.location.href = `/resources/detail?id=${item.id}`;
                  }}
                  className="soft-card rounded-3xl p-7 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-[#ffd5ca] bg-white dark:bg-[#161c2a] relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-xl bg-[#FFF1EC] dark:bg-slate-800/80 px-3 py-1 text-xs font-bold text-[#FF4D37]">
                          {item.tag}
                        </span>
                        <span className="rounded-lg bg-gray-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                          {item.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-[#FF4D37] transition cursor-pointer"
                        title="Bookmark Resource"
                      >
                        <Bookmark
                          size={16}
                          className={bookmarkedIds.includes(item.id) ? "fill-[#FF4D37] text-[#FF4D37]" : ""}
                        />
                      </button>
                    </div>

                    <div className="flex items-start gap-3.5 mt-2">
                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shrink-0 text-[#FF4D37]">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold leading-snug text-[#182033] dark:text-white group-hover:text-[#FF4D37] transition">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      {item.downloadsCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalResource(item);
                      }}
                      className="inline-flex items-center gap-1.5 font-bold text-[#DF3420] text-xs hover:underline cursor-pointer"
                    >
                      Download <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 2: BLOGS & ARTICLES */}
        {activeTab === "blogs" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <motion.article
                  key={blog.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => {
                    window.location.href = `/resources/detail?id=${blog.id}`;
                  }}
                  className="soft-card rounded-3xl p-7 cursor-pointer flex flex-col justify-between bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 hover:shadow-2xl hover:border-[#ffd5ca] group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-xl bg-[#FFF1EC] dark:bg-slate-800/80 px-3 py-1 text-xs font-bold text-[#FF4D37]">
                        {blog.tag}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold leading-snug text-[#182033] dark:text-white mt-2 group-hover:text-[#FF4D37] transition">
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#FF4D37]" />
                      <span>{blog.author}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLikeBlog(blog.id, blog.likes, e)}
                        className="flex items-center gap-1 hover:text-[#FF4D37] transition cursor-pointer"
                      >
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span>{likedBlogs[blog.id] || blog.likes}</span>
                      </button>

                      <span>{blog.date}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: NEWS & PRESS */}
        {activeTab === "news" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-3">
              {newsList.map((news) => (
                <div
                  key={news.id}
                  onClick={() => {
                    window.location.href = `/resources/detail?id=${news.id}`;
                  }}
                  className="soft-card rounded-3xl p-7 cursor-pointer bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 hover:shadow-xl hover:border-[#ffd5ca] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-lg bg-red-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-[#FF4D37]">
                        {news.category}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        {news.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#182033] dark:text-white leading-snug mt-2 group-hover:text-[#FF4D37] transition">
                      {news.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                      {news.summary}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF4D37] flex items-center gap-1">
                      Read Press Release <ArrowRight size={14} />
                    </span>
                    <span className="text-xs text-gray-400">{news.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: EVENTS & WEBINARS */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="soft-card rounded-3xl p-7 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`rounded-xl px-3 py-1 text-xs font-bold ${
                        event.status === "Upcoming"
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                      }`}>
                        {event.status} {event.seatsLeft ? `• ${event.seatsLeft} seats left` : ""}
                      </span>
                      <span className="text-xs font-semibold text-[#FF4D37] flex items-center gap-1">
                        <Video size={14} /> {event.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#182033] dark:text-white leading-snug">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#FF4D37]" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#FF4D37]" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#FF4D37]" />
                        <span>{event.speaker} ({event.speakerTitle})</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 dark:border-slate-800 pt-4">
                    <button
                      onClick={() => {
                        window.location.href = `/resources/detail?id=${event.id}`;
                      }}
                      className="brand-button w-full py-3 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      {event.status === "Upcoming" ? "Register for Event" : "Watch Recording"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 5. Newsletter / Custom Technical Inquiry Box */}
        <section className="soft-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-[#FFFaf7] via-white to-[#FFF3EF] dark:from-[#131924] dark:via-[#161c2a] dark:to-[#1a2234] border border-[#ffd5ca] dark:border-slate-800">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="eyebrow justify-center">STAY AHEAD OF THE CURVE</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#182033] dark:text-white">
              Need a Custom AI Blueprint or Technical Audit?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Our engineering team regularly publishes tech whitepapers and open-source starter repos. Subscribe or contact our architects for custom feasibility reports.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! You have been subscribed to TechEllixir technical updates.");
              }}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter work email..."
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-xs font-semibold outline-none focus:border-[#FF4D37]"
              />
              <button
                type="submit"
                className="brand-button px-6 py-3 text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </div>

      {/* MODAL 1: RESOURCE DOWNLOAD MODAL */}
      <AnimatePresence>
        {activeModalResource && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setActiveModalResource(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37]">
                    {activeModalResource.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#FF4D37] tracking-wider uppercase">
                      {activeModalResource.categoryLabel}
                    </span>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white mt-0.5">
                      {activeModalResource.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalResource(null)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="my-6 overflow-y-auto pr-2 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Executive Summary
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
                    {activeModalResource.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Key Deliverables
                  </h4>
                  <div className="space-y-2">
                    {activeModalResource.takeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60 p-3 text-xs font-semibold text-gray-800 dark:text-gray-200"
                      >
                        <CheckCircle2 size={16} className="text-[#FF4D37] shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ffd5ca] dark:border-slate-800 bg-[#FFF5F2] dark:bg-slate-900/80 p-5">
                  <h5 className="text-xs font-bold text-[#182033] dark:text-white mb-1">
                    Instant File Access
                  </h5>
                  {downloadSuccess ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl">
                      <CheckCircle2 size={18} />
                      <span>Download link sent! Check your inbox.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleDownloadSubmit} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="your.email@company.com"
                        className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF4D37]"
                      />
                      <button
                        type="submit"
                        className="brand-button px-5 py-2 text-xs font-bold whitespace-nowrap cursor-pointer"
                      >
                        Get Link
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: BLOG READER MODAL */}
      <AnimatePresence>
        {activeModalBlog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setActiveModalBlog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#FF4D37] tracking-wider uppercase">
                    {activeModalBlog.tag} • {activeModalBlog.readTime}
                  </span>
                  <h3 className="text-2xl font-black text-[#182033] dark:text-white mt-1">
                    {activeModalBlog.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    By {activeModalBlog.author} ({activeModalBlog.role}) • {activeModalBlog.date}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalBlog(null)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="my-6 overflow-y-auto pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="font-semibold text-base text-[#182033] dark:text-white">
                  {activeModalBlog.excerpt}
                </p>
                <p>{activeModalBlog.content}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#FF4D37] cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>{copiedLink ? "Link Copied!" : "Share Article"}</span>
                </button>

                <button
                  onClick={() => setActiveModalBlog(null)}
                  className="brand-button px-6 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: NEWS MODAL */}
      <AnimatePresence>
        {activeModalNews && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setActiveModalNews(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#FF4D37] tracking-wider uppercase">
                    {activeModalNews.category} • {activeModalNews.date}
                  </span>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white mt-1">
                    {activeModalNews.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModalNews(null)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="my-6 overflow-y-auto pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>{activeModalNews.fullStory}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">{activeModalNews.source}</span>
                <button
                  onClick={() => setActiveModalNews(null)}
                  className="brand-button px-6 py-2 text-xs font-bold cursor-pointer"
                >
                  Close News
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: EVENT REGISTRATION MODAL */}
      <AnimatePresence>
        {activeModalEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setActiveModalEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#FF4D37] tracking-wider uppercase">
                    {activeModalEvent.type} • {activeModalEvent.status}
                  </span>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white mt-1">
                    {activeModalEvent.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Speaker: {activeModalEvent.speaker} ({activeModalEvent.speakerTitle})
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="my-6 overflow-y-auto pr-2 space-y-5">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {activeModalEvent.description}
                </p>

                <div>
                  <h5 className="text-xs font-bold uppercase text-gray-400 mb-2">
                    Key Event Topics
                  </h5>
                  <div className="space-y-2">
                    {activeModalEvent.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-900 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800">
                        <CheckCircle2 size={16} className="text-[#FF4D37]" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeModalEvent.status === "Upcoming" && (
                  <div className="rounded-2xl border border-[#ffd5ca] dark:border-slate-800 bg-[#FFF5F2] dark:bg-slate-900/80 p-5">
                    <h5 className="text-xs font-bold text-[#182033] dark:text-white mb-1">
                      Reserve Your Spot
                    </h5>
                    {eventRegSuccess ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl">
                        <CheckCircle2 size={18} />
                        <span>Registration confirmed! Calendar invite sent to email.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleEventRegSubmit} className="flex gap-2 mt-2">
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="your.email@company.com"
                          className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF4D37]"
                        />
                        <button
                          type="submit"
                          className="brand-button px-5 py-2 text-xs font-bold whitespace-nowrap cursor-pointer"
                        >
                          Register Now
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-end">
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Resources;
