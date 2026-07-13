'use strict';

/**
 * POST /api/guichet/admin-login
 *
 * Autorise CE navigateur a cloturer des dossiers, sans qu'aucun secret ne soit
 * jamais depose dans une page.
 *
 * Corps  : { "token": "<GUICHET_ADMIN_TOKEN>" }
 * Effet  : pose le cookie `guichet_admin`, signe, valable 30 jours.
 * Reponse: { ok: true }
 *
 * Le cookie n'est pas le jeton (voir src/server/admin-cookie.js) : c'est un
 * horodatage d'expiration signe en HMAC-SHA256. Il est ensuite GLISSANT : chaque
 * cloture reussie le repose pour 30 jours de plus. Tant que le guichet travaille
 * au moins une fois par mois, Ayoub n'a plus jamais a se reconnecter.
 *
 * Rien n'est jamais logge du jeton ni du contenu du cookie.
 */

const { rateLimited } = require('../../src/server/guichet-store.js');
const { origineStricte, json, erreurServeur } = require('../../src/server/http.js');
const { secrets, jetonValide, poserCookie } = require('../../src/server/admin-cookie.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  /* Origine stricte : la connexion ne doit etre declenchable que depuis une page
     du site, jamais depuis une page tierce sur laquelle on aurait attire Ayoub. */
  if (!origineStricte(req)) {
    return json(res, 403, { error: 'forbidden' });
  }

  let jeton;
  let cle;
  try {
    ({ jeton, cle } = secrets());
  } catch (err) {
    /* Message d'exploitation, sans aucun secret : il nomme la variable absente,
       jamais sa valeur. */
    console.error('[guichet]', err.message);
    return json(res, 503, { error: 'admin_config_missing', message: err.message });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'inconnue';

  try {
    /* Une connexion est un evenement rare (une fois par mois au plus, et plus
       jamais tant que le cookie glisse). Un plafond bas ferme la porte a l'essai
       systematique du jeton. */
    if (await rateLimited(`admin:${ip}`, 5, 600)) {
      return json(res, 429, { error: 'rate_limited' });
    }
  } catch (err) {
    return erreurServeur(res, err);
  }

  const fourni = (req.body && typeof req.body.token === 'string') ? req.body.token : '';
  if (!fourni || !jetonValide(fourni, jeton)) {
    return json(res, 401, { error: 'unauthorized' });
  }

  poserCookie(res, cle);
  return json(res, 200, { ok: true });
};
