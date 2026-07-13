'use strict';

/**
 * Stockage des sessions du Guichet de Nuit (Upstash Redis via son API REST).
 *
 * Pourquoi ce module existe
 * -------------------------
 * La page /guichet-de-nuit promet un devis en 30 minutes, faute de quoi la
 * majoration de nuit est offerte. C'est une decision qui coute de l'argent :
 * elle ne peut donc PAS reposer sur l'horloge du navigateur du client, qui est
 * a la fois falsifiable (il suffit de reculer l'horloge du telephone) et
 * peu fiable (Safari iOS gele les timers d'un onglet passe en arriere-plan).
 * Le serveur est la seule source de verite sur le temps. Le compteur reste
 * affiche cote client, mais uniquement comme habillage : il est resynchronise
 * sur le serveur, et il ne decide de rien.
 *
 * Pourquoi pas le SDK @upstash/redis
 * ----------------------------------
 * CLAUDE.md interdit toute nouvelle dependance npm et le portique qualite
 * (scripts/quality-gate.mjs) fait echouer les PR qui touchent a package.json.
 * L'API REST d'Upstash est du HTTP simple : un POST dont le corps est la
 * commande Redis sous forme de tableau JSON. Le SDK n'apporterait ici qu'un
 * sucre syntaxique. Meme base, memes variables, zero dependance. C'est deja le
 * parti pris de api/chat.js, qui appelle l'API Anthropic en fetch pur.
 *
 * Variables d'environnement (posees automatiquement par l'integration Upstash
 * du marketplace Vercel, sur les cibles Production et Preview) :
 *   KV_REST_API_URL    point d'entree REST de la base
 *   KV_REST_API_TOKEN  jeton de lecture/ecriture
 * Les variables KV_URL, REDIS_URL et KV_REST_API_READ_ONLY_TOKEN existent aussi
 * mais ne servent pas ici (elles s'adressent a un client Redis natif TCP).
 */

const crypto = require('node:crypto');

/* La promesse commerciale affichee sur la page. Une seule definition cote
   serveur : c'est elle qui fait foi pour la decision tarifaire. */
const DUREE_VEILLE_MS = 30 * 60 * 1000;

/* Duree de vie d'une session non finalisee.
   Elle etait de 2 h. C'etait trop court, et c'etait dangereux : un dossier
   depose a 2 h du matin, une automatisation qui plante, et la session avait
   disparu avant qu'un humain ne se reveille. Impossible alors de savoir depuis
   quand le client attendait, donc impossible de trancher le tarif autrement
   qu'a la main. Un filet de securite doit survivre a une nuit, pas expirer en
   plein milieu.
   Une session finalisee, elle, porte une decision financiere : on la garde
   90 jours pour pouvoir la justifier a un client qui conteste. */
const TTL_SESSION_S = 7 * 24 * 60 * 60;
const TTL_DECISION_S = 90 * 24 * 60 * 60;

/* Journal des decisions, plafonne : de quoi relire les derniers dossiers sans
   faire grossir la base indefiniment. */
const JOURNAL_KEY = 'gn:journal';
const JOURNAL_MAX = 500;

const keySession = (id) => `gn:session:${id}`;
const keyReference = (ref) => `gn:ref:${ref}`;

/**
 * Lit la configuration Redis. Leve une erreur explicite (et non un TypeError
 * obscur sur `undefined`) si l'integration Upstash n'est pas branchee sur
 * l'environnement courant.
 */
function config() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  const manquantes = [];
  if (!url) manquantes.push('KV_REST_API_URL');
  if (!token) manquantes.push('KV_REST_API_TOKEN');

  if (manquantes.length) {
    const err = new Error(
      `Guichet de Nuit : base Redis non configuree, variable(s) manquante(s) : ${manquantes.join(', ')}. `
      + "Sur Vercel, ces variables sont posees par l'integration Upstash (Storage > la base > Connect Project) "
      + 'pour les cibles Production et Preview. En local, les recuperer avec '
      + '`vercel env pull .env.local --environment=preview`.',
    );
    err.code = 'redis_not_configured';
    throw err;
  }

  return { url: url.replace(/\/+$/, ''), token };
}

/**
 * Envoie une commande Redis a Upstash.
 * Exemple : command('SET', 'cle', 'valeur', 'EX', 7200) -> 'OK'
 */
async function command(...args) {
  const { url, token } = config();

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(args.map((a) => String(a))),
    });
  } catch (cause) {
    const err = new Error(`Guichet de Nuit : Redis injoignable (${args[0]}).`);
    err.code = 'redis_unreachable';
    err.cause = cause;
    throw err;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data || typeof data.error === 'string') {
    const detail = (data && data.error) || `HTTP ${res.status}`;
    const err = new Error(`Guichet de Nuit : Redis a refuse la commande ${args[0]} (${detail}).`);
    err.code = 'redis_error';
    throw err;
  }

  return data.result;
}

/**
 * Compteur de debit best-effort, persistant (contrairement au compteur en
 * memoire de api/chat.js, qui ne survit pas au changement d'instance).
 * Renvoie true si l'appelant depasse `max` requetes sur `fenetreS` secondes.
 */
async function rateLimited(bucket, max, fenetreS) {
  const cle = `gn:rl:${bucket}`;
  const hits = Number(await command('INCR', cle));
  if (hits === 1) await command('EXPIRE', cle, fenetreS);
  return hits > max;
}

/**
 * Etat public d'une session, calcule a partir de l'horloge SERVEUR.
 * `serverNow` est renvoye au client pour qu'il puisse mesurer le decalage de sa
 * propre horloge et afficher un compteur juste meme si son telephone est a
 * l'heure de Tokyo.
 */
