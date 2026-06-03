import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackgroundFX from './components/BackgroundFX';
import Navbar from './components/Navbar';
import PageTransition from './components/blocks/PageTransition';
import Home from './pages/Home';
import Faq from './pages/Faq';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Articles from './pages/Articles';
import VoitureImmobilisee from './pages/articles/VoitureImmobilisee';
import ControleSansAssurance from './pages/articles/ControleSansAssurance';
import AcheterVehiculeParticulier from './pages/articles/AcheterVehiculeParticulier';
import CombienDeJoursAssurance from './pages/articles/CombienDeJoursAssurance';
import AssuranceVehiculeEtranger from './pages/articles/AssuranceVehiculeEtranger';
import PretVehicule from './pages/articles/PretVehicule';
import ConvoyageProfessionnel from './pages/articles/ConvoyageProfessionnel';
import EssaiVehicule from './pages/articles/EssaiVehicule';
import Carte from './pages/Carte';

function App() {
  const location = useLocation();
  /* Normalise la clé pour que la transition de page ne se déclenche pas
     lors du changement de pays (/carte/france → /carte/espagne). */
  const pageKey = location.pathname.replace(/^(\/carte)\/.+$/, '$1');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundFX />
      <Navbar />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => {
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
          <Route path="/carte" element={<PageTransition><Carte /></PageTransition>} />
          <Route path="/carte/:pays" element={<PageTransition><Carte /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
