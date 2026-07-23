import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Cloud,
  Code2,
  Cpu,
  Database,
  LineChart,
  Target,
  Zap,
  Check,
  Sparkles,
  X,
  Smartphone,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

interface ServicesProps {
  detailed?: boolean;
}

// 1. Core Engineering & Product Development Services (From screenshot)
const coreServicesData = [
  {
    title: "Web Development",
    icon: <Code2 size={28} />,
    description: "Responsive web platforms built with React, Node.js, and modern architecture that scale with real traffic.",
    note: "We build modern, high-performance web applications with clean frontend architecture, reliable REST/GraphQL APIs, enterprise database systems, and lightning-fast load times.",
    highlights: ["React & Next.js", "Node.js & APIs", "Scalable Web Apps"],
    subServices: [
      "Custom Web Applications",
      "Frontend Development (React/Next.js)",
      "Backend & RESTful APIs (Node.js)",
      "E-Commerce Platforms",
      "Progressive Web Apps (PWA)",
      "Performance Optimization & SEO"
    ]
  },
  {
    title: "Mobile App Development",
    icon: <Smartphone size={28} />,
    description: "Cross-platform Android and iOS apps with slick interfaces, reliable performance, and practical release support.",
    note: "Deliver native-grade mobile experiences on both iOS and Android. From initial UI design to offline synchronization and App Store / Google Play submissions.",
    highlights: ["iOS & Android", "Flutter & React Native", "App Store Deployment"],
    subServices: [
      "Cross-Platform App Development",
      "Native iOS & Android Engineering",
      "Flutter & React Native Frameworks",
      "Mobile UI/UX Design & Prototyping",
      "Offline Data Sync & API Integration",
      "Store Submission & Lifecycle Maintenance"
    ]
  },
  {
    title: "Cloud Solutions",
    icon: <Cloud size={28} />,
    description: "Cloud deployment, DevOps workflows, Docker, Kubernetes, AWS, and Azure setups that keep products resilient.",
    note: "Architect, deploy, and manage scalable cloud infrastructure across AWS, Azure, and GCP. We implement automated CI/CD pipelines, container orchestration, and 24/7 uptime monitoring.",
    highlights: ["AWS & Azure", "DevOps & CI/CD", "Docker & Kubernetes"],
    subServices: [
      "Cloud Infrastructure (AWS / Azure / GCP)",
      "DevOps & Automated CI/CD Pipelines",
      "Docker & Kubernetes Orchestration",
      "Serverless & Microservices Architecture",
      "Cloud Migration & Modernization",
      "Cost Optimization & Monitoring"
    ]
  },
  {
    title: "AI Solutions",
    icon: <Brain size={28} />,
    description: "AI assistants, workflow automation, model integrations, and intelligent tools designed around business outcomes.",
    note: "Harness generative AI, custom fine-tuned LLMs, and intelligent automation agents to eliminate repetitive work, enhance decision-making, and create smart customer experiences.",
    highlights: ["LLM Integration", "AI Agents & Chatbots", "Workflow Automation"],
    subServices: [
      "AI Chatbots & Virtual Assistants",
      "LLM Integration & Prompt Engineering",
      "Automated AI Workflows & Agents",
      "Intelligent Document Processing (OCR)",
      "Custom AI Tooling & API Integration",
      "Retrieval-Augmented Generation (RAG)"
    ]
  },
  {
    title: "UI/UX Design",
    icon: <Palette size={28} />,
    description: "Human-centered product design, prototypes, and design systems that make complex products feel simple.",
    note: "Craft intuitive, beautiful user interfaces backed by deep user research, wireframing, interactive Figma prototypes, and cohesive design systems.",
    highlights: ["User Research", "Wireframes & Prototyping", "Design Systems"],
    subServices: [
      "User Interface (UI) Design",
      "User Experience (UX) Research",
      "Interactive Figma Prototypes",
      "Design Systems & UI Kits",
      "Web & Mobile App Redesigns",
      "Usability Testing & Conversion Design"
    ]
  },
  {
    title: "Cyber Security",
    icon: <ShieldCheck size={28} />,
    description: "Security reviews, hardening, audits, and safer development practices for teams handling sensitive systems.",
    note: "Protect your applications and customer data with comprehensive vulnerability audits, data encryption, API security hardening, and compliance support.",
    highlights: ["Security Audits", "System Hardening", "Data Protection"],
    subServices: [
      "Vulnerability Assessment & Security Audits",
      "Application Security Hardening",
      "Data Encryption & Privacy Controls",
      "Identity & Access Management (IAM)",
      "API Security & Penetration Guidance",
      "Incident Response & Backup Planning"
    ]
  }
];

