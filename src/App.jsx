import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackgroundFX from './components/BackgroundFX';
import Navbar from './components/Navbar';
import PageTransition from './components/blocks/PageTransition';

const Home = lazy(() => import('./pages/Home'));
const Faq = lazy(() => import('./pages/Faq'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Articles = lazy(() => import('./pages/Articles'));
const VoitureImmobilisee = lazy(() => import('./pages/articles/VoitureImmobilisee'));
const ControleSansAssurance = lazy(() => import('./pages/articles/ControleSansAssurance'));

function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080706',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '2px solid #C9A84C',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundFX />
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
            <Route path="/tarification" element={<PageTransition><Pricing /></PageTransition>} />
            <Route path="/qui-sommes-nous" element={<PageTransition><About /></PageTransition>} />
            <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
            <Route path="/articles/voiture-immobilisee-defaut-assurance" element={<PageTransition><VoitureImmobilisee /></PageTransition>} />
            <Route path="/articles/controle-sans-assurance-risques-amende" element={<PageTransition><ControleSansAssurance /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
