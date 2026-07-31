import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAnalyticsAllowed } from '../components/CookieConsent';
import { trackEvent, trackPageView } from '../lib/analytics';

const GA_ID = import.meta.env.VITE_GA_ID;

let gaLoaded = false;
let gaScriptAsked = false;

/* DebugView : gtag.js n'expose AUCUN declencheur par URL (ni debug_mode=1 ni
   gtm_debug, verifie sur la prod le 1er aout : les hits partaient sans _dbg).
   Seul debug_mode dans la config marque le flux comme debug. On le derive donc
   nous-memes de ?debug_mode=1, et on le retient pour la session : le parametre
   disparait des la premiere navigation SPA, alors que la mise au point porte
   justement sur le parcours. ?debug_mode=0 coupe. Jamais actif sans le
   parametre : aucun trafic reel ne part en debug. */
const CLE_DEBUG = 'assutempo_ga_debug';

function debugDemande() {
  try {
    const demande = new URLSearchParams(window.location.search).get('debug_mode');
    if (demande === '1' || demande === 'true') {
      sessionStorage.setItem(CLE_DEBUG, '1');
      return true;
    }
    if (demande === '0' || demande === 'false') {
      sessionStorage.removeItem(CLE_DEBUG);
      return false;
    }
    return sessionStorage.getItem(CLE_DEBUG) === '1';
  } catch {
    /* sessionStorage indisponible (Safari prive) : la mise au point se limite
       a la page qui porte le parametre, la mesure normale n'est pas affectee */
    return false;
  }
}

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
  const config = { anonymize_ip: true, send_page_view: false };
  if (debugDemande()) config.debug_mode = true;
  window.gtag('config', GA_ID, config);
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

  // 2. Suivi des clics d'intention par delegation globale.
  //    Ne modifie aucune navigation : on observe simplement les clics.
  //    - liens tel: -> tel_click
  //    - liens internes vers /tarification dont le libelle est un CTA de devis
  //      -> cta_devis_click (exclut les liens de menu "Tarification").
  //    ECOUTE EN PHASE DE CAPTURE : React pose son ecouteur sur le conteneur
  //    racine, donc en bulle il passe AVANT un ecouteur de document. Le Link
  //    avait deja navigue quand on lisait location.pathname, et le clic etait
  //    attribue a la page d'arrivee. Mesure en prod le 1er aout : un CTA
  //    "Obtenir mon devis" clique depuis un article partait en page_path
  //    "/tarification", ce qui effacait la page d'origine, celle qui a
  //    justement declenche l'intention.
  useEffect(() => {
    function onDocumentClick(e) {
      const target = e.target;
      const anchor = target && target.closest ? target.closest('a[href]') : null;
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href') || '';

      if (rawHref.startsWith('tel:')) {
        trackEvent('tel_click', { "page_path": window.location.pathname });
        return;
      }

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
