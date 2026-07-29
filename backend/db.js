import { DatabaseSync } from "node:sqlite";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const dataDir = join(__dirname, "data");
export const sqlDbPath = join(dataDir, "techellixir.sqlite");

let dbInstance = null;

// Get or Initialize SQLite Connection
export function getSqlDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(sqlDbPath);
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    dbInstance.exec("PRAGMA foreign_keys = ON;");
    createSqlTables(dbInstance);
  }
  return dbInstance;
}

// 1. Create SQL Tables
function createSqlTables(db) {
  // Queries & Leads SQL Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS queries (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'not_started',
      type TEXT DEFAULT 'contact',
      college TEXT,
      year TEXT,
      resumeUrl TEXT,
      reason TEXT,
      domain TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Portal Users SQL Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL
    );
  `);

  // System Settings SQL Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT 'global',
      data TEXT NOT NULL
    );
  `);

  // Dynamic CMS Collections SQL Table (Services, Resources, Careers, Testimonials, Industries, Team, Process, WhyChooseUs, About)
  db.exec(`
    CREATE TABLE IF NOT EXISTS cms_collections (
      id TEXT NOT NULL,
      collection TEXT NOT NULL,
      data TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      PRIMARY KEY (collection, id)
    );
  `);
}

// 2. Initialize Database and Seed Default Data into SQL Tables
export async function initDatabase() {
  await mkdir(dataDir, { recursive: true });
  const db = getSqlDb();

  // Seed Default Portal Users into SQL
  const userCount = db.prepare("SELECT COUNT(*) as cnt FROM users").get();
  if (userCount.cnt === 0) {
    const defaultUsers = [
      { id: "usr_101", name: "Rudra Pratap Singh", email: "rudra@example.com", role: "user", status: "active", createdAt: new Date().toISOString() },
      { id: "usr_102", name: "Shivansh Thapa", email: "shivansh@techellixir.com", role: "admin", status: "active", createdAt: new Date().toISOString() },
      { id: "usr_103", name: "Ananya Sharma", email: "ananya.sharma@dit.edu.in", role: "user", status: "active", createdAt: new Date().toISOString() },
      { id: "usr_104", name: "Vikram Malhotra", email: "vikram@geu.ac.in", role: "user", status: "active", createdAt: new Date().toISOString() },
    ];
    const stmt = db.prepare("INSERT INTO users (id, name, email, role, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)");
    for (const u of defaultUsers) {
      stmt.run(u.id, u.name, u.email, u.role, u.status, u.createdAt);
    }
  }

  // Seed Default Settings into SQL
  const settingsCount = db.prepare("SELECT COUNT(*) as cnt FROM settings").get();
  if (settingsCount.cnt === 0) {
    const defaultSettings = { maintenanceMode: false, announcementBanner: "🚀 TechEllixir 2.0 AI Internship Registrations OPEN!", allowRegistrations: true, updatedBy: "Admin" };
    db.prepare("INSERT INTO settings (id, data) VALUES ('global', ?)").run(JSON.stringify(defaultSettings));
  }

  // Seed Services into SQL CMS Table
  seedCmsIfEmpty(db, "services", [
    { id: "srv_1", title: "Web Development", category: "Core Software Engineering", description: "Responsive web platforms built with React, Node.js, and modern architecture that scale with real traffic.", note: "We build modern, high-performance web applications with clean frontend architecture, reliable REST/GraphQL APIs, enterprise database systems, and lightning-fast load times.", detailedOverview: "We engineer enterprise web applications built for extreme speed, search visibility, and fault tolerance. Using React 19, Next.js, and Node.js microservices, we build platforms that process millions of requests while providing smooth user flows.", highlights: "React 19 & Next.js, Node.js & APIs, Scalable Web Apps", subServices: ["Custom Web Applications", "Frontend Development (React/Next.js)", "Backend & RESTful APIs (Node.js)", "E-Commerce Platforms", "Progressive Web Apps (PWA)", "Performance Optimization & SEO"] },
    { id: "srv_2", title: "Mobile App Development", category: "Core Software Engineering", description: "Cross-platform Android and iOS apps with slick interfaces, reliable performance, and practical release support.", note: "Deliver native-grade iOS & Android mobile applications built using Flutter & React Native.", detailedOverview: "Our mobile development team builds feature-rich iOS and Android apps designed for speed, intuitive touch UX, and offline sync.", highlights: "Flutter & React Native, iOS & Android Apps, App Store Launch Support", subServices: ["Cross-Platform App Development", "iOS Development (Swift/Flutter)", "Android Development (Kotlin/Flutter)", "App UI/UX Design", "Push Notification Systems"] },
    { id: "srv_3", title: "UI / UX Design", category: "Core Software Engineering", description: "User-centric interface design, interactive wireframes, and design systems crafted for high conversion rates.", note: "Transform raw product ideas into intuitive design systems, interactive Figma prototypes, and visually captivating mobile/web user interfaces that users love.", detailedOverview: "We combine human-centered design research with polished visual aesthetics to build design systems that enhance user engagement and brand recognition.", highlights: "Figma Prototypes, Design Systems, User Journey Mapping", subServices: ["User Research & Persona Mapping", "Wireframing & Prototyping", "Mobile & Web UI Design", "Design Systems & Component Libraries", "Usability Testing"] },
    { id: "srv_4", title: "Artificial Intelligence & RAG", category: "AI & Data Solutions", description: "Custom AI solutions, OpenAI integrations, RAG pipelines, and intelligent automation workflows for business tasks.", note: "Unlock enterprise productivity by embedding custom LLMs, vector database search (Pinecone/Qdrant), automated document extractors, and autonomous AI agents directly into your workflows.", detailedOverview: "We design and deploy custom Retrieval-Augmented Generation (RAG) pipelines, semantic vector search engines, and automated AI agents.", highlights: "Custom LLM Integrations, Vector Search & RAG, Autonomous AI Agents", subServices: ["Retrieval-Augmented Generation (RAG)", "OpenAI & Claude API Integration", "Vector Database Indexing", "Document AI & Automated Extraction", "n8n Workflow Automation"] },
    { id: "srv_5", title: "Cloud Architecture & DevOps", category: "Core Software Engineering", description: "AWS and GCP cloud infrastructure setup, Docker containerization, Kubernetes orchestration, and CI/CD pipelines.", note: "Achieve 99.99% infrastructure reliability with automated Terraform deployments, Docker containers, Kubernetes cluster management, and secure CI/CD pipelines.", detailedOverview: "Our certified DevOps engineers build robust cloud infrastructure on AWS and GCP designed to handle high concurrency while keeping operational costs low.", highlights: "AWS & GCP Cloud Setup, Docker & Kubernetes, CI/CD Automated Pipelines", subServices: ["Cloud Infrastructure Setup (AWS/GCP)", "Docker Containerization", "Kubernetes Cluster Management", "CI/CD Pipeline Automation", "Infrastructure as Code (Terraform)"] },
    { id: "srv_6", title: "Data Analytics & BI", category: "AI & Data Solutions", description: "Transform raw business data into actionable dashboard insights, custom analytics pipelines, and automated reporting.", note: "Empower decision-makers with live data dashboards, SQL data warehouse pipelines, predictive customer analytics, and automated daily performance reports.", detailedOverview: "We build high-throughput data processing pipelines and real-time visualization dashboards using PostgreSQL, BigQuery, and Python data frameworks.", highlights: "Real-time Dashboards, Data Warehousing, SQL Analytics Pipelines", subServices: ["Data Warehouse Architecture", "Custom Dashboard Development", "ETL Data Pipeline Setup", "Customer Behavior Analytics", "Automated Business Reporting"] }
  ]);

  // Seed Resources into SQL CMS Table
  seedCmsIfEmpty(db, "resources", [
    { id: "res_1", title: "SEO Services in Dehradun: 2026 Trends & Growth Guide", category: "Blogs & Articles", categoryLabel: "Blogs & Articles", readTime: "5 min read", description: "Discover the latest search engine optimization strategies driving organic traffic and client growth in 2026.", date: "2026-07-24", author: "Shivansh Thapa", summary: "# SEO Services in Dehradun: 2026 Trends\n\nSearch Engine Optimization has transformed dramatically with AI Search Engines like Perplexity and Gemini." },
    { id: "res_2", title: "TechEllixir Announces Next-Gen AI Internship Program", category: "News & Press", categoryLabel: "News & Press", readTime: "3 min read", description: "Empowering 500+ student developers with hands-on industrial AI project experience and mentorship.", date: "2026-07-25", author: "Rudra Pratap Singh", summary: "# TechEllixir AI Internship Announcement\n\nTechEllixir is proud to launch its 2.0 AI Internship initiative." },
    { id: "res_3", title: "Enterprise RAG Architecture Whitepaper: Sub-Second Vector Search", category: "Resources & Blueprints", categoryLabel: "Resources & Blueprints", readTime: "12 min read", description: "A technical architectural blueprint on chunking strategies, hybrid search BM25+dense embeddings, and Qdrant deployment.", date: "2026-07-20", author: "Avneesh Singh", summary: "# Enterprise RAG Architecture Whitepaper\n\nBuilding enterprise-grade RAG systems requires decoupling indexing worker pools from vector search." },
    { id: "res_4", title: "Live Masterclass: Building & Scaling Enterprise RAG Applications", category: "Events & Webinars", categoryLabel: "Events & Webinars", readTime: "8 min read", description: "Join our live 90-minute hands-on masterclass as we code a production-ready RAG application live.", date: "2026-07-18", author: "TechEllixir AI Team", summary: "# Live Masterclass: Enterprise RAG\n\nJoin our interactive live webinar session." }
  ]);

  // Seed Careers into SQL CMS Table
  seedCmsIfEmpty(db, "careers", [
    { id: "car_1", title: "Artificial Intelligence", category: "ai", badge: "🔥 #1 Most Popular", duration: "2 - 6 Months", desc: "Build intelligent applications using AI, LLMs, prompt engineering, and automation tools." },
    { id: "car_2", title: "Full Stack Development", category: "web", badge: "🚀 High Demand", duration: "2 - 6 Months", desc: "Work across frontend and backend systems using MERN / Python while understanding real product delivery." },
    { id: "car_3", title: "Frontend Development", category: "web", badge: "⚡ Trending 2026", duration: "2 - 6 Months", desc: "Learn React 19, HTML, CSS, Tailwind CSS, TypeScript, and modern high-performance frontend development." },
    { id: "car_4", title: "Backend Development", category: "web", badge: "⚡ High Demand", duration: "2 - 6 Months", desc: "Build scalable APIs using Node.js, Express, Python, PostgreSQL, and REST/GraphQL architecture." }
  ]);

  // Seed Testimonials into SQL CMS Table
  seedCmsIfEmpty(db, "testimonials", [
    { id: "tst_1", name: "Rahul Sharma", company: "ABC Technologies", rating: 5, review: "TechEllixir delivered an outstanding website that exceeded our expectations. Their team was professional, responsive and delivered everything on time." },
    { id: "tst_2", name: "Priya Verma", company: "Innovate Solutions", rating: 5, review: "The team was responsive, creative, and delivered our mobile application on time. The experience was smooth from start to finish." },
    { id: "tst_3", name: "David Wilson", company: "Global IT", rating: 5, review: "Excellent support and high-quality software development. Highly recommended for startups and enterprises." }
  ]);

  // Seed Process Steps into SQL CMS Table
  seedCmsIfEmpty(db, "process", [
    { id: "prc_1", step: "01", title: "Discovery & Strategy", description: "We analyze your project requirements, target market, and technical goals to outline a clear architecture roadmap." },
    { id: "prc_2", step: "02", title: "Architecture & UI/UX Design", description: "Designing intuitive wireframes, Figma interactive prototypes, and high-concurrency microservice system architecture." },
    { id: "prc_3", step: "03", title: "Agile Development & QA", description: "Iterative sprint development with clean code standards, automated testing, continuous integration, and security reviews." },
    { id: "prc_4", step: "04", title: "Deployment & Ongoing Support", description: "Production release, cloud infrastructure monitoring, zero-downtime CI/CD automation, and post-launch maintenance." }
  ]);

  // Seed WhyChooseUs into SQL CMS Table
  seedCmsIfEmpty(db, "whychoseus", [
    { id: "wcu_1", title: "End-to-End Solutions", description: "From product discovery and UI design to cloud deployment and ongoing maintenance, we manage the complete lifecycle." },
    { id: "wcu_2", title: "Custom App Engineering", description: "Tailored software platforms built with React, Node.js, and modern tech stacks built specifically for your business." },
    { id: "wcu_3", title: "Scalable Cloud Architecture", description: "Containerized microservices running on AWS, GCP, or Azure designed to scale effortless with high user traffic." },
    { id: "wcu_4", title: "Security & Quality Assurance", description: "OWASP vulnerability audits, automated test suites, and enterprise data encryption protocols." }
  ]);

  // Seed About into SQL CMS Table
  seedCmsIfEmpty(db, "about", [
    { id: "abt_1", title: "100+ Projects Delivered", type: "metric", value: "100+", label: "Delivered Projects" },
    { id: "abt_2", title: "50+ Happy Clients", type: "metric", value: "50+", label: "Happy Clients" },
    { id: "abt_3", title: "10+ Years Tech Experience", type: "metric", value: "10+", label: "Years Experience" },
    { id: "abt_4", title: "24/7 Support", type: "metric", value: "24/7", label: "Enterprise Support" }
  ]);

  return db;
}

