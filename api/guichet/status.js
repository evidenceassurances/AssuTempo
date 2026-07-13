'use strict';

/**
 * GET /api/guichet/status?sessionId=...
 * (ou ?reference=GN-... : la reference suffit, c'est elle que le client a sous
 *  les yeux et qu'il peut dicter au telephone.)
 *
 * Recalcule le temps a partir du startTime STOCKE et de l'horloge du serveur.
 * Aucun temps envoye par le client n'est lu.
 *
 * Reponse : { found, elapsed, remaining, expired, finalized, status,
 *             signatureUrl, tarifPreferentiel, startTime, serverNow, durationMs }
 *
 * `serverNow` permet au front de mesurer le decalage de l'horloge du telephone
 * et d'afficher un compteur juste sans jamais se fier a sa propre heure.
 *
 * Session introuvable (expiree, ou jamais ouverte) : 404 + { found: false }.
 * Le front doit traiter ce cas comme une fin de veille, pas comme une panne.
 */

const { getSession, getSessionByReference, etat } = require('../../src/server/guichet-store.js');
const { originAutorisee, json, erreurServeur } = require('../../src/server/http.js');

const SESSION_ID_RE = /^[a-f0-9]{32}$/;
const REFERENCE_RE = /^GN-\d{8}-\d{4}-[A-Z0-9]{4}$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'method_not_allowed' });
  }
  if (!originAutorisee(req)) {
    return json(res, 403, { error: 'forbidden' });
  }

  const q = req.query || {};
  const sessionId = typeof q.sessionId === 'string' ? q.sessionId.trim() : '';
  const reference = typeof q.reference === 'string' ? q.reference.trim().toUpperCase() : '';

  try {
    let session = null;

    if (SESSION_ID_RE.test(sessionId)) {
      session = await getSession(sessionId);
    } else if (REFERENCE_RE.test(reference)) {
      session = await getSessionByReference(reference);
    } else {
      return json(res, 400, { error: 'bad_request' });
    }

    if (!session) {
      return json(res, 404, { found: false });
    }

    return json(res, 200, etat(session));
  } catch (err) {
    return erreurServeur(res, err);
  }
};
