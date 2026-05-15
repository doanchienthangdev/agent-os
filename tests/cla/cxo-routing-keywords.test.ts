// CLA Phase 2 (domain-analyst) auto-routes to a CxO based on keyword scan
// against knowledge/cla-routing-keywords.yaml. This test exercises the
// scan algorithm directly so we don't depend on LLM behavior.
//
// === Boilerplate state ===
// agent-os ships with ONE generic route ("general" → gpt + gps fallback) and
// `ambiguous_fallback: founder_decides`. These tests verify that minimal
// shape. When you add real CxO routes (cgo, cpo, cto, ...) extend the test
// suite with assertions like "routes a growth problem to cgo", etc.

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import yaml from "js-yaml";

interface Route {
  keywords: string[];
  cxo: string;
  fallback_role: string;
  notes?: string;
}

interface RoutingConfig {
  version: string;
  routes: Record<string, Route>;
  ambiguous_fallback: string;
}

const REPO = resolve(__dirname, "..", "..");
const ROUTING_PATH = join(REPO, "knowledge", "cla-routing-keywords.yaml");

let config: RoutingConfig;

beforeAll(() => {
  const text = readFileSync(ROUTING_PATH, "utf8");
  config = yaml.load(text) as RoutingConfig;
});

// Mirror the scan algorithm spec'd in domain-analyst/SKILL.md.
function scan(problemText: string, cfg: RoutingConfig): {
  matches: Record<string, string[]>;
  decision: { kind: "single"; domain: string } | { kind: "ambiguous"; reason: string };
} {
  const lower = problemText.toLowerCase();
  const matches: Record<string, string[]> = {};
  for (const [domain, route] of Object.entries(cfg.routes)) {
    const hits: string[] = [];
    for (const kw of route.keywords) {
      if (lower.includes(kw.toLowerCase())) hits.push(kw);
    }
    if (hits.length) matches[domain] = hits;
  }
  const domains = Object.keys(matches);
  if (domains.length === 0) return { matches, decision: { kind: "ambiguous", reason: "no_match" } };
  if (domains.length === 1) return { matches, decision: { kind: "single", domain: domains[0] } };

  // Multiple matches: pick max-hit; if tied, ambiguous.
  const sorted = domains.sort((a, b) => matches[b].length - matches[a].length);
  if (matches[sorted[0]].length > matches[sorted[1]].length) {
    return { matches, decision: { kind: "single", domain: sorted[0] } };
  }
  return { matches, decision: { kind: "ambiguous", reason: "tie" } };
}

describe("CLA routing keyword scan (boilerplate config)", () => {
  it("yaml loads with the expected top-level shape", () => {
    expect(config.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(config.routes).toBeTypeOf("object");
    // Boilerplate ships with founder_decides; orgs may switch to muse_panel or ceo_synthesis.
    expect(["muse_panel", "ceo_synthesis", "founder_decides"]).toContain(config.ambiguous_fallback);
  });

  it("has at least one route declared", () => {
    expect(Object.keys(config.routes).length).toBeGreaterThanOrEqual(1);
  });

  it("ships with the placeholder `general` route in boilerplate state", () => {
    // When you populate real routes you may keep `general` as a catch-all OR
    // remove it. If you remove it, drop this test or adapt to your routes.
    const generalRoute = config.routes["general"];
    if (!generalRoute) {
      // Org has customized routing; skip this assertion.
      return;
    }
    expect(generalRoute.cxo).toBe("gpt");
    expect(generalRoute.fallback_role).toBe("gps");
    expect(generalRoute.keywords.length).toBeGreaterThanOrEqual(1);
  });

  it("every route has a cxo + fallback_role + at least 1 keyword", () => {
    for (const [domain, route] of Object.entries(config.routes)) {
      expect(route.cxo, `${domain}.cxo`).toMatch(/^[a-z]{3,5}$/);
      expect(route.fallback_role, `${domain}.fallback_role`).toBeTypeOf("string");
      expect(route.keywords.length, `${domain}.keywords`).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns single match when problem text matches one route's keywords", () => {
    // Use a keyword from the first declared route.
    const firstDomain = Object.keys(config.routes)[0];
    const firstKeyword = config.routes[firstDomain].keywords[0];
    const r = scan(`We want to build a new ${firstKeyword}.`, config);
    expect(r.decision.kind).toBe("single");
  });

  it("returns ambiguous=no_match for fully-neutral text", () => {
    // Pick text with no overlap with any declared keyword.
    const r = scan("xyzzy plugh frobnicate", config);
    expect(r.decision).toEqual({ kind: "ambiguous", reason: "no_match" });
  });

  // === Additional tests to add when you populate real routes ===
  //
  // it("routes growth-flavored problem to cgo", () => {
  //   const r = scan("acquire 10 new customers per day from the funnel", config);
  //   expect(r.decision).toEqual({ kind: "single", domain: "growth" });
  //   expect(config.routes["growth"].cxo).toBe("cgo");
  // });
  //
  // it("routes product wedge problem to cpo", () => { ... });
  // it("routes code/migration problem to cto", () => { ... });
  // (etc.)
});
