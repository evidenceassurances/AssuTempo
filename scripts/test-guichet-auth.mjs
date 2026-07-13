/**
 * Banc d'essai de l'authentification d'administration du Guichet de Nuit.
 *
 * Verifie les quatre proprietes qui protegent la decision tarifaire :
 *   1. connexion avec le bon jeton     -> cookie signe pose ;
 *   2. cloture avec un cookie valide   -> autorisee, ET cookie repose plus loin
 *                                          dans le temps (le cookie glisse) ;
 *   3. cookie perime ou signature fausse -> refuses ;
 *   4. jeton Bearer                    -> toujours autorise.
 *
 * Node natif, zero dependance. Un faux Upstash local tient lieu de base : on
 * teste l'authentification, pas Redis.
 *
 * Usage : npm test
 */

import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const JETON = 'jeton-de-test-du-guichet';
const CLE_COOKIE = 'secret-de-signature-du-cookie';
const ORIGINE = { origin: 'https://assutempo.fr', host: 'assutempo.fr' };

let ok = 0;
let ko = 0;
const verifier = (libelle, condition, detail = '') => {
  if (condition) {
    ok += 1;
    console.log(`  OK    ${libelle}`);
  } else {
    ko += 1;
    console.log(`  ECHEC ${libelle} ${detail}`);
  }
};

/* ── Faux Upstash : juste assez pour que les sessions de dossier existent ──── */
const magasin = new Map();

function executerRedis([nom, ...args]) {
  switch (String(nom).toUpperCase()) {
    case 'SET': {
      const [cle, valeur] = args;
      if (args.some((a) => String(a).toUpperCase() === 'NX') && magasin.has(cle)) return null;
      magasin.set(cle, valeur);
      return 'OK';
    }
    case 'GET': return magasin.has(args[0]) ? magasin.get(args[0]) : null;
    case 'INCR': {
      const v = Number(magasin.get(args[0]) || 0) + 1;
      magasin.set(args[0], String(v));
      return v;
    }
    case 'EXPIRE': return 1;
    case 'LPUSH': {
      const liste = JSON.parse(magasin.get(args[0]) || '[]');
      liste.unshift(args[1]);
      magasin.set(args[0], JSON.stringify(liste));
      return liste.length;
    }
    case 'LTRIM': return 'OK';
    default: throw new Error(`commande non simulee : ${nom}`);
  }
}

const upstash = http.createServer((req, res) => {
  let corps = '';
  req.on('data', (c) => { corps += c; });
  req.on('end', () => {
    try {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ result: executerRedis(JSON.parse(corps)) }));
    } catch (e) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });
});

/* ── Faux couple requete / reponse, facon Vercel ───────────────────────────── */
function appeler(handler, { method = 'POST', body = null, headers = {} } = {}) {
  return new Promise((resolve) => {
    const req = { method, body, query: {}, headers: { ...ORIGINE, ...headers } };
    const entetes = {};
    const res = {
      _code: 200,
      setHeader(k, v) { entetes[k] = v; },
      status(c) { this._code = c; return this; },
      json(p) { resolve({ code: this._code, body: p, cookie: entetes['Set-Cookie'] || '' }); return this; },
    };
    handler(req, res);
  });
}

/* Fabrique une valeur de cookie, pour forger les cas invalides. */
const signer = (exp, cle) => crypto.createHmac('sha256', cle).update(String(exp)).digest('base64url');
const valeurCookie = (exp, cle) => `${exp}.${signer(exp, cle)}`;
const expirationDe = (entete) => Number(entete.split(';')[0].split('=')[1].split('.')[0]);

