/**
 * Prerender script - génère un index.html statique par route.
 * Exécuté après `vite build` via `npm run build`.
 *
 * Flux :
 *  1. Compile l'entry-server en bundle CJS (dans dist-ssr/)
 *  2. Pour chaque route, appelle render(url) -> HTML
 *  3. Injecte dans le template dist/index.html
 *  4. Écrit dist/<route>/index.html
 *  5. Supprime dist-ssr/
 */

import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(__dirname, '..');
const distSsr = path.join(root, 'dist-ssr');

// ── Routes à pré-rendre ──────────────────────────────────────────────────────
// JSON lu via readFileSync (compatible CJS/ESM - évite le conflit "type":"commonjs")
const COUNTRY_SLUGS = JSON.parse(
  readFileSync(new URL('../src/data/country-slugs.json', import.meta.url)),
);

const ROUTES = [
  '/',
  '/faq',
  '/tarification',
  '/qui-sommes-nous',
  '/articles',
  '/articles/voiture-immobilisee-defaut-assurance',
  '/articles/controle-sans-assurance-risques-amende',
  '/articles/assurer-vehicule-achete-chez-particulier',
  '/articles/combien-de-jours-assurance-sortir-fourriere',
  '/articles/assurance-temporaire-vehicule-etranger-france',
  '/articles/assurance-temporaire-pret-de-vehicule',
  '/articles/assurance-temporaire-convoyage-professionnel',
  '/articles/assurance-temporaire-essai-vehicule-avant-achat',
  '/articles/assurance-temporaire-rouler-en-attendant-carte-grise',
  '/articles/assurance-temporaire-resilie-par-assureur',
  '/articles/assurance-temporaire-utilitaire-demenagement',
  '/articles/assurance-temporaire-vehicule-proche-decede',
  '/carte',
  ...COUNTRY_SLUGS.map(s => `/carte/${s}`),
  '/carte-grise',
  '/cookies',
  '/conditions-generales',
  '/assurance-internationale',
];

// ── Métadonnées sitemap ──────────────────────────────────────────────────────
// Le sitemap est généré à partir de ROUTES (source unique) : impossible qu'il
// diverge à nouveau de la liste prérendue. Date stable (mise à jour manuelle
// lors d'un changement de contenu) pour ne pas signaler "tout a changé" à
// chaque build, ce qui érode la confiance dans <lastmod>.
const SITE = 'https://assutempo.fr';
const SITEMAP_LASTMOD = '2026-06-23';

function sitemapMeta(route) {
  if (route === '/' || route === '/tarification') return { changefreq: 'weekly', priority: '1.0' };
  if (route.startsWith('/articles/')) return { changefreq: 'monthly', priority: '0.7' };
  if (route.startsWith('/carte/')) return { changefreq: 'yearly', priority: '0.6' };
  if (route === '/cookies' || route === '/conditions-generales') return { changefreq: 'yearly', priority: '0.3' };
  // Pages de contenu et commerciales : /faq, /articles, /qui-sommes-nous,
  // /carte, /carte-grise, /assurance-internationale.
  return { changefreq: 'monthly', priority: '0.8' };
}

// ── 1. Build SSR bundle ───────────────────────────────────────────────────────
console.log('⚙️  Compilation du bundle SSR…');
await build({
  plugins: [react()],
  root,
  build: {
    ssr: path.join(root, 'src/entry-server.jsx'),
    outDir: distSsr,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'cjs',
        entryFileNames: 'entry-server.js',
      },
    },
  },
  // Évite que Vite tente d'analyser les assets CSS/images côté serveur
  ssr: {
    target: 'node',
  },
});

// ── 2. Charger le bundle et le template ──────────────────────────────────────
const require = createRequire(import.meta.url);
// eslint-disable-next-line import/no-dynamic-require
const { render } = require(path.join(distSsr, 'entry-server.js'));

const templatePath = path.join(root, 'dist/index.html');
if (!existsSync(templatePath)) {
  console.error('❌  dist/index.html introuvable. Lance d\'abord `vite build`.');
  process.exit(1);
}
const template = readFileSync(templatePath, 'utf-8');

// ── CSS critique inline ──────────────────────────────────────────────────────
// La feuille /assets/index-*.css etait la SEULE ressource bloquant le rendu :
// sur un lien mobile degrade (Safari la laisse en plus concurrencer les
// ~150 KB de modulepreload), elle pouvait tenir l'ecran noir plusieurs
// secondes alors que le HTML prerendu etait deja arrive. Inlinee dans chaque
// HTML, le premier paint ne depend plus d'AUCUNE sous-ressource : le hero
// complet se peint des l'arrivee du document (~19 KB bruts, ~5 KB brotli de
// plus par page d'entree ; les navigations suivantes restent client-side).
// Verifie : le CSS ne contient que des url(data:) et des refs #fragment,
// aucune url relative ne casse en changeant de base.
const cssLinkRe = /<link rel="stylesheet"[^>]*href="(\/assets\/index-[^"]+\.css)"[^>]*>/;
const cssMatch = template.match(cssLinkRe);
let templateInlined = template;
if (cssMatch) {
  const css = readFileSync(path.join(root, 'dist', cssMatch[1]), 'utf-8');
  templateInlined = template.replace(cssLinkRe, () => `<style>${css}</style>`);
  console.log(`🎨  CSS inline dans le template (${(css.length / 1024).toFixed(1)} KB, plus aucune ressource bloquant le rendu)`);
} else {
  console.warn('⚠️  lien stylesheet introuvable dans le template : CSS non inline');
}

