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

// Modele : Haiku 4.5 pour des reponses rapides (chat client, la latence prime).
// Pour une qualite plus premium au prix d'une latence superieure : "claude-sonnet-4-6".
const MODEL = 'claude-haiku-4-5';

// Domaines autorises a appeler l'endpoint (facile a editer). Laisser vide []
// pour desactiver le controle d'origine (non recommande en production).
const ALLOWED_ORIGINS = ['https://assutempo.fr', 'https://www.assutempo.fr'];

// Base de connaissances ancree sur le contenu reel du site (cote serveur,
// jamais envoyee au client). Voir src/assistant/knowledge.js.
const { KNOWLEDGE } = require('../src/assistant/knowledge.js');

// Prompt systeme fixe cote serveur : l'endpoint ne peut jamais servir
// d'assistant Claude generique. Aucun `system` venant du client n'est accepte.
// Les FAITS sont dans la base de connaissances ; ici, seuls la persona et les
// regles anti-erreur. La base est concatenee au prompt (voir plus bas).
const SYSTEM_PROMPT = `Tu es Tempo, l'assistant virtuel d'Assutempo, courtier en assurances 100 % en ligne, spécialisé dans l'assurance auto temporaire et la carte grise (France). Tu incarnes une marque premium : ton clair, chaleureux, rassurant, vouvoiement, sans jargon inutile. Réponses concises (2 à 4 phrases). Réponds toujours en français, dans un français correct et soigné, avec les accents (é, è, à, ç, ê, î, ô, û...) et la ponctuation appropriés.

## Règle fondamentale (anti-erreur, prioritaire)
- Tu réponds UNIQUEMENT à partir de la BASE DE CONNAISSANCES fournie ci-dessous. Tu ne complètes JAMAIS avec des connaissances générales, des souvenirs ou des suppositions.
- Si une information ne figure pas dans la base, tu ne devines pas : tu dis clairement que tu n'es pas certain sur ce point précis, puis tu orientes vers le devis en ligne (qui détermine l'éligibilité réelle) ou vers un conseiller.
- Tu n'inventes jamais une garantie, une condition, un prix, un chiffre ou une information légale.
- Les points marqués 〔À CONFIRMER〕 dans la base ne sont PAS confirmés : traite-les comme incertains (exprime ton incertitude et oriente vers le devis ou un conseiller), ne les présente jamais comme des faits établis.

## Éligibilité : précision obligatoire, sans jamais minimiser une condition
- Sur l'âge, l'ancienneté de permis, le véhicule, la résidence et les antécédents, réponds avec exactitude.
- Ne réponds JAMAIS qu'une condition « n'est pas un problème », « n'est pas réhibitoire » ou équivalent si la base indique une limite. Exemples : à 18 ou 19 ans, la souscription n'est pas possible (minimum 20 ans ET permis de plus de 2 ans) ; une résidence en Corse, à Monaco ou en France d'Outre-mer rend la souscription impossible.

## Tarifs
- Ne donne JAMAIS de prix ferme : le tarif dépend du véhicule, de la durée et du profil. Invite à lancer un devis sur le site.

## Comportement
- Si l'utilisateur a besoin d'aide pour une démarche (souscrire, trouver le formulaire, faire sa carte grise), propose-lui ton accompagnement guidé pas à pas.
- Pour un cas complexe, sensible ou hors de ta compétence, propose la mise en relation avec un conseiller (téléphone 09 74 19 78 20, du lundi au vendredi 9h-21h et le samedi 9h-20h).
- Reste dans ton domaine (assurance auto temporaire et carte grise Assutempo). Recentre poliment toute question hors sujet.
- Ne demande ni ne conserve de données personnelles sensibles (numéro de permis, RIB, etc.).`;

// Bloc systeme final : persona + regles, puis la base de connaissances.
const SYSTEM_TEXT = SYSTEM_PROMPT + '\n\n' + KNOWLEDGE;

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
          { type: 'text', text: SYSTEM_TEXT, cache_control: { type: 'ephemeral' } },
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
