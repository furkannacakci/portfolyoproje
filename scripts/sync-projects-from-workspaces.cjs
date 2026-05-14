const fs = require("fs");
const path = require("path");
const os = require("os");

const rootDir = path.resolve(__dirname, "..");
const dbPath = path.join(rootDir, "data", "db.json");
const codeWorkspaceStorage = path.join(
  os.homedir(),
  "Library",
  "Application Support",
  "Code",
  "User",
  "workspaceStorage"
);

const manualProjectIds = new Set(["project-campus", "project-clinic", "project-portfolio"]);
const projectOverrides = {
  myhospitaltaycoon: {
    title: "MyHospitalTycoon",
    description: "MyHospitalTycoon, oyuncunun kendi hastanesini yönetip büyüttüğü bir tycoon simülasyonu olarak tasarlanıyor. Klinik akışı, hasta kabulü, oda geliştirmeleri ve gelir yönetimi gibi sistemlerle hastaneyi adım adım geliştirmeye odaklanıyor."
  },
  pitlane: {
    description: "Pitlane, motor ve araba toplulukları için geliştirilen bir sürüş uygulaması fikridir. Kullanıcılar rota planlayabilir, sohbet odalarında buluşabilir ve sürüş sırasında gruptaki diğer kullanıcıları harita üzerinde canlı takip edebilir."
  },
  "urbantransit-recovery": {
    title: "Begum Midwife Clinic",
    description: "Begum Midwife Clinic, Unity ile geliştirilen oynanabilir bir klinik simülasyonu prototipidir. Oyuncu klinikte hastaları karşılar, şikayetlerine göre doğru odaya yönlendirir, işlemleri tamamlar ve kazandığı gelirle çalışan, makine ve oda geliştirmeleri yapar."
  },
  "task-management-api": {
    description: "Task Management API, Express ile geliştirilen basit bir görev yönetimi servisidir. Görev oluşturma, listeleme, güncelleme ve silme endpointleriyle temel CRUD mantığını backend tarafında göstermeyi amaçlar."
  }
};
const extraProjectRoots = [
  path.join(os.homedir(), "Documents", "task-management-api"),
  path.join(os.homedir(), "Documents", "Playground", "urbantransit-recovery")
];

function fileUrlToPath(folder) {
  if (!folder || !folder.startsWith("file://")) {
    return null;
  }
  return decodeURIComponent(folder.replace("file://", ""));
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function getCodeWorkspaceFolders() {
  if (!fs.existsSync(codeWorkspaceStorage)) {
    return [];
  }

  return fs
    .readdirSync(codeWorkspaceStorage)
    .map(dir => path.join(codeWorkspaceStorage, dir, "workspace.json"))
    .filter(filePath => fs.existsSync(filePath))
    .map(filePath => fileUrlToPath(readJson(filePath)?.folder))
    .filter(Boolean);
}

function hasAny(root, candidates) {
  return candidates.some(candidate => fs.existsSync(path.join(root, candidate)));
}

function listFiles(root, maxDepth = 3) {
  const results = [];

  function walk(current, depth) {
    if (depth > maxDepth) {
      return;
    }

    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (["node_modules", ".git", "Library", "dist", "build"].includes(entry.name)) {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else {
        results.push(fullPath);
      }
    }
  }

  walk(root, 0);
  return results;
}

function detectTech(root, packageJson) {
  const files = listFiles(root, 2);
  const deps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies
  };
  const tech = new Set();

  if (packageJson) {
    tech.add("Node.js");
  }
  if (deps.react) tech.add("React");
  if (deps.vite) tech.add("Vite");
  if (deps.typescript) tech.add("TypeScript");
  if (deps.tailwindcss) tech.add("Tailwind CSS");
  if (deps.express) tech.add("Express");
  if (files.some(file => file.endsWith(".csproj"))) tech.add("C#");
  if (hasAny(root, ["Assets", "ProjectSettings", "Packages"])) tech.add("Unity");
  if (files.some(file => file.endsWith(".html"))) tech.add("HTML");
  if (files.some(file => file.endsWith(".css"))) tech.add("CSS");
  if (files.some(file => file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".tsx"))) tech.add("JavaScript");

  return Array.from(tech).slice(0, 8);
}

function titleFromName(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getGitRemote(root) {
  const configPath = path.join(root, ".git", "config");
  if (!fs.existsSync(configPath)) {
    return "";
  }
  const config = fs.readFileSync(configPath, "utf8");
  const match = config.match(/url = (.+)/);
  return match ? match[1].trim() : "";
}

function makeProject(root) {
  const packageJson = readJson(path.join(root, "package.json"));
  const name = packageJson?.name || path.basename(root);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const override = projectOverrides[slug] || projectOverrides[path.basename(root).toLowerCase()];
  const tech = detectTech(root, packageJson);
  const remote = getGitRemote(root);
  const isUnity = tech.includes("Unity");
  const isApi = tech.includes("Express") || name.toLowerCase().includes("api");

  return {
    id: `auto-${slug}`,
    title: override?.title || titleFromName(name),
    type: isUnity ? "Oyun / Simülasyon Projesi" : isApi ? "Backend API" : "Web Projesi",
    status: "Geliştiriliyor",
    description: override?.description
      || packageJson?.description?.trim()
      || `${titleFromName(name)} projesi VS Code çalışma alanlarından otomatik olarak portfolio sitesine eklendi.`,
    tech: tech.length ? tech : ["Proje Geliştirme"],
    featured: true,
    sourcePath: root,
    repository: remote
  };
}

const candidateRoots = Array.from(new Set([...getCodeWorkspaceFolders(), ...extraProjectRoots]))
  .filter(Boolean)
  .filter(root => fs.existsSync(root))
  .filter(root => path.resolve(root) !== rootDir)
  .filter(root => hasAny(root, ["package.json", "Assets", "ProjectSettings", ".git"]));

const db = readJson(dbPath);
if (!db) {
  throw new Error("data/db.json okunamadı.");
}

const autoProjects = candidateRoots.map(makeProject);
const manualProjects = db.projects.filter(project => manualProjectIds.has(project.id) || !String(project.id).startsWith("auto-"));
const existingManualByTitle = new Set(manualProjects.map(project => project.title.toLowerCase()));
const filteredAutoProjects = autoProjects.filter(project => !existingManualByTitle.has(project.title.toLowerCase()));

db.projects = [...manualProjects, ...filteredAutoProjects];
fs.writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);

console.log(`Portfolio proje listesi güncellendi. Otomatik proje sayısı: ${filteredAutoProjects.length}`);
filteredAutoProjects.forEach(project => {
  console.log(`- ${project.title} (${project.type})`);
});