function seedCmsIfEmpty(db, collectionName, items) {
  const count = db.prepare("SELECT COUNT(*) as cnt FROM cms_collections WHERE collection = ?").get(collectionName);
  if (count.cnt === 0) {
    const stmt = db.prepare("INSERT INTO cms_collections (id, collection, data, createdAt) VALUES (?, ?, ?, ?)");
    const now = new Date().toISOString();
    for (const item of items) {
      stmt.run(String(item.id), collectionName, JSON.stringify(item), now);
    }
  }
}

// 3. Read Table Data from SQL Database
export async function dbSelect(tableName) {
  await initDatabase();
  const db = getSqlDb();

  if (tableName === "queries") {
    const rows = db.prepare("SELECT * FROM queries ORDER BY createdAt DESC").all();
    return rows.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone || "",
      subject: r.subject,
      message: r.message,
      status: r.status,
      type: r.type,
      college: r.college || "",
      year: r.year || "",
      resumeUrl: r.resumeUrl || "",
      reason: r.reason || "",
      domain: r.domain || "",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  if (tableName === "users") {
    const rows = db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      status: r.status,
      createdAt: r.createdAt,
    }));
  }

  if (tableName === "settings") {
    const row = db.prepare("SELECT data FROM settings WHERE id = 'global'").get();
    return row ? JSON.parse(row.data) : { maintenanceMode: false, announcementBanner: "", allowRegistrations: true, updatedBy: "Admin" };
  }

  // Generic CMS Collection Table Select
  const rows = db.prepare("SELECT id, data FROM cms_collections WHERE collection = ? ORDER BY createdAt DESC").all(tableName);
  return rows.map((r) => JSON.parse(r.data));
}

