/**
 * Genere public/og-image.png (1200x630), le visuel de partage du site.
 *
 * Pourquoi un script et pas un fichier depose une fois : le visuel reprend le
 * H1, les arguments et les couleurs de la marque. Le jour ou l'un des trois
 * change, l'image doit suivre, et une image binaire oubliee dans public/ ne
 * suit jamais. La source est scripts/og-image.html, lisible et modifiable.
 *
 * Rendu par Chrome sans interface, deja installe sur le poste : aucune
 * dependance npm ajoutee (regle de CLAUDE.md). Node natif pour le reste.
 *
 * Usage : node scripts/og-image.mjs
 *
 * Ce script n'est PAS branche sur `npm run build` : le visuel change une fois
 * par an, la relancer a chaque build couterait 2 secondes a chaque fois pour
 * un fichier identique. A relancer a la main apres une modification du HTML.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(racine, 'scripts', 'og-image.html');
const sortie = path.join(racine, 'public', 'og-image.png');

/* Emplacements usuels de Chrome. Aucun n'est garanti : on echoue avec un
   message qui dit quoi faire, plutot qu'avec une trace illisible. */
const CANDIDATS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const chrome = CANDIDATS.find((c) => existsSync(c));
if (!chrome) {
  console.error('Chrome introuvable. Emplacements testes :');
  CANDIDATS.forEach((c) => console.error('  ' + c));
  console.error("\nInstaller Chrome, ou ouvrir scripts/og-image.html dans un navigateur\net faire une capture de 1200x630 enregistree dans public/og-image.png.");
  process.exit(1);
}

if (!existsSync(source)) {
  console.error(`Source introuvable : ${source}`);
  process.exit(1);
}

console.log('Rendu du visuel de partage (1200x630)...');
execFileSync(chrome, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  `--screenshot=${sortie}`,
  '--window-size=1200,630',
  `file://${source}`,
], { stdio: ['ignore', 'ignore', 'ignore'] });

if (!existsSync(sortie)) {
  console.error('Chrome n a produit aucun fichier. Rendu echoue.');
  process.exit(1);
}

const poids = statSync(sortie).size;
console.log(`  public/og-image.png ecrit (${Math.round(poids / 1024)} KB).`);

/* Garde-fou : les reseaux sociaux rejettent au-dela de 5 Mo, et une image
   lourde ralentit le premier partage. 500 Ko est large pour ce visuel. */
if (poids > 500 * 1024) {
  console.error(`  ATTENTION : ${Math.round(poids / 1024)} KB, c'est beaucoup pour un visuel de partage.`);
  process.exit(1);
}
console.log('Termine.');
