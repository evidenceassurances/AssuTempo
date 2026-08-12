/**
 * Portique de controle qualite (Gate) des Pull Requests.
 *
 * Lance par .github/workflows/gate.yml apres npm run build. Analyse le diff
 * complet de la branche par rapport a origin/main et ECHOUE (exit 1) avec un
 * rapport detaille si une regle est violee. Tant que le gate echoue, la PR
 * n'est pas auto-mergee.
 *
 * Regles :
 *  1. Aucun tiret cadratin (U+2014) ni demi-cadratin (U+2013) dans les
 *     lignes ajoutees.
 *  2. Aucune expression bannie (tics d'ecriture IA) dans les lignes ajoutees.
 *  3. Sections dependencies / devDependencies de package.json intouchees.
 *  4. Aucun fichier des zones interdites modifie (liste FORBIDDEN_PATHS
 *     ci-dessous). Pour autoriser ou proteger un chemin, ajouter ou retirer
 *     une entree de cette liste : une entree finissant par / protege tout le
 *     repertoire, sinon c'est un fichier exact.
 *  5. Chaque URL du sitemap construit existe bien dans dist/ (le prerender a
 *     produit toutes les pages).
 *  6. Title present et <= 60 caracteres, sur les pages touchees par la PR.
 *  7. Meta description presente et <= 155 caracteres, meme perimetre.
 *  8. Tout bloc application/ld+json est analysable (controle global).
 *  9. Aucun lien interne mort, ni lien interne qui ne marche qu'a travers une
 *     redirection 301 (controle global).
 *
 * Les regles 6 et 7 se limitent aux pages touchees : une PR qui ajoute un
 * article ne doit pas echouer a cause d'une dette ancienne ailleurs. Les
 * regles 8 et 9 sont globales, car un schema casse ou un lien mort peut
 * naitre d'une suppression faite dans une autre page.
 *
 * Cas particulier : si GATE_AUTHOR (login de l'auteur de la PR, pose par le
 * workflow) designe dependabot, la PR ne doit toucher QUE des fichiers sous
 * .github/workflows/ ; les zones interdites ne s'appliquent pas. Le login est
 * normalise avant comparaison : voir normaliserAuteur() plus bas.
 *
 * Node natif, zero dependance. Usage : node scripts/quality-gate.mjs
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = 'origin/main...HEAD';
const problems = [];

function git(args) {
  return execSync(`git ${args}`, {
    cwd: root,
    encoding: 'utf-8',
    maxBuffer: 256 * 1024 * 1024,
  });
}

// Zones interdites : ces chemins ne doivent jamais etre modifies par une PR
// automatique. Une session locale d'Ayoub (commit direct sur main) n'est pas
// concernee : le gate ne s'execute que dans les Pull Requests.
const FORBIDDEN_PATHS = [
  'src/components/Navbar.jsx', // header global
  'src/components/Footer.jsx', // footer global
  'src/pages/Pricing.jsx', // /tarification : tunnel JL Assure fige (meta comprises : passer par une session locale)
  'src/pages/CarteGrise.jsx', // /carte-grise : iframe Certimat figee
  'src/pages/About.jsx', // formulaire partenaires B2B
  'src/pages/AssuranceInternationale.jsx', // formulaire international
  '.github/', // le pipeline lui-meme : une mission ne peut pas modifier ses propres controles
  'scripts/quality-gate.mjs', // ce portique
  'scripts/indexnow.mjs', // le ping IndexNow
  'vercel.json', // redirections et statuts 404 en production
];

// Fichiers exclus des controles de texte (regles 1 et 2) : sorties de build
// et fichiers generes, deja couverts par leurs sources.
const TEXT_SKIP = ['dist/', 'public/sitemap.xml', 'package-lock.json', 'scripts/quality-gate.mjs'];

const DASH_RE = /[–—]/;
const DASH_NAMES = { '–': 'demi-cadratin U+2013', '—': 'tiret cadratin U+2014' };

const BANNED_PHRASES = [
  'dans un monde où',
  'il est important de noter',
  'de nos jours',
  "n'hésitez pas",
  'en résumé',
  'force est de constater',
];

const matchesPath = (file, entry) => (entry.endsWith('/') ? file.startsWith(entry) : file === entry);

// ---------------------------------------------------------------------------
// Fichiers modifies par la PR
// ---------------------------------------------------------------------------
const changedFiles = git(`diff --name-only ${BASE}`).split('\n').filter(Boolean);

/* Le login d'auteur n'a pas UNE forme mais trois, selon l'API interrogee :
   l'API REST renvoie "dependabot[bot]", GraphQL (donc `gh pr view --json
   author`, ce qu'utilise gate.yml) renvoie "app/dependabot", et un compte
   humain renvoie son login nu. Le meme piege avait deja coute un automerge
   sur la PR #11 avec "app/github-actions". On normalise donc une fois pour
   toutes, au lieu de tester une forme particuliere. */
