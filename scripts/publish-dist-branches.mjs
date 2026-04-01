/**
 * Publish each package's built dist/ folder to a branch: release/<pkg-dir>
 *
 * Usage:
 *   node scripts/publish-dist-branches.mjs [--push] [--pkg <pkg-dir>] [--prefix <branch-prefix>]
 *
 * Examples:
 *   node scripts/publish-dist-branches.mjs --push
 *   node scripts/publish-dist-branches.mjs --pkg unified-latex-util-parse --push
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PACKAGES_DIR = path.join(ROOT, "packages");

function exec(cmd, cwd = ROOT) {
    return execSync(cmd, {
        cwd,
        encoding: "utf8",
        stdio: "pipe",
    }).trim();
}

function copyDirSync(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function clearDirExceptGit(dir) {
    for (const entry of fs.readdirSync(dir)) {
        if (entry === ".git") continue;
        fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
    }
}

const args = process.argv.slice(2);
const doPush = args.includes("--push");
const pkgIdx = args.indexOf("--pkg");
const prefixIdx = args.indexOf("--prefix");

const pkgFilter = pkgIdx >= 0 ? args[pkgIdx + 1] : null;
const branchPrefix = prefixIdx >= 0 ? args[prefixIdx + 1] : "release";

if (!branchPrefix) {
    console.error("Missing value for --prefix");
    process.exit(1);
}

let packages = fs
    .readdirSync(PACKAGES_DIR)
    .filter((dir) =>
        fs.existsSync(path.join(PACKAGES_DIR, dir, "dist", "package.json"))
    )
    .sort();

if (pkgFilter) {
    packages = packages.filter((p) => p === pkgFilter);
}

if (packages.length === 0) {
    console.error("No packages found with dist/package.json. Run build/package first.");
    process.exit(1);
}

let gitUser = "github-actions[bot]";
let gitEmail = "41898282+github-actions[bot]@users.noreply.github.com";
try {
    gitUser = exec("git config user.name") || gitUser;
    gitEmail = exec("git config user.email") || gitEmail;
} catch {}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ul-publish-"));
const rootUrl =
    "file://" + ROOT.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "/$1:");

console.log(`Publishing ${packages.length} package branch(es) with prefix '${branchPrefix}/'...`);

try {
    exec("git init", tmpDir);
    exec(`git remote add origin \"${rootUrl}\"`, tmpDir);

    for (const pkg of packages) {
        const branch = `${branchPrefix}/${pkg}`;
        const distDir = path.join(PACKAGES_DIR, pkg, "dist");
        const pkgJson = JSON.parse(
            fs.readFileSync(path.join(distDir, "package.json"), "utf8")
        );

        process.stdout.write(`  ${branch} (${pkgJson.name}@${pkgJson.version}) ... `);

        exec(`git checkout --orphan \"${branch}\"`, tmpDir);
        try {
            exec("git rm -rf --cached .", tmpDir);
        } catch {}

        clearDirExceptGit(tmpDir);
        copyDirSync(distDir, tmpDir);

        exec("git add -A", tmpDir);
        exec(
            `git -c user.name=\"${gitUser}\" -c user.email=\"${gitEmail}\" commit -m \"dist: ${pkg} v${pkgJson.version}\"`,
            tmpDir
        );
        exec(`git push --force origin \"${branch}:refs/heads/${branch}\"`, tmpDir);

        process.stdout.write("done\n");
    }
} finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
}

if (doPush) {
    // Push all branches to the remote in a single operation to avoid
    // repeated handshakes that can cause transient server-side failures.
    const refspecs = packages
        .map((pkg) => {
            const branch = `${branchPrefix}/${pkg}`;
            return `\"${branch}:refs/heads/${branch}\"`;
        })
        .join(" ");
    exec(`git push --force origin ${refspecs}`, ROOT);
}

console.log("Done.");
