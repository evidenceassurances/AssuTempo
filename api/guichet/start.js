'use strict';

/**
 * POST /api/guichet/start
 *
 * Ouvre la veille de 30 minutes d'un dossier du Guichet de Nuit.
 * Appelee par le front une fois la demande reellement deposee.
 *
 * Le point de depart est l'horloge du SERVEUR. Aucun temps envoye par le client
 * n'est lu, ici ou ailleurs.
 *
 * Corps attendu : { reference: "GN-20260713-2312-K7QP" }
 * Reponse       : { sessionId, startTime, serverNow, durationMs, reference }
 *
 * Idempotent : rappeler /start avec la meme reference renvoie la session
 * existante sans remettre le compteur a zero (rechargement de page, double clic,
 * deux onglets).
 */

const { startSession, etat, rateLimited } = require('../../src/server/guichet-store.js');
const { originAutorisee, json, erreurServeur } = require('../../src/server/http.js');

/* Format de reference produit par le front : GN-AAAAMMJJ-HHMM-XXXX.
   Regex stricte : la reference sert de cle Redis, elle ne doit contenir que ce
   qu'on attend. */
const REFERENCE_RE = /^GN-\d{8}-\d{4}-[A-Z0-9]{4}$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }
  if (!originAutorisee(req)) {
    return json(res, 403, { error: 'forbidden' });
  }

  const corps = req.body || {};
  const reference = typeof corps.reference === 'string' ? corps.reference.trim().toUpperCase() : '';

  if (!REFERENCE_RE.test(reference)) {
    return json(res, 400, { error: 'bad_reference' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'inconnue';

  try {
    /* Une ouverture de session est rare et volontaire : 10 par minute et par IP
       laisse toute la place aux rechargements de page (idempotents) tout en
       fermant la porte au remplissage automatise de la base. */
    if (await rateLimited(`start:${ip}`, 10, 60)) {
      return json(res, 429, { error: 'rate_limited' });
    }

    const { session } = await startSession(reference);
    return json(res, 200, etat(session));
  } catch (err) {
    return erreurServeur(res, err);
  }
};
