/* Helpers GA4 surs.
   GA4 est charge dynamiquement (voir src/hooks/useAnalytics.js) : on ne touche
   jamais window.gtag directement ailleurs. Chaque fonction est protegee pour
   ne jamais planter cote SSR (pas de window) ni si le script n'est pas charge
   (gtag absent). Dans ces cas, l'appel est simplement ignore. */

function gtagAvailable() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/* Envoie un evenement GA4. No-op si gtag indisponible. */
export function trackEvent(name, params = {}) {
  if (!name || !gtagAvailable()) return;
  try {
    window.gtag('event', name, params);
  } catch {
    /* la mesure d'audience ne doit jamais casser l'interface */
  }
}

/* Chemin de la page courante, SANS query ni hash : c'est la seule valeur de
   page transmise aux evenements de conversion. Les parametres d'URL peuvent
   porter des donnees saisies par le visiteur : ils ne partent jamais. */
export function pagePath() {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

/* Envoie un page_view GA4 avec page_path et page_location. No-op si indisponible. */
export function trackPageView(path) {
  if (!gtagAvailable()) return;
  const page_path = path || window.location.pathname;
  const page_location = window.location.href;
  try {
    window.gtag('event', 'page_view', {
      "page_path": page_path,
      "page_location": page_location,
    });
  } catch {
    /* idem : silencieux */
  }
}
