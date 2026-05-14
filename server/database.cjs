const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const sqlDbPath = path.join(dataDir, "portfolio.db");
const schemaPath = path.join(dataDir, "schema.sql");
const seedPath = path.join(dataDir, "db.json");

let database;

function getDatabase() {
  if (!database) {
    fs.mkdirSync(dataDir, { recursive: true });
    database = new DatabaseSync(sqlDbPath);
    database.exec("PRAGMA foreign_keys = ON");
    database.exec(fs.readFileSync(schemaPath, "utf8"));
    seedIfEmpty();
  }
  return database;
}

function readSeed() {
  if (!fs.existsSync(seedPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(seedPath, "utf8"));
}

function seedIfEmpty() {
  const db = database;
  const count = db.prepare("SELECT COUNT(*) AS count FROM profile").get().count;
  if (count > 0) {
    return;
  }

  const seed = readSeed();
  if (!seed) {
    throw new Error("SQL database boş ve data/db.json seed dosyası bulunamadı.");
  }

  replacePortfolio(seed);
}

function replacePortfolio(portfolio) {
  const db = getDatabase();
  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM project_tech");
    db.exec("DELETE FROM projects");
    db.exec("DELETE FROM skills");
    db.exec("DELETE FROM messages");
    db.exec("DELETE FROM profile");

    upsertProfile(portfolio.profile);
    portfolio.skills.forEach(skill => upsertSkill(skill));
    portfolio.projects.forEach((project, index) => insertProject(project, index));
    portfolio.messages.forEach(message => insertMessage(message));

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function upsertProfile(profile) {
  getDatabase()
    .prepare(`
      INSERT INTO profile (id, name, title, location, email, summary, availability)
      VALUES (1, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        title = excluded.title,
        location = excluded.location,
        email = excluded.email,
        summary = excluded.summary,
        availability = excluded.availability
    `)
    .run(profile.name, profile.title, profile.location, profile.email, profile.summary, profile.availability);
}

function upsertSkill(skill) {
  getDatabase()
    .prepare(`
      INSERT INTO skills (id, name, category, level)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        category = excluded.category,
        level = excluded.level
    `)
    .run(skill.id, skill.name, skill.category, skill.level);
}

function insertProject(project, sortOrder = 0) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO projects (id, title, type, status, description, featured, source_path, repository, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    project.id,
    project.title,
    project.type,
    project.status,
    project.description,
    project.featured ? 1 : 0,
    project.sourcePath || null,
    project.repository || null,
    sortOrder
  );

  (project.tech || []).forEach((tech, index) => {
    db.prepare(`
      INSERT INTO project_tech (project_id, tech, sort_order)
      VALUES (?, ?, ?)
    `).run(project.id, tech, index);
  });
}

function addProject(project) {
  const db = getDatabase();
  const minSort = db.prepare("SELECT COALESCE(MIN(sort_order), 0) AS sortOrder FROM projects").get().sortOrder;
  db.exec("BEGIN");
  try {
    insertProject(project, minSort - 1);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return project;
}

function deleteProject(projectId) {
  const result = getDatabase().prepare("DELETE FROM projects WHERE id = ?").run(projectId);
  return result.changes > 0;
}

function insertMessage(message) {
  getDatabase()
    .prepare(`
      INSERT INTO messages (id, name, email, message, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(message.id, message.name, message.email, message.message, message.createdAt || message.created_at);
}

function addMessage(message) {
  insertMessage(message);
  return message;
}

function getPortfolio() {
  const db = getDatabase();
  const profile = db.prepare("SELECT name, title, location, email, summary, availability FROM profile WHERE id = 1").get();
  const skills = db.prepare("SELECT id, name, category, level FROM skills ORDER BY rowid").all();
  const projectRows = db.prepare(`
    SELECT id, title, type, status, description, featured, source_path AS sourcePath, repository
    FROM projects
    ORDER BY sort_order ASC, rowid ASC
  `).all();
  const techRows = db.prepare("SELECT project_id AS projectId, tech FROM project_tech ORDER BY sort_order ASC").all();
  const techByProject = new Map();
  techRows.forEach(row => {
    if (!techByProject.has(row.projectId)) {
      techByProject.set(row.projectId, []);
    }
    techByProject.get(row.projectId).push(row.tech);
  });
  const projects = projectRows.map(project => ({
    ...project,
    featured: Boolean(project.featured),
    tech: techByProject.get(project.id) || []
  }));
  const messages = db.prepare(`
    SELECT id, name, email, message, created_at AS createdAt
    FROM messages
    ORDER BY created_at DESC
  `).all();

  return { profile, skills, projects, messages };
}

function replaceAutoProjects(autoProjects) {
  const db = getDatabase();
  const minSort = db.prepare("SELECT COALESCE(MAX(sort_order), 0) AS sortOrder FROM projects WHERE id NOT LIKE 'auto-%'").get().sortOrder;

  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM projects WHERE id LIKE 'auto-%'").run();
    autoProjects.forEach((project, index) => insertProject(project, minSort + index + 1));
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

module.exports = {
  addMessage,
  addProject,
  deleteProject,
  getPortfolio,
  replaceAutoProjects,
  replacePortfolio,
  sqlDbPath
};
