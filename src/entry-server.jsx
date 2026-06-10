import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion, domAnimation } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
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
import CarteGrise from './pages/articles/CarteGrise';
import Carte from './pages/Carte';
import Cookies from './pages/Cookies';
import CGV from './pages/CGV';
import AssuranceInternationale from './pages/AssuranceInternationale';

function AppSSR({ url }) {
  return (
    <LazyMotion features={domAnimation}>
      <Routes location={url}>
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
    </LazyMotion>
  );
}

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AppSSR url={url} />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
  return { html, helmet: helmetContext.helmet };
}
