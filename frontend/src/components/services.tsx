import { useState, useEffect } from "react";
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
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

interface ServicesProps {
  detailed?: boolean;
}

export interface ServiceDetail {
  title: string;
  icon: React.ReactNode;
  description: string;
  note: string;
  detailedOverview: string;
  highlights: string[];
  subServices: string[];
  processSteps: string[];
  keyOutcomes: string[];
  techStack: string[];
}

// 1. Core Engineering & Product Development Services
export const coreServicesData: ServiceDetail[] = [
  {
    title: "Web Development",
    icon: <Code2 size={28} />,
    description: "Responsive web platforms built with React, Node.js, and modern architecture that scale with real traffic.",
    note: "We build modern, high-performance web applications with clean frontend architecture, reliable REST/GraphQL APIs, enterprise database systems, and lightning-fast load times.",
    detailedOverview: "We engineer enterprise web applications built for extreme speed, search visibility, and fault tolerance. Using React 19, Next.js, and Node.js microservices, we build platforms that process millions of requests while providing smooth user flows.",
    highlights: ["React & Next.js", "Node.js & APIs", "Scalable Web Apps"],
    subServices: [
      "Custom Web Applications",
      "Frontend Development (React/Next.js)",
      "Backend & RESTful APIs (Node.js)",
      "E-Commerce Platforms",
      "Progressive Web Apps (PWA)",
      "Performance Optimization & SEO",
      "Single Page Applications (SPA)",
      "API Integrations & Webhooks"
    ],
    processSteps: [
      "1. Discovery & Technical Architecture Audit",
      "2. UI/UX Wireframing & Database Schema Design",
      "3. Full-Stack Agile Development & Automated CI/CD",
      "4. Performance Tuning, Security Audit & Launch"
    ],
    keyOutcomes: [
      "Sub-100ms LCP Page Load Speeds",
      "99.9% Production Server Uptime",
      "SEO-Optimized SSR Architecture",
      "OWASP Security Hardened APIs"
    ],
    techStack: ["React 19", "Next.js", "TypeScript", "Node.js", "Express", "Tailwind CSS v4", "PostgreSQL", "Docker"]
  },
  {
    title: "Mobile App Development",
    icon: <Smartphone size={28} />,
    description: "Cross-platform Android and iOS apps with slick interfaces, reliable performance, and practical release support.",
    note: "Deliver native-grade mobile experiences on both iOS and Android. From initial UI design to offline synchronization and App Store / Google Play submissions.",
    detailedOverview: "Deliver native-grade performance across iOS and Android from a unified codebase. Our mobile engineering team leverages Flutter and React Native to build offline-first, high-framerate mobile apps with push notifications and seamless biometric authentication.",
    highlights: ["iOS & Android", "Flutter & React Native", "App Store Deployment"],
    subServices: [
      "Cross-Platform App Development",
      "Native iOS & Android Engineering",
      "Flutter & React Native Frameworks",
      "Mobile UI/UX Design & Prototyping",
      "Offline Data Sync & API Integration",
      "Store Submission & Lifecycle Maintenance",
      "Biometric Auth & Push Notifications",
      "Mobile App Analytics & Monitoring"
    ],
    processSteps: [
      "1. Mobile UX Prototyping & Flow Mapping",
      "2. Cross-Platform Codebase & State Architecture Setup",
      "3. Backend API Integration & Offline Cache Sync",
      "4. App Store & Google Play Submission & Monitoring"
    ],
    keyOutcomes: [
      "60 FPS Smooth UI Animations & Transitions",
      "50% Reduced Mobile Code Maintenance Costs",
      "Offline Data Sync & Local SQLite Caching",
      "1-Click App Store Publishing Pipeline"
    ],
    techStack: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "REST/GraphQL", "SQLite"]
  },
  {
    title: "Cloud Solutions",
    icon: <Cloud size={28} />,
    description: "Cloud deployment, DevOps workflows, Docker, Kubernetes, AWS, and Azure setups that keep products resilient.",
    note: "Architect, deploy, and manage scalable cloud infrastructure across AWS, Azure, and GCP. We implement automated CI/CD pipelines, container orchestration, and 24/7 uptime monitoring.",
    detailedOverview: "Transform your infrastructure into a resilient, automated cloud platform on AWS, Google Cloud, or Azure. We build auto-scaling Kubernetes clusters, automated zero-downtime CI/CD deployment pipelines, and centralized logging systems.",
    highlights: ["AWS & Azure", "DevOps & CI/CD", "Docker & Kubernetes"],
    subServices: [
      "Cloud Infrastructure (AWS / Azure / GCP)",
      "DevOps & Automated CI/CD Pipelines",
      "Docker & Kubernetes Orchestration",
      "Serverless & Microservices Architecture",
      "Cloud Migration & Modernization",
      "Cost Optimization & Monitoring",
      "Infrastructure as Code (Terraform)",
      "Disaster Recovery & Backup Planning"
    ],
    processSteps: [
      "1. Cloud Infrastructure & Security Audit",
      "2. Terraform Infrastructure-as-Code Setup",
      "3. Docker & Kubernetes Cluster Deployment",
      "4. 24/7 Monitoring & Auto-Scaling Tuning"
    ],
    keyOutcomes: [
      "Zero-Downtime Rolling Deployments",
      "35%+ Reduction in Monthly Cloud Spend",
      "Multi-Region Redundancy & Disaster Recovery",
      "Automated Security Vulnerability Scanning"
    ],
    techStack: ["AWS", "Google Cloud", "Microsoft Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus"]
  },
  {
    title: "AI Solutions",
    icon: <Brain size={28} />,
    description: "AI assistants, workflow automation, model integrations, and intelligent tools designed around business outcomes.",
    note: "Harness generative AI, custom fine-tuned LLMs, and intelligent automation agents to eliminate repetitive work, enhance decision-making, and create smart customer experiences.",
    detailedOverview: "Integrate autonomous generative AI, fine-tuned LLMs, and intelligent multi-agent systems directly into your business workflows. We build context-aware Retrieval-Augmented Generation (RAG) platforms that read company knowledge bases securely.",
    highlights: ["LLM Integration", "AI Agents & Chatbots", "Workflow Automation"],
    subServices: [
      "AI Chatbots & Virtual Assistants",
      "LLM Integration & Prompt Engineering",
      "Automated AI Workflows & Agents",
      "Intelligent Document Processing (OCR)",
      "Custom AI Tooling & API Integration",
      "Retrieval-Augmented Generation (RAG)",
      "Multi-Agent Task Delegation",
      "Zero-Data Leakage AI Sandboxing"
    ],
    processSteps: [
      "1. AI Opportunity & Data Privacy Audit",
      "2. RAG & Vector Database Architecture Setup",
      "3. Agentic Workflow Coding & Model Fine-Tuning",
      "4. Production Guardrails & Latency Optimization"
    ],
    keyOutcomes: [
      "80% Reduction in Customer Support Resolution Time",
      "Zero Data Leakage Security Guardrails",
      "Sub-2s Real-Time LLM Response Times",
      "Automated Knowledge Retrieval"
    ],
    techStack: ["OpenAI API", "Anthropic Claude", "LangChain / LlamaIndex", "Pinecone", "Qdrant", "Python", "FastAPI", "n8n"]
  },
  {
    title: "UI/UX Design",
    icon: <Palette size={28} />,
    description: "Human-centered product design, prototypes, and design systems that make complex products feel simple.",
    note: "Craft intuitive, beautiful user interfaces backed by deep user research, wireframing, interactive Figma prototypes, and cohesive design systems.",
    detailedOverview: "Human-centered digital product design that converts visitors into loyal users. Our design sprint process produces interactive Figma prototypes, accessible design systems, and user interface flows tested with real users.",
    highlights: ["User Research", "Wireframes & Prototyping", "Design Systems"],
    subServices: [
      "User Interface (UI) Design",
      "User Experience (UX) Research",
      "Interactive Figma Prototypes",
      "Design Systems & UI Kits",
      "Web & Mobile App Redesigns",
      "Usability Testing & Conversion Design",
      "Accessibility (WCAG) Compliance",
      "Information Architecture & User Flows"
    ],
    processSteps: [
      "1. User Research & Competitor Benchmarking",
      "2. Information Architecture & Wireframing",
      "3. High-Fidelity UI Design & Figma Prototypes",
      "4. Design System Documentation & Developer Handoff"
    ],
    keyOutcomes: [
      "2.5x Increase in User Conversion Rates",
      "WCAG 2.1 AA Accessibility Compliance",
      "Reusable Figma Design Tokens & Component Kits",
      "Seamless Developer Handoff"
    ],
    techStack: ["Figma", "Framer", "Adobe CC", "Design Systems", "Prototyping", "Usability Testing", "Tailwind Tokens"]
  },
  {
    title: "Cyber Security",
    icon: <ShieldCheck size={28} />,
    description: "Security reviews, hardening, audits, and safer development practices for teams handling sensitive systems.",
    note: "Protect your applications and customer data with comprehensive vulnerability audits, data encryption, API security hardening, and compliance support.",
    detailedOverview: "Protect your applications, APIs, and cloud databases from malicious threats. We perform penetration testing, OWASP vulnerability assessments, automated secret scanning, and implement zero-trust data encryption protocols.",
    highlights: ["Security Audits", "System Hardening", "Data Protection"],
    subServices: [
      "Vulnerability Assessment & Security Audits",
      "Application Security Hardening",
      "Data Encryption & Privacy Controls",
      "Identity & Access Management (IAM)",
      "API Security & Penetration Guidance",
      "Incident Response & Backup Planning",
      "SOC2 & HIPAA Compliance Guidance",
      "Zero-Trust Access Architecture"
    ],
    processSteps: [
      "1. Vulnerability & Code Security Audit",
      "2. API Gateway & Network Hardening",
      "3. Zero-Trust Access & Encryption Setup",
      "4. Continuous Security Monitoring & Compliance"
    ],
    keyOutcomes: [
      "OWASP Top 10 Security Hardening",
      "SOC2 / HIPAA Compliance Preparedness",
      "Zero-Trust Encryption at Rest & In Transit",
      "24/7 Threat Alert Systems"
    ],
    techStack: ["OWASP Tools", "SonarQube", "Trivy", "JWT / OAuth2", "HashiCorp Vault", "AWS WAF", "SSL/TLS"]
  }
];