async function main() {
  await new Promise((r) => upstash.listen(0, '127.0.0.1', r));
  process.env.KV_REST_API_URL = `http://127.0.0.1:${upstash.address().port}`;
  process.env.KV_REST_API_TOKEN = 'peu-importe';
  process.env.GUICHET_ADMIN_TOKEN = JETON;
  process.env.GUICHET_COOKIE_SECRET = CLE_COOKIE;

  const adminLogin = require(path.join(racine, 'api/guichet/admin-login.js'));
  const finalize = require(path.join(racine, 'api/guichet/finalize.js'));
  const start = require(path.join(racine, 'api/guichet/start.js'));

  /* Un dossier neuf par cloture : la decision etant gelee, on ne peut pas
     reutiliser le meme et prouver quoi que ce soit. */
  let n = 0;
  const nouveauDossier = async () => {
    n += 1;
    const reference = `GN-20260713-23${String(n).padStart(2, '0')}-T${String(n).padStart(3, '0')}`;
    await appeler(start, { body: { reference } });
    return reference;
  };

  console.log('\n1. Connexion');
  const bonJeton = await appeler(adminLogin, { body: { token: JETON } });
  verifier('bon jeton : 200 + ok:true', bonJeton.code === 200 && bonJeton.body.ok === true);
  verifier('un cookie guichet_admin est pose', bonJeton.cookie.startsWith('guichet_admin='));
  verifier('HttpOnly (le JavaScript ne peut pas le lire)', bonJeton.cookie.includes('HttpOnly'));
  verifier('Secure (HTTPS uniquement)', bonJeton.cookie.includes('Secure'));
  verifier('SameSite=Lax', bonJeton.cookie.includes('SameSite=Lax'));
  verifier('limite au chemin /api/guichet', bonJeton.cookie.includes('Path=/api/guichet'));

  const valeur = bonJeton.cookie.split(';')[0].split('=')[1];
  verifier("la valeur du cookie n'est PAS le jeton maitre", valeur !== JETON && !valeur.includes(JETON));
  verifier('elle porte une expiration signee', /^\d{13}\.[A-Za-z0-9_-]+$/.test(valeur));

  const mauvais = await appeler(adminLogin, { body: { token: 'pas-le-bon' } });
  verifier('mauvais jeton : 401', mauvais.code === 401);
  verifier('aucun cookie pose sur un echec', !mauvais.cookie);

  console.log('\n2. Cloture avec le cookie : autorisee, et le cookie GLISSE');
  const avant = expirationDe(bonJeton.cookie);
  /* On recule l'expiration du cookie de 10 jours : il reste valide, mais on
     pourra voir qu'il est repose PLUS LOIN qu'il ne l'etait. */
  const vieilli = valeurCookie(Date.now() + 20 * 24 * 60 * 60 * 1000, CLE_COOKIE);
  const parCookie = await appeler(finalize, {
    body: { reference: await nouveauDossier(), status: 'quote_created' },
    headers: { cookie: `guichet_admin=${vieilli}` },
  });
  verifier('cloture autorisee par le seul cookie', parCookie.code === 200);
  verifier('la decision tarifaire est rendue', typeof parCookie.body.tarifPreferentiel === 'boolean');
  verifier('un cookie est repose', parCookie.cookie.startsWith('guichet_admin='));
  const apres = expirationDe(parCookie.cookie);
  verifier(
    'la nouvelle expiration est repoussee a 30 jours (cookie glissant)',
    apres > Number(vieilli.split('.')[0]) && Math.abs(apres - avant) < 60_000,
    `(avant ${avant}, apres ${apres})`,
  );

  console.log('\n3. Cookies refuses');
  const perime = valeurCookie(Date.now() - 1000, CLE_COOKIE);
  const rPerime = await appeler(finalize, {
    body: { reference: await nouveauDossier() },
    headers: { cookie: `guichet_admin=${perime}` },
  });
  verifier('cookie perime : 401', rPerime.code === 401);
  verifier('aucun cookie repose sur un refus', !rPerime.cookie);

  const faux = valeurCookie(Date.now() + 60_000, 'la-mauvaise-cle');
  const rFaux = await appeler(finalize, {
    body: { reference: await nouveauDossier() },
    headers: { cookie: `guichet_admin=${faux}` },
  });
  verifier('signature invalide : 401', rFaux.code === 401);

  const bricole = `${Date.now() + 60_000}.${signer(Date.now() + 999_999, CLE_COOKIE)}`;
  const rBricole = await appeler(finalize, {
    body: { reference: await nouveauDossier() },
    headers: { cookie: `guichet_admin=${bricole}` },
  });
  verifier("expiration rallongee a la main : 401 (elle est dans la signature)", rBricole.code === 401);

  const rCsrf = await appeler(finalize, {
    body: { reference: await nouveauDossier() },
    headers: { cookie: `guichet_admin=${valeur}`, origin: 'https://evil.example' },
  });
  verifier('CSRF : cookie valide mais origine tierce : 401', rCsrf.code === 401);

  const rSans = await appeler(finalize, { body: { reference: await nouveauDossier() } });
  verifier('aucune authentification : 401', rSans.code === 401);

  console.log('\n4. Jeton Bearer : toujours autorise');
  const rBearer = await appeler(finalize, {
    body: { reference: await nouveauDossier(), status: 'quote_created' },
    headers: { authorization: `Bearer ${JETON}` },
  });
  verifier('cloture autorisee par le Bearer', rBearer.code === 200);
  verifier('la decision tarifaire est rendue', typeof rBearer.body.tarifPreferentiel === 'boolean');

  const rBearerFaux = await appeler(finalize, {
    body: { reference: await nouveauDossier() },
    headers: { authorization: 'Bearer mauvais-jeton' },
  });
  verifier('Bearer invalide : 401', rBearerFaux.code === 401);

  console.log('\n5. Secrets absents : la porte reste fermee');
  delete process.env.GUICHET_COOKIE_SECRET;
  const rSansCle = await appeler(finalize, {
    body: { reference: 'GN-20260713-2359-ZZZZ' },
    headers: { authorization: `Bearer ${JETON}` },
  });
  verifier('GUICHET_COOKIE_SECRET absent : 503', rSansCle.code === 503);
  verifier(
    'le message nomme la variable manquante, jamais sa valeur',
    String(rSansCle.body.message).includes('GUICHET_COOKIE_SECRET')
      && !String(rSansCle.body.message).includes(JETON),
  );
  process.env.GUICHET_COOKIE_SECRET = CLE_COOKIE;

  delete process.env.GUICHET_ADMIN_TOKEN;
  const rSansJeton = await appeler(adminLogin, { body: { token: JETON } });
  verifier('GUICHET_ADMIN_TOKEN absent : 503', rSansJeton.code === 503);
  process.env.GUICHET_ADMIN_TOKEN = JETON;

  console.log(`\n${'-'.repeat(52)}`);
  console.log(`${ok} verifications OK, ${ko} echec(s)`);
  upstash.close();
  process.exit(ko === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
