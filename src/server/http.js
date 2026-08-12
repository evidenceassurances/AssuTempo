'use strict';

/**
 * Petites aides communes aux fonctions serverless du Guichet de Nuit.
 * Node natif, zero dependance.
 */

/* Origines autorisees a piloter une session depuis un navigateur. Les
   deploiements de previsualisation Vercel (*.vercel.app) ne sont pas listes :
   ils passent par la regle du meme hote, ci-dessous. */
const ALLOWED_ORIGINS = ['https://assutempo.fr', 'https://www.assutempo.fr'];
const COOKIE_ADMIN = 'gn_admin';

/**
 * Controle d'origine.
 *
 * On refuse une origine PRESENTE et etrangere ; on laisse passer une origine
 * ABSENTE. Ce n'est pas un trou : un navigateur envoie toujours l'en-tete
 * Origin sur une requete POST cross-origin, donc une origine absente ne peut
 * pas etre une attaque CSRF. C'est en revanche le cas d'un appel serveur a
 * serveur ou d'un curl de test, qu'on veut pouvoir faire.
 *
 * La comparaison est EXACTE (jamais startsWith, qui laissait passer
 * https://assutempo.fr.evil.com : bug corrige dans api/chat.js le 2 juillet).
 */
function originAutorisee(req) {
  const brut = req.headers.origin || '';
  if (!brut) return true;

  let origine;
  try {
    origine = new URL(brut);
  } catch {
    return false;
  }

  if (ALLOWED_ORIGINS.includes(origine.origin)) return true;

  /* Meme hote que la fonction elle-meme : couvre les previews Vercel et le
     developpement local sans avoir a lister une URL qui change a chaque
     deploiement. */
  const hote = req.headers.host || '';
  return Boolean(hote) && origine.host === hote;
}

/**
 * Controle d'origine STRICT : l'origine doit etre presente ET autorisee.
 * A utiliser des qu'une requete est authentifiee par COOKIE : le navigateur
 * joint le cookie tout seul, donc une page tierce pourrait declencher l'appel a
 * l'insu d'Ayoub (CSRF). Le SameSite=Strict du cookie l'empeche deja ; ceci est
 * la seconde serrure. Un appel authentifie par jeton Bearer, lui, n'a pas ce
 * probleme : le jeton ne part jamais tout seul.
 */
function origineStricte(req) {
  const brut = req.headers.origin || '';
  if (!brut) return false;
  try {
    const origine = new URL(brut);
    if (ALLOWED_ORIGINS.includes(origine.origin)) return true;
    const hote = req.headers.host || '';
    return Boolean(hote) && origine.host === hote;
  } catch {
    return false;
  }
}

function lireCookie(req, nom) {
  const brut = req.headers.cookie || '';
  for (const morceau of brut.split(';')) {
    const i = morceau.indexOf('=');
    if (i === -1) continue;
    if (morceau.slice(0, i).trim() === nom) {
      return decodeURIComponent(morceau.slice(i + 1).trim());
    }
  }
  return '';
}

/**
 * Pose (ou repose) le cookie de session d'administration du Guichet de Nuit.
 *
 * Centralise ici parce que deux endpoints l'emettent : admin-login au moment de
 * la connexion, et finalize a chaque cloture reussie, pour que la session
 * GLISSE. Dupliquer la liste d'attributs entre les deux, c'etait prendre le
 * risque qu'un jour l'un des deux perde `Secure` ou `HttpOnly` sans que
 * personne le voie.
 *
 * Path est limite a /api/guichet : le cookie n'est jamais joint aux pages du
 * site, seulement aux appels du guichet. SameSite=Strict empeche toute page
 * tierce de le faire partir ; finalize verifie l'origine en plus.
 */
function poserCookieAdmin(res, id, dureeS) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_ADMIN}=${id}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/api/guichet',
    `Max-Age=${dureeS}`,
  ].join('; '));
}

function json(res, code, corps) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  /* Une session est propre a un client et evolue seconde par seconde : jamais
     de mise en cache, ni par le navigateur ni par le CDN. */
  res.setHeader('cache-control', 'no-store, max-age=0');
  return res.status(code).json(corps);
}

/**
 * Traduit une erreur du store en reponse HTTP, sans jamais fuiter de secret.
 * Le detail lisible ne part au client que si la base n'est pas configuree :
 * c'est une erreur d'exploitation, pas une donnee sensible, et elle fait gagner
 * une heure de recherche.
 */
function erreurServeur(res, err) {
  if (err && err.code === 'redis_not_configured') {
    console.error('[guichet]', err.message);
    return json(res, 503, { error: 'redis_not_configured', message: err.message });
  }
  console.error('[guichet]', (err && err.message) || err);
  return json(res, 503, { error: 'storage_unavailable' });
}

module.exports = {
  ALLOWED_ORIGINS,
  COOKIE_ADMIN,
  originAutorisee,
  origineStricte,
  lireCookie,
  poserCookieAdmin,
  json,
  erreurServeur,
};
