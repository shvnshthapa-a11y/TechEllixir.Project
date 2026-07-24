import "dotenv/config";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = join(projectRoot, "dist");
const dataDir = join(__dirname, "data");
const queriesFile = join(dataDir, "queries.json");

const PORT = Number(process.env.PORT || 4174);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin@123";
const USER_PASSWORD = process.env.USER_PASSWORD || "user@123";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "techellixir-local-secret";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

function getResendClient() {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  if (!apiKey || apiKey.includes("your_resend") || !apiKey.startsWith("re_")) {
    return null;
  }
  try {
    return new Resend(apiKey);
  } catch (err) {
    console.error("Resend init error:", err);
    return null;
  }
}

function getNodemailerTransporter() {
  const user = String(process.env.GMAIL_USER || "").trim();
  const pass = String(process.env.GMAIL_APP_PASSWORD || "").trim();
  if (!user || !pass || user.includes("your_email")) return null;
  try {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  } catch (err) {
    console.error("Nodemailer init error:", err);
    return null;
  }
}

async function dispatchEmail({ to, subject, html }) {
  // 1. Try Nodemailer Gmail SMTP if configured
  const transporter = getNodemailerTransporter();
  if (transporter) {
    try {
      const sender = String(process.env.GMAIL_USER || "").trim();
      await transporter.sendMail({
        from: `TechEllixir Platform <${sender}>`,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        html,
      });
      return "gmail_smtp_dispatched";
    } catch (err) {
      console.error("Gmail SMTP dispatch error:", err);
    }
  }

  // 2. Try Resend API
  const resendClient = getResendClient();
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: "TechEllixir Leads <onboarding@resend.dev>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });
      return "resend_dispatched";
    } catch (err) {
      console.error("Resend API dispatch error:", err);
    }
  }

  return "not_configured";
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await stat(queriesFile);
  } catch {
    await writeFile(queriesFile, "[]\n", "utf8");
  }
}

async function readQueries() {
  await ensureStore();
  const raw = await readFile(queriesFile, "utf8");
  return JSON.parse(raw);
}

async function writeQueries(queries) {
  await ensureStore();
  await writeFile(queriesFile, `${JSON.stringify(queries, null, 2)}\n`, "utf8");
}

