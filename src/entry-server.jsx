import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion, domAnimation } from 'framer-motion';
import AppShell from './AppShell';

/* Imports eager : renderToString ne sait pas attendre React.lazy, le contenu
   serait remplacé par le fallback du Suspense. Le shell reste AppShell,
   strictement identique au client (voir App.jsx). */
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

const PAGES = {
  Home,
  Faq,
  Pricing,
  About,
  Articles,
  VoitureImmobilisee,
  ControleSansAssurance,
  AcheterVehiculeParticulier,
  CombienDeJoursAssurance,
  AssuranceVehiculeEtranger,
  PretVehicule,
  ConvoyageProfessionnel,
  EssaiVehicule,
  CarteGrise,
  Carte,
  Cookies,
  CGV,
  AssuranceInternationale,
};

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <LazyMotion features={domAnimation} strict>
            <AppShell pages={PAGES} />
          </LazyMotion>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
  return { html, helmet: helmetContext.helmet };
}
