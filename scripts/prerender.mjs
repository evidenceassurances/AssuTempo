/**
 * Prerender script — génère un index.html statique par route.
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
  '/carte',
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

  // Injecter le contenu dans le template
  let pageHtml = template.replace('<!--ssr-outlet-->', appHtml);

  // Injecter les balises <head> de react-helmet-async si présentes
  if (helmet) {
    if (helmet.title?.toString()) {
      pageHtml = pageHtml.replace(
        /<title>[^<]*<\/title>/,
        helmet.title.toString(),
      );
    }
    const headTags = [helmet.meta?.toString(), helmet.link?.toString()]
      .filter((s) => s && s.trim())
      .join('\n    ');
    if (headTags) {
      pageHtml = pageHtml.replace('</head>', `    ${headTags}\n  </head>`);
    }
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
