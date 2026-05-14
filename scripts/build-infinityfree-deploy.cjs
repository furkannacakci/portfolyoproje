const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const sourceDir = path.join(rootDir, "deploy", "infinityfree");
const outputDir = path.join(rootDir, "deploy", "infinityfree-public-html");

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === "README.md") {
      continue;
    }

    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }
    fs.copyFileSync(sourcePath, targetPath);
  }
}

if (!fs.existsSync(path.join(distDir, "index.html"))) {
  throw new Error("dist/index.html bulunamadi. Once npm run build calistir.");
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDirectory(distDir, outputDir);
copyDirectory(sourceDir, outputDir);

console.log(`InfinityFree upload klasoru hazir: ${outputDir}`);
console.log("Bu klasorun icindekileri htdocs/public_html icine yukle.");
