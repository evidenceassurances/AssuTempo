/**
 * Audit du maillage interne : parcourt tous les HTML prerendus de dist/,
 * extrait les <a href> internes et produit un rapport "liens entrants par
 * page" + liens casses. Aucune dependance, Node natif.
 *
 * Usage :
 *   node scripts/link-graph.mjs               -> tableau lisible sur stdout
 *   node scripts/link-graph.mjs --json out.json -> dump JSON complet
 *
 * Un lien ne compte que s'il est present dans le HTML statique : c'est
 * exactement ce que voit un crawler sans JavaScript.
 */

import path from 'node:path';
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');

if (!existsSync(dist)) {
  console.error('dist/ introuvable : lance `npm run build` d\'abord.');
  process.exit(1);
}

/* ── 1. Collecte des pages prerendues ──────────────────────────────────── */
function collectPages(dir, routePrefix = '') {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'assets' || entry === '.vite') continue;
      pages.push(...collectPages(full, `${routePrefix}/${entry}`));
    } else if (entry === 'index.html') {
      pages.push({ route: routePrefix || '/', file: full });
    }
  }
  return pages;
}

const pages = collectPages(dist).sort((a, b) => a.route.localeCompare(b.route));
const routeSet = new Set(pages.map((p) => p.route));

/* ── 2. Extraction des <a href> internes ───────────────────────────────── */
function normalize(href) {
  let h = href.replace(/^https?:\/\/(www\.)?assutempo\.fr/, '');
  if (h === '') h = '/';
  if (!h.startsWith('/')) return null;          // externe ou relatif exotique
  if (h.startsWith('//')) return null;          // protocole relatif = externe
  h = h.split('#')[0].split('?')[0];
  if (h === '') h = '/';
  if (h.length > 1 && h.endsWith('/')) h = h.slice(0, -1);
  if (/\.(xml|txt|png|svg|ico|pdf|json)$/.test(h)) return null; // fichiers
  return h;
}

const A_TAG = /<a\b[^>]*\bhref="([^"]+)"[^>]*>/gi;

const outbound = new Map();   // route -> [targets] (toutes occurrences)
const inbound = new Map();    // target -> Map(source -> count)
for (const page of pages) {
  const html = readFileSync(page.file, 'utf-8');
  const targets = [];
  for (const match of html.matchAll(A_TAG)) {
    const t = normalize(match[1]);
    if (t) targets.push(t);
  }
  outbound.set(page.route, targets);
  for (const t of targets) {
    if (t === page.route) continue; // auto-lien : ignore pour les entrants
    if (!inbound.has(t)) inbound.set(t, new Map());
    const m = inbound.get(t);
    m.set(page.route, (m.get(page.route) ?? 0) + 1);
  }
}

/* ── 3. Sitemap et liens casses ────────────────────────────────────────── */
const sitemapFile = path.join(dist, 'sitemap.xml');
const sitemapRoutes = existsSync(sitemapFile)
  ? [...readFileSync(sitemapFile, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => normalize(m[1]))
      .filter(Boolean)
  : [];

const brokenLinks = [];
for (const [route, targets] of outbound) {
  for (const t of new Set(targets)) {
    if (!routeSet.has(t)) brokenLinks.push({ from: route, to: t });
  }
}

/* ── 4. Rapport ────────────────────────────────────────────────────────── */
const totalInternal = [...outbound.values()].reduce((s, t) => s + t.length, 0);
const totalCrossPage = [...inbound.values()]
  .reduce((s, m) => s + [...m.values()].reduce((a, b) => a + b, 0), 0);

const rows = pages.map(({ route }) => {
  const inMap = inbound.get(route) ?? new Map();
  return {
    route,
    inboundPages: inMap.size,
    inboundLinks: [...inMap.values()].reduce((a, b) => a + b, 0),
    outboundLinks: (outbound.get(route) ?? []).length,
  };
}).sort((a, b) => a.inboundLinks - b.inboundLinks || a.route.localeCompare(b.route));

const orphans = sitemapRoutes.filter(
  (r) => ((inbound.get(r)?.size) ?? 0) === 0,
);

const report = {
  generatedFrom: 'dist/',
  pages: pages.length,
  totalInternalAnchors: totalInternal,
  totalCrossPageLinks: totalCrossPage,
  sitemapUrls: sitemapRoutes.length,
  orphans,
  brokenLinks,
  rows,
  inboundDetail: Object.fromEntries(
    [...inbound.entries()].map(([k, m]) => [k, Object.fromEntries(m)]),
  ),
};

const jsonIdx = process.argv.indexOf('--json');
if (jsonIdx !== -1 && process.argv[jsonIdx + 1]) {
  writeFileSync(process.argv[jsonIdx + 1], JSON.stringify(report, null, 2));
  console.log(`Rapport JSON ecrit : ${process.argv[jsonIdx + 1]}`);
}

console.log(`\nPages prerendues : ${pages.length}`);
console.log(`Ancres internes totales : ${totalInternal} (dont ${totalCrossPage} inter-pages)`);
console.log(`URLs sitemap : ${sitemapRoutes.length} | orphelines : ${orphans.length}`);
if (orphans.length) console.log('  Orphelines :', orphans.join(', '));
console.log(`Liens casses : ${brokenLinks.length}`);
for (const b of brokenLinks) console.log(`  ${b.from} -> ${b.to}`);

console.log('\nLiens entrants par page (croissant) :');
const pad = (s, n) => String(s).padEnd(n);
console.log(pad('PAGE', 62) + pad('IN(pages)', 11) + pad('IN(liens)', 11) + 'OUT');
for (const r of rows) {
  console.log(pad(r.route, 62) + pad(r.inboundPages, 11) + pad(r.inboundLinks, 11) + r.outboundLinks);
}
