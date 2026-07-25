import React, { useState } from "react";
import { useSearchParams, useParams, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Bookmark,
  Star,
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  category: string;
  author: string;
  role: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  likes: number;
  image: string;
  contentSections: {
    heading: string;
    body: string;
    codeSnippet?: string;
    quote?: string;
  }[];
}

const blogsCatalog: Record<string, BlogArticle> = {
  "blog-rag-vs-finetuning": {
    id: "blog-rag-vs-finetuning",
    title: "Why Fine-Tuning LLMs Fails Without Proper RAG Architecture",
    excerpt: "Many enterprises rush to fine-tune open-weight models on proprietary data, only to suffer from hallucination and high retraining costs. Here is why Retrieval-Augmented Generation is the true foundation.",
    tag: "AI Architecture",
    category: "Technical Deep Dive",
    author: "Avneesh Singh",
    role: "Lead AI Architect & Principal Researcher",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    date: "July 18, 2026",
    readTime: "8 min read",
    likes: 142,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200",
    contentSections: [
      {
        heading: "1. The Illusion of Model Fine-Tuning",
        body: "When organizations deploy Generative AI to internal knowledge bases, the initial impulse is often to fine-tune an open-source LLM (such as Llama 3 or Mistral) on enterprise PDFs and Notion docs. However, fine-tuning alters the internal weights of neural networks — it modifies the model's tone and formatting capabilities, but fails to guarantee factual memory retrieval.",
        quote: "Fine-tuning is like teaching a student how to write in medical prose; RAG is giving that student an open-book medical encyclopedia to reference live during the exam.",
      },
      {
        heading: "2. The RAG Alternative: Decoupled Memory Indexing",
        body: "Retrieval-Augmented Generation (RAG) decouples parametric memory (the LLM) from non-parametric memory (external vector databases like Qdrant, Pinecone, or pgvector). When a user submits a query, RAG performs semantic vector search across chunked documents and injects exact, verified context directly into the prompt payload.",
      },
      {
        heading: "3. Benchmarking Hybrid Search: Dense Embeddings + BM25",
        body: "Pure vector embeddings excel at conceptual semantic search, but struggle with exact alphanumeric product codes, API endpoints, or proper nouns. By implementing Hybrid Search — combining dense vector embeddings (bge-large-en) with sparse BM25 keyword matching and Cohere re-ranking — context recall precision jumps from 72% to 98.4%.",
        codeSnippet: `// Example Hybrid Search Retrieval in Node.js / TypeScript
import { QdrantClient } from "@qdrant/js-client-rest";

async function retrieveContext(query: string) {
  const vector = await generateEmbedding(query);
  const denseResults = await qdrant.search("enterprise_docs", {
    vector,
    limit: 10,
  });
  
  // BM25 Sparse Search Re-ranking
  const reranked = await cohere.rerank({
    query,
    documents: denseResults.map(d => d.payload.text),
    topN: 3,
  });

  return reranked.results.map(r => r.document.text).join("\\n\\n");
}`,
      },
      {
        heading: "4. Cost Analysis & Real-Time Data Freshness",
        body: "Fine-tuning a 70B parameter model costs thousands of dollars per iteration and becomes stale the moment new company policies are published. In contrast, RAG document updates take sub-50 milliseconds in a vector index with zero model downtime or GPU retraining expenses.",
      },
    ],
  },
  "blog-react19-migration": {
    id: "blog-react19-migration",
    title: "Migrating Production Enterprise Apps to React 19 & Tailwind v4",
    excerpt: "A practical walkthrough on upgrading large codebase repositories to React 19, taking advantage of the new React Compiler and CSS-first Tailwind configuration.",
    tag: "Web Engineering",
    category: "Frontend Architecture",
    author: "Rudra Pratap Singh",
    role: "Senior Frontend Architect",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    date: "July 10, 2026",
    readTime: "10 min read",
    likes: 98,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    contentSections: [
      {
        heading: "1. The React 19 Paradigm Shift",
        body: "React 19 removes the necessity for manual performance optimization hooks such as useMemo, useCallback, and React.memo. The new auto-memoizing React Compiler automatically optimizes rendering subtrees during compilation, eliminating human error in dependency arrays.",
      },
      {
        heading: "2. Server Actions & Async Form States",
        body: "With native Server Actions and useActionState, client-side boilerplate code for form submission states, error catching, and manual loading spinners is reduced by over 60%.",
        codeSnippet: `// React 19 Action Hook Example
import { useActionState } from "react";

async function updateProfile(prevState, formData) {
  const name = formData.get("name");
  const res = await fetch("/api/user", { method: "POST", body: JSON.stringify({ name }) });
  return await res.json();
}

export function UserForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);
  return (
    <form action={formAction}>
      <input name="name" required />
      <button disabled={isPending}>{isPending ? "Saving..." : "Update"}</button>
    </form>
  );
}`,
      },
      {
        heading: "3. CSS-First Theme Tokens with Tailwind v4",
        body: "Tailwind v4 replaces javascript-based tailwind.config.js files with pure CSS @theme directives. This reduces Vite dev server HMR compile times by 45% and shrinks bundle CSS footprints.",
      },
    ],
  },
  "blog-n8n-python": {
    id: "blog-n8n-python",
    title: "Building Resilient AI Workflows With Self-Hosted n8n & Python",
    excerpt: "How to automate multi-step invoice approvals and customer ticket classification using self-hosted n8n nodes and custom Python webhooks.",
    tag: "DevOps & Automation",
    category: "Workflow Engineering",
    author: "Priya Sharma",
    role: "Automation & Integration Specialist",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    date: "June 28, 2026",
    readTime: "7 min read",
    likes: 85,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
    contentSections: [
      {
        heading: "1. Orchestration vs Heavy Computation",
        body: "Combining visual orchestration tools like n8n with custom Python microservices provides the ideal balance between rapid developer prototyping and production reliability.",
      },
      {
        heading: "2. Parsing Email Invoices with OpenAI Vision",
        body: "By configuring n8n trigger webhooks on incoming Gmail / IMAP mailboxes, PDF invoice attachments are passed to Python FastAPI workers equipped with OpenAI Vision & Tesseract OCR to extract structured JSON data.",
      },
    ],
  },
};

