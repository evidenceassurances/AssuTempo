import Hero from '../components/Hero';
import TrustBand from '../components/TrustBand';
import VehicleCarousel from '../components/VehicleCarousel';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Advantages from '../components/Advantages';
import Testimonials from '../components/Testimonials';
import WhyUs from '../components/WhyUs';
import Contact from '../components/Contact';
import Countries from '../components/Countries';

function Home() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <Hero />
      <TrustBand />
      <VehicleCarousel />
      <HowItWorks />
      <Stats />
      <Advantages />
      <Testimonials />
      <WhyUs />
      <Contact />
      <Countries />
    </main>
  );
}

export default Home;