// ── Modulepreload du chunk de page ───────────────────────────────────────────
// Le template ne precharge que les chunks partages (runtime, framer,
// react-vendor, icons) : le chunk de la PAGE arrivait apres l'hydratation et
// l'ecran passait par le loader. On lit le manifest Vite pour injecter, dans
// chaque HTML prerendu, le modulepreload de son propre chunk (+ imports).
const manifestPath = path.join(root, 'dist/.vite/manifest.json');
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf-8'))
  : null;
if (!manifest) console.warn('⚠️  manifest Vite absent : pas de modulepreload de page');

const ROUTE_MODULES = {
  '/':                        'src/pages/HomeSections.jsx', // Home est dans l'entry ; ses sections lazy, non
  '/faq':                     'src/pages/Faq.jsx',
  '/tarification':            'src/pages/Pricing.jsx',
  '/qui-sommes-nous':         'src/pages/About.jsx',
  '/articles':                'src/pages/Articles.jsx',
  '/articles/voiture-immobilisee-defaut-assurance':          'src/pages/articles/VoitureImmobilisee.jsx',
  '/articles/controle-sans-assurance-risques-amende':        'src/pages/articles/ControleSansAssurance.jsx',
  '/articles/assurer-vehicule-achete-chez-particulier':      'src/pages/articles/AcheterVehiculeParticulier.jsx',
  '/articles/combien-de-jours-assurance-sortir-fourriere':   'src/pages/articles/CombienDeJoursAssurance.jsx',
  '/articles/assurance-temporaire-vehicule-etranger-france': 'src/pages/articles/AssuranceVehiculeEtranger.jsx',
  '/articles/assurance-temporaire-pret-de-vehicule':         'src/pages/articles/PretVehicule.jsx',
  '/articles/assurance-temporaire-convoyage-professionnel':  'src/pages/articles/ConvoyageProfessionnel.jsx',
  '/articles/assurance-temporaire-essai-vehicule-avant-achat': 'src/pages/articles/EssaiVehicule.jsx',
  '/articles/assurance-temporaire-rouler-en-attendant-carte-grise': 'src/pages/articles/CarteGrise.jsx',
  '/articles/assurance-temporaire-resilie-par-assureur':     'src/pages/articles/ResilieAssureur.jsx',
  '/articles/assurance-temporaire-utilitaire-demenagement':  'src/pages/articles/UtilitaireDemenagement.jsx',
  '/articles/assurance-temporaire-vehicule-proche-decede':   'src/pages/articles/VehiculeProcheDecede.jsx',
  '/carte':                   'src/pages/Carte.jsx',
  '/carte-grise':             'src/pages/CarteGrise.jsx',
  '/cookies':                 'src/pages/Cookies.jsx',
  '/conditions-generales':    'src/pages/CGV.jsx',
  '/assurance-internationale': 'src/pages/AssuranceInternationale.jsx',
  '/404':                     'src/pages/NotFound.jsx',
};

// fichiers deja charges/precharges par le template : jamais dupliques
const templateAssets = new Set(
  [...template.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)].map((m) => m[1]),
);

function preloadLinksFor(route) {
  if (!manifest) return '';
  const moduleId = route.startsWith('/carte/')
    ? 'src/pages/Carte.jsx'
    : ROUTE_MODULES[route];
  if (!moduleId) return '';
  if (!manifest[moduleId]) {
    console.warn(`⚠️  module absent du manifest pour ${route} : ${moduleId}`);
    return '';
  }
  const seen = new Set();
  const files = [];
  (function walk(id) {
    const entry = manifest[id];
    if (!entry || seen.has(id)) return;
    seen.add(id);
    const file = '/' + entry.file;
    if (!templateAssets.has(file) && !files.includes(file)) files.push(file);
    (entry.imports || []).forEach(walk);
  })(moduleId);
  return files
    .map((f) => `    <link rel="modulepreload" crossorigin href="${f}">`)
    .join('\n');
}


// ── 3. Rendre chaque route ───────────────────────────────────────────────────
console.log(`\n🖨️  Pré-rendu de ${ROUTES.length} routes…`);