// 2. AI & Data Services
export const aiDataServicesData: ServiceDetail[] = [
  {
    title: "Artificial Intelligence Solutions",
    icon: <Brain size={28} />,
    description: "Custom intelligent systems designed to automate workflows and accelerate growth.",
    note: "Our AI solutions combine generative models, autonomous agents, and RAG architectures to automate enterprise knowledge retrieval, streamline customer interactions, and transform raw document streams into actionable insights.",
    detailedOverview: "Comprehensive AI engineering from custom generative applications to intelligent document processing. We construct multi-modal pipelines that process scanned PDFs, doctor notes, and financial reports with high precision.",
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
    ],
    processSteps: [
      "1. Knowledge Ingestion & Chunking Setup",
      "2. Vector Embeddings & Indexing",
      "3. Agentic Task Automation Integration",
      "4. Production Benchmarking & Guardrails"
    ],
    keyOutcomes: [
      "99.4% Document Extraction Accuracy",
      "Automated Invoice & Contract Processing",
      "Multi-Agent Workflow Delegation",
      "Scalable Enterprise AI Infrastructure"
    ],
    techStack: ["PyTorch", "TensorFlow", "OpenAI", "Llama 3", "AWS Textract", "Pinecone", "Python", "Docker"]
  },
  {
    title: "Data Analytics",
    icon: <BarChart3 size={28} />,
    description: "Transform raw data into beautiful BI dashboards and strategic business insights.",
    note: "We engineer interactive, real-time business intelligence dashboards using Power BI, Tableau, and custom SQL analytics to turn complex operational datasets into clear executive KPIs and sales metrics.",
    detailedOverview: "Turn disconnected raw data into real-time business intelligence. We build custom executive dashboards in Power BI, Tableau, and Metabase powered by query-optimized SQL databases and automated ETL pipelines.",
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
    ],
    processSteps: [
      "1. Business KPI Mapping & Data Source Integration",
      "2. Data Cleaning & Model Normalization",
      "3. Interactive BI Dashboard Engineering",
      "4. Scheduled Refresh & Stakeholder Access Setup"
    ],
    keyOutcomes: [
      "Sub-Second BI Dashboard Load Times",
      "100% Automated Financial & Sales Reporting",
      "Unified Single Source of Data Truth",
      "Executive KPI Tracking"
    ],
    techStack: ["Power BI", "Tableau", "SQL Server", "Snowflake", "dbt", "PostgreSQL", "BigQuery", "Python"]
  },
  {
    title: "Data Science",
    icon: <LineChart size={28} />,
    description: "Predict trends and unlock hidden data patterns with advanced models and segmentation.",
    note: "Leverage advanced statistical modeling, time-series forecasting, and algorithmic customer segmentation to accurately predict customer churn, optimize pricing strategies, and detect fraudulent transactions.",
    detailedOverview: "Extract predictive intelligence from complex historical datasets. We develop statistical machine learning models for customer churn prediction, recommendation systems, demand forecasting, and fraud detection.",
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
    ],
    processSteps: [
      "1. Exploratory Data Analysis & Feature Engineering",
      "2. ML Algorithm Training & Cross-Validation",
      "3. Model Evaluation & A/B Testing",
      "4. API Deployment & Performance Monitoring"
    ],
    keyOutcomes: [
      "30%+ Increase in Customer Retention",
      "Accurate Sales & Demand Forecasting",
      "Real-Time Algorithmic Fraud Detection",
      "A/B Test Statistical Confidence"
    ],
    techStack: ["Scikit-Learn", "Pandas", "NumPy", "XGBoost", "Statsmodels", "Jupyter", "MLflow", "Python"]
  },
  {
    title: "Machine Learning & Deep Learning",
    icon: <Cpu size={28} />,
    description: "Train custom neural networks, computer vision tools, and natural language processors.",
    note: "Develop tailored neural networks and computer vision pipelines capable of real-time object detection, video analysis, sentiment tracking, and high-throughput NLP classification.",
    detailedOverview: "Custom neural networks for computer vision, image classification, object detection, and natural language processing. We train, optimize, and deploy models using PyTorch and MLOps best practices.",
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
    ],
    processSteps: [
      "1. Dataset Curation & Data Labeling",
      "2. Deep Neural Network Training",
      "3. Model Quantization & Edge Optimization",
      "4. MLOps Automated Re-Training Pipeline"
    ],
    keyOutcomes: [
      "Real-Time Video & Image Processing",
      "High-Throughput NLP Classification",
      "Optimized Model Inference Latency",
      "Automated Model Versioning"
    ],
    techStack: ["PyTorch", "TensorFlow", "OpenCV", "YOLO", "Hugging Face", "MLflow", "CUDA", "TensorRT"]
  },
  {
    title: "Business Process Automation",
    icon: <Zap size={28} />,
    description: "Connect workflows and automate daily manual tasks using AI and robust APIs.",
    note: "Eliminate repetitive manual data entry and multi-app overhead. We build resilient n8n, Make, and Zapier automated workflows integrated with custom AI parsers and CRM systems.",
    detailedOverview: "Connect disjointed SaaS applications and eliminate manual data entry. Using self-hosted n8n, Make, and Zapier combined with custom Python webhooks and AI parsers, we build self-healing business workflows.",
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
    ],
    processSteps: [
      "1. Operational Workflow Audit & Mapping",
      "2. Automation Blueprint & Webhook Setup",
      "3. AI Parser & CRM System Integration",
      "4. Error-Handling & Alert Testing"
    ],
    keyOutcomes: [
      "100+ Hours Saved Per Month Per Team",
      "Zero Manual Copy-Paste Errors",
      "Instant Lead Routing & SLA Triggers",
      "Self-Healing Fallback Workflows"
    ],
    techStack: ["n8n", "Make", "Zapier", "Python Webhooks", "REST APIs", "PostgreSQL", "Slack API", "OpenAI"]
  },
  {
    title: "Data Engineering",
    icon: <Database size={28} />,
    description: "Build robust data warehouses and ETL pipelines for clean, query-optimized databases.",
    note: "Establish scalable data pipelines, automated ETL/ELT workflows, and high-performance cloud data warehouses (Snowflake, BigQuery) for lightning-fast queries and high data reliability.",
    detailedOverview: "Architect scalable data warehouses and automated ETL/ELT pipelines. We structure clean, query-optimized data models in Snowflake, BigQuery, and Redshift with automated data validation tests.",
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
    ],
    processSteps: [
      "1. Data Architecture & Schema Design",
      "2. Streaming & Batch Pipeline Setup",
      "3. Data Warehouse Optimization & dbt Models",
      "4. Automated Quality Checks & Alerting"
    ],
    keyOutcomes: [
      "10x Faster Query Execution Speeds",
      "Automated Data Quality & Validation",
      "Zero Data Loss Pipeline Guarantee",
      "Scalable Big Data Infrastructure"
    ],
    techStack: ["Snowflake", "BigQuery", "AWS Redshift", "Apache Airflow", "dbt", "PostgreSQL", "Spark", "Python"]
  },
  {
    title: "Software Development",
    icon: <Code2 size={28} />,
    description: "Build custom web applications, custom API integrations, and robust admin dashboards.",
    note: "From high-performance SaaS applications to modern admin dashboards and RESTful API microservices, we build scalable digital products engineered for long-term growth.",
    detailedOverview: "Custom software engineering for ambitious products. From multi-tenant AI SaaS platforms to custom API integrations and administrative backoffice portals, we build clean, maintainable software.",
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
    ],
    processSteps: [
      "1. Product Discovery & System Architecture",
      "2. Full-Stack Agile Development Sprint",
      "3. QA Automation & Penetration Testing",
      "4. Cloud Deployment & Scale Support"
    ],
    keyOutcomes: [
      "Enterprise-Grade Architecture",
      "High-Security Microservices API",
      "Custom Admin & Analytics Portals",
      "Scalable Multi-Tenant Backend"
    ],
    techStack: ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS", "PostgreSQL", "Redis"]
  },
  {
    title: "Cloud & MLOps",
    icon: <Cloud size={28} />,
    description: "Secure, monitor, and scale models inside resilient AWS, Azure, or GCP infrastructure.",
    note: "Deploy, containerize, and orchestrate ML models using Docker, Kubernetes, and automated CI/CD pipelines with continuous latency monitoring and security compliance.",
    detailedOverview: "Deploy, monitor, and scale AI models and microservices with confidence. We implement continuous integration and continuous deployment (CI/CD) pipelines, automated model monitoring, and Kubernetes cluster management.",
    highlights: ["Docker & Kubernetes", "CI/CD Pipelines", "Model Monitoring"],
    subServices: [
      "AWS, Azure & Google Cloud",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Model Monitoring",
      "AI Infrastructure",
      "Scalable Deployment"
    ],
    processSteps: [
      "1. Cloud & Model Pipeline Audit",
      "2. Containerization & CI/CD Pipeline Setup",
      "3. Kubernetes Cluster Deployment",
      "4. Drift Detection & Latency Monitoring"
    ],
    keyOutcomes: [
      "Continuous Model Deployment (CI/CD)",
      "Automated Model Drift Alerts",
      "Sub-Second Inference Scaling",
      "Enterprise Cloud Compliance"
    ],
    techStack: ["AWS SageMaker", "Kubernetes", "Docker", "MLflow", "GitHub Actions", "Prometheus", "Grafana", "Python"]
  },
  {
    title: "AI Consulting",
    icon: <Target size={28} />,
    description: "Shape your digital transformation roadmap and validate AI readiness with a clear PoC.",
    note: "Receive strategic advisory on AI architecture, vendor selection, data readiness, and rapid Proof-of-Concept (PoC) prototyping to de-risk high-impact technology investments.",
    detailedOverview: "Strategic technology advisory to navigate digital transformation and validate AI feasibility before large capital investments. We conduct AI readiness assessments and build rapid Proof-of-Concepts (PoC).",
    highlights: ["AI Strategy & Roadmap", "AI Readiness Assessment", "Proof of Concept"],
    subServices: [
      "AI Strategy & Roadmap",
      "Data Strategy",
      "AI Readiness Assessment",
      "Digital Transformation",
      "Technology Consulting",
      "Proof of Concept (PoC)"
    ],
    processSteps: [
      "1. Enterprise AI Readiness Assessment",
      "2. Data Strategy & Architecture Roadmap",
      "3. Rapid 4-Week PoC Prototyping",
      "4. Vendor Selection & Deployment Strategy"
    ],
    keyOutcomes: [
      "Validated AI Feasibility in 4 Weeks",
      "De-risked Technology Investment",
      "Custom Data & AI Strategy Roadmap",
      "Clear ROI & Cost Projections"
    ],
    techStack: ["AI Advisory", "Data Strategy", "PoC Prototyping", "Vendor Evaluation", "Architecture Review"]
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
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [modalTab, setModalTab] = useState<"overview" | "process" | "outcomes">("overview");
  const [dynamicServices, setDynamicServices] = useState<ServiceDetail[]>([]);

  useEffect(() => {
    fetch("/api/cms/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const cmsServices = data.items.map((item: any) => {
            const title = String(item.title || "").trim();
            const cat = String(item.category || "").trim();
            const t = title.toLowerCase();

            let icon = <Brain size={28} />;
            if (t.includes("web")) icon = <Code2 size={28} />;
            else if (t.includes("mobile") || t.includes("app")) icon = <Smartphone size={28} />;
            else if (t.includes("cloud") || t.includes("devops") || t.includes("mlops")) icon = <Cloud size={28} />;
            else if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("palette")) icon = <Palette size={28} />;
            else if (t.includes("security") || t.includes("cyber") || t.includes("audit")) icon = <ShieldCheck size={28} />;
            else if (t.includes("analytics") || t.includes("bi") || t.includes("intelligence")) icon = <BarChart3 size={28} />;
            else if (t.includes("science") || t.includes("predict")) icon = <LineChart size={28} />;
            else if (t.includes("machine") || t.includes("deep") || t.includes("learning") || t.includes("neural")) icon = <Cpu size={28} />;
            else if (t.includes("automation") || t.includes("process") || t.includes("workflow")) icon = <Zap size={28} />;
            else if (t.includes("engineering") || t.includes("warehouse") || t.includes("etl")) icon = <Database size={28} />;
            else if (t.includes("consulting") || t.includes("strategy") || t.includes("poc")) icon = <Target size={28} />;

            return {
              title,
              rawCategory: cat,
              icon,
              description: item.description || "Scalable digital solution engineered for enterprise reliability.",
              note: item.note || "Enterprise scale and performance.",
              detailedOverview: item.detailedOverview || item.description || "Full technical overview.",
              highlights: Array.isArray(item.highlights) ? item.highlights : (typeof item.highlights === "string" ? item.highlights.split(",") : ["Enterprise Ready", "High Performance"]),
              subServices: Array.isArray(item.subServices) ? item.subServices : ["Custom Software Development", "API Integration"],
              processSteps: Array.isArray(item.processSteps) ? item.processSteps : ["1. Discovery & Architecture", "2. Agile Development", "3. Quality Assurance", "4. Deployment & Launch"],
              keyOutcomes: Array.isArray(item.keyOutcomes) ? item.keyOutcomes : ["Sub-100ms Load Times", "99.9% Uptime SLA", "OWASP Security Hardening"],
              techStack: Array.isArray(item.techStack) ? item.techStack : ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"]
            };
          });
          setDynamicServices(cmsServices);
        }
      })
      .catch((err) => console.warn("Backend services fetch fallback to static data:", err));
  }, []);

  const filteredDynamicServices = dynamicServices.filter((item: any) => {
    const cat = (item.rawCategory || "").toLowerCase();
    const title = (item.title || "").toLowerCase();
    if (activeCategory === "ai") {
      return cat.includes("ai") || cat.includes("data") || cat.includes("machine") || cat.includes("science") || cat.includes("automation") || title.includes("ai") || title.includes("data") || title.includes("analytics") || title.includes("learning");
    }
    return !cat.includes("ai") || cat.includes("core") || cat.includes("mobile") || cat.includes("design") || cat.includes("devops") || cat.includes("cyber") || cat.includes("security") || title.includes("web") || title.includes("mobile") || title.includes("cloud") || title.includes("security") || title.includes("design");
  });

  const baseServicesData = activeCategory === "core" ? coreServicesData : aiDataServicesData;
  const currentServicesData = dynamicServices.length > 0
    ? (filteredDynamicServices.length > 0 ? filteredDynamicServices : dynamicServices)
    : baseServicesData;
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
          className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedServices.map((service) => (
            <motion.article
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => {
                const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                window.location.href = `/services/detail?id=${slug}`;
              }}
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
                    {service.subServices.slice(0, 6).map((sub) => (
                      <li key={sub} className="flex items-start gap-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Check size={14} className="text-[#FF4D37] shrink-0 mt-0.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    window.location.href = `/services/detail?id=${slug}#demo-form`;
                  }}
                  className="inline-flex items-center gap-2 font-bold text-[#DF3420] text-sm hover:underline cursor-pointer"
                >
                  Request a Demo
                  <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-[#FF4D37] transition">
                  Details & Pipeline →
                </span>
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

      {/* ENHANCED DETAILED SERVICE MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#161c2a] border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div className="icon-tile !h-14 !w-14 !rounded-2xl text-[#FF4D37] border border-[#FF4D37]/15">
                    {selectedService.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#FF4D37] tracking-wider uppercase">
                      {activeCategory === "core" ? "Core Engineering Capability" : "AI & Data Solution"}
                    </span>
                    <h3 className="text-2xl font-black text-[#182033] dark:text-white mt-0.5">
                      {selectedService.title}
                    </h3>
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

              {/* Modal Internal Navigation Sub-Tabs */}
              <div className="mt-4 flex gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
                <button
                  onClick={() => setModalTab("overview")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    modalTab === "overview"
                      ? "bg-[#FF4D37] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#182033] dark:hover:text-white"
                  }`}
                >
                  Detailed Overview & Stack
                </button>
                <button
                  onClick={() => setModalTab("process")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    modalTab === "process"
                      ? "bg-[#FF4D37] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#182033] dark:hover:text-white"
                  }`}
                >
                  4-Step Delivery Pipeline
                </button>
                <button
                  onClick={() => setModalTab("outcomes")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    modalTab === "outcomes"
                      ? "bg-[#FF4D37] text-white shadow-sm"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-[#182033] dark:hover:text-white"
                  }`}
                >
                  Guaranteed Outcomes & SLAs
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="my-5 overflow-y-auto pr-2 space-y-6 flex-1">
                
                {/* TAB 1: OVERVIEW & STACK */}
                {modalTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Comprehensive Strategic Overview
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                        {selectedService.detailedOverview}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                        Technology Stack & Tooling
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5"
                          >
                            <FileCheck size={14} className="text-[#FF4D37]" />
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Complete Sub-Services Capabilities Grid */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        Full Specialized Capabilities
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedService.subServices.map((sub: string) => (
                          <div
                            key={sub}
                            className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-gray-50/70 dark:bg-slate-900/60 p-3 text-xs font-semibold text-gray-800 dark:text-gray-200"
                          >
                            <CheckCircle2 size={16} className="text-[#FF4D37] shrink-0" />
                            <span>{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DELIVERY PIPELINE */}
                {modalTab === "process" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Execution Architecture & Roadmap
                    </h4>
                    <div className="space-y-3">
                      {selectedService.processSteps.map((step, idx) => (
                        <div
                          key={step}
                          className="soft-card p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-4"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1EC] dark:bg-slate-800 text-[#FF4D37] font-black text-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-[#182033] dark:text-white">
                              {step}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Rigorous quality checks, automated tests, and continuous delivery handoffs.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: OUTCOMES & SLAS */}
                {modalTab === "outcomes" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                      Expected Business Impact & Performance SLAs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedService.keyOutcomes.map((outcome) => (
                        <div
                          key={outcome}
                          className="soft-card p-5 rounded-2xl border border-[#ffd5ca] dark:border-slate-800 bg-gradient-to-br from-[#FFF5F2] via-white to-[#FFF0EC] dark:from-[#161c2a] dark:to-[#131924]"
                        >
                          <div className="flex items-center gap-2 text-[#FF4D37] mb-2 font-black text-sm">
                            <Sparkles size={18} />
                            Verified Impact
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-[#182033] dark:text-white leading-relaxed">
                            {outcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Footer */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  Ready to integrate this solution into your stack?
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
