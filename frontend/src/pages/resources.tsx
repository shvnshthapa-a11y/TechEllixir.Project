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
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  category: "whitepaper" | "casestudy" | "guide" | "template";
  categoryLabel: string;
  icon: React.ReactNode;
  tag: string;
  readTime: string;
  fileFormat: string;
  description: string;
  summary: string;
  takeaways: string[];
  featured?: boolean;
}

const resourcesList: ResourceItem[] = [
  {
    id: "ai-enterprise-guide",
    title: "The 2026 Enterprise AI & LLM Implementation Blueprint",
    category: "whitepaper",
    categoryLabel: "Whitepapers & E-Books",
    icon: <Brain size={24} className="text-[#FF4D37]" />,
    tag: "AI Architecture",
    readTime: "15 min read",
    fileFormat: "PDF (3.2 MB)",
    featured: true,
    description: "A comprehensive executive guide on deploying Retrieval-Augmented Generation (RAG), fine-tuning LLMs, and setting up secure MLOps pipelines inside regulated enterprise cloud infrastructure.",
    summary: "This blueprint bridges the gap between proof-of-concept AI experiments and mission-critical production deployments. It covers vector database selection, latency optimization, data privacy compliance, cost control strategies, and real-world fallback mechanisms.",
    takeaways: [
      "Step-by-step RAG architecture comparing Pinecone, Qdrant, and pgvector",
      "Token usage cost-containment strategies for enterprise LLM APIs",
      "Data sandboxing and PII redaction protocols for AI agent workflows",
      "Continuous model evaluation & halluncination benchmark frameworks"
    ]
  },
  {
    id: "fintech-bi-casestudy",
    title: "How Real-Time Analytics Accelerated Financial Reporting by 10x",
    category: "casestudy",
    categoryLabel: "Case Studies",
    icon: <BarChart2 size={24} className="text-[#FF4D37]" />,
    tag: "FinTech & Analytics",
    readTime: "8 min read",
    fileFormat: "Case Study PDF",
    description: "Discover how TechEllixir transformed an multi-currency fintech platform's legacy batch pipeline into a sub-second SQL analytics dashboard using Power BI and Snowflake.",
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
    readTime: "Code Repo",
    fileFormat: "GitHub Zip",
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
    readTime: "12 min read",
    fileFormat: "Interactive Guide",
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
    readTime: "5 min audit",
    fileFormat: "Interactive Sheet",
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
    readTime: "10 min read",
    fileFormat: "Case Study PDF",
    description: "How an automated AI document processing system eliminated manual data entry for 50,000+ patient records and claim forms with 99.4% precision.",
    summary: "Learn how modern OCR models combined with specialized medical LLMs extract structured JSON schemas from handwritten doctor notes, invoices, and diagnostic insurance forms automatically.",
    takeaways: [
      "Fine-tuning Tesseract and AWS Textract for medical jargon",
      "HIPAA-compliant data encryption in transit and at rest",
      "Human-in-the-loop validation dashboards for edge-case review"
    ]
  }
];

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalResource, setActiveModalResource] = useState<ResourceItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");

  const categories = [
    { id: "all", label: "All Resources" },
    { id: "whitepaper", label: "Whitepapers & E-Books" },
    { id: "casestudy", label: "Case Studies" },
    { id: "guide", label: "Developer Guides" },
    { id: "template", label: "Templates & Code" },
  ];

  const filteredResources = resourcesList.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResource = resourcesList.find((r) => r.featured) || resourcesList[0];

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setEmailInput("");
      setActiveModalResource(null);
    }, 2500);
  };

  return (
    <div className="pt-28 pb-20 bg-[#fffaf7] dark:bg-[#0d111a] min-h-screen text-[#182033] dark:text-gray-100 transition-colors duration-300">
      
      {/* 1. Header & Hero Banner */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div className="container-shell text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow justify-center">
              <Sparkles size={16} /> Knowledge Hub & Engineering Assets
            </span>
            <h1 className="section-title mt-4 text-4xl sm:text-5xl lg:text-6xl font-black">
              TechEllixir <span className="text-[#FF4D37]">Resources</span> & Insights
            </h1>
            <p className="section-copy mt-6 text-base sm:text-lg max-w-2xl mx-auto">
              Explore our curated library of technical whitepapers, production blueprints, AI architecture case studies, developer templates, and security checklists.
            </p>
          </motion.div>

          {/* Search & Category Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search resources, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] shadow-sm transition"
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

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#FF4D37] text-white shadow-md"
                      : "bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-[#FF4D37]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-shell max-w-7xl mx-auto space-y-16">

        {/* 2. Featured Resource Banner */}
        {selectedCategory === "all" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-[#ffd5ca] dark:border-slate-800 bg-gradient-to-br from-[#FFF5F2] via-white to-[#FFF0EC] dark:from-[#161c2a] dark:via-[#131924] dark:to-[#1a2234] p-8 lg:p-12 shadow-xl"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#FF4D37] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Featured Asset
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

                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveModalResource(featuredResource)}
                    className="brand-button px-6 py-3.5 text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <Download size={16} /> Access Free Blueprint
                  </button>

                  <button
                    onClick={() => setActiveModalResource(featuredResource)}
                    className="ghost-button px-6 py-3.5 text-xs font-bold cursor-pointer flex items-center gap-2"
                  >
                    Preview Content <ArrowRight size={16} />
                  </button>
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
                    Free download • No credit card required
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Resources Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#182033] dark:text-white">
              {selectedCategory === "all" ? "All Engineering & AI Resources" : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Showing {filteredResources.length} items
            </span>
          </div>

          {filteredResources.length === 0 ? (
            <div className="soft-card rounded-3xl p-12 text-center my-8">
              <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
                No resources found matching "{searchQuery}". Try searching for another topic or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="brand-button mt-4 px-6 py-2.5 text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  onClick={() => setActiveModalResource(item)}
                  className="soft-card rounded-3xl p-7 cursor-pointer flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl hover:border-[#ffd5ca] bg-white dark:bg-[#161c2a]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-xl bg-[#FFF1EC] dark:bg-slate-800/80 px-3 py-1 text-xs font-bold text-[#FF4D37]">
                        {item.tag}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        {item.readTime}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5 mt-2">
                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shrink-0">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold leading-snug text-[#182033] dark:text-white">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      {item.fileFormat}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalResource(item);
                      }}
                      className="inline-flex items-center gap-1.5 font-bold text-[#DF3420] text-xs hover:underline cursor-pointer"
                    >
                      Get Resource <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* 4. Newsletter / Custom Technical Inquiry Box */}
        <section className="soft-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-[#FFFaf7] via-white to-[#FFF3EF] dark:from-[#131924] dark:via-[#161c2a] dark:to-[#1a2234] border border-[#ffd5ca] dark:border-slate-800">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="eyebrow justify-center">STAY AHEAD OF THE CURVE</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#182033] dark:text-white">
              Need a Custom AI or Engineering Resource?
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

      {/* 5. Resource Preview & Download Modal */}
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Header */}
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
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-white transition cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
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
                    Key Insights & Deliverables
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

                {/* Instant Download / Access Form */}
                <div className="rounded-2xl border border-[#ffd5ca] dark:border-slate-800 bg-[#FFF5F2] dark:bg-slate-900/80 p-5">
                  <h5 className="text-xs font-bold text-[#182033] dark:text-white mb-1">
                    Receive Instant Download Link
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Enter your email to receive the direct file download ({activeModalResource.fileFormat}).
                  </p>

                  {downloadSuccess ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 size={18} />
                      <span>Download link sent! Check your inbox momentarily.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleDownload} className="flex gap-2">
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

              {/* Footer */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400">
                  Format: {activeModalResource.fileFormat}
                </span>
                <button
                  onClick={() => setActiveModalResource(null)}
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
