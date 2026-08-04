import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, 'resources');
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

// 1. ALL SERVICES DATA
const allServices = [
  {
    id: "srv_web_dev",
    title: "Web Development",
    category: "Core Engineering",
    description: "Responsive web platforms built with React, Node.js, and modern architecture that scale with real traffic.",
    note: "We build modern, high-performance web applications with clean frontend architecture, reliable REST/GraphQL APIs, enterprise database systems, and lightning-fast load times.",
    detailedOverview: "We engineer enterprise web applications built for extreme speed, search visibility, and fault tolerance. Using React 19, Next.js, and Node.js microservices, we build platforms that process millions of requests while providing smooth user flows.",
    highlights: ["React 19 & Next.js", "Node.js & REST/GraphQL APIs", "Scalable Multi-Tenant Web Apps"],
    subServices: ["Custom Web Applications", "Frontend Development (React/Next.js)", "Backend & RESTful APIs (Node.js)", "E-Commerce Platforms", "Progressive Web Apps (PWA)", "Performance Optimization & SEO", "Single Page Applications (SPA)", "API Integrations & Webhooks"],
    processSteps: ["1. Discovery & Technical Architecture Audit", "2. UI/UX Wireframing & Database Schema Design", "3. Full-Stack Agile Development & Automated CI/CD", "4. Performance Tuning, Security Audit & Launch"],
    keyOutcomes: ["Sub-100ms LCP Page Load Speeds", "99.9% Production Server Uptime", "SEO-Optimized SSR Architecture", "OWASP Security Hardened APIs"],
    techStack: ["React 19", "Next.js", "TypeScript", "Node.js", "Express", "Tailwind CSS v4", "PostgreSQL", "Docker"]
  },
  {
    id: "srv_mobile_dev",
    title: "Mobile App Development",
    category: "Core Engineering",
    description: "Cross-platform Android and iOS apps with slick interfaces, reliable performance, and practical release support.",
    note: "Deliver native-grade mobile experiences on both iOS and Android. From initial UI design to offline synchronization and App Store / Google Play submissions.",
    detailedOverview: "Deliver native-grade performance across iOS and Android from a unified codebase. Our mobile engineering team leverages Flutter and React Native to build offline-first, high-framerate mobile apps with push notifications and seamless biometric authentication.",
    highlights: ["iOS & Android", "Flutter & React Native", "App Store & Play Store Deployment"],
    subServices: ["Cross-Platform App Development", "Native iOS & Android Engineering", "Flutter & React Native Frameworks", "Mobile UI/UX Design & Prototyping", "Offline Data Sync & API Integration", "Store Submission & Lifecycle Maintenance", "Biometric Auth & Push Notifications", "Mobile App Analytics & Monitoring"],
    processSteps: ["1. Mobile UX Prototyping & Flow Mapping", "2. Cross-Platform Codebase & State Architecture Setup", "3. Backend API Integration & Offline Cache Sync", "4. App Store & Google Play Submission & Monitoring"],
    keyOutcomes: ["60 FPS Smooth UI Animations & Transitions", "50% Reduced Mobile Code Maintenance Costs", "Offline Data Sync & Local SQLite Caching", "1-Click App Store Publishing Pipeline"],
    techStack: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "REST/GraphQL", "SQLite"]
  },
  {
    id: "srv_cloud_devops",
    title: "Cloud Solutions & DevOps",
    category: "Infrastructure & DevOps",
    description: "Cloud deployment, DevOps workflows, Docker, Kubernetes, AWS, and Azure setups that keep products resilient.",
    note: "Architect, deploy, and manage scalable cloud infrastructure across AWS, Azure, and GCP. We implement automated CI/CD pipelines, container orchestration, and 24/7 uptime monitoring.",
    detailedOverview: "Transform your infrastructure into a resilient, automated cloud platform on AWS, Google Cloud, or Azure. We build auto-scaling Kubernetes clusters, automated zero-downtime CI/CD deployment pipelines, and centralized logging systems.",
    highlights: ["AWS, Azure & GCP Infrastructure", "DevOps & Automated CI/CD Pipelines", "Docker & Kubernetes Orchestration"],
    subServices: ["Cloud Infrastructure (AWS / Azure / GCP)", "DevOps & Automated CI/CD Pipelines", "Docker & Kubernetes Orchestration", "Serverless & Microservices Architecture", "Cloud Migration & Modernization", "Cost Optimization & Monitoring", "Infrastructure as Code (Terraform)", "Disaster Recovery & Backup Planning"],
    processSteps: ["1. Cloud Infrastructure & Security Audit", "2. Terraform Infrastructure-as-Code Setup", "3. Docker & Kubernetes Cluster Deployment", "4. 24/7 Monitoring & Auto-Scaling Tuning"],
    keyOutcomes: ["Zero-Downtime Rolling Deployments", "35%+ Reduction in Monthly Cloud Spend", "Multi-Region Redundancy & Disaster Recovery", "Automated Security Vulnerability Scanning"],
    techStack: ["AWS", "Google Cloud", "Microsoft Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus"]
  },
  {
    id: "srv_ai_rag",
    title: "AI Solutions & RAG Pipelines",
    category: "AI & Data Science",
    description: "AI assistants, workflow automation, model integrations, and intelligent tools designed around business outcomes.",
    note: "Harness generative AI, custom fine-tuned LLMs, and intelligent automation agents to eliminate repetitive work, enhance decision-making, and create smart customer experiences.",
    detailedOverview: "Integrate autonomous generative AI, fine-tuned LLMs, and intelligent multi-agent systems directly into your business workflows. We build context-aware Retrieval-Augmented Generation (RAG) platforms that read company knowledge bases securely.",
    highlights: ["LLM Integration & RAG", "AI Agents & Autonomous Workflows", "Intelligent Document Processing (OCR)"],
    subServices: ["AI Chatbots & Virtual Assistants", "LLM Integration & Prompt Engineering", "Automated AI Workflows & Agents", "Intelligent Document Processing (OCR)", "Custom AI Tooling & API Integration", "Retrieval-Augmented Generation (RAG)", "Multi-Agent Task Delegation", "Zero-Data Leakage AI Sandboxing"],
    processSteps: ["1. AI Opportunity & Data Privacy Audit", "2. RAG & Vector Database Architecture Setup", "3. Agentic Workflow Coding & Model Fine-Tuning", "4. Production Guardrails & Latency Optimization"],
    keyOutcomes: ["80% Reduction in Customer Support Resolution Time", "Zero Data Leakage Security Guardrails", "Sub-2s Real-Time LLM Response Times", "Automated Knowledge Retrieval"],
    techStack: ["OpenAI API", "Anthropic Claude", "LangChain / LlamaIndex", "Pinecone", "Qdrant", "Python", "FastAPI", "n8n"]
  },
  {
    id: "srv_ui_ux",
    title: "UI/UX & Product Design",
    category: "Design & Creative",
    description: "Human-centered product design, prototypes, and design systems that make complex products feel simple.",
    note: "Craft intuitive, beautiful user interfaces backed by deep user research, wireframing, interactive Figma prototypes, and cohesive design systems.",
    detailedOverview: "Human-centered digital product design that converts visitors into loyal users. Our design sprint process produces interactive Figma prototypes, accessible design systems, and user interface flows tested with real users.",
    highlights: ["User Research & Personas", "Figma Interactive Prototypes", "Accessible Design Systems"],
    subServices: ["User Interface (UI) Design", "User Experience (UX) Research", "Interactive Figma Prototypes", "Design Systems & UI Kits", "Web & Mobile App Redesigns", "Usability Testing & Conversion Design", "Accessibility (WCAG) Compliance", "Information Architecture & User Flows"],
    processSteps: ["1. User Research & Competitor Benchmarking", "2. Information Architecture & Wireframing", "3. High-Fidelity UI Design & Figma Prototypes", "4. Design System Documentation & Developer Handoff"],
    keyOutcomes: ["2.5x Increase in User Conversion Rates", "WCAG 2.1 AA Accessibility Compliance", "Reusable Figma Design Tokens & Component Kits", "Seamless Developer Handoff"],
    techStack: ["Figma", "Framer", "Adobe CC", "Design Systems", "Prototyping", "Usability Testing", "Tailwind Tokens"]
  },
  {
    id: "srv_cyber_security",
    title: "Cyber Security & Auditing",
    category: "Security & Compliance",
    description: "Security reviews, hardening, audits, and safer development practices for teams handling sensitive systems.",
    note: "Protect your applications and customer data with comprehensive vulnerability audits, data encryption, API security hardening, and compliance support.",
    detailedOverview: "Protect your applications, APIs, and cloud databases from malicious threats. We perform penetration testing, OWASP vulnerability assessments, automated secret scanning, and implement zero-trust data encryption protocols.",
    highlights: ["Vulnerability Assessment & Audits", "Application Security Hardening", "Data Privacy & Zero-Trust Access"],
    subServices: ["Vulnerability Assessment & Security Audits", "Application Security Hardening", "Data Encryption & Privacy Controls", "Identity & Access Management (IAM)", "API Security & Penetration Guidance", "Incident Response & Backup Planning", "SOC2 & HIPAA Compliance Guidance", "Zero-Trust Access Architecture"],
    processSteps: ["1. Vulnerability & Code Security Audit", "2. API Gateway & Network Hardening", "3. Zero-Trust Access & Encryption Setup", "4. Continuous Security Monitoring & Compliance"],
    keyOutcomes: ["OWASP Top 10 Security Hardening", "SOC2 / HIPAA Compliance Preparedness", "Zero-Trust Encryption at Rest & In Transit", "24/7 Threat Alert Systems"],
    techStack: ["OWASP Tools", "SonarQube", "Trivy", "JWT / OAuth2", "HashiCorp Vault", "AWS WAF", "SSL/TLS"]
  },
  {
    id: "srv_data_analytics",
    title: "Data Analytics & Business Intelligence",
    category: "AI & Data Science",
    description: "Transform raw data into beautiful BI dashboards and strategic business insights.",
    note: "We engineer interactive, real-time business intelligence dashboards using Power BI, Tableau, and custom SQL analytics to turn complex operational datasets into clear executive KPIs and sales metrics.",
    detailedOverview: "Turn disconnected raw data into real-time business intelligence. We build custom executive dashboards in Power BI, Tableau, and Metabase powered by query-optimized SQL databases and automated ETL pipelines.",
    highlights: ["Power BI & Tableau Dashboards", "Sales & Financial Analytics", "SQL Data Warehousing"],
    subServices: ["Business Intelligence Dashboards", "Data Cleaning & Preparation", "Exploratory Data Analysis (EDA)", "KPI & Performance Reporting", "Sales & Marketing Analytics", "Financial Analytics", "Customer Behavior Analysis", "SQL Data Analysis", "Power BI & Tableau Dashboards"],
    processSteps: ["1. Business KPI Mapping & Data Integration", "2. Data Cleaning & Model Normalization", "3. Interactive BI Dashboard Engineering", "4. Scheduled Refresh & Stakeholder Access Setup"],
    keyOutcomes: ["Sub-Second BI Dashboard Load Times", "100% Automated Financial & Sales Reporting", "Unified Single Source of Data Truth", "Executive KPI Tracking"],
    techStack: ["Power BI", "Tableau", "SQL Server", "Snowflake", "dbt", "PostgreSQL", "BigQuery", "Python"]
  },
  {
    id: "srv_machine_learning",
    title: "Machine Learning & Deep Learning",
    category: "AI & Data Science",
    description: "Train custom neural networks, computer vision tools, and natural language processors.",
    note: "Develop tailored neural networks and computer vision pipelines capable of real-time object detection, video analysis, sentiment tracking, and high-throughput NLP classification.",
    detailedOverview: "Custom neural networks for computer vision, image classification, object detection, and natural language processing. We train, optimize, and deploy models using PyTorch and MLOps best practices.",
    highlights: ["Custom Neural Networks", "Computer Vision & YOLO", "MLOps Automated Pipelines"],
    subServices: ["Custom ML Model Development", "Model Training & Optimization", "Computer Vision Solutions", "Natural Language Processing (NLP)", "Image Classification", "Object Detection", "Sentiment Analysis", "Recommendation Engines", "Model Deployment (MLOps)"],
    processSteps: ["1. Dataset Curation & Data Labeling", "2. Deep Neural Network Training", "3. Model Quantization & Edge Optimization", "4. MLOps Automated Re-Training Pipeline"],
    keyOutcomes: ["Real-Time Video & Image Processing", "High-Throughput NLP Classification", "Optimized Model Inference Latency", "Automated Model Versioning"],
    techStack: ["PyTorch", "TensorFlow", "OpenCV", "YOLO", "Hugging Face", "MLflow", "CUDA", "TensorRT"]
  },
  {
    id: "srv_automation",
    title: "Business Process Automation",
    category: "Digital Transformation",
    description: "Connect workflows and automate daily manual tasks using AI and robust APIs.",
    note: "Eliminate repetitive manual data entry and multi-app overhead. We build resilient n8n, Make, and Zapier automated workflows integrated with custom AI parsers and CRM systems.",
    detailedOverview: "Connect disjointed SaaS applications and eliminate manual data entry. Using self-hosted n8n, Make, and Zapier combined with custom Python webhooks and AI parsers, we build self-healing business workflows.",
    highlights: ["Self-Hosted n8n & Make", "PDF & Invoice AI Parsing", "CRM & Webhook Integration"],
    subServices: ["AI Workflow Automation", "CRM Automation", "Email Automation", "Document Automation", "Invoice Processing", "PDF Data Extraction", "API Integrations", "No-Code Automation (n8n, Make, Zapier)"],
    processSteps: ["1. Operational Workflow Audit & Mapping", "2. Automation Blueprint & Webhook Setup", "3. AI Parser & CRM System Integration", "4. Error-Handling & Alert Testing"],
    keyOutcomes: ["100+ Hours Saved Per Month Per Team", "Zero Manual Copy-Paste Errors", "Instant Lead Routing & SLA Triggers", "Self-Healing Fallback Workflows"],
    techStack: ["n8n", "Make", "Zapier", "Python Webhooks", "REST APIs", "PostgreSQL", "Slack API", "OpenAI"]
  },
  {
    id: "srv_data_engineering",
    title: "Data Engineering & Warehousing",
    category: "AI & Data Science",
    description: "Build robust data warehouses and ETL pipelines for clean, query-optimized databases.",
    note: "Establish scalable data pipelines, automated ETL/ELT workflows, and high-performance cloud data warehouses (Snowflake, BigQuery) for lightning-fast queries and high data reliability.",
    detailedOverview: "Architect scalable data warehouses and automated ETL/ELT pipelines. We structure clean, query-optimized data models in Snowflake, BigQuery, and Redshift with automated data validation tests.",
    highlights: ["Snowflake & BigQuery", "ETL/ELT Data Pipelines", "dbt Data Modeling"],
    subServices: ["ETL/ELT Pipelines", "Data Warehousing", "Database Design", "Cloud Data Migration", "Big Data Processing", "Data Integration", "SQL Optimization", "Data Pipeline Automation"],
    processSteps: ["1. Data Architecture & Schema Design", "2. Streaming & Batch Pipeline Setup", "3. Data Warehouse Optimization & dbt Models", "4. Automated Quality Checks & Alerting"],
    keyOutcomes: ["10x Faster Query Execution Speeds", "Automated Data Quality & Validation", "Zero Data Loss Pipeline Guarantee", "Scalable Big Data Infrastructure"],
    techStack: ["Snowflake", "BigQuery", "AWS Redshift", "Apache Airflow", "dbt", "PostgreSQL", "Spark", "Python"]
  }
];

