const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const {
  addMessage,
  addProject,
  deleteProject,
  getPortfolio,
  sqlDbPath
} = require("./database.cjs");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const fallbackPublicDir = path.join(rootDir, "public");
const port = Number(process.env.PORT || 3000);
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
const adminToken = crypto.randomBytes(32).toString("hex");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
  });
}

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(5).toString("hex")}`;
}

function isAdminRequest(req) {
  return req.headers.authorization === `Bearer ${adminToken}`;
}

function requireAdmin(req, res) {
  if (isAdminRequest(req)) {
    return true;
  }
  sendJson(res, 401, { error: "Admin girişi gerekli." });
  return false;
}

function requireText(value, fieldName, maxLength = 200) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} zorunludur.`);
  }
  return value.trim().slice(0, maxLength);
}

function normalizeProject(payload) {
  const tech = Array.isArray(payload.tech)
    ? payload.tech.map(item => String(item).trim()).filter(Boolean).slice(0, 8)
    : String(payload.tech || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 8);

  return {
    title: requireText(payload.title, "Proje başlığı", 80),
    type: requireText(payload.type, "Proje türü", 40),
    status: requireText(payload.status, "Proje durumu", 40),
    description: requireText(payload.description, "Proje açıklaması", 420),
    tech,
    featured: Boolean(payload.featured)
  };
}

async function handleApi(req, res, url) {
  try {
    if (req.method === "POST" && url.pathname === "/api/admin/login") {
      const payload = await parseBody(req);
      if (payload.password !== adminPassword) {
        sendJson(res, 401, { error: "Admin şifresi hatalı." });
        return;
      }
      sendJson(res, 200, { token: adminToken });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/portfolio") {
      sendJson(res, 200, getPortfolio());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/projects") {
      if (!requireAdmin(req, res)) {
        return;
      }
      const payload = await parseBody(req);
      const project = { id: createId("project"), ...normalizeProject(payload) };
      sendJson(res, 201, addProject(project));
      return;
    }

    const projectMatch = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
    if (projectMatch && req.method === "DELETE") {
      if (!requireAdmin(req, res)) {
        return;
      }
      if (!deleteProject(projectMatch[1])) {
        sendJson(res, 404, { error: "Proje bulunamadı." });
        return;
      }
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/messages") {
      const payload = await parseBody(req);
      const message = {
        id: createId("msg"),
        name: requireText(payload.name, "Name", 80),
        email: requireText(payload.email, "E-posta", 120),
        message: requireText(payload.message, "Mesaj", 600),
        createdAt: new Date().toISOString()
      };
      sendJson(res, 201, addMessage(message));
      return;
    }

    sendJson(res, 404, { error: "API rotası bulunamadı." });
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Bad request." });
  }
}

async function serveStatic(req, res, url) {
  const publicDir = await fs
    .access(distDir)
    .then(() => distDir)
    .catch(() => fallbackPublicDir);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(publicDir, requestedPath));

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    res.end(file);
  } catch {
    const fallback = await fs.readFile(path.join(publicDir, "index.html"));
    res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    res.end(fallback);
  }
}

async function requestHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url);
    return;
  }
  await serveStatic(req, res, url);
}

if (process.argv.includes("--check")) {
  try {
    const db = getPortfolio();
    const requiredKeys = ["profile", "skills", "projects", "messages"];
    const missing = requiredKeys.filter(key => !(key in db));
    if (missing.length) {
      throw new Error(`Missing db keys: ${missing.join(", ")}`);
    }
    console.log(`Proje sağlık kontrolü geçti. SQL database: ${sqlDbPath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
} else {
  http.createServer(requestHandler).listen(port, () => {
    console.log(`Portfolio Hub http://localhost:${port} adresinde çalışıyor.`);
  });
}
