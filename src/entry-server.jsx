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
import HomeSections from './pages/HomeSections';
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
import ResilieAssureur from './pages/articles/ResilieAssureur';
import UtilitaireDemenagement from './pages/articles/UtilitaireDemenagement';
import VehiculeProcheDecede from './pages/articles/VehiculeProcheDecede';
import AssuranceTrajetRetourAchat from './pages/articles/AssuranceTrajetRetourAchat';
import AssuranceImmediateEnLigne from './pages/articles/AssuranceImmediateEnLigne';
import CarteGriseUrgence from './pages/articles/CarteGriseUrgence';
import AssuranceMalus from './pages/articles/AssuranceMalus';
import AttestationImmediate from './pages/articles/AttestationImmediate';
import AssurerSansCarteGrise from './pages/articles/AssurerSansCarteGrise';
import PrixAssuranceAutoTemporaire from './pages/articles/PrixAssuranceAutoTemporaire';
import DelaiCarteGrise from './pages/articles/DelaiCarteGrise';
import AssuranceJeuneConducteur from './pages/articles/AssuranceJeuneConducteur';
import RouleSansCarteGriseNom from './pages/articles/RouleSansCarteGriseNom';
import CarteGriseService from './pages/CarteGrise';
import RoulezLegalApresAchat from './pages/RoulezLegalApresAchat';
import Carte from './pages/Carte';
import Cookies from './pages/Cookies';
import CGV from './pages/CGV';
import AssuranceInternationale from './pages/AssuranceInternationale';
import GuichetDeNuit from './pages/GuichetDeNuit';
import Urgence from './pages/Urgence';
import NotFound from './pages/NotFound';

const PAGES = {
  Home,
  HomeSections,
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
  ResilieAssureur,
  UtilitaireDemenagement,
  VehiculeProcheDecede,
  AssuranceTrajetRetourAchat,
  AssuranceImmediateEnLigne,
  CarteGriseUrgence,
  AssuranceMalus,
  AttestationImmediate,
  AssurerSansCarteGrise,
  PrixAssuranceAutoTemporaire,
  DelaiCarteGrise,
  AssuranceJeuneConducteur,
  RouleSansCarteGriseNom,
  CarteGriseService,
  RoulezLegalApresAchat,
  Carte,
  Cookies,
  CGV,
  AssuranceInternationale,
  GuichetDeNuit,
  Urgence,
  NotFound,
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
