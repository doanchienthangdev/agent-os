#!/usr/bin/env node
/**
 * scrub.cjs — boilerplate-extraction substitution pass.
 *
 * Walks agent-os/ and replaces every Ritsu-coupled literal with a ${PLACEHOLDER}.
 * Intended to be run ONCE during initial extraction. After this and the manual
 * stub-rewrites for TEMPLATE_HEAVY files, the boilerplate is identity-free.
 *
 * The init wizard (scripts/init.cjs) does the REVERSE pass: ${PLACEHOLDER} → user value.
 *
 * Usage:
 *   node scripts/_extract/scrub.cjs           # apply, write report
 *   node scripts/_extract/scrub.cjs --dry-run # report only, no writes
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const DRY_RUN = process.argv.includes("--dry-run");

// Files explicitly skipped — handled by manual stub-rewrite in Phase 3B, or fundamentally rewritten in Phase 5.
const SKIP_FILES = new Set([
  "00-charter/charter.md",
  "00-charter/product.md",
  "00-charter/brand_voice.md",
  "00-charter/founder-profile.md",
  "00-charter/transparency.md",
  "governance/ROLES.md",
  "governance/IDENTITY.md",
  "README.md",
  "CLAUDE.md",
  "TODOS.md",
  "package.json",
  "01-growth/README.md",
  "02-customer/README.md",
  "03-product/README.md",
  "04-content/README.md",
  "06-finance/README.md",
  "07-compliance/README.md",
  "08-integrations/README.md",
  // scripts/_extract is our own tooling — don't scrub ourselves
  "scripts/_extract/scrub.cjs",
]);

// Directories never walked
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "_build",
  "coverage",
  "runtime",
  "raw",
  ".archives",
  "scripts/_extract",
]);

// File extensions we substitute in. Anything else is treated as binary/keep-as-is.
const TEXT_EXTS = new Set([
  ".md", ".yaml", ".yml", ".json", ".ts", ".tsx", ".js", ".cjs", ".mjs",
  ".sql", ".sh", ".env", ".example", ".toml", ".txt", ".gitignore", "",
]);

// Specific filenames (no extension) we DO substitute in.
const TEXT_NAMES = new Set([".env.example", ".gitignore", ".nvmrc"]);

// Substitutions — order matters. Longer/more-specific patterns first.
const SUBSTITUTIONS = [
  // Literal Supabase project IDs
  { find: /mntobbmieuoaxipnjaau/g, replace: "${SUPABASE_OPS_PROJECT_REF}", note: "ops project ref" },
  { find: /ixfvqxnohlmayzuesrrq/g, replace: "${SUPABASE_PRODUCT_PROJECT_REF}", note: "product project ref" },

  // GitHub owner+repo compound (before parts)
  { find: /doanchienthangdev\/ritsu-works/g, replace: "${GITHUB_OWNER}/${ORG_REPO_NAME}", note: "github owner/repo" },
  { find: /doanchienthangdev/g, replace: "${GITHUB_OWNER}", note: "github owner" },

  // Founder name
  { find: /Doan Chien Thang/g, replace: "${FOUNDER_NAME}", note: "founder name" },

  // URLs — longer first
  { find: /https:\/\/dashboard\.ritsu\.ai/g, replace: "https://dashboard.${PRODUCT_DOMAIN}", note: "dashboard url" },
  { find: /https:\/\/mcp\.ritsu\.ai/g, replace: "https://mcp.${PRODUCT_DOMAIN}", note: "mcp url" },
  { find: /https:\/\/ritsu\.ai/g, replace: "https://${PRODUCT_DOMAIN}", note: "primary url" },
  { find: /dashboard\.ritsu\.ai/g, replace: "dashboard.${PRODUCT_DOMAIN}", note: "dashboard host" },
  { find: /mcp\.ritsu\.ai/g, replace: "mcp.${PRODUCT_DOMAIN}", note: "mcp host" },
  { find: /@ritsu\.ai/g, replace: "@${PRIMARY_EMAIL_DOMAIN}", note: "email domain" },
  { find: /ritsu\.ai/g, replace: "${PRODUCT_DOMAIN}", note: "bare domain catchall" },

  // Event namespaces (keep dot, replace prefix)
  { find: /\britsu\.customer\./g, replace: "${ORG_EVENT_NS}.customer.", note: "event ns customer" },
  { find: /\britsu\.capability\./g, replace: "${ORG_EVENT_NS}.capability.", note: "event ns capability" },
  { find: /\britsu\.internal\b/g, replace: "${ORG_EVENT_NS}.internal", note: "event ns internal" },
  { find: /\britsu\.(read|write_limited|write)\b/g, replace: "${ORG_EVENT_NS}.$1", note: "tool ns" },

  // Tagline
  { find: /B2C EdTech AI tutor/g, replace: "${ORG_TAGLINE}", note: "tagline" },
  { find: /B2C EdTech/g, replace: "${ORG_CATEGORY}", note: "category short" },

  // Supabase project NAMES (not refs)
  { find: /\britsu-ops\b/g, replace: "${SUPABASE_OPS_PROJECT_NAME}", note: "ops project name" },
  { find: /\britsu_ops\b/g, replace: "${SUPABASE_OPS_PROJECT_NAME_SNAKE}", note: "ops project name snake" },

  // Repo name (slug)
  { find: /\britsu-works\b/g, replace: "${ORG_REPO_NAME}", note: "repo name" },

  // Bot accounts
  { find: /\britsu-(gps|growth|support|content|ts|backoffice|reviewer|etl|drafter|safety)-bot\b/g, replace: "${ORG_SLUG}-$1-bot", note: "bot account" },

  // Env var prefix (used in .env.example and code)
  { find: /\bRITSU_/g, replace: "AGENT_OS_", note: "env var prefix" },

  // Region & timezone
  { find: /\bap-south-1\b/g, replace: "${OPS_REGION}", note: "region code" },
  { find: /South Asia \/ Mumbai/g, replace: "${OPS_REGION_HUMAN}", note: "region human" },
  { find: /\bAsia\/Ho_Chi_Minh\b/g, replace: "${FOUNDER_TIMEZONE}", note: "tz" },

  // Locale (only the explicit code; "Vietnamese" prose left for manual review)
  { find: /\bvi-VN\b/g, replace: "${PRIMARY_LOCALE_FULL}", note: "locale full" },

  // Possessive + assistant (before bare Ritsu)
  { find: /Ritsu Assistant/g, replace: "${PRODUCT_NAME} Assistant", note: "assistant brand" },
  { find: /Ritsu Works/g, replace: "${ORG_NAME} Works", note: "ritsu works prose" },
  { find: /Ritsu's/g, replace: "${ORG_NAME}'s", note: "possessive" },

  // Bare Ritsu — last catchall, capitalized
  { find: /\bRitsu\b/g, replace: "${ORG_NAME}", note: "bare Ritsu" },

  // Lowercase ritsu — handle separately and carefully (skip when in URL/namespace context)
  // After all URL/namespace/repo/ops_name substitutions, remaining lowercase `ritsu` is usually
  // either a stray prose reference or part of a non-matched compound. Use cautious word-boundary.
  { find: /\britsu\b/g, replace: "${ORG_SLUG}", note: "bare ritsu lowercase" },
];

let totalReplacements = 0;
let filesTouched = 0;
const report = [];

function walk(dir, rel = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_DIRS.has(relPath)) continue;
      walk(fullPath, relPath);
    } else if (entry.isFile()) {
      processFile(fullPath, relPath);
    }
  }
}

function processFile(fullPath, relPath) {
  if (SKIP_FILES.has(relPath)) return;
  const ext = path.extname(fullPath);
  const base = path.basename(fullPath);
  if (!TEXT_EXTS.has(ext) && !TEXT_NAMES.has(base)) return;

  let content;
  try {
    content = fs.readFileSync(fullPath, "utf8");
  } catch (err) {
    return; // probably binary
  }
  // Skip files that look binary (NUL byte)
  if (content.indexOf("\0") !== -1) return;

  let modified = content;
  const fileReplacements = {};

  for (const sub of SUBSTITUTIONS) {
    const matches = modified.match(sub.find);
    if (matches && matches.length > 0) {
      fileReplacements[sub.note] = (fileReplacements[sub.note] || 0) + matches.length;
      modified = modified.replace(sub.find, sub.replace);
    }
  }

  if (modified !== content) {
    const total = Object.values(fileReplacements).reduce((a, b) => a + b, 0);
    totalReplacements += total;
    filesTouched += 1;
    report.push({ file: relPath, count: total, breakdown: fileReplacements });
    if (!DRY_RUN) {
      fs.writeFileSync(fullPath, modified, "utf8");
    }
  }
}

walk(ROOT);

// Print report
console.log("=".repeat(72));
console.log(`scrub.cjs ${DRY_RUN ? "(dry-run)" : ""} — agent-os boilerplate extraction`);
console.log("=".repeat(72));
console.log(`Files touched : ${filesTouched}`);
console.log(`Total replaces: ${totalReplacements}`);
console.log("");
console.log("Top files by replacement count:");
report
  .sort((a, b) => b.count - a.count)
  .slice(0, 30)
  .forEach((r) => {
    const breakdown = Object.entries(r.breakdown)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    console.log(`  ${String(r.count).padStart(4)} ${r.file}  [${breakdown}]`);
  });
console.log("");
if (DRY_RUN) {
  console.log("DRY RUN — no files written. Remove --dry-run to apply.");
} else {
  console.log("Applied. Review _build/scrub-report.txt for full audit.");
  const buildDir = path.join(ROOT, "_build");
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
  const reportPath = path.join(buildDir, "scrub-report.txt");
  const reportText =
    `scrub.cjs report — ${new Date().toISOString()}\n` +
    `files=${filesTouched}, replaces=${totalReplacements}\n\n` +
    report
      .sort((a, b) => b.count - a.count)
      .map((r) => `${r.count.toString().padStart(4)} ${r.file}  [${Object.entries(r.breakdown).map(([k,v])=>k+"="+v).join(", ")}]`)
      .join("\n");
  fs.writeFileSync(reportPath, reportText, "utf8");
  console.log(`Full report: ${reportPath}`);
}
