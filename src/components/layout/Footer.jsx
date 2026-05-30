import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-[#050505] text-textSub">
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-white">AssuTempo</p>
            <p className="max-w-xl text-sm leading-7 text-textSub">Assurance temporaire élégante, claire et rapide. Transparence tarifaire et service premium pour chaque conducteur.</p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">Contact</p>
            <div className="space-y-3 text-sm">
              <p>Téléphone: <span className="text-white">09 74 19 78 20</span></p>
              <p>Horaires: <span className="text-white">Lun-Ven 9h-21h | Sam 9h-20h</span></p>
              <p>Email: <a href="mailto:contact@assutempo.fr" className="text-gold hover:text-goldLight">contact@assutempo.fr</a></p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">Liens rapides</p>
            <ul className="space-y-3 text-sm text-textSub">
              <li><Link to="/tarification" className="transition hover:text-white">Tarification</Link></li>
              <li><Link to="/faq" className="transition hover:text-white">FAQ</Link></li>
              <li><Link to="/qui-sommes-nous" className="transition hover:text-white">Qui sommes-nous</Link></li>
              <li><a href="#" className="transition hover:text-white">CGU</a></li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-gold/20 bg-[#111111] p-6 text-sm text-textSub shadow-gold">
          <p>Démarche simple, attestation immédiate.</p>
        </div>

        <div className="text-sm text-textSub">© {new Date().getFullYear()} Evidence Assurances. Tous droits réservés.</div>
      </div>
    </footer>
  );
}

export default Footer;