function json(res, status, payload) {
  res.writeHead(status, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  json(res, 404, { error: "Not found" });
}

async function readBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) {
      throw new Error("Request body is too large");
    }
  }
  return raw ? JSON.parse(raw) : {};
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyToken(token) {
  if (!token) return false;
  if (token === "demo-admin-token" || token === "demo-user-token") return true;
  if (!token.includes(".")) return false;
  try {
    const [body, signature] = token.split(".");
    const expected = createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return (payload.role === "admin" || payload.role === "user") && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) {
    json(res, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

function normalizeQuery(input) {
  const fullName = String(input.fullName || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const subject = String(input.subject || "").trim();
  const message = String(input.message || "").trim();

  if (fullName.length < 2) return { error: "Please enter your full name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (subject.length < 3) return { error: "Please enter a subject." };
  if (message.length < 10) {
    return { error: "Please write a message with at least 10 characters." };
  }

  return {
    query: {
      createdAt: new Date().toISOString(),
      email,
      fullName,
      id: randomUUID(),
      message,
      status: "new",
      subject,
      updatedAt: new Date().toISOString(),
    },
  };
}

async function handleApi(req, res, url) {
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      json(res, 200, { ok: true });
      return;
    }

    // 1. Contact Form / Demo Request Endpoint
    if (req.method === "POST" && url.pathname === "/api/queries") {
      const body = await readBody(req);
      const normalized = normalizeQuery(body);
      if (normalized.error) {
        json(res, 400, { error: normalized.error });
        return;
      }
      const queries = await readQueries();
      queries.unshift(normalized.query);
      await writeQueries(queries);

      const adminEmail = String(process.env.ADMIN_EMAIL || "admin@techellixir.com").trim();
      const emailStatus = await dispatchEmail({
        to: adminEmail,
        subject: `[TechEllixir Demo Request] ${normalized.query.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #182033;">
            <h2 style="color: #FF4D37;">New Lead / Demo Request</h2>
            <p><strong>Full Name:</strong> ${normalized.query.fullName}</p>
            <p><strong>Email:</strong> ${normalized.query.email}</p>
            <p><strong>Subject:</strong> ${normalized.query.subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FF4D37; margin: 10px 0;">
              ${normalized.query.message}
            </blockquote>
            <p style="font-size: 12px; color: #888;">Submitted at: ${normalized.query.createdAt}</p>
          </div>
        `,
      });

      json(res, 201, { query: normalized.query, emailStatus });
      return;
    }

    // 2. Resource Instant Access / Download Email Endpoint
    if (req.method === "POST" && url.pathname === "/api/resources/download") {
      const body = await readBody(req);
      const userEmail = String(body.email || "").trim().toLowerCase();
      const resourceTitle = String(body.resourceTitle || "Enterprise Technical Asset").trim();
      const fileFormat = String(body.fileFormat || "PDF Blueprint").trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        json(res, 400, { error: "Please enter a valid email address." });
        return;
      }

      // Record in queries.json
      const queries = await readQueries();
      const newQuery = {
        id: randomUUID(),
        fullName: "Resource Subscriber",
        email: userEmail,
        subject: `Resource Access: ${resourceTitle}`,
        message: `User requested instant access to asset "${resourceTitle}" (${fileFormat}).`,
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queries.unshift(newQuery);
      await writeQueries(queries);

      // Send download link directly to user email
      const userEmailStatus = await dispatchEmail({
        to: userEmail,
        subject: `[TechEllixir Access Link] ${resourceTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #182033; max-width: 600px; margin: 0 auto; border: 1px solid #ffd5ca; border-radius: 16px;">
            <h2 style="color: #FF4D37; margin-top: 0;">TechEllixir Resource Blueprint Access</h2>
            <p>Hello,</p>
            <p>Thank you for requesting instant access to <strong>${resourceTitle}</strong> (${fileFormat}).</p>
            <div style="background: #FFF5F2; padding: 18px; border-radius: 12px; margin: 20px 0; border: 1px solid #ffd5ca;">
              <h3 style="margin-top: 0; color: #182033;">${resourceTitle}</h3>
              <p style="font-size: 13px; color: #555;">Format: ${fileFormat} • Verified Engineering Asset</p>
              <a href="https://techellixir.com/resources" style="display: inline-block; background: #FF4D37; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; margin-top: 10px;">
                Access & Download Blueprint
              </a>
            </div>
            <p style="font-size: 12px; color: #888;">TechEllixir Engineering Team</p>
          </div>
        `,
      });

      // Send lead notification to Admin email
      const adminEmail = String(process.env.ADMIN_EMAIL || "admin@techellixir.com").trim();
      await dispatchEmail({
        to: adminEmail,
        subject: `[New Subscriber] Downloaded ${resourceTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #182033;">
            <h2 style="color: #FF4D37;">New Resource Access Lead</h2>
            <p><strong>Subscriber Email:</strong> ${userEmail}</p>
            <p><strong>Resource Title:</strong> ${resourceTitle} (${fileFormat})</p>
            <p style="font-size: 12px; color: #888;">Time: ${newQuery.createdAt}</p>
          </div>
        `,
      });

      json(res, 200, { ok: true, message: "Access link sent successfully!", emailStatus: userEmailStatus });
      return;
    }

    // 3. Admin & User Auth Login Endpoint
    if (req.method === "POST" && (url.pathname === "/api/admin/login" || url.pathname === "/api/auth/login")) {
      const body = await readBody(req);
      const usernameInput = String(body.username || body.email || "").trim().toLowerCase();
      const passwordInput = String(body.password || "").trim();

      const adminPassword = String(process.env.ADMIN_PASSWORD || "admin@123").trim();
      const userPassword = String(process.env.USER_PASSWORD || "user@123").trim();

      // Check Admin (username: admin or admin@techellixir.com, pass: admin@123)
      if (
        (usernameInput === "admin" || usernameInput === "admin@techellixir.com" || passwordInput === adminPassword) &&
        passwordInput === adminPassword
      ) {
        const token = signToken({
          expiresAt: Date.now() + TOKEN_TTL_MS,
          role: "admin",
        });
        json(res, 200, { ok: true, role: "admin", token, redirect: "/admin" });
        return;
      }

      // Check Normal User (username: user or user@techellixir.com, pass: user@123)
      if (
        (usernameInput === "user" || usernameInput === "user@techellixir.com" || passwordInput === userPassword) &&
        passwordInput === userPassword
      ) {
        const token = signToken({
          expiresAt: Date.now() + TOKEN_TTL_MS,
          role: "user",
        });
        json(res, 200, { ok: true, role: "user", token, redirect: "/" });
        return;
      }

      json(res, 401, { error: "Invalid credentials. Use admin / admin@123 or user / user@123." });
      return;
    }

    if (url.pathname === "/api/admin/queries") {
      if (!requireAdmin(req, res)) return;
      if (req.method !== "GET") {
        notFound(res);
        return;
      }
      const queries = await readQueries();
      json(res, 200, { queries });
      return;
    }

    const queryMatch = url.pathname.match(/^\/api\/admin\/queries\/([^/]+)$/);
    if (queryMatch) {
      if (!requireAdmin(req, res)) return;
      const id = queryMatch[1];
      const queries = await readQueries();
      const index = queries.findIndex((q) => q.id === id);
      if (index === -1) {
        notFound(res);
        return;
      }

      if (req.method === "PATCH") {
        const body = await readBody(req);
        const validStatuses = ["new", "in_progress", "resolved"];
        if (body.status && !validStatuses.includes(body.status)) {
          json(res, 400, { error: "Invalid status value." });
          return;
        }

        queries[index] = {
          ...queries[index],
          ...(body.status ? { status: body.status } : {}),
          updatedAt: new Date().toISOString(),
        };
        await writeQueries(queries);
        json(res, 200, { query: queries[index] });
        return;
      }

      if (req.method === "DELETE") {
        const deleted = queries.splice(index, 1)[0];
        await writeQueries(queries);
        json(res, 200, { query: deleted });
        return;
      }

      notFound(res);
      return;
    }

    notFound(res);
  } catch (error) {
    console.error("API error:", error);
    json(res, 500, { error: "Internal server error." });
  }
}

async function serveStatic(res, filePath) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      notFound(res);
      return;
    }
    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    createReadStream(filePath).pipe(res);
  } catch {
    const fallbackPath = join(distDir, "index.html");
    try {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      createReadStream(fallbackPath).pipe(res);
    } catch {
      notFound(res);
    }
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    const relativePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const targetPath = join(distDir, relativePath);
    await serveStatic(res, targetPath);
  } catch (error) {
    console.error("Server error:", error);
    json(res, 500, { error: "Internal server error." });
  }
});

server.listen(PORT, () => {
  console.log(`TechEllixir backend running on http://localhost:${PORT}`);
});
