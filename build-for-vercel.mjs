import { execSync } from "child_process";
import { cpSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = path.join(repoRoot, "artifacts", "english-grammar");
const artifactDist = path.join(artifactDir, "dist");
const outputDir = path.join(repoRoot, "dist");

console.log("Building from:", artifactDir);

execSync("pnpm run build", {
  cwd: artifactDir,
  stdio: "inherit",
  env: { ...process.env, PORT: "3000", BASE_PATH: "/" },
});

console.log("Copying output to:", outputDir);
rmSync(outputDir, { recursive: true, force: true });
cpSync(artifactDist, outputDir, { recursive: true });

console.log("Done. Output at:", outputDir);
