import { Helmet } from 'react-helmet-async';
import HeroScrollytelling from '../components/HeroScrollytelling';
import VehicleMarquee from '../components/VehicleMarquee';
import Stats from '../components/Stats';
import Advantages from '../components/Advantages';
import Process from '../components/Process';
import UseCases from '../components/UseCases';
import Countries from '../components/Countries';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import { CtaAfterVehicles, CtaAfterProcess, CtaAfterCountries, CtaInternational } from '../components/CtaBanner';

function Home() {
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
      </Helmet>
      {/* overflow-x clip et non hidden : un ancetre overflow hidden
          desactiverait le position: sticky de l'etage du scrollytelling */}
      <main style={{ overflowX: 'clip' }}>
      <HeroScrollytelling />
      <VehicleMarquee />
      <CtaAfterVehicles />
      <Stats />
      <Advantages />
      <Process />
      <CtaAfterProcess />
      <UseCases />
      <Countries />
      <CtaInternational />
      <CtaAfterCountries />
      <Faq />
      <FinalCTA />
      <Footer />
    </main>
    </>
  );
}

export default Home;
