import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Globe,
  Palette,
  Shield,
  Smartphone,
  BarChart3,
  Gamepad2,
  Briefcase,
  TestTube2,
  FileSpreadsheet,
  PenTool,
  Search,
  Bot,
  LineChart,
  Server,
  Cpu,
  Monitor,
  Paintbrush,
  Megaphone,
  Users,
  Phone,
  BookOpen,
  ClipboardList,
  Calculator,
  UserCheck,
  Mail,
  Building2,
  Layers,
  ArrowUpRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const domains = [
  {
    title: "Artificial Intelligence",
    category: "ai",
    badge: "🔥 #1 Most Popular",
    icon: <BrainCircuit size={30} />,
    description:
      "Build intelligent applications using AI, LLMs, prompt engineering, and automation tools.",
  },
  {
    title: "Full Stack Development",
    category: "web",
    badge: "🚀 High Demand",
    icon: <Code2 size={30} />,
    description:
      "Work across frontend and backend systems using MERN / Python while understanding real product delivery.",
  },
  {
    title: "Frontend Development",
    category: "web",
    badge: "⚡ Trending 2026",
    icon: <Globe size={30} />,
    description:
      "Learn React 19, HTML, CSS, Tailwind CSS, TypeScript, and modern high-performance frontend development.",
  },
  {
    title: "Backend Development",
    category: "web",
    badge: "⚡ High Demand",
    icon: <Database size={30} />,
    description:
      "Build scalable APIs using Node.js, Express, Python, PostgreSQL, and REST/GraphQL architecture.",
  },
  {
    title: "Mobile App Development",
    category: "mobile",
    badge: "⭐ Top Choice",
    icon: <Smartphone size={30} />,
    description:
      "Develop Android and iOS applications using Flutter, React Native, and cross-platform tools.",
  },
  {
    title: "Cloud Computing & DevOps",
    category: "cloud",
    badge: "🚀 2026 Hot Skill",
    icon: <Cloud size={30} />,
    description:
      "Deploy scalable applications using AWS, Azure, Docker, Kubernetes, and CI/CD pipelines.",
  },
  {
    title: "Machine Learning",
    category: "ai",
    badge: "🔥 High Demand",
    icon: <Bot size={30} />,
    description:
      "Learn supervised learning, deep learning, neural networks, model deployment, and AI workflows.",
  },
  {
    title: "Cyber Security",
    category: "cloud",
    badge: "🛡️ High Demand",
    icon: <Shield size={30} />,
    description:
      "Learn ethical hacking, network security, penetration testing, zero-trust, and secure development.",
  },
  {
    title: "UI / UX Design",
    icon: <Palette size={30} />,
    description:
      "Design intuitive interfaces using Figma, wireframes, and design systems.",
  },
  {
    title: "Graphic Design",
    icon: <Paintbrush size={30} />,
    description:
      "Create branding, social media creatives, and marketing assets.",
  },
  {
    title: "Video Editing",
    icon: <Monitor size={30} />,
    description:
      "Edit professional videos using modern editing software and motion graphics.",
  },
  {
    title: "Web Development",
    icon: <Layers size={30} />,
    description:
      "Build responsive websites with modern frontend and backend technologies.",
  },
  {
    title: "React Development",
    icon: <Code2 size={30} />,
    description:
      "Develop scalable React applications using hooks, routing, and APIs.",
  },
  {
    title: "Python Development",
    icon: <Cpu size={30} />,
    description:
      "Develop backend applications, automation scripts, and APIs using Python.",
  },
  {
    title: "Python Full Stack Development",
    icon: <Server size={30} />,
    description:
      "Master Python, Django, React, databases, and deployment.",
  },
  {
    title: "Java Full Stack Development",
    icon: <Code2 size={30} />,
    description:
      "Develop enterprise applications with Java, Spring Boot, and React.",
  },
  {
    title: ".NET Development",
    icon: <Server size={30} />,
    description:
      "Build enterprise software using C#, ASP.NET Core, and SQL Server.",
  },
  {
    title: "MEAN Stack Development",
    icon: <Layers size={30} />,
    description:
      "Build full-stack applications using MongoDB, Express, Angular, and Node.js.",
  },
  {
    title: "MERN Stack Development",
    icon: <Layers size={30} />,
    description:
      "Create scalable web applications using MongoDB, Express, React, and Node.js.",
  },
  {
    title: "Flutter Development",
    icon: <Smartphone size={30} />,
    description:
      "Develop beautiful cross-platform mobile apps with Flutter.",
  },
  {
    title: "Game Development",
    icon: <Gamepad2 size={30} />,
    description:
      "Build engaging games using Unity, C#, and game development concepts.",
  },
  {
    title: "Software Testing",
    icon: <TestTube2 size={30} />,
    description:
      "Learn manual testing, automation testing, Selenium, and QA processes.",
  },
  {
    title: "Data Science",
    icon: <BarChart3 size={30} />,
    description:
      "Analyze data, build predictive models, and create business insights.",
  },
  {
    title: "Data Engineering",
    icon: <Database size={30} />,
    description:
      "Design data pipelines, ETL processes, and cloud data platforms.",
  },
  {
    title: "Data Analytics",
    icon: <LineChart size={30} />,
    description:
      "Turn raw data into meaningful insights using SQL, Excel, and BI tools.",
  },
  {
    title: "Power BI / Data Visualization",
    icon: <BarChart3 size={30} />,
    description:
      "Create interactive dashboards and reports using Microsoft Power BI.",
  },
  {
    title: "MS SQL",
    icon: <Database size={30} />,
    description:
      "Learn relational databases, SQL queries, optimization, and reporting.",
  },
  {
    title: "Business Analyst",
    icon: <Briefcase size={30} />,
    description:
      "Bridge business needs with technical solutions through analysis and documentation.",
  },
  {
    title: "WordPress Development",
    icon: <Globe size={30} />,
    description:
      "Build responsive websites and e-commerce platforms using WordPress.",
  },
  {
    title: "SEO",
    icon: <Search size={30} />,
    description:
      "Improve website rankings through technical SEO and content optimization.",
  },
  {
    title: "Digital Marketing",
    icon: <Megaphone size={30} />,
    description:
      "Learn SEO, SEM, social media marketing, and campaign management.",
  },
  {
    title: "Advanced Excel",
    icon: <FileSpreadsheet size={30} />,
    description:
      "Master Excel formulas, dashboards, pivot tables, and automation.",
  },
  {
    title: "Project Management",
    icon: <ClipboardList size={30} />,
    description:
      "Learn Agile, Scrum, planning, execution, and project delivery.",
  },
  {
    title: "Sales Executive",
    icon: <Briefcase size={30} />,
    description:
      "Develop customer relationships and achieve business growth targets.",
  },
  {
    title: "Social Media Handling",
    icon: <Users size={30} />,
    description:
      "Manage social media pages, engagement, and online communities.",
  },
  {
    title: "Social Media Management",
    icon: <Users size={30} />,
    description:
      "Plan, schedule, and optimize content across social platforms.",
  },
  {
    title: "Social Media Marketing",
    icon: <Megaphone size={30} />,
    description:
      "Run campaigns that grow brand awareness and generate leads.",
  },
  {
    title: "Accounting",
    icon: <Calculator size={30} />,
    description:
      "Learn bookkeeping, financial reporting, taxation, and accounting tools.",
  },
  {
    title: "Content Creation",
    icon: <PenTool size={30} />,
    description:
      "Create engaging content for digital platforms and brands.",
  },
  {
    title: "Content Writing",
    icon: <BookOpen size={30} />,
    description:
      "Write SEO-friendly blogs, articles, website copy, and marketing content.",
  },
  {
    title: "HR",
    icon: <UserCheck size={30} />,
    description:
      "Learn recruitment, onboarding, employee engagement, and HR operations.",
  },
  {
    title: "Email Marketing",
    icon: <Mail size={30} />,
    description:
      "Create email campaigns, automation, and customer engagement strategies.",
  },
  {
    title: "Tele Calling",
    icon: <Phone size={30} />,
    description:
      "Develop communication skills and customer interaction techniques.",
  },
  {
    title: "Support Calling",
    icon: <Phone size={30} />,
    description:
      "Provide customer support and resolve client issues professionally.",
  },
  {
    title: "Meta & Google Ads",
    icon: <Megaphone size={30} />,
    description:
      "Create and optimize paid advertising campaigns across Meta and Google.",
  },
  {
    title: "Business Development Executive (BDE)",
    icon: <Building2 size={30} />,
    description:
      "Generate leads, build client relationships, and drive business growth.",
  },
  {
    title: "Business Development Associate (BDA)",
    icon: <Building2 size={30} />,
    description:
      "Support sales initiatives, client acquisition, and market expansion.",
  },
];

