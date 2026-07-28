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

// Initialize Database Schemas & Seed Default Data
export async function initDatabase() {
  await mkdir(dbDir, { recursive: true });

  // 1. Queries Table
  try {
    await stat(tables.queries);
  } catch {
    await writeFile(tables.queries, "[]\n", "utf8");
  }

  // 2. Users Table
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

  // 3. Settings Table
  try {
    await stat(tables.settings);
  } catch {
    const defaultSettings = { maintenanceMode: false, announcementBanner: "", allowRegistrations: true, updatedBy: "Admin" };
    await writeFile(tables.settings, JSON.stringify(defaultSettings, null, 2), "utf8");
  }

  // 4. Services Table
  try {
    await stat(tables.services);
  } catch {
    const defaultServices = [
      { id: "srv_1", title: "Web Development", category: "Core Development", description: "Responsive web platforms built with React, Node.js, and modern architecture.", note: "Enterprise scale and performance", highlights: "React 19 & Next.js, REST/GraphQL API, PostgreSQL" },
      { id: "srv_2", title: "Artificial Intelligence & RAG", category: "AI & Data", description: "Custom LLM integrations, document search, and intelligent workflow automations.", note: "Sub-second response time", highlights: "Vector DB Integration, Custom AI Agents, PyTorch" },
      { id: "srv_3", title: "Cloud Architecture & DevOps", category: "Infrastructure", description: "AWS/GCP infrastructure setup, Kubernetes clusters, and automated CI/CD pipelines.", note: "99.99% Uptime SLA", highlights: "Docker & Kubernetes, Terraform, Infrastructure as Code" },
    ];
    await writeFile(tables.services, JSON.stringify(defaultServices, null, 2), "utf8");
  }

  // 5. Resources Table
  try {
    await stat(tables.resources);
  } catch {
    const defaultResources = [
      { id: "res_1", title: "SEO Services in Dehradun: 2026 Trends & Growth Guide", category: "Blogs & Articles", readTime: "5 min read", description: "Discover the latest search engine optimization strategies driving organic traffic in 2026.", date: "2026-07-24" },
      { id: "res_2", title: "TechEllixir Announces Next-Gen AI Internship Program", category: "News & Press", readTime: "3 min read", description: "Empowering 500+ student developers with hands-on industrial AI project experience.", date: "2026-07-25" },
    ];
    await writeFile(tables.resources, JSON.stringify(defaultResources, null, 2), "utf8");
  }

  // 6. Careers Table
  try {
    await stat(tables.careers);
  } catch {
    const defaultCareers = [
      { id: "car_1", title: "Artificial Intelligence", category: "AI & Data Science", badge: "🔥 #1 Most Popular", duration: "2 - 6 Months", desc: "Machine Learning, LLM Fine-Tuning, RAG Pipelines, Python & PyTorch." },
      { id: "car_2", title: "Full Stack Development", category: "Web & Full Stack", badge: "🚀 High Demand", duration: "2 - 6 Months", desc: "React, Node.js, TypeScript, PostgreSQL, REST APIs & Tailwind CSS." },
      { id: "car_3", title: "Cloud & DevOps Engineering", category: "Cloud & Security", badge: "⚡ Trending 2026", duration: "2 - 6 Months", desc: "Docker, Kubernetes, AWS, Terraform, CI/CD & Linux Administration." },
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
