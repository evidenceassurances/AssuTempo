import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAnalyticsAllowed } from '../components/CookieConsent';

const GA_ID = import.meta.env.VITE_GA_ID;

let gaLoaded = false;

function loadGA() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Analytics active par défaut : charge GA dès que l'utilisateur n'a pas refusé.
    if (isAnalyticsAllowed()) loadGA();

    const handler = (e) => {
      if (e.detail?.analytics === false) {
        // Refus explicite : désactive GA pour la session en cours.
        if (GA_ID) window['ga-disable-' + GA_ID] = true;
      } else if (e.detail?.analytics === true) {
        loadGA();
      }
    };
    window.addEventListener('cookie-consent', handler);
    return () => window.removeEventListener('cookie-consent', handler);
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname });
    }
  }, [location.pathname]);
}