export default function Career() {
  const [filterTag, setFilterTag] = useState<string>("all");

  // Custom Internship Application Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("Frontend Development");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("3rd Year");
  const [resumeUrl, setResumeUrl] = useState("");
  const [reason, setReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenModal = (domainTitle?: string) => {
    if (domainTitle) {
      setSelectedDomain(domainTitle);
    }
    setFormError("");
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError("Please enter a valid mobile / WhatsApp number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/internship-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          domain: selectedDomain,
          college: college.trim() || "Not specified",
          year,
          resumeUrl: resumeUrl.trim(),
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDomains = domains.filter((d) => {
    if (filterTag === "all") return true;
    if (filterTag === "trending") return !!d.badge;
    return d.category === filterTag;
  });

  return (
    <main className="bg-[#fffaf7] dark:bg-[#0d111a] text-[#182033] dark:text-gray-100 transition-colors duration-300">
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#fffaf7,#ffffff_48%,#fff0eb)] dark:bg-[linear-gradient(135deg,#0d111a,#131924_48%,#1a2234)]" />
        <div className="container-shell text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow justify-center"
          >
            Internship Program
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-title mx-auto mt-5 max-w-3xl text-4xl sm:text-4xl md:text-6xl text-[#182033] dark:text-white"
          >
            Start your career with practical project experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-copy mx-auto mt-7 max-w-3xl text-lg text-gray-600 dark:text-gray-300"
          >
            Gain hands-on experience, learn modern technologies, and grow under
            mentors who help you understand how real products are planned,
            designed, built, and launched.
          </motion.p>
        </div>
      </section>

      <section className="section-shell pt-8">
        <div className="container-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="eyebrow justify-center">Internship Domains</p>
            <h2 className="section-title mt-3 text-4xl text-[#182033] dark:text-white">
              Choose your area of interest
            </h2>
          </div>

          {/* Trend Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: "all", label: `⚡ All Domains (${domains.length})` },
              { id: "trending", label: `🔥 Top Trending 2026 (${domains.filter(d => !!d.badge).length})` },
              { id: "ai", label: "🤖 AI & Data Science" },
              { id: "web", label: "💻 Web & Full Stack" },
              { id: "mobile", label: "📱 Mobile Apps" },
              { id: "cloud", label: "☁️ Cloud & Security" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTag(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  filterTag === tab.id
                    ? "bg-[#FF4D37] text-white shadow-lg shadow-[#FF4D37]/20 font-black"
                    : tab.id === "trending"
                    ? "bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] border border-orange-200 dark:border-slate-700 hover:bg-[#ffe5dc]"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredDomains.map((domain, index) => (
                <motion.article
                  layout
                  key={domain.title}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: index * 0.03 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="soft-card rounded-3xl p-7 flex flex-col bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-[#ffd5ca] dark:hover:border-slate-700 transition-all duration-300 group"
                >
                  {/* Trend Badge if present */}
                  {domain.badge && (
                    <div className="mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] border border-orange-200 dark:border-slate-700 inline-block group-hover:scale-105 transition">
                        {domain.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon Left - Title Right */}
                  <div className="flex items-center gap-4">
                    <div className="icon-tile flex h-14 w-14 items-center justify-center flex-shrink-0 bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] rounded-2xl group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#FF4D37] group-hover:text-white transition-all duration-300 shadow-sm">
                      {domain.icon}
                    </div>
                    <h3 className="text-xl font-black text-[#182033] dark:text-white leading-snug flex-1 group-hover:text-[#FF4D37] transition-colors duration-200">
                      {domain.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="section-copy mt-5 text-sm flex-1 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => handleOpenModal(domain.title)}
                    className="group/btn mt-7 inline-flex items-center gap-2 font-bold text-[#FF4D37] hover:underline cursor-pointer text-left"
                  >
                    Register Now
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                    />
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-shell">
          <div className="glass-card mx-auto max-w-4xl rounded-3xl p-8 text-center sm:p-12 bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 shadow-xl">
            <h2 className="section-title text-3xl sm:text-4xl text-[#182033] dark:text-white">
              Ready to join our internship program?
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl text-gray-600 dark:text-gray-300">
              Complete your registration and we will review your application.
              Shortlisted candidates will be contacted with the next steps.
            </p>
            <button
              onClick={() => handleOpenModal("Full Stack Development")}
              className="brand-button mt-9 px-9 py-4 cursor-pointer"
            >
              Register Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* CUSTOM INTERNSHIP APPLICATION MODAL FORM */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
                    <span>Internship Program Application</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Complete your registration to join TechEllixir's practical project program.
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
                {isSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-2xl font-black text-[#182033] dark:text-white">
                      Application Submitted! 🎉
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
                      Thank you <span className="font-bold text-[#FF4D37]">{fullName}</span> for applying for the <span className="font-bold">{selectedDomain}</span> Internship. We have sent a confirmation email to <span className="font-bold">{email}</span>.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={handleCloseModal}
                        className="brand-button px-8 py-3 text-xs font-bold cursor-pointer"
                      >
                        Done & Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    
                    {formError && (
                      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Domain Selection */}
                    <div>
                      <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                        Applied Internship Domain <span className="text-[#FF4D37]">*</span>
                      </label>
                      <select
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                      >
                        {domains.map((d) => (
                          <option key={d.title} value={d.title}>
                            {d.title} {d.badge ? `(${d.badge})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                          Full Name <span className="text-[#FF4D37]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rudra Pratap Bisht"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                          Email Address <span className="text-[#FF4D37]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. rudra@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                          Mobile / WhatsApp Number <span className="text-[#FF4D37]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        />
                      </div>

                      {/* Year of Study */}
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                          Year of Study / Status <span className="text-[#FF4D37]">*</span>
                        </label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                        >
                          <option value="1st Year">1st Year Student</option>
                          <option value="2nd Year">2nd Year Student</option>
                          <option value="3rd Year">3rd Year Student</option>
                          <option value="Final Year">Final Year Student</option>
                          <option value="Graduated / Working">Graduated / Working Professional</option>
                        </select>
                      </div>
                    </div>

                    {/* College / University Name */}
                    <div>
                      <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                        College / University / Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Graphic Era University / DIT Dehradun"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                      />
                    </div>

                    {/* Resume / Portfolio Link */}
                    <div>
                      <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                        LinkedIn / Portfolio / Resume Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.in/in/yourprofile or Google Drive link"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition"
                      />
                    </div>

                    {/* Statement of Purpose */}
                    <div>
                      <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                        Why do you want to join TechEllixir?
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Share your goals and what project experience you hope to gain..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-[#FF4D37] transition resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-5 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="brand-button px-8 py-3 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