const defaultBlog: BlogArticle = {
  id: "default-blog",
  title: "TechEllixir Enterprise AI & Software Engineering Post",
  excerpt: "Exploring modern software engineering patterns, AI agent deployment, and scalable cloud infrastructure.",
  tag: "Engineering",
  category: "Tech Article",
  author: "TechEllixir Editorial Board",
  role: "Engineering Division",
  authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
  date: "July 2026",
  readTime: "6 min read",
  likes: 54,
  image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200",
  contentSections: [
    {
      heading: "Overview of Modern Technical Architecture",
      body: "Building software for enterprise scale requires balancing rapid feature iterations with long-term system maintainability and zero-trust security controls.",
    },
  ],
};

const BlogDetailPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const blogId = params.id || searchParams.get("id") || "blog-rag-vs-finetuning";

  const blog = blogsCatalog[blogId] || defaultBlog;

  const [likesCount, setLikesCount] = useState(blog.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubSuccess(true);
    setTimeout(() => {
      setSubSuccess(false);
      setSubscribedEmail("");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#fffaf7] dark:bg-[#0d111a] pt-28 pb-20 text-[#182033] dark:text-gray-100 transition-colors duration-300">
      <div className="container-shell max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          <NavLink to="/" className="hover:text-[#FF4D37] transition">Home</NavLink>
          <ChevronRight size={14} />
          <NavLink to="/resources" className="hover:text-[#FF4D37] transition">Knowledge Hub</NavLink>
          <ChevronRight size={14} />
          <span className="text-[#FF4D37] font-black">{blog.tag}</span>
        </div>

        {/* Back Link & Social Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="ghost-button px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Articles
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`ghost-button px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                hasLiked ? "text-amber-500" : ""
              }`}
            >
              <Star size={16} className={hasLiked ? "fill-amber-400 text-amber-400" : ""} />
              <span>{likesCount} Likes</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`ghost-button px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                bookmarked ? "text-[#FF4D37]" : ""
              }`}
            >
              <Bookmark size={16} className={bookmarked ? "fill-current" : ""} />
              <span>{bookmarked ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="ghost-button px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Blog Header Card */}
        <div className="soft-card rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] text-xs font-extrabold border border-orange-200 dark:border-slate-700">
              {blog.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold">
              #{blog.tag}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#182033] dark:text-white leading-tight">
            {blog.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {blog.excerpt}
          </p>

          {/* Author Metadata Bar */}
          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={blog.authorAvatar}
                alt={blog.author}
                className="h-12 w-12 rounded-2xl object-cover border-2 border-[#FF4D37]"
              />
              <div>
                <h4 className="text-sm font-extrabold text-[#182033] dark:text-white">
                  {blog.author}
                </h4>
                <p className="text-xs text-gray-400 font-semibold">{blog.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-[#FF4D37]" /> {blog.readTime}
              </span>
              <span>•</span>
              <span>Published on {blog.date}</span>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-[420px] relative border border-gray-200 dark:border-slate-800">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#182033]/60 via-transparent to-transparent"></div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Article Body (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="soft-card rounded-3xl p-8 sm:p-10 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-8">
              
              {blog.contentSections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black text-[#182033] dark:text-white">
                    {section.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                    {section.body}
                  </p>

                  {section.quote && (
                    <blockquote className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-white dark:from-slate-900 dark:to-slate-900/60 border-l-4 border-[#FF4D37] text-sm font-bold text-gray-800 dark:text-gray-200 italic my-4">
                      "{section.quote}"
                    </blockquote>
                  )}

                  {section.codeSnippet && (
                    <div className="rounded-2xl bg-[#0d111a] p-5 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                      <pre><code>{section.codeSnippet}</code></pre>
                    </div>
                  )}
                </div>
              ))}

              {/* Author Bio Footer */}
              <div className="pt-8 border-t border-gray-100 dark:border-slate-800 flex items-center gap-4 bg-gray-50 dark:bg-slate-900/60 p-6 rounded-3xl">
                <img
                  src={blog.authorAvatar}
                  alt={blog.author}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-[#FF4D37]"
                />
                <div>
                  <h4 className="text-sm font-black text-[#182033] dark:text-white">
                    Written by {blog.author}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {blog.role}. Writes regular technical whitepapers on enterprise AI architectures and full-stack performance.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Sidebar (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Table of Contents */}
            <div className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#182033] dark:text-white flex items-center gap-2">
                <BookOpen size={18} className="text-[#FF4D37]" /> Article Outline
              </h3>
              <ul className="space-y-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                {blog.contentSections.map((sec, i) => (
                  <li key={i} className="hover:text-[#FF4D37] transition cursor-pointer flex items-center gap-2">
                    <span className="text-[#FF4D37] font-black">•</span>
                    <span>{sec.heading}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscribe */}
            <div className="soft-card rounded-3xl p-6 bg-gradient-to-br from-orange-50 to-white dark:from-[#161c2a] dark:to-slate-900 border border-orange-200 dark:border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF4D37]">
                <Sparkles size={16} /> TechEllixir Dispatch
              </div>
              <h4 className="text-lg font-black text-[#182033] dark:text-white">
                Subscribe to Tech Articles
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Get high-quality engineering architecture breakdowns delivered straight to your inbox.
              </p>

              {subSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Subscribed successfully!
                </div>
              )}

              <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                <input
                  type="email"
                  required
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#FF4D37]"
                />
                <button
                  type="submit"
                  className="brand-button w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Subscribe <Send size={14} />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};

export default BlogDetailPage;
