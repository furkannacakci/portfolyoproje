const { execFileSync } = require("child_process");

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    stdio: options.capture ? "pipe" : "inherit",
    encoding: "utf8"
  });
}

function hasRemote() {
  try {
    const remotes = run("git", ["remote"], { capture: true });
    return remotes.split(/\s+/).includes("origin");
  } catch {
    return false;
  }
}

function hasChanges() {
  const status = run("git", ["status", "--short"], { capture: true });
  return status.trim().length > 0;
}

run("npm", ["run", "sync:projects"]);
run("npm", ["test"]);

if (!hasChanges()) {
  console.log("Commitlenecek değişiklik yok.");
  process.exit(0);
}

run("git", ["add", "."]);
run("git", ["commit", "-m", "Update portfolio site"]);

if (!hasRemote()) {
  console.log("origin remote tanımlı değil. GitHub repo URL'si eklenince push otomatik çalışacak.");
  process.exit(0);
}

run("git", ["push", "-u", "origin", "HEAD"]);
