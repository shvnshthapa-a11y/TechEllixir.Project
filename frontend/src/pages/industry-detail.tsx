import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Briefcase,
  ShoppingCart,
  Factory,
  Truck,
  Building,
  GraduationCap,
  Megaphone,
  Users,
  Rocket,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface IndustryData {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullDesc: string;
  outcomes: string[];
  capabilities: { title: string; desc: string }[];
  useCases: string[];
}

const industryDetailsMap: Record<string, IndustryData> = {
  healthcare: {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    category: "Medical AI & Cloud Pipelines",
    icon: <Activity size={32} />,
    shortDesc: "Predictive diagnostics, OCR patient reports, and secure HIPAA-compliant cloud data pipelines.",
    fullDesc:
      "Empowering hospital networks, diagnostic centers, and healthtech platforms with automated OCR patient report extraction, AI-driven diagnostic assistance, electronic health record (EHR) sync, and zero-trust cloud data pipelines.",
    outcomes: [
      "94% Faster Diagnostic Report Extraction",
      "100% HIPAA & GDPR Compliance Encryption",
      "Seamless Integration with Hospital Information Systems (HIS)",
      "Reduced Administrative Workloads for Clinicians",
    ],
    capabilities: [
      {
        title: "Medical Document OCR & Parsing",
        desc: "Extract structured clinical data, lab reports, and doctor notes automatically into standard JSON format.",
      },
      {
        title: "Predictive Health Risk Models",
        desc: "Utilize Machine Learning algorithms to analyze historical patient vitals and flag early risk indicators.",
      },
      {
        title: "HIPAA Cloud Data Storage",
        desc: "Encrypted at-rest and in-transit healthcare pipelines built on AWS HealthLake and GCP Med-PaLM.",
      },
    ],
    useCases: [
      "Automated Lab Test Result Interpretation & Patient Portal Sync",
      "Radiology Image Segmentation & Diagnostic Recommendation Assistant",
      "Telemedicine EHR Integration & Prescription Automation",
    ],
  },

  finance: {
    id: "finance",
    name: "FinTech & Banking Analytics",
    category: "Financial Risk & Algorithmic ML",
    icon: <Briefcase size={32} />,
    shortDesc: "Fraud detection ML, automated portfolio reporting, sub-second risk analytics, and algorithmic trading pipelines.",
    fullDesc:
      "Architecting high-frequency financial data systems, automated credit scoring models, real-time transaction fraud monitoring, and automated portfolio balancing engines for modern banks, credit unions, and FinTech platforms.",
    outcomes: [
      "Sub-10ms Fraud Transaction Detection",
      "Automated Compliance & Regulatory Audit Reports",
      "Enhanced Loan Approval Efficiency with ML Credit Scoring",
      "Bank-Grade Multi-Tenant Cloud Architecture",
    ],
    capabilities: [
      {
        title: "Real-Time Transaction Fraud Detection",
        desc: "Anomalous transaction monitoring using deep neural networks to intercept fraudulent transfers instantly.",
      },
      {
        title: "Automated Portfolio Analytics",
        desc: "Algorithmic risk evaluation, automated rebalancing recommendations, and yield optimization dashboards.",
      },
      {
        title: "KYC & AML Document Automation",
        desc: "Automated identity verification, background check cross-referencing, and anti-money-laundering audits.",
      },
    ],
    useCases: [
      "Next-Gen Digital Banking & Mobile Wallet Backend",
      "Automated Stock & Crypto Portfolio Strategy Engine",
      "Algorithmic Underwriting & Credit Risk Scoring Platform",
    ],
  },

  retail: {
    id: "retail",
    name: "Retail & E-commerce",
    category: "Personalization Engines & Demand ML",
    icon: <ShoppingCart size={32} />,
    shortDesc: "Personalized recommendation engines, churn predictors, demand forecasting, and real-time sales dashboards.",
    fullDesc:
      "Transforming digital commerce experiences with real-time vector recommendation engines, dynamic pricing algorithms, customer retention analytics, and unified omnichannel inventory orchestration.",
    outcomes: [
      "+35% Increase in Average Order Value (AOV)",
      "Accurate Inventory Demand Forecasting",
      "Automated Customer Churn Prevention Campaigns",
      "Ultra-Fast Next.js Storefront Performance",
    ],
    capabilities: [
      {
        title: "Personalized AI Recommendations",
        desc: "Deploy vector embeddings to suggest hyper-relevant product add-ons and personalized shopping feeds.",
      },
      {
        title: "Inventory Demand Forecasting",
        desc: "Predict regional SKU demand patterns to prevent stockouts and reduce warehouse holding costs.",
      },
      {
        title: "Customer Lifetime Value (LTV) Prediction",
        desc: "Segment customer cohorts automatically to optimize ad spend and launch targeted loyalty workflows.",
      },
    ],
    useCases: [
      "Headless E-Commerce Storefronts with Next.js & Shopify Plus",
      "Dynamic Pricing & Markdown Optimization Algorithms",
      "AI Shopping Assistant & Visual Product Search Engine",
    ],
  },

  manufacturing: {
    id: "manufacturing",
    name: "Smart Manufacturing & IoT",
    category: "Predictive Maintenance & Quality AI",
    icon: <Factory size={32} />,
    shortDesc: "Predictive maintenance forecasting, quality assurance computer vision, and automated telemetry pipelines.",
    fullDesc:
      "Modernizing industrial operations with IoT sensor telemetry ingestion, computer vision quality control, predictive equipment failure alerts, and automated supply chain tracking.",
    outcomes: [
      "40% Reduction in Unplanned Machine Downtime",
      "99.8% Automated Defect Inspection Accuracy",
      "Real-Time Factory Floor Telemetry Dashboard",
      "Streamlined Assembly Line Energy Optimization",
    ],
    capabilities: [
      {
        title: "Predictive Equipment Maintenance",
        desc: "Analyze vibration, thermal, and sensor telemetry to predict component failures weeks before occurrence.",
      },
      {
        title: "Computer Vision Quality Inspection",
        desc: "Edge AI cameras scanning assembly lines at high speeds to detect micro-defects automatically.",
      },
      {
        title: "Industrial IoT Cloud Telemetry",
        desc: "Scalable MQTT and Kafka streaming data pipelines aggregating data from thousands of factory sensors.",
      },
    ],
    useCases: [
      "Automated Factory Quality Assurance Camera System",
      "IoT Predictive Maintenance & Work-Order Automation",
      "Energy Consumption Analytics & Production Scheduling",
    ],
  },

  logistics: {
    id: "logistics",
    name: "Supply Chain & Logistics",
    category: "Fleet Optimization & Telemetry",
    icon: <Truck size={32} />,
    shortDesc: "Route scheduling algorithms, demand forecasting, real-time fleet telemetry, and automated inventory tracking.",
    fullDesc:
      "Optimizing global and regional supply chains with dynamic route optimization algorithms, real-time vehicle GPS telemetry tracking, automated warehouse inventory, and carrier performance analytics.",
    outcomes: [
      "22% Reduction in Vehicle Fuel Costs",
      "Real-Time Shipment Visibility & ETA Accuracy",
      "Automated Warehouse Dispatch & Dispatching",
      "Reduced Transit Delays & Idle Times",
    ],
    capabilities: [
      {
        title: "Dynamic Fleet Route Optimization",
        desc: "Graph theory algorithms computing fuel-efficient delivery routes considering live traffic and weather constraints.",
      },
      {
        title: "Warehouse Inventory Automation",
        desc: "RFID and barcode tracking pipelines integrated with enterprise ERP systems.",
      },
      {
        title: "Carrier Performance & Risk Analytics",
        desc: "Score carrier dependability and automate delivery status notifications for end customers.",
      },
    ],
    useCases: [
      "Last-Mile Delivery Driver Dispatch & Navigation App",
      "Real-Time Cold-Chain Temperature Telemetry Tracking",
      "Automated Customs & Freight Clearance Documentation",
    ],
  },

  realestate: {
    id: "realestate",
    name: "Real Estate & PropTech",
    category: "Property Pricing & Valuation Dashboards",
    icon: <Building size={32} />,
    shortDesc: "Market pricing models, automated document extraction, virtual tours, and valuation dashboards.",
    fullDesc:
      "Transforming real estate investment and property management with automated valuation models (AVM), lease agreement OCR extraction, tenant portal automation, and predictive yield analytics.",
    outcomes: [
      "Instant Automated Property Valuation Estimates",
      "90% Faster Lease Agreement Data Extraction",
      "Higher Tenant Engagement & Renewal Rates",
    ],
    capabilities: [
      {
        title: "Automated Valuation Models (AVM)",
        desc: "Combine comparative market analysis, historical sales, and neighborhood trends for pricing insights.",
      },
      {
        title: "Lease Document Extraction",
        desc: "Parse complex legal leases to automatically extract key dates, escalation clauses, and payment schedules.",
      },
      {
        title: "Tenant & Maintenance Portals",
        desc: "Modern digital platforms for rent collection, work order tickets, and property performance analytics.",
      },
    ],
    useCases: [
      "AI-Powered Commercial Property Investment Dashboard",
      "Automated Tenant Screen & Lease Sign Platform",
      "PropTech Property Management & Maintenance Portal",
    ],
  },

  education: {
    id: "education",
    name: "Education & EdTech",
    category: "AI Tutors & Adaptive Learning",
    icon: <GraduationCap size={32} />,
    shortDesc: "Custom AI tutors, student behavior analytics, automated grading, and administrative automations.",
    fullDesc:
      "Powering next-generation learning platforms with personalized AI tutoring assistants, adaptive quiz generation, student engagement tracking, and university administrative workflow automation.",
    outcomes: [
      "Personalized 24/7 AI Tutoring Support",
      "Increased Student Retention & Course Completion Rates",
      "Automated Quiz Generation & Assignment Grading",
    ],
    capabilities: [
      {
        title: "Adaptive AI Course Tutors",
        desc: "LLM agents trained on curriculum data to answer student questions and offer customized practice exercises.",
      },
      {
        title: "Student Progress Analytics",
        desc: "Dashboards tracking learning pace, concept mastery, and flagging students needing extra assistance.",
      },
      {
        title: "Automated Grading & Assessment",
        desc: "Instant evaluation of coding assignments, multiple-choice quizzes, and essay structure analysis.",
      },
    ],
    useCases: [
      "Interactive Coding & STEM Learning Platform",
      "University Student Information System & Portal",
      "AI Exam Preparation & Flashcard Generator",
    ],
  },

  marketing: {
    id: "marketing",
    name: "Digital Marketing & MarTech",
    category: "Sentiment AI & Attribution Models",
    icon: <Megaphone size={32} />,
    shortDesc: "Sentiment analysis, campaign performance trackers, attribution models, and customer segmentation.",
    fullDesc:
      "Supercharging marketing campaigns with AI copy generation, real-time social sentiment listening, automated multi-touch attribution models, and high-converting landing page architectures.",
    outcomes: [
      "3x Higher Campaign Return on Ad Spend (ROAS)",
      "Automated Multi-Channel Content Publishing",
      "Real-Time Audience Sentiment & Trend Alerts",
    ],
    capabilities: [
      {
        title: "AI Content Generation Pipelines",
        desc: "Generate brand-aligned ad creatives, SEO articles, and email newsletters automatically.",
      },
      {
        title: "Multi-Touch Attribution Analytics",
        desc: "Track customer conversion paths accurately across organic, paid, social, and email channels.",
      },
      {
        title: "Real-Time Sentiment Monitoring",
        desc: "NLP pipelines scanning social channels to gauge audience sentiment around your brand.",
      },
    ],
    useCases: [
      "Automated Social Media Scheduling & Content Suite",
      "SEO Growth & Keyword Performance Tracking Platform",
      "Hyper-Personalized Email Marketing Automation Engine",
    ],
  },

  hr: {
    id: "hr",
    name: "Human Resources & HRTech",
    category: "CV Parsing & Talent Analytics",
    icon: <Users size={32} />,
    shortDesc: "CV parser automations, employee engagement analytics, automated onboarding, and organizational charts.",
    fullDesc:
      "Streamlining recruitment and talent management with intelligent resume parsing, automated interview scheduling, employee sentiment surveys, and performance evaluation dashboards.",
    outcomes: [
      "80% Faster Candidate Resume Screening",
      "Automated Onboarding Documentation Workflow",
      "Improved Employee Retention & Culture Insights",
    ],
    capabilities: [
      {
        title: "AI CV & Resume Screening",
        desc: "Automatically rank candidate resumes based on skill match, experience relevance, and project portfolio.",
      },
      {
        title: "Automated Interview Scheduling",
        desc: "Sync recruiter calendars with candidate availability to schedule rounds automatically.",
      },
      {
        title: "Employee Sentiment & Performance",
        desc: "Analyze feedback surveys to identify burnout risks and recognize top performers.",
      },
    ],
    useCases: [
      "Enterprise Applicant Tracking System (ATS)",
      "Digital Employee Onboarding & Task Checklist Portal",
      "Internal Skills Matrix & Continuous Feedback Tool",
    ],
  },

  startups: {
    id: "startups",
    name: "Startups & Enterprises",
    category: "Rapid PoC & Scalable Architecture",
    icon: <Rocket size={32} />,
    shortDesc: "Rapid PoC development, scalable cloud MLOps infrastructure, MVP buildout, and AI product roadmaps.",
    fullDesc:
      "Accelerating product launch velocity for high-growth startups and enterprise innovation labs. From zero-to-one MVP development to multi-region cloud scaling and custom AI model integration.",
    outcomes: [
      "Go-Live MVP Launched in 4 to 8 Weeks",
      "Enterprise Cloud Architecture Ready for Scale",
      "Sub-Second API Response Times & High Reliability",
    ],
    capabilities: [
      {
        title: "Rapid MVP & PoC Engineering",
        desc: "Build production-grade web & mobile applications fast using React 19, Node.js, and cloud backends.",
      },
      {
        title: "AI Model Fine-Tuning & RAG",
        desc: "Integrate specialized LLMs and vector databases tailored specifically to your core product feature set.",
      },
      {
        title: "Scalable Infrastructure Architecture",
        desc: "Set up auto-scaling Kubernetes clusters, serverless databases, and CI/CD pipelines from day one.",
      },
    ],
    useCases: [
      "SaaS MVP Build for Venture-Backed Startups",
      "Enterprise AI Prototype & Proof-of-Concept Engine",
      "Legacy Platform Migration to Modern Next.js Cloud",
    ],
  },
};

