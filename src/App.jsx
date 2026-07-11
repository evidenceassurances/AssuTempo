import { lazy, useEffect } from 'react';
import AppShell from './AppShell';
import Home from './pages/Home';

/* Importeurs des pages : partages entre le code splitting (lazy) et le
   prefetch en idle. Un meme import() est deduplique par le navigateur :
   une fois prefetche, la navigation resout le chunk instantanement. */
const IMPORTERS = {
  Faq:                        () => import('./pages/Faq'),
  Pricing:                    () => import('./pages/Pricing'),
  About:                      () => import('./pages/About'),
  Articles:                   () => import('./pages/Articles'),
  VoitureImmobilisee:         () => import('./pages/articles/VoitureImmobilisee'),
  ControleSansAssurance:      () => import('./pages/articles/ControleSansAssurance'),
  AcheterVehiculeParticulier: () => import('./pages/articles/AcheterVehiculeParticulier'),
  CombienDeJoursAssurance:    () => import('./pages/articles/CombienDeJoursAssurance'),
  AssuranceVehiculeEtranger:  () => import('./pages/articles/AssuranceVehiculeEtranger'),
  PretVehicule:               () => import('./pages/articles/PretVehicule'),
  ConvoyageProfessionnel:     () => import('./pages/articles/ConvoyageProfessionnel'),
  EssaiVehicule:              () => import('./pages/articles/EssaiVehicule'),
  CarteGrise:                 () => import('./pages/articles/CarteGrise'),
  ResilieAssureur:            () => import('./pages/articles/ResilieAssureur'),
  UtilitaireDemenagement:     () => import('./pages/articles/UtilitaireDemenagement'),
  VehiculeProcheDecede:       () => import('./pages/articles/VehiculeProcheDecede'),
  AssuranceTrajetRetourAchat: () => import('./pages/articles/AssuranceTrajetRetourAchat'),
  Carte:                      () => import('./pages/Carte'),
  CarteGriseService:          () => import('./pages/CarteGrise'),
  Cookies:                    () => import('./pages/Cookies'),
  CGV:                        () => import('./pages/CGV'),
  AssuranceInternationale:    () => import('./pages/AssuranceInternationale'),
  NotFound:                   () => import('./pages/NotFound'),
};

/* Pages lazy côté client (code splitting). Le serveur fournit les mêmes
   pages en imports eager via entry-server.jsx : le shell (AppShell) reste
   identique des deux côtés, seul le mode de chargement des pages change. */
const PAGES = { Home };
for (const [name, importer] of Object.entries(IMPORTERS)) {
  PAGES[name] = lazy(importer);
}
/* Sections sous le pli de la Home : lazy côté client (le hero s'hydrate
   seul au démarrage), eager côté serveur. React déclenche le chargement
   dès le rendu de la Home ; le HTML prérendu reste affiché en attendant. */
const importHomeSections = () => import('./pages/HomeSections');
PAGES.HomeSections = lazy(importHomeSections);
/* Prechauffe : le telechargement du chunk part DES l'évaluation du module,
   en parallèle de l'hydratation (import() dédupliqué avec le lazy) : le
   Suspense des sections se réhydrate quasi immédiatement. */
if (typeof window !== 'undefined') importHomeSections();

/* Ordre de prefetch : les destinations de navigation probables d'abord,
   le reste ensuite. Tout est petit (2 a 50 KB gzip par chunk). */
const PREFETCH_ORDER = [
  'Pricing', 'Faq', 'Articles', 'Carte', 'CarteGriseService', 'About',
  'AssuranceInternationale', 'CGV', 'Cookies',
];

/* Prefetch des routes en temps idle : supprime le temps mort au premier
   clic (le chunk n'est plus telecharge au moment de la navigation).
   Respecte l'economiseur de donnees et les connexions lentes. */
function usePrefetchRoutes() {
  useEffect(() => {
    const conn = navigator.connection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;

    let cancelled = false;

    const run = async () => {
      const ordered = [
        ...PREFETCH_ORDER.filter((n) => IMPORTERS[n]),
        ...Object.keys(IMPORTERS).filter((n) => !PREFETCH_ORDER.includes(n)),
      ];
      for (const name of ordered) {
        if (cancelled) return;
        try {
          await IMPORTERS[name]();
        } catch {
          /* hors ligne ou chunk indisponible : la navigation classique
             retentera, le prefetch ne doit jamais faire de bruit */
        }
        /* une respiration entre chaque chunk pour ne jamais concurrencer
           une interaction en cours */
        await new Promise((r) => setTimeout(r, 250));
      }
    };

    const start = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => { run(); }, { timeout: 6000 });
      } else {
        setTimeout(run, 2500);
      }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
    };
  }, []);
}

function App() {
  usePrefetchRoutes();
  return <AppShell pages={PAGES} />;
}

export default App;