// 4. Write / Update Table Data in SQL Database
export async function dbSave(tableName, data) {
  await initDatabase();
  const db = getSqlDb();

  if (tableName === "queries") {
    if (Array.isArray(data)) {
      const stmt = db.prepare(`
        INSERT INTO queries (id, fullName, email, phone, subject, message, status, type, college, year, resumeUrl, reason, domain, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          fullName=excluded.fullName,
          email=excluded.email,
          phone=excluded.phone,
          subject=excluded.subject,
          message=excluded.message,
          status=excluded.status,
          type=excluded.type,
          college=excluded.college,
          year=excluded.year,
          resumeUrl=excluded.resumeUrl,
          reason=excluded.reason,
          domain=excluded.domain,
          updatedAt=excluded.updatedAt
      `);
      for (const q of data) {
        stmt.run(
          q.id,
          q.fullName || "N/A",
          q.email || "N/A",
          q.phone || "",
          q.subject || "N/A",
          q.message || "N/A",
          q.status || "not_started",
          q.type || "contact",
          q.college || "",
          q.year || "",
          q.resumeUrl || "",
          q.reason || "",
          q.domain || "",
          q.createdAt || new Date().toISOString(),
          q.updatedAt || new Date().toISOString()
        );
      }
    }
    return data;
  }

  if (tableName === "users") {
    if (Array.isArray(data)) {
      const stmt = db.prepare(`
        INSERT INTO users (id, name, email, role, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          email=excluded.email,
          role=excluded.role,
          status=excluded.status
      `);
      for (const u of data) {
        stmt.run(u.id, u.name, u.email, u.role, u.status, u.createdAt || new Date().toISOString());
      }
    }
    return data;
  }

  if (tableName === "settings") {
    const payload = typeof data === "object" ? JSON.stringify(data) : String(data);
    db.prepare("INSERT INTO settings (id, data) VALUES ('global', ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data").run(payload);
    return data;
  }

  // Write CMS Collection array into SQL Database
  if (Array.isArray(data)) {
    db.prepare("DELETE FROM cms_collections WHERE collection = ?").run(tableName);
    const stmt = db.prepare("INSERT INTO cms_collections (id, collection, data, createdAt) VALUES (?, ?, ?, ?)");
    const now = new Date().toISOString();
    for (const item of data) {
      stmt.run(String(item.id || item.title), tableName, JSON.stringify(item), now);
    }
  }

  return data;
}

// 5. Database Statistics & Health Inspection
export async function dbStats() {
  await initDatabase();
  const db = getSqlDb();
  const statsResult = {};

  const queryCount = db.prepare("SELECT COUNT(*) as cnt FROM queries").get().cnt;
  statsResult["queries"] = { rowCount: queryCount, engine: "SQLite Table (queries)" };

  const userCount = db.prepare("SELECT COUNT(*) as cnt FROM users").get().cnt;
  statsResult["users"] = { rowCount: userCount, engine: "SQLite Table (users)" };

  const cmsRows = db.prepare("SELECT collection, COUNT(*) as cnt FROM cms_collections GROUP BY collection").all();
  for (const r of cmsRows) {
    statsResult[r.collection] = { rowCount: r.cnt, engine: `SQLite Table (cms_collections:${r.collection})` };
  }

  let dbSizeBytes = 0;
  try {
    const fileStat = await stat(sqlDbPath);
    dbSizeBytes = fileStat.size;
  } catch {}

  return {
    engine: "SQLite 3 Engine (node:sqlite DatabaseSync)",
    sqlDbPath,
    databaseSizeBytes: dbSizeBytes,
    tables: statsResult,
  };
}
