import VehicleMarquee from '../components/VehicleMarquee';
import Stats from '../components/Stats';
import Advantages from '../components/Advantages';
import Process from '../components/Process';
import UseCases from '../components/UseCases';
import Countries from '../components/Countries';
import GuidesEtDemarches from '../components/GuidesEtDemarches';
import CtaGuichetDeNuit from '../components/CtaGuichetDeNuit';
import Faq from '../components/Faq';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import { CtaAfterVehicles, CtaAfterProcess, CtaAfterCountries, CtaInternational } from '../components/CtaBanner';

/* Sections sous le pli de la Home, en chunk separe du bundle critique.
   Cote serveur : import eager (entry-server.jsx) -> le HTML prerendu reste
   complet (SEO intact). Cote client : React.lazy (App.jsx) -> le hero est
   hydrate seul au demarrage, ces sections s'hydratent a l'arrivee de leur
   chunk (React preserve le HTML serveur du Suspense en attendant : aucun
   flash). Meme mecanique que les pages (voir AppShell.jsx). */
function HomeSections() {
  return (
    <>
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
      <GuidesEtDemarches />
      <CtaGuichetDeNuit />
      <Faq />
      <FinalCTA />
      <Footer />
    </>
  );
}

export default HomeSections;
