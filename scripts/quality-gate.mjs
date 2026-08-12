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
 *
 * Cas particulier : si GATE_AUTHOR (login de l'auteur de la PR, pose par le
 * workflow) designe dependabot, la PR ne doit toucher QUE des fichiers sous
 * .github/workflows/ ; les zones interdites ne s'appliquent pas. Le login est
 * normalise avant comparaison : voir normaliserAuteur() plus bas.
 *
 * Node natif, zero dependance. Usage : node scripts/quality-gate.mjs
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
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
// Verdict
// ---------------------------------------------------------------------------
if (problems.length > 0) {
  console.error(`Gate : ECHEC, ${problems.length} probleme(s) :\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nCorrigez la branche puis poussez : le gate se relancera automatiquement.');
  process.exit(1);
}

console.log(`Gate : tout est vert (${changedFiles.length} fichier(s) modifie(s), ${urlCount} URL du sitemap verifiees).`);
