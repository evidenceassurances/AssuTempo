import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAnalyticsAllowed } from '../components/CookieConsent';
import { pagePath, trackEvent, trackPageView } from '../lib/analytics';

const GA_ID = import.meta.env.VITE_GA_ID;

let gaLoaded = false;
let gaScriptAsked = false;

/* Stub synchrone SANS reseau : dataLayer + gtag qui empile. Tous les
   evenements emis avant l'arrivee du script (dont le page_view initial du
   suivi de route) s'accumulent dans la queue et sont traites par gtag.js
   a son chargement. Aucun evenement perdu. */
function ensureStub() {
  if (typeof window.gtag === 'function') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // send_page_view: false -> le page_view initial est desactive ici. Tous les
  // page_view (y compris celui du premier chargement) sont emis par le suivi de
  // route ci-dessous, ce qui evite un double comptage au demarrage.
  window.gtag('config', GA_ID, { anonymize_ip: true, send_page_view: false });
}

/* Injection du script gtag.js APRES load + idle : la pile analytics
   (~310 KB de reseau, ~150 ms de JS mesures au profil du 3 juillet) ne
   concurrence plus jamais l'hydratation, le LCP ni le bundle applicatif.
   Un refus de consentement pose ga-disable-<id> avant le chargement :
   gtag.js le respecte a l'arrivee. */
function injectScript() {
  if (gaScriptAsked) return;
  gaScriptAsked = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function loadGA() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;
  ensureStub();

  const whenIdle = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(injectScript, { timeout: 5000 });
    } else {
      setTimeout(injectScript, 2500);
    }
  };
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}

// Libelles des CTA de devis a tracker (clic sur un lien menant vers /tarification).
const DEVIS_CTA_LABELS = /obtenir mon devis|voir les tarifs|souscrire maintenant/i;

/* Libelles exacts qui declenchent `demande_devis`, lien ou bouton. La
   comparaison se fait sur le libelle normalise (casse et espaces), la valeur
   remontee a GA4 est TOUJOURS celle de cette liste : la cardinalite du
   parametre `cta` reste donc fermee, quoi qu'il arrive dans le rendu. */
const DEVIS_CTA = ['Obtenir mon devis', 'Souscrire maintenant', 'Voir les tarifs'];
const DEVIS_CTA_BY_KEY = new Map(DEVIS_CTA.map((label) => [label.toLowerCase(), label]));

/* Libelle accessible d'un element cliquable : aria-label s'il existe, sinon le
   texte visible (les icones SVG n'apportent aucun texte). */
function labelKey(el) {
  const raw = el.getAttribute('aria-label') || el.textContent || '';
  return raw.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function useAnalytics() {
  const location = useLocation();

  // 1. Chargement de GA et gestion du consentement.
  useEffect(() => {
    // Mesure d'audience active par defaut : on charge GA tant que l'utilisateur
    // n'a pas explicitement refuse.
    if (isAnalyticsAllowed()) loadGA();

    const handler = (e) => {
      if (e.detail?.analytics === false) {
        // Refus explicite : desactive GA pour la session en cours.
        if (GA_ID) window['ga-disable-' + GA_ID] = true;
      } else if (e.detail?.analytics === true) {
        loadGA();
      }
    };
    window.addEventListener('cookie-consent', handler);
    return () => window.removeEventListener('cookie-consent', handler);
  }, []);

  // 2. Suivi des clics d'intention par delegation globale : UN seul listener
  //    pour tout le site, pose une seule fois (useAnalytics n'est appele qu'a
  //    un endroit, AppShell). Aucun composant n'a de handler a porter, donc
  //    aucun risque de double comptage entre un handler local et la
  //    delegation. Ne modifie aucune navigation : on observe les clics.
  //    - liens tel: -> clic_telephone
  //    - lien OU bouton portant un libelle de CTA de devis -> demande_devis
  //    - liens internes vers /tarification dont le libelle est un CTA de devis
  //      -> cta_devis_click (evenement historique, conserve tel quel).
  //    Un clic ne peut declencher qu'une seule branche telephone/devis :
  //    `closest` ne remonte qu'a UN element et un lien tel: sort aussitot.
  useEffect(() => {
    function onDocumentClick(e) {
      /* Un clic peut viser un noeud texte (dispatch synthetique) : on repart
         alors de son element parent, sinon closest n'existe pas. */
      const target = e.target && e.target.nodeType === 3 ? e.target.parentElement : e.target;
      const el = target && target.closest ? target.closest('a[href], button') : null;
      if (!el) return;

      const anchor = el.tagName === 'A' ? el : null;
      const rawHref = anchor ? anchor.getAttribute('href') || '' : '';

      if (rawHref.startsWith('tel:')) {
        trackEvent('clic_telephone', { "page": pagePath() });
        return;
      }

      /* Demande de devis : le libelle fait foi, quel que soit l'element
         (les CTA du site sont tantot des <Link>, tantot des <button> qui
         naviguent par code). */
      const cta = DEVIS_CTA_BY_KEY.get(labelKey(el));
      if (cta) {
        trackEvent('demande_devis', { "cta": cta, "page": pagePath() });
      }

      if (!anchor) return;

      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin !== window.location.origin || url.pathname !== '/tarification') return;
        const label = (anchor.textContent || '').trim();
        if (DEVIS_CTA_LABELS.test(label)) {
          trackEvent('cta_devis_click', {
            "cta_label": label,
            "page_path": window.location.pathname,
          });
        }
      } catch {
        /* href non analysable : on ignore */
      }
    }

    /* Phase de CAPTURE, et non de bulle : React 18 branche ses handlers sur le
       conteneur racine, donc son onClick (qui appelle navigate) s'executerait
       AVANT un listener pose sur document en bulle. `page` porterait alors la
       page d'ARRIVEE au lieu de celle du clic (constate en navigateur). La
       capture passe en premier : le chemin lu est bien celui de la page
       quittee, et aucun stopPropagation en aval ne peut masquer un clic. */
    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, []);

  // 3. page_view a chaque changement de route + evenements de page dedies.
  useEffect(() => {
    trackPageView(location.pathname);

    if (location.pathname === '/tarification') trackEvent('view_tarification');
    else if (location.pathname === '/carte-grise') trackEvent('view_carte_grise');
  }, [location.pathname]);
}
