import { useState } from "react";
import { Link } from "react-router-dom";
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
                  <Link
                    to={`/register-internship?domain=${encodeURIComponent(domain.title)}`}
                    className="group/btn mt-7 inline-flex items-center gap-2 font-bold text-[#FF4D37] hover:underline cursor-pointer text-left"
                  >
                    Register Now
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                    />
                  </Link>
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
            <Link
              to="/register-internship?domain=Full%20Stack%20Development"
              className="brand-button mt-9 px-9 py-4 inline-flex items-center gap-2"
            >
              Register Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