export default function IndustryDetail() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [cmsIndustry, setCmsIndustry] = useState<IndustryData | null>(null);

  // Match industry or default to healthcare
  const key = slug ? slug.toLowerCase().replace(/[^a-z]/g, "") : "healthcare";

  useEffect(() => {
    fetch("/api/cms/industries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items) && slug) {
          const match = data.items.find(
            (i: any) =>
              i.id === slug ||
              i.slug === slug ||
              (i.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug.toLowerCase() ||
              (i.title || "").toLowerCase().includes(slug.toLowerCase())
          );
          if (match) {
            setCmsIndustry({
              id: match.id || slug,
              name: match.title || match.name,
              category: match.tagline || "Specialized Industry Solution",
              icon: <Rocket size={32} />,
              shortDesc: match.description || match.tagline || "",
              fullDesc: match.description || match.tagline || "",
              outcomes: [
                "100% Custom Tailored Solution",
                "Proven High Performance & Scalability",
                "Enterprise Security & Compliance",
              ],
              capabilities: [
                { title: "Specialized Integration", desc: match.description || "Tailored workflow engineering." }
              ],
              useCases: ["Enterprise Sector Automation", "Real-Time Pipeline Optimization"],
            });
          }
        }
      })
      .catch(() => {});
  }, [slug]);

  const industry = cmsIndustry || industryDetailsMap[key] || industryDetailsMap["healthcare"];

  return (
    <main className="bg-[#fffaf7] dark:bg-[#0d111a] text-[#182033] dark:text-gray-100 transition-colors duration-300 min-h-screen pt-32 pb-24">
      <div className="container-shell max-w-5xl space-y-12">
        
        {/* Back Link Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF4D37] transition group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Industries & Services</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] border border-orange-200 dark:border-slate-700">
            {industry.category}
          </span>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="soft-card rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-md space-y-6"
        >
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] shrink-0 border border-orange-200 dark:border-slate-700 shadow-sm">
              {industry.icon}
            </div>
            <div>
              <span className="eyebrow">Industry Specific AI & Cloud Solution</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#182033] dark:text-white mt-1">
                {industry.name}
              </h1>
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {industry.fullDesc}
          </p>

          {/* Key Outcomes */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 block mb-4">
              Proven Business Impact & Measurable Outcomes:
            </span>
            <div className="grid sm:grid-cols-2 gap-3">
              {industry.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <CheckCircle2 size={18} className="text-[#FF4D37] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technical Capabilities Section */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="eyebrow justify-center">CORE ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#182033] dark:text-white">
              Technical Capabilities for {industry.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {industry.capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="soft-card rounded-3xl p-6 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-slate-800 text-[#FF4D37] flex items-center justify-center font-black text-sm">
                  0{i + 1}
                </div>
                <h3 className="text-base font-black text-[#182033] dark:text-white">
                  {cap.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Example Use Cases Box */}
        <div className="soft-card rounded-3xl p-8 bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-[#182033] dark:text-white flex items-center gap-2">
            <Sparkles size={20} className="text-[#FF4D37]" /> Example Product Deployments
          </h3>

          <div className="space-y-3">
            {industry.useCases.map((useCase, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                <span className="text-[#FF4D37] font-black">•</span>
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-orange-50 to-white dark:from-[#161c2a] dark:to-slate-900 border border-orange-200 dark:border-slate-800 shadow-xl space-y-4">
          <span className="eyebrow justify-center">TAILORED INDUSTRY CONSULTATION</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#182033] dark:text-white">
            Ready to deploy {industry.name} AI solutions?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto font-medium">
            Schedule a strategy session with our technical architects to discuss your specific infrastructure requirements and project roadmap.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                navigate("/contact");
                setTimeout(() => {
                  const event = new CustomEvent("set-contact-subject", {
                    detail: `${industry.name} AI & Software Solutions Inquiry`,
                  });
                  window.dispatchEvent(event);
                }, 300);
              }}
              className="brand-button px-9 py-4 text-xs font-black inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              Request Strategy Call for {industry.name}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
