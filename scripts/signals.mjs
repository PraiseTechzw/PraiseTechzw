#!/usr/bin/env node
/**
 * Generates assets/signals-light.svg and assets/signals-dark.svg from live
 * GitHub data.
 *
 * Why this exists: the usual profile stats cards are third-party services that
 * rate-limit and render as broken images. These are committed files, so they
 * always load, cost one request, and match the rest of the brand.
 *
 * Usage:  GITHUB_TOKEN=... node scripts/signals.mjs
 * Without a token it still works, minus the contribution count.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const USER = "PraiseTechzw";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "PraiseTechzw-signals",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function rest(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function graphql(query) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

const nf = new Intl.NumberFormat("en-US");

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Editorial plate: four figures, one accent block, nothing else. */
function plate(theme, stats) {
  const t =
    theme === "dark"
      ? { bg: "#0d1117", ink: "#e9dfcc", soft: "#8d94a3" }
      : { bg: "#e6dbc7", ink: "#062b8a", soft: "#4a63a0" };

  const W = 880;
  const H = 148;
  const cols = [40, 250, 460, 670];
  const cells = stats.slice(0, 4);

  const numbers = cells
    .map((c, i) => `  <text x="${cols[i]}" y="72" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="${t.ink}" letter-spacing="-1.5">${esc(c.value)}</text>`)
    .join("\n");

  const labels = cells
    .map((c, i) => {
      const lines = c.label.split("\n");
      const y0 = 100;
      return lines
        .map((line, j) => `  <text x="${cols[i]}" y="${y0 + j * 18}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="13.5" fill="${t.soft}">${esc(line)}</text>`)
        .join("\n");
    })
    .join("\n");

  const langs = esc(stats.map((s) => s.stack).filter(Boolean)[0] || "");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="GitHub signals for ${esc(USER)}: ${esc(cells.map((c) => `${c.value} ${c.label.replace(/\n/g, " ")}`).join(", "))}">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
${numbers}
${labels}
  <text x="40" y="138" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="13.5" fill="${t.soft}">${langs}</text>
</svg>
`;
}

async function main() {
  const repos = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await rest(`/users/${USER}/repos?per_page=100&page=${page}&sort=pushed`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }

  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((n, r) => n + r.stargazers_count, 0);

  const langs = new Map();
  for (const r of own) if (r.language) langs.set(r.language, (langs.get(r.language) || 0) + 1);
  const stack = [...langs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name)
    .join(" · ");

  let contributions = null;
  const gql = await graphql(
    `query { user(login: "${USER}") { contributionsCollection { contributionCalendar { totalContributions } totalPullRequestContributions } } }`,
  ).catch(() => null);
  if (gql?.user) {
    contributions = gql.user.contributionsCollection.contributionCalendar.totalContributions;
  }
  const prs = gql?.user?.contributionsCollection?.totalPullRequestContributions ?? null;

  const stats = [
    {
      value: contributions === null ? nf.format(own.length) : nf.format(contributions),
      label: contributions === null ? "public\nrepositories" : "contributions\nin the last year",
    },
    { value: nf.format(own.length), label: "public\nrepositories" },
    { value: nf.format(stars), label: "stars\nearned" },
    { value: prs === null ? String(new Date().getFullYear()) : nf.format(prs), label: prs === null ? "building\nin public" : "pull\nrequests" },
  ].map((s, i) => ({ ...s, stack: i === 0 ? stack : undefined }));

  mkdirSync(join(root, "assets"), { recursive: true });
  for (const theme of ["light", "dark"]) {
    const out = join(root, "assets", `signals-${theme}.svg`);
    writeFileSync(out, plate(theme, stats));
    console.log(`wrote assets/signals-${theme}.svg`);
  }

  // The showcase reads the same figures, so the README and the site cannot drift.
  const summary = {
    contributions,
    repositories: own.length,
    stars,
    pullRequests: prs,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  mkdirSync(join(root, "site"), { recursive: true });
  writeFileSync(join(root, "site", "signals.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log("wrote site/signals.json");

  console.log(stats.map((s) => `${s.value} ${s.label.replace(/\n/g, " ")}`).join(" | "));
}

main().catch((err) => {
  console.error(`signals: ${err.message}`);
  process.exit(1);
});
