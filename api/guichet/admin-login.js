'use strict';

/**
 * POST /api/guichet/admin-login
 *
 * Ouvre le droit de cloturer des dossiers depuis CE navigateur, pour 30 jours.
 *
 * Pourquoi cet endpoint existe
 * ---------------------------
 * La souscription automatisee (skill JL Assure) ne tourne pas sur un serveur :
 * elle pilote le navigateur Chrome d'Ayoub. Le bac a sable qui l'execute ne peut
 * ni lire une variable d'environnement, ni joindre assutempo.fr. L'appel de
 * cloture doit donc partir de la PAGE.
 *
 * Or poser GUICHET_ADMIN_TOKEN dans du JavaScript, ou dans le localStorage du
 * site public, reviendrait a deposer sur les pages que visitent les clients la
 * cle qui decide des tarifs. Une seule injection de script suffirait a la voler.
 *
 * D'ou ce detour : Ayoub s'authentifie UNE fois avec le jeton, le serveur pose
 * un cookie HttpOnly, et l'automatisation n'a plus jamais besoin d'aucun secret.
 *
 * Le cookie :
 *   - HttpOnly : le JavaScript de la page ne peut pas le lire, donc une
 *     injection de script ne peut pas l'exfiltrer ;
 *   - Secure : il ne circule qu'en HTTPS ;
 *   - SameSite=Strict : un site tiers ne peut pas le faire partir a l'insu
 *     d'Ayoub ;
 *   - Path=/api/guichet : il n'est joint qu'aux appels du guichet, jamais au
 *     reste du site ;
 *   - sa valeur n'est PAS le jeton, mais un identifiant aleatoire revocable,
 *     sans aucune valeur en dehors de la base. Meme intercepte, il ne revele
 *     rien.
 *
 * Appel (depuis un onglet ouvert sur https://assutempo.fr) :
 *   POST /api/guichet/admin-login   { "token": "<GUICHET_ADMIN_TOKEN>" }
 */

const crypto = require('node:crypto');
const { ouvrirSessionAdmin, rateLimited, TTL_ADMIN_S } = require('../../src/server/guichet-store.js');
const {
  origineStricte, json, erreurServeur, poserCookieAdmin,
} = require('../../src/server/http.js');

/* Comparaison a duree constante : une comparaison naive (===) fuit le jeton
   caractere par caractere, mesure apres mesure. */
function jetonValide(fourni, attendu) {
  const a = Buffer.from(String(fourni));
  const b = Buffer.from(String(attendu));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  /* Origine stricte : cet endpoint ne doit etre appelable que depuis une page du
     site, jamais depuis une page tierce qui aurait attire Ayoub. */
  if (!origineStricte(req)) {
    return json(res, 403, { error: 'forbidden' });
  }

  const attendu = process.env.GUICHET_ADMIN_TOKEN;
  if (!attendu) {
    console.error('[guichet] GUICHET_ADMIN_TOKEN absent : la connexion est impossible.');
    return json(res, 503, { error: 'admin_token_missing' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'inconnue';

  try {
    /* Une connexion est un evenement rare (une fois par mois). Un plafond bas
       ferme la porte a l'essai systematique du jeton. */
    if (await rateLimited(`admin:${ip}`, 5, 600)) {
      return json(res, 429, { error: 'rate_limited' });
    }

    const fourni = (req.body && typeof req.body.token === 'string') ? req.body.token : '';
    if (!fourni || !jetonValide(fourni, attendu)) {
      return json(res, 401, { error: 'unauthorized' });
    }

    const { id } = await ouvrirSessionAdmin();

    poserCookieAdmin(res, id, TTL_ADMIN_S);

    return json(res, 200, {
      ok: true,
      message: 'Ce navigateur peut desormais cloturer des dossiers pendant 30 jours, sans jeton.',
      expireDans: '30 jours',
    });
  } catch (err) {
    return erreurServeur(res, err);
  }
};
