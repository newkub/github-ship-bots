#!/usr/bin/env bun
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const cmd = args[0] || "update";

function run(command: string, args: string[], cwd?: string) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0 && result.status !== null) {
    process.exit(result.status);
  }
}

function hasFlag(name: string) {
  const index = args.indexOf(name);
  if (index === -1) return false;
  args.splice(index, 1);
  return true;
}

function getFlag(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  args.splice(index, 2);
  return value;
}

function tazeMode(type: string): string {
  switch (type) {
    case "patch":
      return "patch";
    case "minor":
      return "minor";
    case "major":
      return "major";
    case "all":
    default:
      return "latest";
  }
}

function update() {
  const type = getFlag("--type") || "all";
  const dryRun = hasFlag("--dry-run");
  const write = hasFlag("--write");
  const recursive = hasFlag("--recursive");
  const interactive = hasFlag("--interactive");

  const tazeArgs = [tazeMode(type)];
  if (write && !dryRun) tazeArgs.push("--write");
  if (recursive) tazeArgs.push("--recursive");
  if (interactive) tazeArgs.push("--interactive");

  if (dryRun) {
    console.log(`[updatedeps] dry-run update --type ${type}`);
  } else {
    console.log(`[updatedeps] update --type ${type}`);
  }
  run("bunx", ["taze", ...tazeArgs]);

  if (write && !dryRun) {
    console.log("[updatedeps] bun install");
    run("bun", ["install"]);
  }
}

function retest() {
  const temp = hasFlag("--temp");
  if (temp) {
    console.log("[updatedeps] retest --temp is not supported in this project");
    return;
  }
  console.log("[updatedeps] retest");
  run("bun", ["install"]);
  run("bun", ["run", "lint"]);
  run("bun", ["run", "test"]);
  run("bun", ["run", "build"]);
}

function refactor() {
  const custom = getFlag("--command");
  if (custom) {
    const parts = custom.split(" ");
    const command = parts[0];
    if (!command) {
      console.error("[updatedeps] refactor --command cannot be empty");
      process.exit(1);
    }
    run(command, parts.slice(1));
  } else {
    console.log("[updatedeps] refactor (lint)");
    run("bun", ["run", "lint"]);
  }
}

function commit() {
  const message = getFlag("-m") || "chore: update dependencies";
  const push = hasFlag("--push");
  run("git", ["add", "-A"]);
  run("git", ["commit", "-m", message]);
  if (push) {
    run("git", ["push", "origin", "main"]);
  }
}

function convertSubmodules() {
  const path = args[1];
  const remote = getFlag("--remote");
  if (!path || !remote) {
    console.error("[updatedeps] convert-submodules <path> --remote <url>");
    process.exit(1);
  }
  console.log("[updatedeps] convert-submodules is a manual operation in this project");
  console.log(`  path: ${path}`);
  console.log(`  remote: ${remote}`);
}

switch (cmd) {
  case "update":
    update();
    break;
  case "retest":
    retest();
    break;
  case "refactor":
    refactor();
    break;
  case "commit":
    commit();
    break;
  case "convert-submodules":
    convertSubmodules();
    break;
  default:
    console.log("Usage: updatedeps [update|retest|refactor|commit|convert-submodules]");
    process.exit(1);
}
