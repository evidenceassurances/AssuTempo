import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackgroundFX from './components/BackgroundFX';
import Navbar from './components/Navbar';
import CookieConsent from './components/CookieConsent';
import { useAnalytics } from './hooks/useAnalytics';
import PageTransition from './components/blocks/PageTransition';
import Home from './pages/Home';

const Faq                      = lazy(() => import('./pages/Faq'));
const Pricing                  = lazy(() => import('./pages/Pricing'));
const About                    = lazy(() => import('./pages/About'));
const Articles                 = lazy(() => import('./pages/Articles'));
const VoitureImmobilisee       = lazy(() => import('./pages/articles/VoitureImmobilisee'));
const ControleSansAssurance    = lazy(() => import('./pages/articles/ControleSansAssurance'));
const AcheterVehiculeParticulier = lazy(() => import('./pages/articles/AcheterVehiculeParticulier'));
const CombienDeJoursAssurance  = lazy(() => import('./pages/articles/CombienDeJoursAssurance'));
const AssuranceVehiculeEtranger = lazy(() => import('./pages/articles/AssuranceVehiculeEtranger'));
const PretVehicule             = lazy(() => import('./pages/articles/PretVehicule'));
const ConvoyageProfessionnel   = lazy(() => import('./pages/articles/ConvoyageProfessionnel'));
const EssaiVehicule            = lazy(() => import('./pages/articles/EssaiVehicule'));
const CarteGrise               = lazy(() => import('./pages/articles/CarteGrise'));
const Carte                    = lazy(() => import('./pages/Carte'));
const Cookies                  = lazy(() => import('./pages/Cookies'));
const CGV                      = lazy(() => import('./pages/CGV'));
const AssuranceInternationale  = lazy(() => import('./pages/AssuranceInternationale'));

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

function App() {
  const location = useLocation();
  useAnalytics();
  const pageKey = location.pathname.replace(/^(\/carte)\/.+$/, '$1');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundFX />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait" onExitComplete={() => {
          if (typeof window !== 'undefined') window.scrollTo(0, 0);
        }}>
          <Routes location={location} key={pageKey}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
            <Route path="/tarification" element={<PageTransition><Pricing /></PageTransition>} />
            <Route path="/qui-sommes-nous" element={<PageTransition><About /></PageTransition>} />
            <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
            <Route path="/articles/voiture-immobilisee-defaut-assurance" element={<PageTransition><VoitureImmobilisee /></PageTransition>} />
            <Route path="/articles/controle-sans-assurance-risques-amende" element={<PageTransition><ControleSansAssurance /></PageTransition>} />
            <Route path="/articles/assurer-vehicule-achete-chez-particulier" element={<PageTransition><AcheterVehiculeParticulier /></PageTransition>} />
            <Route path="/articles/combien-de-jours-assurance-sortir-fourriere" element={<PageTransition><CombienDeJoursAssurance /></PageTransition>} />
            <Route path="/articles/assurance-temporaire-vehicule-etranger-france" element={<PageTransition><AssuranceVehiculeEtranger /></PageTransition>} />
            <Route path="/articles/assurance-temporaire-pret-de-vehicule" element={<PageTransition><PretVehicule /></PageTransition>} />
            <Route path="/articles/assurance-temporaire-convoyage-professionnel" element={<PageTransition><ConvoyageProfessionnel /></PageTransition>} />
            <Route path="/articles/assurance-temporaire-essai-vehicule-avant-achat" element={<PageTransition><EssaiVehicule /></PageTransition>} />
            <Route path="/articles/assurance-temporaire-rouler-en-attendant-carte-grise" element={<PageTransition><CarteGrise /></PageTransition>} />
            <Route path="/carte" element={<PageTransition><Carte /></PageTransition>} />
            <Route path="/carte/:pays" element={<PageTransition><Carte /></PageTransition>} />
            <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />
            <Route path="/conditions-generales" element={<PageTransition><CGV /></PageTransition>} />
            <Route path="/assurance-internationale" element={<PageTransition><AssuranceInternationale /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <CookieConsent />
    </div>
  );
}

export default App;
