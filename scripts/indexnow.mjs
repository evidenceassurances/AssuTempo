/**
 * Ping IndexNow : notifie Bing (l'index utilise par ChatGPT) et les moteurs
 * partenaires du protocole a chaque mise a jour du site.
 *
 * - Lit les URL du sitemap committe (public/sitemap.xml, regenere a chaque
 *   `npm run build` avec des lastmod reels).
 * - POST l'integralite de la liste vers api.indexnow.org : soumettre tout le
 *   sitemap a chaque fois est accepte par le protocole, les moteurs dedupliquent.
 * - Node natif uniquement (fetch integre depuis Node 18), zero dependance.
 *
 * Usage : node scripts/indexnow.mjs
 * Lance en CI par .github/workflows/indexnow.yml a chaque push sur main.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

const HOST = 'assutempo.fr';
const KEY = '333c3e14ba12a91b5b09cf6eaa5315ac';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sitemapPath = path.join(root, 'public/sitemap.xml');

let xml;
try {
  xml = readFileSync(sitemapPath, 'utf-8');
} catch {
  console.error(`Sitemap introuvable : ${sitemapPath}. Lance npm run build d'abord.`);
  process.exit(1);
}

const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (urlList.length === 0) {
  console.error('Aucune URL trouvee dans le sitemap : abandon.');
  process.exit(1);
}

console.log(`IndexNow : soumission de ${urlList.length} URL pour ${HOST}...`);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

const body = await res.text();
console.log(`Reponse IndexNow : HTTP ${res.status} ${res.statusText}${body ? ` | ${body}` : ''}`);

// 200 OK / 202 Accepted = soumission prise en compte.
// 4xx (cle invalide, quota...) = echec a rendre visible en CI.
if (res.status >= 400) {
  process.exit(1);
}
console.log('Soumission acceptee.');
