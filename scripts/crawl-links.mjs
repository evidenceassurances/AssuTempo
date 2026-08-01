/**
 * Crawl du maillage interne (chantier du 1er aout 2026).
 *
 * Parcourt tout dist/ (build pre-rendu final), extrait chaque <a href="...">
 * interne du HTML BRUT (jamais de JS execute : c'est ce que Google recoit),
 * et produit un rapport liens entrants / liens sortants par page.
 *
 * Usage : npm run build && node scripts/crawl-links.mjs [--out fichier.json]
 * Sans --out, le rapport est imprime en JSON sur stdout.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!existsSync(dist)) {
  console.error('dist/ introuvable : lancez `npm run build` avant ce script.');
  process.exit(1);
}

// ── Liste tous les index.html de dist/ (recursif) ───────────────────────────
function listHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'assets') continue;
      listHtmlFiles(full, acc);
    } else if (entry === 'index.html' || entry === '404.html') {
      acc.push(full);
    }
  }
  return acc;
}

function fileToRoute(file) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404';
  return `/${rel.replace(/\/index\.html$/, '')}`;
}

const files = listHtmlFiles(dist);
const routes = new Set(files.map(fileToRoute));

// ── Extraction des <a href="..."> internes (regex sur le HTML brut,
//    volontairement simple : pas de dependance DOM, le format est stable) ──
const HREF_RE = /<a\b[^>]*\bhref=["']([^"'#][^"']*)["'][^>]*>/gi;

function normalizeHref(href) {
  // Ignore externes, mailto, tel, ancres pures.
  if (/^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  let clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (!clean.startsWith('/')) return null; // relatif improbable dans ce build
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);
  return clean || '/';
}

const outLinks = {}; // route -> Set(targets)
const inLinks = {};  // route -> Set(sources)
for (const r of routes) { outLinks[r] = new Set(); inLinks[r] = new Set(); }

const brokenLinks = [];

for (const file of files) {
  const route = fileToRoute(file);
  const html = readFileSync(file, 'utf-8');
  let m;
  HREF_RE.lastIndex = 0;
  while ((m = HREF_RE.exec(html))) {
    const target = normalizeHref(m[1]);
    if (!target) continue;
    outLinks[route].add(target);
    // /carte/:pays est une route dynamique : toute cible /carte/xxx est valide
    // si /carte/xxx a ete prerendue (verifie ci-dessous), sinon signalee.
    if (routes.has(target)) {
      inLinks[target] = inLinks[target] || new Set();
      inLinks[target].add(route);
    } else {
      brokenLinks.push({ from: route, to: target });
    }
  }
}

const report = {
  generatedAt: null, // rempli par l'appelant si besoin (Date.now() interdit dans un script Workflow)
  totalRoutes: routes.size,
  totalInternalLinks: Object.values(outLinks).reduce((s, set) => s + set.size, 0),
  orphanPages: [...routes].filter((r) => r !== '/' && (inLinks[r]?.size ?? 0) === 0).sort(),
  brokenLinks,
  inboundByRoute: Object.fromEntries(
    [...routes].sort().map((r) => [r, inLinks[r]?.size ?? 0]),
  ),
};

const outArgIndex = process.argv.indexOf('--out');
if (outArgIndex !== -1 && process.argv[outArgIndex + 1]) {
  writeFileSync(path.join(root, process.argv[outArgIndex + 1]), JSON.stringify(report, null, 2));
  console.log(`Rapport ecrit dans ${process.argv[outArgIndex + 1]}`);
} else {
  console.log(JSON.stringify(report, null, 2));
}

console.log(`\nTotal liens internes : ${report.totalInternalLinks}`);
console.log(`Pages orphelines (0 lien entrant) : ${report.orphanPages.length}`);
if (report.orphanPages.length) console.log(report.orphanPages.join('\n'));
console.log(`Liens casses : ${report.brokenLinks.length}`);
if (report.brokenLinks.length) {
  for (const b of report.brokenLinks.slice(0, 40)) console.log(`  ${b.from} -> ${b.to}`);
}
