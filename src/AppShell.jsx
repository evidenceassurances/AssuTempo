import { Suspense, createContext, lazy, startTransition, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackgroundFX from './components/BackgroundFX';
import Navbar from './components/Navbar';
import CookieConsent from './components/CookieConsent';
import { useAnalytics } from './hooks/useAnalytics';
import PageTransition from './components/blocks/PageTransition';

/* Assistant en chunk DIFFERE : ~80 KB source (composant + styles + tour)
   sortis du bundle critique. Il n'est monte qu'apres load + idle : jamais
   en concurrence avec l'hydratation ni le LCP. Parite SSR garantie : ni le
   serveur ni le premier rendu client ne le rendent (gate assistantReady,
   false a l'hydratation des deux cotes -> aucun risque React #418). */
const AssistantAssutempo = lazy(() => import('./assistant/AssistantAssutempo'));

/* Monte l'assistant apres load + requestIdleCallback (secours : timeout).
   Si une page demande l'ouverture pendant la fenetre de differe (bouton
   "Discuter avec Tempo"), on charge immediatement et l'assistant s'ouvrira
   au montage via le drapeau window.__assutempoOpenPending. */
function useDeferredAssistant() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idleId = 0;
    let t = 0;
    /* startTransition : une mise a jour d'etat au-dessus d'un Suspense encore
       deshydrate (sections de la Home en vol) forcerait React a jeter le HTML
       serveur du boundary (client-render -> fallback). En transition, React
       attend le chunk et conserve le HTML. */
    const activate = () => startTransition(() => setReady(true));
    const arm = () => {
      if ('requestIdleCallback' in window) {
        idleId = requestIdleCallback(activate, { timeout: 4000 });
      } else {
        t = setTimeout(activate, 2000);
      }
    };
    const onOpenRequest = () => {
      window.__assutempoOpenPending = true;
      activate();
    };
    window.addEventListener('assutempo:open-assistant', onOpenRequest);
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      window.removeEventListener('assutempo:open-assistant', onOpenRequest);
      window.removeEventListener('load', arm);
      if (idleId && 'cancelIdleCallback' in window) cancelIdleCallback(idleId);
      clearTimeout(t);
    };
  }, []);
  return ready;
}

/* Table de routage unique, partagée entre le client (App.jsx, pages lazy)
   et le serveur (entry-server.jsx, pages eager). Le shell doit être
   strictement identique des deux côtés : toute divergence d'arbre entre
   le HTML prérendu et le premier rendu client provoque une erreur
   d'hydratation React #418 et un re-rendu complet côté client. */
const ROUTE_TABLE = [
  ['/', 'Home'],
  ['/faq', 'Faq'],
  ['/tarification', 'Pricing'],
  ['/qui-sommes-nous', 'About'],
  ['/articles', 'Articles'],
  ['/articles/voiture-immobilisee-defaut-assurance', 'VoitureImmobilisee'],
  ['/articles/controle-sans-assurance-risques-amende', 'ControleSansAssurance'],
  ['/articles/assurer-vehicule-achete-chez-particulier', 'AcheterVehiculeParticulier'],
  ['/articles/combien-de-jours-assurance-sortir-fourriere', 'CombienDeJoursAssurance'],
  ['/articles/assurance-temporaire-vehicule-etranger-france', 'AssuranceVehiculeEtranger'],
  ['/articles/assurance-temporaire-pret-de-vehicule', 'PretVehicule'],
  ['/articles/assurance-temporaire-convoyage-professionnel', 'ConvoyageProfessionnel'],
  ['/articles/assurance-temporaire-essai-vehicule-avant-achat', 'EssaiVehicule'],
  ['/articles/assurance-temporaire-rouler-en-attendant-carte-grise', 'CarteGrise'],
  ['/articles/assurance-temporaire-resilie-par-assureur', 'ResilieAssureur'],
  ['/articles/assurance-temporaire-utilitaire-demenagement', 'UtilitaireDemenagement'],
  ['/articles/assurance-temporaire-vehicule-proche-decede', 'VehiculeProcheDecede'],
  ['/articles/assurance-auto-temporaire-immediate-en-ligne', 'AssuranceImmediateEnLigne'],
  ['/articles/carte-grise-urgence-cpi-immediat', 'CarteGriseUrgence'],
  ['/carte', 'Carte'],
  ['/carte/:pays', 'Carte'],
  ['/carte-grise', 'CarteGriseService'],
  ['/cookies', 'Cookies'],
  ['/conditions-generales', 'CGV'],
  ['/assurance-internationale', 'AssuranceInternationale'],
  /* Catch-all : toute URL inconnue rend la page 404 (prerendue en
     dist/404.html et servie par Vercel avec le statut 404). */
  ['*', 'NotFound'],
];

