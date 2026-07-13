'use strict';

/**
 * Petites aides communes aux fonctions serverless du Guichet de Nuit.
 * Node natif, zero dependance.
 */

/* Origines autorisees a piloter une session depuis un navigateur. Les
   deploiements de previsualisation Vercel (*.vercel.app) ne sont pas listes :
   ils passent par la regle du meme hote, ci-dessous. */
const ALLOWED_ORIGINS = ['https://assutempo.fr', 'https://www.assutempo.fr'];

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

module.exports = { ALLOWED_ORIGINS, originAutorisee, json, erreurServeur };
