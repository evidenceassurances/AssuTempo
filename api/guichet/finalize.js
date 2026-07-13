'use strict';

/**
 * POST /api/guichet/finalize
 *
 * Cloture un dossier au moment ou le guichet emet le contrat. C'est ICI, et
 * nulle part ailleurs, que se decide le tarif :
 *
 *   elapsed = maintenant (horloge serveur) - startTime (enregistre a l'ouverture)
 *   tarifPreferentiel = elapsed > 30 minutes
 *
 * Le client ne transmet jamais de duree, et aucune duree recue de l'exterieur
 * n'est lue. Meme un client qui recule l'horloge de son telephone, gele son
 * onglet ou rejoue les requetes ne peut pas influencer la decision.
 *
 * RESERVE AU GUICHET. Un endpoint de cloture ouvert au public serait une porte
 * ouverte a la fraude : il suffirait d'attendre 31 minutes puis de declencher
 * soi-meme la cloture pour s'octroyer le tarif preferentiel, quelle qu'ait ete
 * la rapidite reelle du guichet. D'ou le jeton secret, et le refus de
 * fonctionner tant qu'il n'est pas configure (on bloque plutot qu'on n'ouvre).
 *
 * Appel :
 *   POST /api/guichet/finalize
 *   Authorization: Bearer <GUICHET_ADMIN_TOKEN>
 *   { "reference": "GN-20260713-2312-K7QP", "signatureUrl": "https://..." }
 *
 * Reponse :
 *   { reference, elapsedMinutes, tarifPreferentiel, decideLe, rejoue }
 *
 * Idempotent : une seconde cloture du meme dossier ne rejoue pas la decision,
 * elle renvoie celle qui a deja ete prise (rejoue: true).
 */

const {
  getSession, getSessionByReference, finalizeSession, DUREE_VEILLE_MS,
} = require('../../src/server/guichet-store.js');
const { json, erreurServeur, origineStricte } = require('../../src/server/http.js');
const {
  secrets, jetonValide, valeurValide, poserCookie, lireCookie,
} = require('../../src/server/admin-cookie.js');

const SESSION_ID_RE = /^[a-f0-9]{32}$/;
const REFERENCE_RE = /^GN-\d{8}-\d{4}-[A-Z0-9]{4}$/;
const STATUTS = ['pending', 'quote_created', 'signature_sent', 'paid'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  let jeton;
  let cle;
  try {
    ({ jeton, cle } = secrets());
  } catch (err) {
    /* Fail-closed : sans secrets, la porte reste fermee. Le message nomme la
       variable absente, jamais sa valeur. */
    console.error('[guichet]', err.message);
    return json(res, 503, { error: 'admin_config_missing', message: err.message });
  }

  /* Deux voies d'authentification, et deux seulement.

     1. Jeton Bearer : pour un appel depuis un terminal ou un serveur (le skill
        du depot, sur la machine d'Ayoub).
     2. Cookie signe : pour un appel depuis le navigateur Chrome, ou tourne la
        souscription automatisee. Son bac a sable ne peut ni lire une variable
        d'environnement, ni joindre assutempo.fr : l'appel doit donc partir de la
        page. Le cookie evite d'y deposer le jeton, qui serait alors volable par
        une injection de script.

     Sur la voie cookie, l'origine est verifiee STRICTEMENT : le navigateur joint
     le cookie tout seul, donc une page tierce pourrait sinon declencher une
     cloture a l'insu d'Ayoub. Le SameSite=Lax l'empeche deja sur un POST venu
     d'ailleurs ; ceci est la seconde serrure. */
  const entete = req.headers.authorization || '';
  const bearer = entete.startsWith('Bearer ') ? entete.slice(7) : '';

  const autorise = bearer
    ? jetonValide(bearer, jeton)
    : (origineStricte(req) && valeurValide(lireCookie(req), cle));

  if (!autorise) {
    return json(res, 401, { error: 'unauthorized' });
  }

  /* Le cookie GLISSE : chaque cloture reussie le repose pour 30 jours. Tant que
     le guichet travaille au moins une fois par mois, il ne meurt jamais et Ayoub
     n'a plus a se reconnecter. Pose des maintenant : la reponse peut sortir par
     plusieurs chemins plus bas, et un renouvellement oublie ferait expirer le
     cookie en silence, une nuit, sans que personne ne comprenne pourquoi. */
  poserCookie(res, cle);

  const corps = req.body || {};
  const sessionId = typeof corps.sessionId === 'string' ? corps.sessionId.trim() : '';
  const reference = typeof corps.reference === 'string' ? corps.reference.trim().toUpperCase() : '';

  /* Champs facultatifs poses par le guichet, jamais par le client. */
  const statut = STATUTS.includes(corps.status) ? corps.status : 'signature_sent';
  let signatureUrl = '';
  if (typeof corps.signatureUrl === 'string' && corps.signatureUrl) {
    try {
      const u = new URL(corps.signatureUrl);
      if (u.protocol !== 'https:') throw new Error('https attendu');
      signatureUrl = u.href;
    } catch {
      return json(res, 400, { error: 'bad_signature_url' });
    }
  }

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
      /* Passe 7 jours sans cloture, la session s'efface. Le dossier existe
         toujours (le mail est dans la boite du guichet), mais le serveur n'a
         plus de point de depart : il ne peut donc pas trancher. Ne jamais
         deviner. */
      return json(res, 404, {
        error: 'session_introuvable',
        message: "Aucune veille ouverte pour ce dossier (jamais ouverte, ou expiree au-dela de 7 jours). Le tarif doit etre tranche a la main.",
      });
    }

    const { session: finalisee, rejoue } = await finalizeSession(session, { status: statut, signatureUrl });
    const elapsed = finalisee.elapsedMs;

    return json(res, 200, {
      reference: finalisee.reference,
      sessionId: finalisee.id,
      elapsedMs: elapsed,
      elapsedMinutes: Math.round(elapsed / 60000),
      seuilMinutes: Math.round(DUREE_VEILLE_MS / 60000),
      tarifPreferentiel: finalisee.tarifPreferentiel,
      /* Heures lisibles a Paris : de quoi recouper avec l'heure du mail recu au
         guichet sans convertir des timestamps a la main. */
      ouvertLe: new Date(finalisee.startTime).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      decideLe: new Date(finalisee.finalizedAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      status: finalisee.status,
      rejoue,
    });
  } catch (err) {
    return erreurServeur(res, err);
  }
};
