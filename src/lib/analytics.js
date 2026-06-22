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