function etat(session) {
  const serverNow = Date.now();
  const debut = session.finalized ? session.finalizedAt : serverNow;
  const elapsed = Math.max(0, debut - session.startTime);

  return {
    found: true,
    sessionId: session.id,
    reference: session.reference || '',
    startTime: session.startTime,
    serverNow,
    durationMs: DUREE_VEILLE_MS,
    elapsed,
    remaining: Math.max(0, DUREE_VEILLE_MS - elapsed),
    expired: elapsed > DUREE_VEILLE_MS,
    finalized: Boolean(session.finalized),
    finalizedAt: session.finalizedAt || null,
    status: session.status || 'pending',
    signatureUrl: session.signatureUrl || '',
    /* null tant que le guichet n'a pas repondu : on n'annonce jamais un tarif
       avant que le serveur ne l'ait tranche. */
    tarifPreferentiel: session.finalized ? Boolean(session.tarifPreferentiel) : null,
  };
}

async function getSession(sessionId) {
  if (!sessionId) return null;
  const brut = await command('GET', keySession(sessionId));
  if (!brut) return null;
  try {
    return typeof brut === 'string' ? JSON.parse(brut) : brut;
  } catch {
    return null;
  }
}

async function getSessionByReference(reference) {
  if (!reference) return null;
  const sessionId = await command('GET', keyReference(reference));
  return sessionId ? getSession(String(sessionId)) : null;
}

async function saveSession(session, ttlS) {
  await command('SET', keySession(session.id), JSON.stringify(session), 'EX', ttlS);
}

/**
 * Ouvre la veille d'un dossier. Le point de depart est l'horloge du serveur,
 * jamais une valeur envoyee par le client.
 *
 * Idempotent par reference : un rechargement de page, un double clic ou un
 * rappel de /start ne remet JAMAIS le compteur a zero. La premiere ouverture
 * gagne (SET ... NX), les suivantes recuperent la session existante.
 */
async function startSession(reference) {
  if (reference) {
    const existante = await getSessionByReference(reference);
    if (existante) return { session: existante, created: false };
  }

  const session = {
    id: crypto.randomBytes(16).toString('hex'),
    reference: reference || '',
    startTime: Date.now(),
    status: 'pending',
    finalized: false,
    finalizedAt: null,
    tarifPreferentiel: null,
    signatureUrl: '',
  };

  if (reference) {
    /* NX : si deux onglets ouvrent la meme reference en meme temps, un seul
       gagne et l'autre se raccroche a la session du gagnant. */
    const pose = await command('SET', keyReference(reference), session.id, 'EX', TTL_SESSION_S, 'NX');
    if (pose !== 'OK') {
      const gagnante = await getSessionByReference(reference);
      if (gagnante) return { session: gagnante, created: false };
    }
  }

  await saveSession(session, TTL_SESSION_S);
  return { session, created: true };
}

/**
 * Cloture un dossier : c'est ICI que se decide le tarif.
 *
 * Le temps ecoule est calcule par le serveur, entre le depart enregistre a
 * l'ouverture et l'instant present. Le client n'envoie jamais de duree, et
 * aucune duree recue de l'exterieur n'est lue. Idempotent : une seconde
 * cloture ne rejoue pas la decision, elle renvoie celle qui a ete prise.
 */
async function finalizeSession(session, { status, signatureUrl } = {}) {
  /* Deja tranche : la decision tarifaire est GELEE, on ne la rejoue jamais.
     En revanche l'avancement du dossier, lui, peut encore progresser.
     C'est ce qui permet a la souscription automatisee de travailler en deux
     temps : elle clot une premiere fois au moment ou elle fixe les honoraires
     (c'est LA que le tarif doit etre connu, sinon la promesse est decidee mais
     jamais appliquee), puis rappelle avec `signature_sent` quand le lien part
     vraiment chez le client. Le prix facture et la decision enregistree ne
     peuvent donc plus diverger. */
  if (session.finalized) {
    const avance = {
      ...session,
      status: status || session.status,
      signatureUrl: signatureUrl || session.signatureUrl || '',
    };
    const bouge = avance.status !== session.status
      || avance.signatureUrl !== session.signatureUrl;
    if (bouge) await saveSession(avance, TTL_DECISION_S);
    return { session: avance, rejoue: true };
  }

  const finalizedAt = Date.now();
  const elapsed = Math.max(0, finalizedAt - session.startTime);

  const finalisee = {
    ...session,
    finalized: true,
    finalizedAt,
    elapsedMs: elapsed,
    tarifPreferentiel: elapsed > DUREE_VEILLE_MS,
    status: status || 'signature_sent',
    signatureUrl: signatureUrl || session.signatureUrl || '',
  };

  await saveSession(finalisee, TTL_DECISION_S);
  if (finalisee.reference) {
    await command('EXPIRE', keyReference(finalisee.reference), TTL_DECISION_S);
  }

  /* Trace lisible : de quoi justifier la decision a un client qui conteste. */
  await command('LPUSH', JOURNAL_KEY, JSON.stringify({
    reference: finalisee.reference,
    sessionId: finalisee.id,
    startTime: finalisee.startTime,
    finalizedAt,
    elapsedMs: elapsed,
    elapsedMinutes: Math.round(elapsed / 60000),
    tarifPreferentiel: finalisee.tarifPreferentiel,
  }));
  await command('LTRIM', JOURNAL_KEY, 0, JOURNAL_MAX - 1);

  return { session: finalisee, rejoue: false };
}

module.exports = {
  DUREE_VEILLE_MS,
  TTL_SESSION_S,
  command,
  rateLimited,
  etat,
  getSession,
  getSessionByReference,
  startSession,
  finalizeSession,
};
