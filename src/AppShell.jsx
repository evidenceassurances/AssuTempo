import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackgroundFX from './components/BackgroundFX';
import Navbar from './components/Navbar';
import CookieConsent from './components/CookieConsent';
import { useAnalytics } from './hooks/useAnalytics';
import PageTransition from './components/blocks/PageTransition';
import AssistantAssutempo from './assistant/AssistantAssutempo';

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
  ['/carte', 'Carte'],
  ['/carte/:pays', 'Carte'],
  ['/carte-grise', 'CarteGriseService'],
  ['/cookies', 'Cookies'],
  ['/conditions-generales', 'CGV'],
  ['/assurance-internationale', 'AssuranceInternationale'],
];

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
  const pageKey = location.pathname.replace(/^(\/carte)\/.+$/, '$1');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundFX />
      <div aria-hidden className="grain-overlay" />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait" onExitComplete={() => {
          if (typeof window !== 'undefined') window.scrollTo(0, 0);
        }}>
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
        </AnimatePresence>
      </Suspense>
      <CookieConsent />
      <AssistantAssutempo />
    </div>
  );
}

export default AppShell;
