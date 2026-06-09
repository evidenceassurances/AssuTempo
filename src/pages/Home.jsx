import Hero from '../components/Hero';
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
    <main style={{ overflow: 'hidden' }}>
      <Hero />
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
  );
}

export default Home;
