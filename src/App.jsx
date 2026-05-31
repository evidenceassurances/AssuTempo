import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import BackgroundFX from './components/BackgroundFX';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Faq from './pages/Faq';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Articles from './pages/Articles';
import PageTransition from './components/blocks/PageTransition';

function App() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <BackgroundFX />
      <Navbar />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
          <Route path="/tarification" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/qui-sommes-nous" element={<PageTransition><About /></PageTransition>} />
          <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
