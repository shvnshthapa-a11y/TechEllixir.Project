import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const dbDir = join(__dirname, "resources");

// Table file paths
const tables = {
  queries: join(dbDir, "queries.json"),
  users: join(dbDir, "users.json"),
  settings: join(dbDir, "settings.json"),
  services: join(dbDir, "services.json"),
  resources: join(dbDir, "resources.json"),
  careers: join(dbDir, "careers.json"),
};

// Initialize Database Schemas & Seed Full Project Data
export async function initDatabase() {
  await mkdir(dbDir, { recursive: true });

  // 1. Queries Table (Leads & Candidates)
  try {
    await stat(tables.queries);
  } catch {
    await writeFile(tables.queries, "[]\n", "utf8");
  }

  // 2. Users Table (System Accounts & Access Roles)
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

  // 3. Settings Table (Global Portal Controls)
  try {
    await stat(tables.settings);
  } catch {
    const defaultSettings = { maintenanceMode: false, announcementBanner: "🚀 TechEllixir 2.0 AI Internship Registrations OPEN!", allowRegistrations: true, updatedBy: "Admin" };
    await writeFile(tables.settings, JSON.stringify(defaultSettings, null, 2), "utf8");
  }

  // 4. Services Table (Full Technical Services Catalog)
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

  // 5. Resources Table (Blogs, Whitepapers, News & Press Releases)
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

  // 6. Careers Table (Full 16 Internship Domains)
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

  console.log("Database initialized successfully at:", dbDir);
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
    engine: "TechEllixir JSON Document Database v2.0",
    databasePath: dbDir,
    tables: statsResult,
  };
}
