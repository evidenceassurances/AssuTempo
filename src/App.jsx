import { lazy } from 'react';
import AppShell from './AppShell';
import Home from './pages/Home';

/* Pages lazy côté client (code splitting). Le serveur fournit les mêmes
   pages en imports eager via entry-server.jsx : le shell (AppShell) reste
   identique des deux côtés, seul le mode de chargement des pages change. */
const PAGES = {
  Home,
  Faq:                        lazy(() => import('./pages/Faq')),
  Pricing:                    lazy(() => import('./pages/Pricing')),
  About:                      lazy(() => import('./pages/About')),
  Articles:                   lazy(() => import('./pages/Articles')),
  VoitureImmobilisee:         lazy(() => import('./pages/articles/VoitureImmobilisee')),
  ControleSansAssurance:      lazy(() => import('./pages/articles/ControleSansAssurance')),
  AcheterVehiculeParticulier: lazy(() => import('./pages/articles/AcheterVehiculeParticulier')),
  CombienDeJoursAssurance:    lazy(() => import('./pages/articles/CombienDeJoursAssurance')),
  AssuranceVehiculeEtranger:  lazy(() => import('./pages/articles/AssuranceVehiculeEtranger')),
  PretVehicule:               lazy(() => import('./pages/articles/PretVehicule')),
  ConvoyageProfessionnel:     lazy(() => import('./pages/articles/ConvoyageProfessionnel')),
  EssaiVehicule:              lazy(() => import('./pages/articles/EssaiVehicule')),
  CarteGrise:                 lazy(() => import('./pages/articles/CarteGrise')),
  ResilieAssureur:            lazy(() => import('./pages/articles/ResilieAssureur')),
  UtilitaireDemenagement:     lazy(() => import('./pages/articles/UtilitaireDemenagement')),
  VehiculeProcheDecede:       lazy(() => import('./pages/articles/VehiculeProcheDecede')),
  Carte:                      lazy(() => import('./pages/Carte')),
  CarteGriseService:          lazy(() => import('./pages/CarteGrise')),
  Cookies:                    lazy(() => import('./pages/Cookies')),
  CGV:                        lazy(() => import('./pages/CGV')),
  AssuranceInternationale:    lazy(() => import('./pages/AssuranceInternationale')),
};

function App() {
  return <AppShell pages={PAGES} />;
}

export default App;