function buildPageHtml(route) {
  let appHtml;
  try {
    ({ html: appHtml } = render(route));
  } catch (err) {
    console.error(`❌  Erreur sur ${route}:`, err.message);
    process.exit(1);
  }

  /* React 19 rend les balises <Helmet> (<title>, <meta>, <link>) directement
     dans le HTML du composant (Document Metadata hoisting). Il faut les
     extraire du body SSR et les hisser dans le <head> du template.
     ATTENTION : ne pas toucher aux <script type="application/ld+json">.
     Contrairement aux title/meta/link (hoistables, que React 19 réconcilie
     avec le <head> sans erreur), un <script> inline reste dans l'arbre client
     à sa position d'origine : le retirer du body prérendu provoque un
     mismatch d'hydratation React #418. Le JSON-LD est valide dans le body. */

  // Extraire le <title> depuis le body et le retirer du body
  const titleMatch = appHtml.match(/<title[^>]*>([^<]*)<\/title>/);
  if (titleMatch) {
    appHtml = appHtml.replace(/<title[^>]*>[^<]*<\/title>/g, '');
  }

  // Extraire la <meta name="description"> depuis le body
  const descMatch = appHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (descMatch) {
    appHtml = appHtml.replace(/<meta\s+name="description"[^>]*\/?>/gi, '');
  }

  // Extraire le <link rel="canonical"> depuis le body
  const canonicalMatch = appHtml.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (canonicalMatch) {
    appHtml = appHtml.replace(/<link\s+rel="canonical"[^>]*\/?>/gi, '');
  }

  // Extraire les balises og:/article:/twitter: depuis le body. Elles sont
  // hoistables au meme titre que la description (React 19 reconcilie les
  // <meta> du <head> sans mismatch) et les scrapers sociaux (WhatsApp,
  // LinkedIn, Facebook...) ne lisent que le <head> du HTML statique.
  const socialMetas = [];
  appHtml = appHtml.replace(/<meta\b[^>]*\/?>/gi, (tag) => {
    if (/property="(?:og|article):|name="twitter:/i.test(tag)) {
      socialMetas.push(tag);
      return '';
    }
    return tag;
  });

  // Injecter le contenu dans le template
  let pageHtml = templateInlined.replace('<!--ssr-outlet-->', appHtml);

  // Remplacer le <title> générique par le titre extrait
  if (titleMatch) {
    pageHtml = pageHtml.replace(
      /<title>[^<]*<\/title>/,
      `<title>${titleMatch[1]}</title>`,
    );
  }

  // Remplacer la <meta description> générique
  if (descMatch) {
    pageHtml = pageHtml.replace(
      /<meta\s+name="description"\s+content="[^"]*"/i,
      `<meta name="description" content="${descMatch[1]}"`,
    );
  }

  // Injecter les modulepreload du chunk de page avant </head>
  const preloads = preloadLinksFor(route);
  if (preloads) {
    pageHtml = pageHtml.replace('</head>', `${preloads}\n  </head>`);
  }

  // Injecter le canonical avant </head>
  if (canonicalMatch) {
    pageHtml = pageHtml.replace(
      '</head>',
      `    <link rel="canonical" href="${canonicalMatch[1]}">\n  </head>`,
    );
  }

  // Injecter les balises sociales avant </head>
  if (socialMetas.length) {
    pageHtml = pageHtml.replace(
      '</head>',
      `    ${socialMetas.join('\n    ')}\n  </head>`,
    );
  }

  return pageHtml;
}

for (const route of ROUTES) {
  const pageHtml = buildPageHtml(route);

  // Écrire dans dist/<route>/index.html
  const segments = route === '/' ? [] : route.split('/').filter(Boolean);
  const dir = path.join(root, 'dist', ...segments);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), pageHtml);

  console.log(`  ✓  ${route}`);
}

// ── 3 bis. Page 404 ──────────────────────────────────────────────────────────
// Hors ROUTES (donc hors sitemap) : Vercel sert dist/404.html avec un vrai
// statut 404 pour toute URL sans fichier. Cote client, la route catch-all "*"
// rend la meme page NotFound : arbre identique, hydratation propre.
writeFileSync(path.join(root, 'dist/404.html'), buildPageHtml('/404'));
console.log('  ✓  /404 (dist/404.html)');

// ── 4. Génération du sitemap (depuis ROUTES, source unique) ───────────────────
const sitemapBody = ROUTES.map((route) => {
  const loc = route === '/' ? `${SITE}/` : `${SITE}${route}`;
  const { changefreq, priority } = sitemapMeta(route);
  return `  <url><loc>${loc}</loc><lastmod>${SITEMAP_LASTMOD}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}).join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;

// dist/ = artefact déployé ; public/ = source committée (servie en dev, lisible).
writeFileSync(path.join(root, 'dist/sitemap.xml'), sitemapXml);
writeFileSync(path.join(root, 'public/sitemap.xml'), sitemapXml);
console.log(`\n🗺️  sitemap.xml généré (${ROUTES.length} URLs).`);

// ── 5. Nettoyage ─────────────────────────────────────────────────────────────
rmSync(distSsr, { recursive: true, force: true });
console.log('\n✅  Pré-rendu terminé !');