/* Expose la table `pages` aux pages elles-memes : la Home y prend ses
   sections sous le pli (HomeSections), eager cote serveur et lazy cote
   client, comme les routes. Toute nouvelle entree partagee client/SSR
   passe par cette table, jamais par un import direct divergent. */
export const PagesContext = createContext({});

function PageLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#C9A84C',
        animation: 'pulse-dot 1.4s ease-in-out infinite',
      }} />
    </div>
  );
}

function AppShell({ pages }) {
  const location = useLocation();
  useAnalytics();
  const assistantReady = useDeferredAssistant();
  const pageKey = location.pathname.replace(/^(\/carte)\/.+$/, '$1');

  /* AnimatePresence n'est activee qu'apres le premier montage : pendant
     l'hydratation d'une page lazy (chunk en suspens), sa mecanique de
     presence desynchronise l'arbre client du HTML prerendu et React
     rejoue toute la page cote client (erreur #418 + re-rendu complet).
     Les transitions de route ne servent qu'aux navigations, toujours
     posterieures au montage : rien ne change visuellement.
     PageTransition (le <main>) reste rendu des le SSR, lui. */
  /* SYNC volontaire, ne JAMAIS passer en startTransition : en transition,
     la bascule {routes} -> <AnimatePresence>{routes}</AnimatePresence> devient
     interruptible et remodele l'arbre autour des Suspense de routes encore
     deshydrates -> #418 sur TOUTES les routes lazy (constate le 3 juillet).
     En sync post-montage (regle de juillet), l'echange est atomique.
     On attend en plus la RESOLUTION du chunk des sections Home (import
     deduplique avec le lazy d'App.jsx, deja prechauffe) : la bascule sync ne
     force ainsi jamais le client-render du Suspense des sections pendant le
     vol de leur chunk (le HTML prerendu sous le pli resterait sinon absent
     ~100 ms). Les transitions ne servent qu'aux navigations, bien plus tard. */
  const [transitionsReady, setTransitionsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    import('./pages/HomeSections').finally(() => {
      if (alive) setTransitionsReady(true);
    });
    return () => { alive = false; };
  }, []);

  const routes = (
    <Routes location={location} key={pageKey}>
      {ROUTE_TABLE.map(([path, name]) => {
        const Page = pages[name];
        return (
          <Route
            key={path}
            path={path}
            element={<PageTransition><Page /></PageTransition>}
          />
        );
      })}
    </Routes>
  );

  return (
    <PagesContext.Provider value={pages}>
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundFX />
      <div aria-hidden className="grain-overlay" />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        {transitionsReady ? (
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => {
              if (typeof window !== 'undefined') window.scrollTo(0, 0);
            }}
          >
            {routes}
          </AnimatePresence>
        ) : (
          routes
        )}
      </Suspense>
      <CookieConsent />
      {assistantReady && (
        <Suspense fallback={null}>
          <AssistantAssutempo />
        </Suspense>
      )}
    </div>
    </PagesContext.Provider>
  );
}

export default AppShell;
