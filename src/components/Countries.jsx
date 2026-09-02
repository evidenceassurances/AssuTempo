import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
/* Index leger uniquement : le contenu complet des 34 pays (~80 KB source)
   ne doit JAMAIS entrer dans le bundle critique de la Home */
import { COUNTRIES_INDEX as COUNTRIES } from '../data/countries-index';
import Flag from './ui/Flag';

/* Les 10 destinations les plus demandees passent en tete, en carte lisible,
   le reste suit en pastilles. Un pays n'apparait que dans un seul des deux
   groupes : deux liens vers la meme URL sur une meme page, Google n'en
   retient que le premier, le second ne sert a rien. */
const MAJEURS = [
  'allemagne', 'espagne', 'italie', 'suisse', 'belgique',
  'portugal', 'pays-bas', 'royaume-uni', 'autriche', 'pologne',
];
const RANG = Object.fromEntries(MAJEURS.map((slug, i) => [slug, i]));

const EN_TETE = COUNTRIES
  .filter((c) => c.slug in RANG)
  .sort((a, b) => RANG[a.slug] - RANG[b.slug]);
const AUTRES = COUNTRIES.filter((c) => !(c.slug in RANG));

/* Etat de depart des revelations : opacite 0.6 et non 0. Le HTML prerendu
   vit plusieurs secondes seul sur mobile, et ce bloc est une grille de liens
   internes : elle ne doit jamais etre invisible au premier paint (regle du
   8 juillet 2026, etendue ici au maillage). */
const DEPART = { opacity: 0.6, y: 12 };
const ARRIVEE = { opacity: 1, y: 0 };

function Countries() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <m.div
          ref={ref}
          initial={{ opacity: 0.6, y: 20 }}
          animate={inView ? ARRIVEE : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}
          >
            Rouler à l&apos;étranger
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            34 pays européens couverts dès le premier jour. Chaque fiche détaille les
            règles locales : vignette, péages, équipements exigés à bord.
          </p>
        </m.div>

        {/* Destinations principales */}
        <div
          className="pays-majeurs"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {EN_TETE.map((c, i) => (
            <m.div
              key={c.slug}
              initial={DEPART}
              animate={inView ? ARRIVEE : {}}
              transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/carte/${c.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 16px',
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 14,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                  e.currentTarget.style.background = 'var(--gold-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--glass)';
                }}
              >
                <Flag code={c.code} size={22} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--gold)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    }}
                  >
                    Assurance temporaire
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                    {c.nom}
                  </span>
                </span>
              </Link>
            </m.div>
          ))}
        </div>

        {/* Les 24 autres pays couverts */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {AUTRES.map((c, i) => (
            <m.div
              key={c.slug}
              initial={DEPART}
              animate={inView ? ARRIVEE : {}}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.02, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/carte/${c.slug}`}
                state={{ fromHome: true }}
                style={{
                  display: 'block',
                  padding: '8px 14px',
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 999,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                  e.currentTarget.style.background = 'var(--gold-glow)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--glass)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <Flag code={c.code} size={16} /> {c.nom}
              </Link>
            </m.div>
          ))}
        </div>

        {/* Lien vers la carte interactive */}
        <m.div
          initial={{ opacity: 0.6, y: 10 }}
          animate={inView ? ARRIVEE : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginTop: 32 }}
        >
          <Link
            to="/carte"
            className="btn-glass"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
            }}
          >
            Voir les 34 pays sur la carte
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </m.div>
      </div>
    </section>
  );
}

export default Countries;
