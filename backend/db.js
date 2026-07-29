import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const dbDir = join(__dirname, "resources");

// Complete Database Table Registry
const tables = {
  queries: join(dbDir, "queries.json"),
  users: join(dbDir, "users.json"),
  settings: join(dbDir, "settings.json"),
  services: join(dbDir, "services.json"),
  resources: join(dbDir, "resources.json"),
  careers: join(dbDir, "careers.json"),
  testimonials: join(dbDir, "testimonials.json"),
  industries: join(dbDir, "industries.json"),
  team: join(dbDir, "team.json"),
  process: join(dbDir, "process.json"),
  whychoseus: join(dbDir, "whychoseus.json"),
  about: join(dbDir, "about.json"),
};

// Initialize All Database Tables with Full Project Content Seed
export async function initDatabase() {
  await mkdir(dbDir, { recursive: true });

  // 1. Queries & Applications Table
  try {
    await stat(tables.queries);
  } catch {
    await writeFile(tables.queries, "[]\n", "utf8");
  }

  // 2. Portal User Directory Table
  try {
    await stat(tables.users);
  } catch {
    const defaultUsers = [
      { id: "usr_101", name: "Rudra Pratap Singh", email: "rudra@example.com", role: "user", status: "active", createdAt: new Date().toISOString() },
      { id: "usr_102", name: "Shivansh Thapa", email: "shivansh@techellixir.com", role: "admin", status: "active", createdAt: new Date().toISOString() },
      { id: "usr_103", name: "Ananya Sharma", email: "ananya.sharma@dit.edu.in", role: "user", status: "active", createdAt: new Date().toISOString() },
      { id: "usr_104", name: "Vikram Malhotra", email: "vikram@geu.ac.in", role: "user", status: "active", createdAt: new Date().toISOString() },
    ];
    await writeFile(tables.users, JSON.stringify(defaultUsers, null, 2), "utf8");
  }

  // 3. Settings & Announcement Controls Table
  try {
    await stat(tables.settings);
  } catch {
    const defaultSettings = { maintenanceMode: false, announcementBanner: "🚀 TechEllixir 2.0 AI Internship Registrations OPEN!", allowRegistrations: true, updatedBy: "Admin" };
    await writeFile(tables.settings, JSON.stringify(defaultSettings, null, 2), "utf8");
  }

  // 4. Full Technical Services Catalog Table
  try {
    await stat(tables.services);
  } catch {
    const defaultServices = [
      {
        id: "srv_1",
        title: "Web Development",
        category: "Core Engineering",
        description: "Responsive web platforms built with React, Node.js, and modern architecture that scale with real traffic.",
        note: "We build modern, high-performance web applications with clean frontend architecture, reliable REST/GraphQL APIs, enterprise database systems, and lightning-fast load times.",
        detailedOverview: "We engineer enterprise web applications built for extreme speed, search visibility, and fault tolerance. Using React 19, Next.js, and Node.js microservices, we build platforms that process millions of requests while providing smooth user flows.",
        highlights: "React 19 & Next.js, Node.js & APIs, Scalable Web Apps",
        subServices: ["Custom Web Applications", "Frontend Development (React/Next.js)", "Backend & RESTful APIs (Node.js)", "E-Commerce Platforms", "Progressive Web Apps (PWA)", "Performance Optimization & SEO"]
      },
      {
        id: "srv_2",
        title: "Mobile App Development",
        category: "Mobile Solutions",
        description: "Cross-platform Android and iOS apps with slick interfaces, reliable performance, and practical release support.",
        note: "Deliver native-grade iOS & Android mobile applications built using Flutter & React Native. We focus on offline support, push notifications, smooth 60fps UI animations, and app store compliance.",
        detailedOverview: "Our mobile development team builds feature-rich iOS and Android apps designed for speed, intuitive touch UX, and offline sync.",
        highlights: "Flutter & React Native, iOS & Android Apps, App Store Launch Support",
        subServices: ["Cross-Platform App Development", "iOS Development (Swift/Flutter)", "Android Development (Kotlin/Flutter)", "App UI/UX Design", "Push Notification Systems"]
      },
      {
        id: "srv_3",
        title: "UI / UX Design",
        category: "Design Systems",
        description: "User-centric interface design, interactive wireframes, and design systems crafted for high conversion rates.",
        note: "Transform raw product ideas into intuitive design systems, interactive Figma prototypes, and visually captivating mobile/web user interfaces that users love.",
        detailedOverview: "We combine human-centered design research with polished visual aesthetics to build design systems that enhance user engagement and brand recognition.",
        highlights: "Figma Prototypes, Design Systems, User Journey Mapping",
        subServices: ["User Research & Persona Mapping", "Wireframing & Prototyping", "Mobile & Web UI Design", "Design Systems & Component Libraries", "Usability Testing"]
      },
      {
        id: "srv_4",
        title: "Artificial Intelligence & RAG",
        category: "AI & Automation",
        description: "Custom AI solutions, OpenAI integrations, RAG pipelines, and intelligent automation workflows for business tasks.",
        note: "Unlock enterprise productivity by embedding custom LLMs, vector database search (Pinecone/Qdrant), automated document extractors, and autonomous AI agents directly into your workflows.",
        detailedOverview: "We design and deploy custom Retrieval-Augmented Generation (RAG) pipelines, semantic vector search engines, and automated AI agents.",
        highlights: "Custom LLM Integrations, Vector Search & RAG, Autonomous AI Agents",
        subServices: ["Retrieval-Augmented Generation (RAG)", "OpenAI & Claude API Integration", "Vector Database Indexing", "Document AI & Automated Extraction", "n8n Workflow Automation"]
      },
      {
        id: "srv_5",
        title: "Cloud Architecture & DevOps",
        category: "Infrastructure",
        description: "AWS and GCP cloud infrastructure setup, Docker containerization, Kubernetes orchestration, and CI/CD pipelines.",
        note: "Achieve 99.99% infrastructure reliability with automated Terraform deployments, Docker containers, Kubernetes cluster management, and secure CI/CD pipelines.",
        detailedOverview: "Our certified DevOps engineers build robust cloud infrastructure on AWS and GCP designed to handle high concurrency while keeping operational costs low.",
        highlights: "AWS & GCP Cloud Setup, Docker & Kubernetes, CI/CD Automated Pipelines",
        subServices: ["Cloud Infrastructure Setup (AWS/GCP)", "Docker Containerization", "Kubernetes Cluster Management", "CI/CD Pipeline Automation", "Infrastructure as Code (Terraform)"]
      },
      {
        id: "srv_6",
        title: "Data Analytics & BI",
        category: "Data Science",
        description: "Transform raw business data into actionable dashboard insights, custom analytics pipelines, and automated reporting.",
        note: "Empower decision-makers with live data dashboards, SQL data warehouse pipelines, predictive customer analytics, and automated daily performance reports.",
        detailedOverview: "We build high-throughput data processing pipelines and real-time visualization dashboards using PostgreSQL, BigQuery, and Python data frameworks.",
        highlights: "Real-time Dashboards, Data Warehousing, SQL Analytics Pipelines",
        subServices: ["Data Warehouse Architecture", "Custom Dashboard Development", "ETL Data Pipeline Setup", "Customer Behavior Analytics", "Automated Business Reporting"]
      }
    ];
    await writeFile(tables.services, JSON.stringify(defaultServices, null, 2), "utf8");
  }

  // 5. Resources, Blogs & Case Studies Table
  try {
    await stat(tables.resources);
  } catch {
    const defaultResources = [
      { id: "res_1", title: "SEO Services in Dehradun: 2026 Trends & Growth Guide", category: "Blogs & Articles", readTime: "5 min read", description: "Discover the latest search engine optimization strategies driving organic traffic and client growth in 2026.", date: "2026-07-24" },
      { id: "res_2", title: "TechEllixir Announces Next-Gen AI Internship Program", category: "News & Press", readTime: "3 min read", description: "Empowering 500+ student developers with hands-on industrial AI project experience and mentorship.", date: "2026-07-25" },
      { id: "res_3", title: "Enterprise RAG Architecture Whitepaper: Sub-Second Vector Search", category: "Whitepaper", readTime: "12 min read", description: "A technical architectural blueprint on chunking strategies, hybrid search BM25+dense embeddings, and Qdrant deployment.", date: "2026-07-20" },
      { id: "res_4", title: "Scaling React 19 Applications with Modern Server Components", category: "Guides", readTime: "8 min read", description: "Learn step-by-step optimization techniques for React 19, state management, and SSR caching.", date: "2026-07-18" },
      { id: "res_5", title: "Cloud Security Zero-Trust Checklist 2026", category: "Template", readTime: "4 min read", description: "Comprehensive SOC2 and ISO27001 readiness security audit template for cloud microservices.", date: "2026-07-15" }
    ];
    await writeFile(tables.resources, JSON.stringify(defaultResources, null, 2), "utf8");
  }

  // 6. Complete 16 Career Internship Domains Table
  try {
    await stat(tables.careers);
  } catch {
    const defaultCareers = [
      { id: "car_1", title: "Artificial Intelligence", category: "ai", badge: "🔥 #1 Most Popular", duration: "2 - 6 Months", desc: "Build intelligent applications using AI, LLMs, prompt engineering, and automation tools." },
      { id: "car_2", title: "Full Stack Development", category: "web", badge: "🚀 High Demand", duration: "2 - 6 Months", desc: "Work across frontend and backend systems using MERN / Python while understanding real product delivery." },
      { id: "car_3", title: "Frontend Development", category: "web", badge: "⚡ Trending 2026", duration: "2 - 6 Months", desc: "Learn React 19, HTML, CSS, Tailwind CSS, TypeScript, and modern high-performance frontend development." },
      { id: "car_4", title: "Backend Development", category: "web", badge: "⚡ High Demand", duration: "2 - 6 Months", desc: "Build scalable APIs using Node.js, Express, Python, PostgreSQL, and REST/GraphQL architecture." },
      { id: "car_5", title: "Mobile App Development", category: "mobile", badge: "⭐ Top Choice", duration: "2 - 6 Months", desc: "Develop Android and iOS applications using Flutter, React Native, and cross-platform tools." },
      { id: "car_6", title: "Cloud Computing & DevOps", category: "cloud", badge: "🚀 2026 Hot Skill", duration: "2 - 6 Months", desc: "Deploy scalable applications using AWS, Azure, Docker, Kubernetes, and CI/CD pipelines." },
      { id: "car_7", title: "Machine Learning", category: "ai", badge: "🔥 High Demand", duration: "2 - 6 Months", desc: "Learn supervised learning, deep learning, neural networks, model deployment, and AI workflows." },
      { id: "car_8", title: "Cyber Security", category: "cloud", badge: "🛡️ High Demand", duration: "2 - 6 Months", desc: "Learn ethical hacking, network security, penetration testing, zero-trust, and secure development." },
      { id: "car_9", title: "UI / UX Design", category: "design", badge: "✨ Creative Choice", duration: "2 - 6 Months", desc: "Design intuitive interfaces using Figma, wireframes, and modern design systems." },
      { id: "car_10", title: "Data Science & Analytics", category: "ai", badge: "📊 High Growth", duration: "2 - 6 Months", desc: "Analyze data sets using Python, Pandas, SQL, visualization dashboards, and business intelligence." },
      { id: "car_11", title: "Game Development", category: "gaming", badge: "🎮 Emerging Tech", duration: "2 - 6 Months", desc: "Develop interactive 2D/3D games using Unity, Unreal Engine, and C# game logic." },
      { id: "car_12", title: "Quality Assurance & Testing", category: "web", badge: "🎯 High Precision", duration: "2 - 6 Months", desc: "Master automated testing with Cypress, Selenium, Jest, Postman, and bug tracking systems." },
      { id: "car_13", title: "Digital Marketing & SEO", category: "marketing", badge: "📈 High ROI", duration: "2 - 6 Months", desc: "Master Google Analytics, SEO optimization, social media marketing, and content strategies." },
      { id: "car_14", title: "Python Development", category: "web", badge: "🐍 Versatile Tech", duration: "2 - 6 Months", desc: "Develop backend applications, automation scripts, and REST APIs using Python & Django." },
      { id: "car_15", title: "MERN Stack Development", category: "web", badge: "🔥 Industry Standard", duration: "2 - 6 Months", desc: "Create scalable web applications using MongoDB, Express, React, and Node.js." },
      { id: "car_16", title: "Flutter Mobile Development", category: "mobile", badge: "⚡ Fast Native Apps", duration: "2 - 6 Months", desc: "Develop beautiful cross-platform mobile apps for iOS & Android with Flutter." }
    ];
    await writeFile(tables.careers, JSON.stringify(defaultCareers, null, 2), "utf8");
  }

  // 7. Client & Student Testimonials Table
  try {
    await stat(tables.testimonials);
  } catch {
    const defaultTestimonials = [
      { id: "tst_1", name: "Rahul Sharma", company: "ABC Technologies", rating: 5, review: "TechEllixir delivered an outstanding website that exceeded our expectations. Their team was professional, responsive and delivered everything on time." },
      { id: "tst_2", name: "Priya Verma", company: "Innovate Solutions", rating: 5, review: "The team was responsive, creative, and delivered our mobile application on time. The experience was smooth from start to finish." },
      { id: "tst_3", name: "David Wilson", company: "Global IT", rating: 5, review: "Excellent support and high-quality software development. Highly recommended for startups and enterprises." },
      { id: "tst_4", name: "Anjali Gupta", company: "NextGen", rating: 5, review: "Professional team with excellent communication and beautiful UI designs. We loved working with them." },
      { id: "tst_5", name: "Amit Kumar", company: "Digital World", rating: 5, review: "Outstanding service from planning to deployment. Great experience and excellent technical support." },
      { id: "tst_6", name: "Sneha Patel", company: "TechHub", rating: 5, review: "Amazing developers and excellent post-launch support. We will definitely work together again." }
    ];
    await writeFile(tables.testimonials, JSON.stringify(defaultTestimonials, null, 2), "utf8");
  }

  // 8. Industry Verticals Table
  try {
    await stat(tables.industries);
  } catch {
    const defaultIndustries = [
      { id: "healthcare", title: "Healthcare & MedTech", tagline: "HIPAA-Compliant Patient Care & AI Diagnostics", description: "Empowering hospitals, telemedicine platforms, and medical device manufacturers with secure, compliant digital solutions." },
      { id: "finance", title: "Finance & FinTech", tagline: "High-Concurrency Trading & Micro-Services", description: "Architecting zero-trust banking APIs, automated fraud detection models, and high-frequency transaction engines." },
      { id: "retail", title: "E-Commerce & Retail", tagline: "Headless Commerce & AI Recommendation Engines", description: "Building omnichannel shopping experiences, inventory sync microservices, and personalized product engines." },
      { id: "manufacturing", title: "Manufacturing & Industry 4.0", tagline: "IoT Telemetry & Predictive Maintenance", description: "Connecting factory machinery with real-time IoT sensors, automated defect inspection, and supply chain visibility." },
      { id: "logistics", title: "Logistics & Supply Chain", tagline: "Real-Time Fleet Tracking & Route Optimization", description: "Building dispatch management platforms, driver mobile apps, and automated warehouse inventory systems." },
      { id: "real-estate", title: "Real Estate & PropTech", tagline: "Virtual Property Tours & Automated CRM Lead Flows", description: "Developing tenant portals, automated lease document generation, and MLS listing integrations." },
      { id: "education", title: "Education & EdTech", tagline: "Interactive Learning Systems & Proctored Exams", description: "Engineering LMS platforms, live virtual classroom video streaming, and AI automated grading tools." },
      { id: "marketing", title: "Marketing & AdTech", tagline: "Campaign Analytics & High-Volume Lead Engines", description: "Building real-time bidding analytics, automated email drip engines, and conversion rate optimization tools." },
      { id: "hr", title: "HR Tech & Recruitment", tagline: "AI Candidate Screening & Payroll Automation", description: "Building resume parser models, automated interview scheduling bots, and employee onboarding portals." },
      { id: "startups", title: "Startups & Venture Backed", tagline: "Rapid MVP Engineering & Scalable Seed Architecture", description: "Helping founders take ideas from pitch deck wireframes to production-grade applications in under 6 weeks." }
    ];
    await writeFile(tables.industries, JSON.stringify(defaultIndustries, null, 2), "utf8");
  }

  // 9. Core Engineering Team Table
  try {
    await stat(tables.team);
  } catch {
    const defaultTeam = [
      { id: "tm_1", name: "Shivansh Thapa", role: "Chief Executive Officer & Founder", bio: "Tech visionary specializing in full-stack architecture, enterprise growth, and AI product execution.", email: "shivansh@techellixir.com" },
      { id: "tm_2", name: "Rudra Pratap Singh Bisht", role: "Lead Systems Architect", bio: "Expert in distributed cloud systems, high-concurrency microservices, and DevOps infrastructure.", email: "rudra@techellixir.com" },
      { id: "tm_3", name: "Avneesh Singh", role: "Head of AI & Machine Learning", bio: "Leading Generative AI, RAG architecture, and custom LLM deployments for enterprise clients.", email: "avneesh@techellixir.com" }
    ];
    await writeFile(tables.team, JSON.stringify(defaultTeam, null, 2), "utf8");
  }

  // 10. Engineering Process Steps Table
  try {
    await stat(tables.process);
  } catch {
    const defaultProcess = [
      { id: "prc_1", step: "01", title: "Discovery & Strategy", description: "We analyze your project requirements, target market, and technical goals to outline a clear architecture roadmap." },
      { id: "prc_2", step: "02", title: "Architecture & UI/UX Design", description: "Designing intuitive wireframes, Figma interactive prototypes, and high-concurrency microservice system architecture." },
      { id: "prc_3", step: "03", title: "Agile Development & QA", description: "Iterative sprint development with clean code standards, automated testing, continuous integration, and security reviews." },
      { id: "prc_4", step: "04", title: "Deployment & Ongoing Support", description: "Production release, cloud infrastructure monitoring, zero-downtime CI/CD automation, and post-launch maintenance." }
    ];
    await writeFile(tables.process, JSON.stringify(defaultProcess, null, 2), "utf8");
  }

  // 11. Why Choose Us Features Table
  try {
    await stat(tables.whychoseus);
  } catch {
    const defaultWhyChooseUs = [
      { id: "wcu_1", title: "End-to-End Solutions", description: "From product discovery and UI design to cloud deployment and ongoing maintenance, we manage the complete lifecycle." },
      { id: "wcu_2", title: "Custom App Engineering", description: "Tailored software platforms built with React, Node.js, and modern tech stacks built specifically for your business." },
      { id: "wcu_3", title: "Scalable Cloud Architecture", description: "Containerized microservices running on AWS, GCP, or Azure designed to scale effortless with high user traffic." },
      { id: "wcu_4", title: "Security & Quality Assurance", description: "OWASP vulnerability audits, automated test suites, and enterprise data encryption protocols." },
      { id: "wcu_5", title: "Rapid On-Time Delivery", description: "Agile sprint workflows ensuring predictable milestones, transparent communication, and fast time-to-market." },
      { id: "wcu_6", title: "24/7 Dedicated Support", description: "Continuous monitoring, automated uptime alerts, and proactive maintenance to keep your applications running 24/7." }
    ];
    await writeFile(tables.whychoseus, JSON.stringify(defaultWhyChooseUs, null, 2), "utf8");
  }

  // 12. Company Metrics & Principles Table
  try {
    await stat(tables.about);
  } catch {
    const defaultAbout = [
      { id: "abt_1", title: "100+ Projects Delivered", type: "metric", value: "100+", label: "Delivered Projects" },
      { id: "abt_2", title: "50+ Happy Clients", type: "metric", value: "50+", label: "Happy Clients" },
      { id: "abt_3", title: "10+ Years Tech Experience", type: "metric", value: "10+", label: "Years Experience" },
      { id: "abt_4", title: "24/7 Support", type: "metric", value: "24/7", label: "Enterprise Support" },
      { id: "abt_5", title: "Outcome-Driven Engineering", type: "principle", value: "Principle 1", label: "We build software aimed directly at solving core operational challenges and driving measurable revenue growth." },
      { id: "abt_6", title: "Built for Enterprise Scale", type: "principle", value: "Principle 2", label: "Our modular microservices and clean code bases are engineered to scale seamlessly as your user base expands." },
      { id: "abt_7", title: "Human-Centered Design", type: "principle", value: "Principle 3", label: "We prioritize intuitive UX, accessibility, and high performance to deliver software products users love." }
    ];
    await writeFile(tables.about, JSON.stringify(defaultAbout, null, 2), "utf8");
  }

  console.log("Full Database initialized successfully at:", dbDir);
}

// Read Table Data
export async function dbSelect(tableName) {
  await initDatabase();
  const filePath = tables[tableName];
  if (!filePath) throw new Error(`Invalid table name: ${tableName}`);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

// Write Table Data
export async function dbSave(tableName, data) {
  await initDatabase();
  const filePath = tables[tableName];
  if (!filePath) throw new Error(`Invalid table name: ${tableName}`);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return data;
}

// Database Statistics & Health Inspection
export async function dbStats() {
  await initDatabase();
  const statsResult = {};
  for (const [table, filePath] of Object.entries(tables)) {
    try {
      const fileStat = await stat(filePath);
      const rows = await dbSelect(table);
      statsResult[table] = {
        rowCount: Array.isArray(rows) ? rows.length : 1,
        sizeBytes: fileStat.size,
        updatedAt: fileStat.mtime,
      };
    } catch {
      statsResult[table] = { rowCount: 0, sizeBytes: 0, updatedAt: null };
    }
  }
  return {
    engine: "TechEllixir Enterprise JSON Document Database v2.0",
    databasePath: dbDir,
    tables: statsResult,
  };
}
