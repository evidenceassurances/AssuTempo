'use strict';

/**
 * Cookie d'administration du Guichet de Nuit : signe, sans etat, glissant.
 *
 * Pourquoi il existe
 * ------------------
 * La souscription automatisee ne tourne pas sur un serveur : elle pilote le
 * navigateur Chrome d'Ayoub. Le bac a sable qui l'execute ne peut ni lire
 * GUICHET_ADMIN_TOKEN, ni joindre assutempo.fr. L'appel de cloture part donc de
 * la PAGE. Or poser le jeton dans du JavaScript, ou dans le localStorage du site
 * public, reviendrait a deposer sur les pages que visitent les clients la cle
 * qui decide des tarifs : une seule injection de script suffirait a la voler.
 *
 * Ce que contient le cookie
 * -------------------------
 * Sa valeur n'est PAS le jeton maitre. C'est :
 *
 *     <horodatage d'expiration>.<HMAC-SHA256 de cet horodatage>
 *
 * signe avec GUICHET_COOKIE_SECRET, une variable d'environnement distincte du
 * jeton. Meme intercepte, le cookie ne revele donc jamais GUICHET_ADMIN_TOKEN :
 * il ne permet que ce qu'il permet, et il expire.
 *
 * Il est HttpOnly (le JavaScript de la page ne peut pas le lire, donc une
 * injection de script ne peut pas l'exfiltrer), Secure (HTTPS seulement),
 * SameSite=Lax (un POST venant d'un site tiers ne l'emporte pas : le navigateur
 * ne le joint pas), et limite au chemin /api/guichet (il ne part jamais vers le
 * reste du site).
 *
 * Glissant
 * --------
 * A chaque appel authentifie reussi, le cookie est repose avec une nouvelle
 * expiration a 30 jours. Tant que le guichet cloture au moins un dossier par
 * mois, il ne meurt jamais, et Ayoub n'a plus jamais a se reconnecter.
 *
 * Limite assumee : un cookie signe n'est PAS revocable individuellement. Pour
 * invalider un cookie compromis, il faut changer GUICHET_COOKIE_SECRET, ce qui
 * deconnecte tous les navigateurs a la fois. C'est le prix du sans-etat.
 */

const crypto = require('node:crypto');

const NOM_COOKIE = 'guichet_admin';
const DUREE_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_AGE_S = Math.floor(DUREE_MS / 1000);

/**
 * Lit les secrets. Leve une erreur explicite (et jamais un TypeError obscur) si
 * l'un manque : la porte reste alors fermee plutot que de s'ouvrir par defaut.
 * Ne loggue et ne renvoie JAMAIS la valeur des secrets.
 */
function secrets() {
  const jeton = process.env.GUICHET_ADMIN_TOKEN;
  const cle = process.env.GUICHET_COOKIE_SECRET;

  const manquantes = [];
  if (!jeton) manquantes.push('GUICHET_ADMIN_TOKEN');
  if (!cle) manquantes.push('GUICHET_COOKIE_SECRET');

  if (manquantes.length) {
    const err = new Error(
      `Guichet de Nuit : variable(s) d'environnement manquante(s) : ${manquantes.join(', ')}. `
      + "L'authentification d'administration est desactivee tant qu'elles ne sont pas posees. "
      + 'Les ajouter dans Vercel > Settings > Environment Variables, puis redeployer.',
    );
    err.code = 'admin_config_missing';
    err.manquantes = manquantes;
    throw err;
  }

  return { jeton, cle };
}

const signer = (expiration, cle) => crypto
  .createHmac('sha256', cle)
  .update(String(expiration))
  .digest('base64url');

/** Fabrique une valeur de cookie valable 30 jours a partir de maintenant. */
function fabriquerValeur(cle) {
  const expiration = Date.now() + DUREE_MS;
  return `${expiration}.${signer(expiration, cle)}`;
}

/**
 * Verifie une valeur de cookie : signature d'abord (a duree constante), date
 * ensuite. Une signature fausse et un cookie perime sont tous deux refuses, et
 * de la meme facon : on ne renseigne pas un attaquant sur ce qui a echoue.
 */
function valeurValide(valeur, cle) {
  if (typeof valeur !== 'string' || !valeur) return false;

  const separateur = valeur.indexOf('.');
  if (separateur === -1) return false;

  const expiration = valeur.slice(0, separateur);
  const signature = valeur.slice(separateur + 1);
  if (!/^\d{1,15}$/.test(expiration) || !signature) return false;

  const attendue = Buffer.from(signer(expiration, cle));
  const fournie = Buffer.from(signature);
  if (attendue.length !== fournie.length) return false;
  if (!crypto.timingSafeEqual(attendue, fournie)) return false;

  return Number(expiration) > Date.now();
}

/** Comparaison a duree constante : un `===` fuit le jeton caractere par caractere. */
function jetonValide(fourni, attendu) {
  const a = Buffer.from(String(fourni));
  const b = Buffer.from(String(attendu));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Pose (ou repose) le cookie. C'est ce rappel qui le fait glisser. */
function poserCookie(res, cle) {
  res.setHeader('Set-Cookie', [
    `${NOM_COOKIE}=${fabriquerValeur(cle)}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Path=/api/guichet',
    `Max-Age=${MAX_AGE_S}`,
  ].join('; '));
}

function lireCookie(req) {
  const brut = req.headers.cookie || '';
  for (const morceau of brut.split(';')) {
    const i = morceau.indexOf('=');
    if (i === -1) continue;
    if (morceau.slice(0, i).trim() === NOM_COOKIE) {
      return decodeURIComponent(morceau.slice(i + 1).trim());
    }
  }
  return '';
}

module.exports = {
  NOM_COOKIE,
  DUREE_MS,
  MAX_AGE_S,
  secrets,
  fabriquerValeur,
  valeurValide,
  jetonValide,
  poserCookie,
  lireCookie,
};