const normaliserAuteur = (brut) => (brut || '')
  .trim()
  .toLowerCase()
  .replace(/^app\//, '')
  .replace(/\[bot\]$/, '');

const author = normaliserAuteur(process.env.GATE_AUTHOR);

if (author === 'dependabot') {
  // Regle dediee dependabot : mises a jour de versions d'actions uniquement.
  for (const f of changedFiles) {
    if (!f.startsWith('.github/workflows/')) {
      problems.push(`[dependabot] Fichier hors perimetre (.github/workflows/ uniquement) : ${f}`);
    }
  }
} else {
  // Regle 4 : zones interdites.
  for (const f of changedFiles) {
    for (const entry of FORBIDDEN_PATHS) {
      if (matchesPath(f, entry)) {
        problems.push(`[zone interdite] ${f} ne doit pas etre modifie par une PR automatique (regle : ${entry})`);
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Regle 3 : dependances npm figees
// ---------------------------------------------------------------------------
if (changedFiles.includes('package.json')) {
  let before = {};
  try {
    before = JSON.parse(git('show origin/main:package.json'));
  } catch {
    // package.json absent sur main : rien a comparer
  }
  const after = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8'));
  for (const section of ['dependencies', 'devDependencies']) {
    if (JSON.stringify(before[section] ?? {}) !== JSON.stringify(after[section] ?? {})) {
      problems.push(`[dependances] La section ${section} de package.json est modifiee : aucune nouvelle dependance n'est autorisee`);
    }
  }
}

// ---------------------------------------------------------------------------
// Regles 1 et 2 : lignes ajoutees (tirets interdits, expressions bannies)
// ---------------------------------------------------------------------------
const normalize = (s) => s.toLowerCase().replace(/’/g, "'");
const diff = git(`diff --unified=0 --no-color ${BASE}`);
let file = null;
let lineNo = 0;

for (const line of diff.split('\n')) {
  if (line.startsWith('+++ ')) {
    file = line.startsWith('+++ b/') ? line.slice(6) : null;
    continue;
  }
  if (line.startsWith('@@')) {
    const m = line.match(/\+(\d+)/);
    lineNo = m ? parseInt(m[1], 10) : 0;
    continue;
  }
  if (!line.startsWith('+') || line.startsWith('+++') || !file) continue;

  const content = line.slice(1);
  const current = lineNo;
  lineNo++;

  if (TEXT_SKIP.some((entry) => matchesPath(file, entry) || (entry.endsWith('/') && file.startsWith(entry)))) continue;

  const dash = content.match(DASH_RE);
  if (dash) {
    problems.push(`[tiret interdit] ${file}:${current} contient un ${DASH_NAMES[dash[0]]}`);
  }

  // CLAUDE.md liste lui-meme les expressions bannies : exclu de la regle 2.
  if (file !== 'CLAUDE.md') {
    const norm = normalize(content);
    for (const phrase of BANNED_PHRASES) {
      if (norm.includes(normalize(phrase))) {
        problems.push(`[expression bannie] ${file}:${current} contient "${phrase}"`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Regle 5 : chaque URL du sitemap a sa page dans dist/
// ---------------------------------------------------------------------------
const sitemapPath = path.join(root, 'dist', 'sitemap.xml');
let urlCount = 0;
if (!existsSync(sitemapPath)) {
  problems.push('[build] dist/sitemap.xml introuvable : npm run build doit etre lance avant le gate');
} else {
  const xml = readFileSync(sitemapPath, 'utf-8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  urlCount = locs.length;
  if (locs.length === 0) {
    problems.push('[build] Le sitemap ne contient aucune URL');
  }
  for (const loc of locs) {
    const pathname = new URL(loc).pathname.replace(/\/$/, '');
    const rel = pathname === '' ? 'index.html' : `${pathname.slice(1)}/index.html`;
    if (!existsSync(path.join(root, 'dist', rel))) {
      problems.push(`[build] ${loc} est dans le sitemap mais dist/${rel} n'existe pas`);
    }
  }
}

// ---------------------------------------------------------------------------
// Regles 6 a 9 : controles SEO sur le rendu.
//
// Pourquoi ici : ces regles etaient ecrites dans CLAUDE.md depuis juillet et
// n'etaient appliquees par rien. Resultat mesure le 12 aout : 53 pages sur 78
// avec un title ou une description tronques par Google, et un lien interne
// mort qui avait survecu des semaines. Le gate construit deja tout le site a
// chaque PR : y brancher ces controles coute quelques secondes et transforme
// une regle esperee en regle appliquee.
//
// PERIMETRE : les pages TOUCHEES par la PR, pas tout le site. Une PR qui
// ajoute un article ne doit pas echouer a cause d'une dette ancienne sur une
// page qu'elle n'a pas ecrite. Seul le controle des liens morts est global :
// un lien casse peut naitre d'une page supprimee ailleurs.
// ---------------------------------------------------------------------------
const distDir = path.join(root, 'dist');

/* La longueur se mesure sur le texte DECODE. Dans le HTML rendu, une
   apostrophe s'ecrit &#x27; et pese 6 caracteres : mesurer le brut ferait
   echouer des pages parfaitement conformes. Constate en calibrant ce
   controle, ou 3 titles et 5 descriptions apparaissaient a tort hors normes. */
const decodeEntites = (s) => s
  .replace(/&#x27;|&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#x2F;/g, '/')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&');

const extraire = (html, re) => {
  const m = html.match(re);
  return m ? decodeEntites(m[1]).trim() : null;
};

function listerPages(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) out.push(...listerPages(p));
    /* Les copies de conflit iCloud (" 2.html") ne sont pas des pages. */
    else if (e.endsWith('.html') && !/ \d+\.html$/.test(e)) out.push(p);
  }
  return out;
}

const urlDePage = (f) => '/' + path.relative(distDir, f).replace(/index\.html$/, '').replace(/\.html$/, '');

if (existsSync(distDir)) {
  const toutesPages = listerPages(distDir);

  /* Une page est "touchee" si son HTML rendu a change dans cette PR. C'est le
     signal exact, et il ne demande aucune heuristique : dist/ est versionne,
     le build reecrit tout, et git ne retient que les fichiers dont le CONTENU
     a reellement change. Une premiere version appariait le slug de l'URL au
     nom du fichier source ; elle ne detectait rien, le nom de base d'une page
     rendue etant toujours "index". */
  const pagesTouchees = new Set(
    changedFiles
      .filter((f) => f.startsWith('dist/') && f.endsWith('.html'))
      .map((f) => '/' + f.slice('dist/'.length).replace(/index\.html$/, '').replace(/\.html$/, '')),
  );

  const concernee = (url) => pagesTouchees.has(url);

  for (const f of toutesPages) {
    const url = urlDePage(f);
    const html = readFileSync(f, 'utf-8');

    /* Regle 8 : JSON-LD analysable. Global : un schema casse est invisible a
       l'oeil et coute une rich snippet, sur n'importe quelle page. */
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(m[1]);
      } catch (e) {
        problems.push(`[json-ld] ${url} contient un bloc ld+json invalide : ${e.message.slice(0, 70)}`);
      }
    }

    if (!concernee(url)) continue;

    /* Regles 6 et 7 : longueurs, sur les pages touchees par la PR. */
    const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
    const titre = extraire(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const desc = extraire(html, /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i);

    if (!noindex) {
      if (!titre) problems.push(`[seo] ${url} n'a pas de <title>`);
      else if (titre.length > 60) problems.push(`[seo] ${url} : title de ${titre.length} caracteres (max 60) : "${titre}"`);

      if (!desc) problems.push(`[seo] ${url} n'a pas de meta description`);
      else if (desc.length > 155) problems.push(`[seo] ${url} : description de ${desc.length} caracteres (max 155)`);
    }
  }

  /* Regle 9 : aucun lien interne mort. Global, car un lien peut casser du
     fait d'une page supprimee ailleurs que dans la page qui le porte. Les
     liens vers une URL couverte par une redirection de vercel.json sont
     signales aussi : un lien interne ne doit jamais dependre d'une 301. */
  const pagesExistantes = new Set(toutesPages.map((f) => urlDePage(f).replace(/\/$/, '') || '/'));
  let redirections = [];
  try {
    const vercel = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf-8'));
    redirections = (vercel.redirects || []).map((r) => r.source.replace(/\/$/, ''));
  } catch { /* pas de vercel.json lisible : on ne signale que les vrais 404 */ }

  const morts = new Map();
  for (const f of toutesPages) {
    const url = urlDePage(f);
    const html = readFileSync(f, 'utf-8');
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const cible = m[1].replace(/\/$/, '') || '/';
      if (cible.startsWith('/assets/') || cible.startsWith('/flags/') || /\.[a-z0-9]{2,4}$/i.test(cible)) continue;
      if (pagesExistantes.has(cible)) continue;
      const via301 = redirections.includes(cible);
      morts.set(`${cible}|${via301}`, (morts.get(`${cible}|${via301}`) || 0) + 1);
      if (!morts.has(`src:${cible}`)) morts.set(`src:${cible}`, url);
    }
  }
  for (const [cle, valeur] of morts) {
    if (cle.startsWith('src:')) continue;
    const [cible, via301] = cle.split('|');
    const depuis = morts.get(`src:${cible}`);
    problems.push(via301 === 'true'
      ? `[lien] ${depuis} pointe vers ${cible}, qui n'existe qu'a travers une redirection 301 : viser directement la page finale`
      : `[lien] ${depuis} pointe vers ${cible}, qui n'existe pas dans dist/ (${valeur} occurrence(s) au total)`);
  }
}

// ---------------------------------------------------------------------------
// Verdict
// ---------------------------------------------------------------------------
if (problems.length > 0) {
  console.error(`Gate : ECHEC, ${problems.length} probleme(s) :\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nCorrigez la branche puis poussez : le gate se relancera automatiquement.');
  process.exit(1);
}

console.log(`Gate : tout est vert (${changedFiles.length} fichier(s) modifie(s), ${urlCount} URL du sitemap verifiees).`);
