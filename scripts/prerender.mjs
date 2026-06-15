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
  '/carte',
  ...COUNTRY_SLUGS.map(s => `/carte/${s}`),
  '/carte-grise',
  '/cookies',
  '/assurance-internationale',
];

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

// ── 3. Rendre chaque route ───────────────────────────────────────────────────
console.log(`\n🖨️  Pré-rendu de ${ROUTES.length} routes…`);

for (const route of ROUTES) {
  let appHtml, helmet;
  try {
    ({ html: appHtml, helmet } = render(route));
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

  // Injecter le contenu dans le template
  let pageHtml = template.replace('<!--ssr-outlet-->', appHtml);

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

  // Injecter le canonical avant </head>
  if (canonicalMatch) {
    pageHtml = pageHtml.replace(
      '</head>',
      `    <link rel="canonical" href="${canonicalMatch[1]}">\n  </head>`,
    );
  }

  // Écrire dans dist/<route>/index.html
  const segments = route === '/' ? [] : route.split('/').filter(Boolean);
  const dir = path.join(root, 'dist', ...segments);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), pageHtml);

  console.log(`  ✓  ${route}`);
}

// ── 4. Nettoyage ─────────────────────────────────────────────────────────────
rmSync(distSsr, { recursive: true, force: true });
console.log('\n✅  Pré-rendu terminé !');