// 2. AI & Data Services
const aiDataServicesData = [
  {
    title: "Artificial Intelligence Solutions",
    icon: <Brain size={28} />,
    description: "Custom intelligent systems designed to automate workflows and accelerate growth.",
    note: "Our AI solutions combine generative models, autonomous agents, and RAG architectures to automate enterprise knowledge retrieval, streamline customer interactions, and transform raw document streams into actionable insights.",
    highlights: ["Generative AI Solutions", "AI Agents & Business Automation", "RAG & LLM Integration"],
    subServices: [
      "Custom AI Application Development",
      "Generative AI Solutions",
      "AI Chatbots & Virtual Assistants",
      "AI Agents & Business Automation",
      "Large Language Model (LLM) Integration",
      "Retrieval-Augmented Generation (RAG)",
      "AI API Integration",
      "Intelligent Document Processing (OCR + AI)"
    ]
  },
  {
    title: "Data Analytics",
    icon: <BarChart3 size={28} />,
    description: "Transform raw data into beautiful BI dashboards and strategic business insights.",
    note: "We engineer interactive, real-time business intelligence dashboards using Power BI, Tableau, and custom SQL analytics to turn complex operational datasets into clear executive KPIs and sales metrics.",
    highlights: ["BI Dashboards", "Sales & Marketing Analytics", "Performance Reporting"],
    subServices: [
      "Business Intelligence Dashboards",
      "Data Cleaning & Preparation",
      "Exploratory Data Analysis (EDA)",
      "KPI & Performance Reporting",
      "Sales & Marketing Analytics",
      "Financial Analytics",
      "Customer Behavior Analysis",
      "SQL Data Analysis",
      "Power BI & Tableau Dashboards"
    ]
  },
  {
    title: "Data Science",
    icon: <LineChart size={28} />,
    description: "Predict trends and unlock hidden data patterns with advanced models and segmentation.",
    note: "Leverage advanced statistical modeling, time-series forecasting, and algorithmic customer segmentation to accurately predict customer churn, optimize pricing strategies, and detect fraudulent transactions.",
    highlights: ["Predictive Analytics", "Recommendation Engines", "Customer Segmentation"],
    subServices: [
      "Predictive Analytics",
      "Machine Learning Models",
      "Time Series Forecasting",
      "Customer Segmentation",
      "Recommendation Systems",
      "Churn Prediction",
      "Fraud Detection",
      "Statistical Analysis",
      "A/B Testing"
    ]
  },
  {
    title: "Machine Learning & Deep Learning",
    icon: <Cpu size={28} />,
    description: "Train custom neural networks, computer vision tools, and natural language processors.",
    note: "Develop tailored neural networks and computer vision pipelines capable of real-time object detection, video analysis, sentiment tracking, and high-throughput NLP classification.",
    highlights: ["Custom Model Training", "Computer Vision Solutions", "NLP & MLOps Pipelines"],
    subServices: [
      "Custom ML Model Development",
      "Model Training & Optimization",
      "Computer Vision Solutions",
      "Natural Language Processing (NLP)",
      "Image Classification",
      "Object Detection",
      "Sentiment Analysis",
      "Recommendation Engines",
      "Model Deployment (MLOps)"
    ]
  },
  {
    title: "Business Process Automation",
    icon: <Zap size={28} />,
    description: "Connect workflows and automate daily manual tasks using AI and robust APIs.",
    note: "Eliminate repetitive manual data entry and multi-app overhead. We build resilient n8n, Make, and Zapier automated workflows integrated with custom AI parsers and CRM systems.",
    highlights: ["AI Workflow Automation", "Invoice Processing", "Make, Zapier & n8n Flows"],
    subServices: [
      "AI Workflow Automation",
      "CRM Automation",
      "Email Automation",
      "Document Automation",
      "Invoice Processing",
      "PDF Data Extraction",
      "API Integrations",
      "No-Code Automation (n8n, Make, Zapier)"
    ]
  },
  {
    title: "Data Engineering",
    icon: <Database size={28} />,
    description: "Build robust data warehouses and ETL pipelines for clean, query-optimized databases.",
    note: "Establish scalable data pipelines, automated ETL/ELT workflows, and high-performance cloud data warehouses (Snowflake, BigQuery) for lightning-fast queries and high data reliability.",
    highlights: ["ETL/ELT Pipelines", "Data Warehousing", "SQL Optimization"],
    subServices: [
      "ETL/ELT Pipelines",
      "Data Warehousing",
      "Database Design",
      "Cloud Data Migration",
      "Big Data Processing",
      "Data Integration",
      "SQL Optimization",
      "Data Pipeline Automation"
    ]
  },
  {
    title: "Software Development",
    icon: <Code2 size={28} />,
    description: "Build custom web applications, custom API integrations, and robust admin dashboards.",
    note: "From high-performance SaaS applications to modern admin dashboards and RESTful API microservices, we build scalable digital products engineered for long-term growth.",
    highlights: ["Custom Web Apps", "AI SaaS Development", "Admin Dashboards"],
    subServices: [
      "Custom Web Applications",
      "AI SaaS Development",
      "Admin Dashboards",
      "REST API Development",
      "Backend Development",
      "Cloud Deployment",
      "Enterprise Software Solutions",
      "System Integration"
    ]
  },
  {
    title: "Cloud & MLOps",
    icon: <Cloud size={28} />,
    description: "Secure, monitor, and scale models inside resilient AWS, Azure, or GCP infrastructure.",
    note: "Deploy, containerize, and orchestrate ML models using Docker, Kubernetes, and automated CI/CD pipelines with continuous latency monitoring and security compliance.",
    highlights: ["Docker & Kubernetes", "CI/CD Pipelines", "Model Monitoring"],
    subServices: [
      "AWS, Azure & Google Cloud",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Model Monitoring",
      "AI Infrastructure",
      "Scalable Deployment"
    ]
  },
  {
    title: "AI Consulting",
    icon: <Target size={28} />,
    description: "Shape your digital transformation roadmap and validate AI readiness with a clear PoC.",
    note: "Receive strategic advisory on AI architecture, vendor selection, data readiness, and rapid Proof-of-Concept (PoC) prototyping to de-risk high-impact technology investments.",
    highlights: ["AI Strategy & Roadmap", "AI Readiness Assessment", "Proof of Concept"],
    subServices: [
      "AI Strategy & Roadmap",
      "Data Strategy",
      "AI Readiness Assessment",
      "Digital Transformation",
      "Technology Consulting",
      "Proof of Concept (PoC)"
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const Services = ({ detailed = false }: ServicesProps) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<"core" | "ai">("core");
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const currentServicesData = activeCategory === "core" ? coreServicesData : aiDataServicesData;
  const displayedServices = detailed ? currentServicesData : currentServicesData.slice(0, 6);

  const handleRequestDemo = (serviceTitle: string) => {
    setSelectedService(null);
    const event = new CustomEvent("set-contact-subject", {
      detail: `Request a Demo: ${serviceTitle}`
    });
    window.dispatchEvent(event);

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/contact";
    }
  };

  return (
    <section className="section-shell bg-[#fffaf7] dark:bg-[#131924] transition-colors duration-300 relative">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">{t("services.eyebrow")}</p>
          <h2 className="section-title mt-4 text-3xl md:text-4xl">
            {activeCategory === "core" 
              ? "Practical engineering for every stage of growth" 
              : "Transforming businesses with AI & Data Solutions"}
          </h2>
          <p className="section-copy mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            {activeCategory === "core"
              ? "From discovery to deployment, we shape reliable technology around your users, your workflows, and the way your business actually runs."
              : "We help businesses transform data into actionable insights and build intelligent AI-powered solutions that automate workflows."}
          </p>

          {/* Category Toggle Tabs */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-1.5 shadow-sm">
              <button
                onClick={() => setActiveCategory("core")}
                className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                  activeCategory === "core"
                    ? "bg-[#ff4d37] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Core Software Engineering
              </button>
              <button
                onClick={() => setActiveCategory("ai")}
                className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                  activeCategory === "ai"
                    ? "bg-[#ff4d37] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                AI & Data Solutions
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedServices.map((service) => (
            <motion.article
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedService(service)}
              className="soft-card group rounded-3xl p-8 cursor-pointer flex flex-col justify-between transition-shadow transition-colors duration-300 hover:shadow-xl hover:border-[#ffd5ca]"
            >
              <div>
                <div className="icon-tile">{service.icon}</div>
                <h3 className="mt-6 text-2xl font-black text-[#182033] dark:text-white">
                  {service.title}
                </h3>
                <p className="section-copy mt-4 text-sm leading-relaxed">{service.description}</p>

                {/* Summary / Pill view */}
                {!detailed ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : (
                  // Detailed view (List of sub-services)
                  <ul className="mt-6 space-y-2 border-t border-gray-100 dark:border-slate-800 pt-5">
                    {service.subServices.map((sub) => (
                      <li key={sub} className="flex items-start gap-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Check size={14} className="text-[#FF4D37] shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(service);
                  }}
                  className="inline-flex items-center gap-2 font-bold text-[#DF3420] text-sm hover:underline cursor-pointer"
                >
                  Request a Demo
                  <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {!detailed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <NavLink to="/services">
              <motion.span
                className="brand-button px-8 py-4 cursor-pointer text-sm"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {t("services.viewAll")}
                <ArrowRight size={18} />
              </motion.span>
            </NavLink>
          </motion.div>
        )}
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="icon-tile !h-14 !w-14 !rounded-2xl text-[#FF4D37]">
                    {selectedService.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#182033] dark:text-white">
                      {selectedService.title}
                    </h3>
                    <p className="text-xs font-bold text-[#FF4D37] mt-1 tracking-wider uppercase">
                      Overview & Demo Request
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(null)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-white transition cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="my-6 overflow-y-auto pr-2 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-2">
                    About This Service
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                    {selectedService.note || selectedService.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-3">
                    Key Features & Solutions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.subServices.map((sub: string) => (
                      <div
                        key={sub}
                        className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-gray-50/70 dark:bg-slate-900/60 p-3 text-xs font-semibold text-gray-800 dark:text-gray-200"
                      >
                        <Check size={16} className="text-[#FF4D37] shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  Want to see a tailored demonstration for your business?
                </span>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleRequestDemo(selectedService.title)}
                    className="brand-button px-6 py-3 cursor-pointer text-xs font-bold whitespace-nowrap shadow-lg flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    Request a Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