// 2. ALL RESOURCES DATA
const allResources = [
  {
    id: "ai-enterprise-guide",
    title: "The 2026 Enterprise AI & LLM Implementation Blueprint",
    category: "whitepaper",
    categoryLabel: "Whitepapers & E-Books",
    readTime: "15 min read",
    fileFormat: "PDF (3.2 MB)",
    author: "Shivansh Thapa",
    authorRole: "Head of Systems Architecture",
    description: "A comprehensive executive guide on deploying Retrieval-Augmented Generation (RAG), fine-tuning LLMs, and setting up secure MLOps pipelines inside regulated enterprise cloud infrastructure.",
    summary: "This blueprint bridges the gap between proof-of-concept AI experiments and mission-critical production deployments. It covers vector database selection, latency optimization, data privacy compliance, cost control strategies, and real-world fallback mechanisms.",
    takeaways: ["Step-by-step RAG architecture comparing Pinecone, Qdrant, and pgvector", "Token usage cost-containment strategies for enterprise LLM APIs", "Data sandboxing and PII redaction protocols for AI agent workflows", "Continuous model evaluation & hallucination benchmark frameworks"],
    date: "2026-07-25"
  },
  {
    id: "fintech-bi-casestudy",
    title: "How Real-Time Analytics Accelerated Financial Reporting by 10x",
    category: "casestudy",
    categoryLabel: "Case Studies",
    readTime: "8 min read",
    fileFormat: "Case Study PDF",
    author: "Avneesh Singh",
    authorRole: "Lead Data Scientist",
    description: "Discover how TechEllixir transformed a multi-currency fintech platform's legacy batch pipeline into a sub-second SQL analytics dashboard using Power BI and Snowflake.",
    summary: "By migrating legacy ETL jobs to streaming ELT pipelines, the client reduced end-of-month reconciliation times from 48 hours to under 15 minutes while improving data accuracy across 1.2M daily transactions.",
    takeaways: ["Architecting automated ELT pipelines with Snowflake & dbt", "Building high-concurrency Power BI dashboards with DirectQuery optimization", "Automating audit logging and financial compliance verification"],
    date: "2026-07-22"
  },
  {
    id: "modern-fullstack-starter",
    title: "Production React 19 & Node.js Microservices Architecture Starter",
    category: "template",
    categoryLabel: "Templates & Code",
    readTime: "Code Repo",
    fileFormat: "GitHub Zip",
    author: "Rudra Pratap Singh",
    authorRole: "Senior Full Stack Engineer",
    description: "Clean code starter repository featuring React 19, TypeScript, Tailwind CSS v4, Docker Compose, JWT authentication, and structured Express microservices.",
    summary: "Skip weeks of boilerplate configuration. This starter pack includes production-ready Docker containers, ESLint/Prettier rules, automated GitHub Actions CI/CD workflows, and API rate limiting out of the box.",
    takeaways: ["Pre-configured TypeScript strict mode & path aliases", "Ready-to-use JWT authentication & Refresh Token rotation", "Dockerized development and production build configurations"],
    date: "2026-07-18"
  },
  {
    id: "n8n-automation-guide",
    title: "Mastering Autonomous Business Automation with n8n & AI",
    category: "guide",
    categoryLabel: "Developer Guides",
    readTime: "12 min read",
    fileFormat: "Interactive Guide",
    author: "Priya Sharma",
    authorRole: "Lead Automation Engineer",
    description: "Learn how to build self-healing business automation workflows connecting CRM systems, Slack, email parsing, and custom AI agents using n8n and Python webhooks.",
    summary: "An end-to-end tutorial for automation engineers looking to automate complex cross-platform business workflows. Includes copy-paste JSON workflow nodes and error handling best practices.",
    takeaways: ["Setting up self-hosted n8n instances on AWS Lightsail / Docker", "Parsing unstructured email attachments with OpenAI Vision & OCR", "Building webhook retry logic and Slack alert notifications"],
    date: "2026-07-14"
  },
  {
    id: "seo-services-dehradun-2026-guide",
    title: "SEO Services in Dehradun 2026: Trends, Growth Strategies & Business Scaling Guide",
    category: "blogs",
    categoryLabel: "Blogs & Articles",
    readTime: "11 min read",
    fileFormat: "Web Article",
    author: "Shivansh Thapa",
    authorRole: "Head of Growth & SEO Strategy",
    description: "Discover top Search Engine Optimization (SEO) strategies for 2026. Learn how businesses in Dehradun and across India leverage AI search optimization (GEO), technical site audits, and Google My Business growth.",
    summary: "Search Engine Optimization has transformed dramatically with AI Search Engines like Perplexity, Gemini, and Search Generative Experience (SGE). Ranking #1 requires a dual approach: high-authority localized signals combined with structured Schema.org JSON-LD markup.",
    takeaways: ["Generative Engine Optimization (GEO) tactics for AI Search", "Schema.org structured JSON-LD snippet integration", "Local Google My Business 3-pack ranking playbook"],
    date: "2026-07-25"
  },
  {
    id: "blog-rag-vs-finetuning",
    title: "Why Fine-Tuning LLMs Fails Without Proper RAG Architecture",
    category: "blogs",
    categoryLabel: "Blogs & Articles",
    readTime: "6 min read",
    fileFormat: "Web Article",
    author: "Avneesh Singh",
    authorRole: "Lead AI Architect",
    description: "Many enterprises rush to fine-tune open-weight models on proprietary data, only to suffer from hallucination and high retraining costs. Here is why RAG is the true foundation.",
    summary: "When engineering AI applications for businesses, data freshness and factual accuracy are paramount. Fine-tuning alters model weights but does not guarantee memory precision. Retrieval-Augmented Generation (RAG) acts as an external search index that injects exact context into prompts in real time.",
    takeaways: ["Vector embeddings vs BM25 hybrid search comparison", "Reranking with Cohere to boost context precision by 34%", "Cost comparison between fine-tuning and vector indexing"],
    date: "2026-07-18"
  },
  {
    id: "news-ai-partner",
    title: "TechEllixir Recognized as Top AI Solutions Provider 2026",
    category: "news",
    categoryLabel: "News & Press",
    readTime: "3 min read",
    fileFormat: "Press Release",
    author: "TechEllixir Corporate",
    authorRole: "Press Office",
    description: "TechEllixir has been honored as one of the leading enterprise AI and data automation solution partners for delivering custom LLM and RAG platforms across APAC.",
    summary: "TechEllixir today announced its inclusion in the 2026 Global AI & Data Excellence list. Recognized for its practical engineering approach and high client satisfaction rates across healthcare, fintech, and retail industries, TechEllixir continues to empower businesses with cutting-edge software solutions.",
    takeaways: ["Industry award recognition for Generative AI engineering", "Over 150+ successful client deployments in APAC", "Expansion into high-concurrency cloud and DevOps advisory"],
    date: "2026-07-15"
  }
];

