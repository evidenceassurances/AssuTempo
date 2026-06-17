/**
 * Proxy serverless securise vers l'API Anthropic pour l'assistant Assutempo.
 *
 * Runtime Node (pas Edge). La cle API ne quitte jamais le serveur : le client
 * poste seulement l'historique `messages`, jamais de `system`, jamais de cle.
 *
 * Format de requete verifie sur la reference Claude API :
 *   - header `anthropic-version: 2023-06-01`
 *   - `system` est un tableau de blocs `{type:"text", text, cache_control}`
 *   - `cache_control: {type:"ephemeral"}` active le prompt caching sur le bloc
 *     systeme (le prompt systeme est stable -> il est mis en cache, ce qui
 *     reduit le cout des appels repetes).
 *
 * Configuration : la cle se regle dans Vercel -> Project Settings ->
 * Environment Variables (ANTHROPIC_API_KEY), puis redeploiement. Voir
 * src/assistant/README.md.
 */

// Modele : qualite premium. Pour reduire le cout, passer a "claude-haiku-4-5".
const MODEL = 'claude-sonnet-4-6';

// Domaines autorises a appeler l'endpoint (facile a editer). Laisser vide []
// pour desactiver le controle d'origine (non recommande en production).
const ALLOWED_ORIGINS = ['https://assutempo.fr', 'https://www.assutempo.fr'];

// Prompt systeme fixe cote serveur : l'endpoint ne peut jamais servir
// d'assistant Claude generique. Aucun `system` venant du client n'est accepte.
const SYSTEM_PROMPT = `Tu es l'assistant virtuel d'Assutempo, courtier en assurances 100 % en ligne, specialise dans l'assurance auto temporaire et la carte grise (France). Tu incarnes une marque premium : ton clair, chaleureux, rassurant, vouvoiement, sans jargon inutile. Reponses concises (2 a 4 phrases).

## Ton expertise
Assurance auto temporaire :
- Couverture de courte duree, de 1 a 90 jours, dans 34 pays europeens.
- Cas d'usage : achat ou revente d'un vehicule, essai avant achat, pret ou emprunt de vehicule, conducteur occasionnel, vehicule en attente d'une assurance definitive, importation, permis recent, deplacement ponctuel.
- Conditions generales : permis valide, age minimum, vehicule eligible (type, usage, etat). Les conditions exactes dependent du profil et du vehicule, invite a verifier via le parcours de devis.
- Permis etranger : souvent accepte selon les cas ; invite a verifier l'eligibilite dans le parcours en ligne.
- Documents : depuis avril 2024, la carte verte papier n'est plus obligatoire ; le justificatif est le memo vehicule remis apres souscription, et le vehicule est inscrit au Fichier des Vehicules Assures (FVA).

Autres domaines :
- Carte grise : demarche d'immatriculation en ligne via un partenaire agree.
- Assurance voyage : couverture pour les deplacements a l'etranger.
- Assurance en general : explique clairement et de facon pedagogique les notions courantes (responsabilite civile, tous risques, franchise, garanties, resiliation, etc.).

## Regles de comportement
- Ne donne JAMAIS de prix ferme : le tarif depend du vehicule, de la duree et du profil. Invite a lancer un devis sur le site.
- N'invente jamais une garantie, un prix, une condition ou une information legale dont tu n'es pas certain. En cas de doute, dis-le et oriente vers un conseiller.
- Si l'utilisateur semble avoir besoin d'aide pour realiser une demarche (souscrire, trouver le formulaire, faire sa carte grise), propose-lui ton accompagnement guide pas a pas.
- Pour un cas complexe, sensible ou hors de ta competence, propose la mise en relation avec un conseiller (formulaire de contact, ou telephone 09 74 19 78 20, du lundi au vendredi 9h-21h et le samedi 9h-20h).
- Reste dans ton domaine (assurances et demarches Assutempo). Recentre poliment toute question hors sujet.
- Ne demande ni ne conserve de donnees personnelles sensibles (numero de permis, RIB, etc.).
- Reponds toujours en francais.`;

// Garde-fou de debit best-effort, en memoire (par IP). Sur Vercel, la memoire
// n'est pas partagee entre instances : pour un vrai rate-limiting persistant,
// utiliser Vercel KV / Upstash Redis.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const win = 60_000;
  const max = 20;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Controle d'origine (allowlist).
  const origin = req.headers.origin || req.headers.referer || '';
  if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  // Validation stricte du body : roles {user, assistant} uniquement, content
  // chaine. On plafonne a 16 messages et 4000 caracteres par message.
  let { messages } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'bad_request' });
  }
  messages = messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string',
    )
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (!messages.length) {
    return res.status(400).json({ error: 'empty' });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: [
          { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages,
      }),
    });

    if (!r.ok) {
      return res.status(502).json({ error: 'upstream_error' });
    }

    const data = await r.json();
    const text = (data.content || [])
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('\n')
      .trim();

    // On ne logge jamais le contenu des conversations (RGPD / minimisation).
    return res.status(200).json({ text });
  } catch {
    return res.status(502).json({ error: 'upstream_error' });
  }
}
