/* ─────────────────────────────────────────────────────────────────────────────
   Flag : drapeau SVG auto-heberge, source unique de verite pour tout le site.

   Pourquoi pas les emoji : les drapeaux Unicode sont des paires de Regional
   Indicator Symbols (U+1F1E6-U+1F1FF). Segoe UI Emoji n'embarque AUCUN glyphe
   de drapeau, donc la majorite des PC Windows affichait les deux lettres du
   code pays en petit et en gris a la place du drapeau. Aucune police systeme,
   aucune webfont couleur et aucun remplacement JS au runtime ne corrige ce cas
   sur les navigateurs anciens : seul un vrai fichier image le fait.

   Les SVG vivent dans public/flags (voir public/flags/LICENSE.txt) : servis
   depuis notre domaine, aucune requete tierce, aucun CDN a surveiller.
   Ratio 4:3, dimensions explicites sur le <img> : zero layout shift.
───────────────────────────────────────────────────────────────────────────── */

/* Codes ISO 3166-1 alpha-2 reellement presents dans public/flags. Un code
   absent ne rend RIEN plutot qu'une image cassee. */
const AVAILABLE = new Set([
  'ad', 'al', 'at', 'az', 'ba', 'be', 'bg', 'ch', 'cy', 'cz', 'de', 'dk',
  'ee', 'es', 'fi', 'fr', 'gb', 'gr', 'hr', 'hu', 'ie', 'is', 'it', 'lt',
  'lu', 'lv', 'ma', 'md', 'me', 'mk', 'mt', 'nl', 'no', 'pl', 'pt', 'ro',
  'se', 'si', 'sk', 'tn', 'tr',
]);

/**
 * @param {string} code  code ISO 3166-1 alpha-2 (insensible a la casse)
 * @param {number} size  largeur en px (hauteur = size * 0.75)
 * @param {string} label nom du pays. Fourni => le drapeau est annonce aux
 *                       lecteurs d'ecran. Omis => decoratif (le nom du pays
 *                       est deja en texte a cote), donc masque.
 */
function Flag({ code, size = 20, label, style }) {
  const iso = String(code || '').toLowerCase();
  if (!AVAILABLE.has(iso)) return null;

  const height = size * 0.75;

  return (
    <img
      className="flag-svg"
      src={`/flags/${iso}.svg`}
      width={size}
      height={height}
      /* Le drapeau est purement decoratif : il ne doit jamais disputer de la
         bande passante au contenu. lazy = pas telecharge tant que la section
         n'approche pas, priorite basse = servi apres tout le reste, async =
         decode hors du thread principal. Sur connexion faible, le nom du pays
         reste lisible en texte pendant que le drapeau arrive. */
      loading="lazy"
      fetchPriority="low"
      decoding="async"
      alt={label ? `Drapeau de ${label}` : ''}
      aria-hidden={label ? undefined : 'true'}
      style={style}
    />
  );
}

export default Flag;
