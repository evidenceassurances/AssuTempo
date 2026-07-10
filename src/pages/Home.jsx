import { Suspense, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroScrollytelling from '../components/HeroScrollytelling';
import { PagesContext } from '../AppShell';
import { jsonLd } from '../lib/seo';
import { faqHomeItems } from '../data/faqHome';

/* FAQPage : reprend mot pour mot les 7 questions/reponses affichees dans la
   section FAQ de la Home (components/Faq.jsx, meme module de donnees).
   Jamais de contenu invisible dans ce schema. */
const JSONLD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqHomeItems.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

function Home() {
  /* Sections sous le pli fournies par le shell : eager cote serveur
     (prerendu complet), lazy cote client (le hero s'hydrate seul au
     demarrage). Le Suspense existe dans les DEUX arbres : parite
     d'hydratation stricte (regle #418 du shell). */
  const pages = useContext(PagesContext);
  const Sections = pages.HomeSections;
  return (
    <>
      <Helmet>
        <title>Assurance Temporaire Auto en Ligne, 1 à 90 Jours | AssuTempo</title>
        <meta name="description" content="Assurance auto temporaire de 1 à 90 jours. Attestation immédiate en 5 minutes, sans relevé d'information. 34 pays couverts. Devis gratuit en ligne." />
        <link rel="canonical" href="https://assutempo.fr/" />
        <meta property="og:title" content="Assurance Temporaire Auto en Ligne, 1 à 90 Jours | AssuTempo" />
        <meta property="og:description" content="Assurance auto temporaire de 1 à 90 jours. Attestation immédiate en 5 minutes, sans relevé d'information. 34 pays couverts. Devis gratuit en ligne." />
        <meta property="og:url" content="https://assutempo.fr/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Assurance Temporaire Auto en Ligne, 1 à 90 Jours | AssuTempo" />
        <meta name="twitter:description" content="Assurance auto temporaire de 1 à 90 jours. Attestation immédiate en 5 minutes, sans relevé d'information. 34 pays couverts. Devis gratuit en ligne." />
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>
      {/* overflow-x clip et non hidden : un ancetre overflow hidden
          desactiverait le position: sticky de l'etage du scrollytelling */}
      <main style={{ overflowX: 'clip' }}>
      <HeroScrollytelling />
      <Suspense fallback={null}>
        <Sections />
      </Suspense>
    </main>
    </>
  );
}

export default Home;