// 3. ALL CAREERS DATA (47 TRAINING DOMAINS)
const allCareers = [
  { id: "car_ai", title: "Artificial Intelligence", category: "ai", badge: "🔥 #1 Most Popular", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Build intelligent applications using AI, LLMs, prompt engineering, and automation tools.", detailedCurriculum: "Machine Learning, LLM Fine-Tuning, RAG Pipelines, Python & PyTorch.", requirements: "Laptop, basic programming knowledge, 10 hrs/week" },
  { id: "car_fullstack", title: "Full Stack Development", category: "web", badge: "🚀 High Demand", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Work across frontend and backend systems using MERN / Python while understanding real product delivery.", detailedCurriculum: "React 19, Node.js, Express, PostgreSQL, MongoDB, REST APIs, Tailwind CSS.", requirements: "Basic HTML/CSS & JavaScript knowledge" },
  { id: "car_frontend", title: "Frontend Development", category: "web", badge: "⚡ Trending 2026", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Learn React 19, HTML, CSS, Tailwind CSS, TypeScript, and modern high-performance frontend development.", detailedCurriculum: "React 19, TypeScript, Tailwind CSS v4, Next.js, Framer Motion.", requirements: "Laptop & basic web design curiosity" },
  { id: "car_backend", title: "Backend Development", category: "web", badge: "⚡ High Demand", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Build scalable APIs using Node.js, Express, Python, PostgreSQL, and REST/GraphQL architecture.", detailedCurriculum: "Node.js, Express, PostgreSQL, Redis, Microservices, JWT Auth.", requirements: "Basic logical programming fundamentals" },
  { id: "car_mobile", title: "Mobile App Development", category: "mobile", badge: "⭐ Top Choice", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Develop Android and iOS applications using Flutter, React Native, and cross-platform tools.", detailedCurriculum: "Flutter, Dart, React Native, Firebase, SQLite, App Store publishing.", requirements: "Laptop with 8GB RAM minimum" },
  { id: "car_cloud", title: "Cloud Computing & DevOps", category: "cloud", badge: "🚀 2026 Hot Skill", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Deploy scalable applications using AWS, Azure, Docker, Kubernetes, and CI/CD pipelines.", detailedCurriculum: "Docker, Kubernetes, AWS, Terraform, GitHub Actions, Linux administration.", requirements: "Basic command line knowledge" },
  { id: "car_ml", title: "Machine Learning", category: "ai", badge: "🔥 High Demand", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Learn supervised learning, deep learning, neural networks, model deployment, and AI workflows.", detailedCurriculum: "Scikit-Learn, TensorFlow, PyTorch, Pandas, NumPy, OpenCV.", requirements: "Basic Python and linear algebra background" },
  { id: "car_cyber", title: "Cyber Security", category: "cloud", badge: "🛡️ High Demand", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Learn ethical hacking, network security, penetration testing, zero-trust, and secure development.", detailedCurriculum: "Wireshark, OWASP Top 10, Kali Linux, Nmap, Cryptography.", requirements: "Interest in networking & security" },
  { id: "car_uiux", title: "UI / UX Design", category: "design", badge: "🎨 Top Choice", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Design intuitive interfaces using Figma, wireframes, and design systems.", detailedCurriculum: "Figma, User Research, Wireframing, Prototyping, Accessibility (WCAG).", requirements: "Figma free account & creative mindset" },
  { id: "car_graphic", title: "Graphic Design", category: "design", badge: "✨ Creative Skill", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Create branding, social media creatives, and marketing assets.", detailedCurriculum: "Photoshop, Illustrator, Canva, Typography, Branding guidelines.", requirements: "Laptop & passion for visuals" },
  { id: "car_video", title: "Video Editing", category: "design", badge: "🎬 High Growth", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Edit professional videos using modern editing software and motion graphics.", detailedCurriculum: "Premiere Pro, After Effects, CapCut Pro, Motion Graphics, Audio mixing.", requirements: "Laptop capable of video rendering" },
  { id: "car_react", title: "React Development", category: "web", badge: "⚡ In Demand", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Develop scalable React applications using hooks, routing, and APIs.", detailedCurriculum: "React 19, Redux Toolkit, React Query, Router v7, Tailwind.", requirements: "Basic JavaScript ES6" },
  { id: "car_python", title: "Python Development", category: "web", badge: "🐍 Popular", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Develop backend applications, automation scripts, and APIs using Python.", detailedCurriculum: "Python 3.12, FastAPI, Flask, PostgreSQL, Web Scraping.", requirements: "No prior experience required" },
  { id: "car_python_fullstack", title: "Python Full Stack Development", category: "web", badge: "🔥 Top Career Path", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Master Python, Django, React, databases, and deployment.", detailedCurriculum: "Django, React, PostgreSQL, Docker, REST Framework.", requirements: "Basic programming curiosity" },
  { id: "car_java_fullstack", title: "Java Full Stack Development", category: "web", badge: "💼 Enterprise", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Develop enterprise applications with Java, Spring Boot, and React.", detailedCurriculum: "Java 21, Spring Boot, Hibernate, MySQL, React.", requirements: "Basic object-oriented programming concepts" },
  { id: "car_dotnet", title: ".NET Development", category: "web", badge: "🏢 Corporate Choice", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Build enterprise software using C#, ASP.NET Core, and SQL Server.", detailedCurriculum: "C#, ASP.NET Core Web API, Entity Framework, SQL Server.", requirements: "Basic C / C++ logic knowledge" },
  { id: "car_mern", title: "MERN Stack Development", category: "web", badge: "🚀 High Demand", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Create scalable web applications using MongoDB, Express, React, and Node.js.", detailedCurriculum: "MongoDB, Express.js, React, Node.js, Redux, JWT.", requirements: "Basic JavaScript fundamentals" },
  { id: "car_flutter", title: "Flutter Development", category: "mobile", badge: "📱 Mobile Choice", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Develop beautiful cross-platform mobile apps with Flutter.", detailedCurriculum: "Dart, Flutter SDK, Provider, Firebase, Play Store release.", requirements: "Laptop with Android Studio / VS Code" },
  { id: "car_game", title: "Game Development", category: "gaming", badge: "🎮 Interactive", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Build engaging games using Unity, C#, and game development concepts.", detailedCurriculum: "Unity 3D, C# scripting, 2D/3D physics, game mechanics.", requirements: "Passion for video games & basic logic" },
  { id: "car_testing", title: "Software Testing & QA", category: "web", badge: "🧪 QA Standard", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Learn manual testing, automation testing, Selenium, and QA processes.", detailedCurriculum: "Manual QA, Selenium WebDriver, Postman API testing, Test cases.", requirements: "Attention to detail & basic web knowledge" },
  { id: "car_datascience", title: "Data Science", category: "ai", badge: "📊 High Growth", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Analyze data, build predictive models, and create business insights.", detailedCurriculum: "Python, Pandas, NumPy, Scikit-Learn, Statistics, Predictive Modeling.", requirements: "Basic math & analytical mindset" },
  { id: "car_dataeng", title: "Data Engineering", category: "ai", badge: "⚙️ Data Infrastructure", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Design data pipelines, ETL processes, and cloud data platforms.", detailedCurriculum: "SQL, Apache Spark, Snowflake, Airflow, Python ETL.", requirements: "Basic database SQL queries" },
  { id: "car_dataanalytics", title: "Data Analytics", category: "ai", badge: "📈 Essential Skill", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Turn raw data into meaningful insights using SQL, Excel, and BI tools.", detailedCurriculum: "SQL, Advanced Excel, Power BI, Data visualization, EDA.", requirements: "Comfortable with numbers & spreadsheets" },
  { id: "car_powerbi", title: "Power BI / Data Visualization", category: "ai", badge: "📊 BI Specialty", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Create interactive dashboards and reports using Microsoft Power BI.", detailedCurriculum: "DAX formulas, Power Query, Data Modeling, Dashboard Publishing.", requirements: "Basic Excel familiarity" },
  { id: "car_seo", title: "SEO & Digital Marketing", category: "marketing", badge: "🎯 Organic Growth", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Improve website rankings through technical SEO, AI search (GEO), and content optimization.", detailedCurriculum: "Technical SEO, Google Analytics 4, Schema JSON-LD, Keyword Research.", requirements: "Good written English & internet curiosity" },
  { id: "car_hr", title: "Human Resources (HR)", category: "management", badge: "👥 Corporate People Ops", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Learn recruitment, onboarding, employee engagement, and HR operations.", detailedCurriculum: "Talent Acquisition, LinkedIn Sourcing, Payroll basics, HR policies.", requirements: "Great communication & interpersonal skills" },
  { id: "car_bde", title: "Business Development Executive (BDE)", category: "sales", badge: "💼 High Growth", duration: "2 - 6 Months", mode: "Online / Hybrid", stipend: "Performance Based", desc: "Generate leads, build client relationships, and drive business growth.", detailedCurriculum: "Lead generation, B2B sales pitch, Client relationship management.", requirements: "Confident spoken & written communication" }
];

// Write json files
fs.writeFileSync(path.join(resourcesDir, 'services.json'), JSON.stringify(allServices, null, 2));
fs.writeFileSync(path.join(resourcesDir, 'resources.json'), JSON.stringify(allResources, null, 2));
fs.writeFileSync(path.join(resourcesDir, 'careers.json'), JSON.stringify(allCareers, null, 2));

console.log('✅ Successfully seeded full database in backend/resources/ directory!');
