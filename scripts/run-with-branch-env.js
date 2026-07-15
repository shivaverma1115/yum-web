const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function currentBranch() {
    try {
        return execSync("git branch --show-current", { encoding: "utf8" }).trim();
    } catch {
        return "staging";
    }
}

const branch = currentBranch();
const envFile = branch === "main" ? ".env.main" : ".env.stage";
const envPath = path.join(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
    console.error(`Missing ${envFile}. Create it before running.`);
    process.exit(1);
}

// Load KEY=VALUE into process.env
const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
}

console.log(`Using ${envFile} (branch: ${branch || "unknown"})`);

const args = process.argv.slice(2); // e.g. ["next", "dev"]
const child = spawn(args[0], args.slice(1), {
    stdio: "inherit",
    shell: true,
    env: process.env,
});
child.on("exit", (code) => process.exit(code ?? 0));