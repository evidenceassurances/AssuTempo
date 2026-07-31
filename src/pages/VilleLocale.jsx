import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, Phone, FileText, ChevronRight, Calendar } from 'lucide-react';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { jsonLd } from '../lib/seo';
import { VILLES_LOCALES } from '../data/villesLocales';

const EASE = [0.22, 1, 0.36, 1];
const SITE = 'https://assutempo.fr';

const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-border)',
  borderRadius: 16,
  padding: '22px 20px',
};

const eyebrowStyle = {
  fontSize: 12,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  margin: '0 0 14px',
};

/* ── Bloc double CTA, réutilisé en tête et en pied de page ───────────────── */
function DoubleCta() {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link
        to="/tarification"
        className="btn-gold"
        style={{ textDecoration: 'none', padding: '14px 26px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        Assurer mon véhicule maintenant
        <ArrowRight size={15} strokeWidth={2} />
      </Link>
      <Link
        to="/carte-grise"
        className="btn-glass"
        style={{ textDecoration: 'none', padding: '14px 26px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        <FileText size={15} strokeWidth={1.75} />
        Faire ma carte grise en ligne
      </Link>
    </div>
  );
}

/* ── Ligne de faits du bandeau, à figure saillante ────────────────────────── */
function BandeauRow({ item }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(96px, 158px) 1fr',
      gap: 'clamp(18px, 4vw, 40px)',
      alignItems: 'start',
      padding: '26px 0',
      borderTop: '1px solid rgba(201,168,76,0.14)',
    }}>
      <p style={{
        fontSize: 'clamp(1.3rem, 2.6vw, 1.8rem)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        margin: 0,
      }}>
        <span className="text-gold-gradient">{item.figure}</span>
      </p>
      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '2px 0 8px', lineHeight: 1.35 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: 14.5, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.7, maxWidth: 620 }}>
          {item.body}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: 0, letterSpacing: '0.01em' }}>
          {item.ref}
        </p>
      </div>
    </div>
  );
}

/* ── Bloc "fourrière" / "carte grise", texte + CTA unique ─────────────────── */
function InfoBlock({ block }) {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <h2 style={{
        fontSize: 'clamp(1.6rem, 3.2vw, 2.1rem)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--text)',
        margin: '0 0 20px',
      }}>
        {block.title}
      </h2>
      {block.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} style={{ fontSize: 15.5, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.8 }}>
          {p}
        </p>
      ))}
      <Link
        to={block.cta.href}
        className="btn-gold"
        style={{ textDecoration: 'none', padding: '13px 24px', fontSize: 14.5, display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8 }}
      >
        {block.cta.text}
        <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </div>
  );
}

function Maillage({ maillage }) {
  const { lead, items } = maillage;
  return (
    <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 auto', maxWidth: 780 }}>
      {lead}{' '}
      {items.map((it, i) => (
        <span key={it.href}>
          {i > 0 && (i === items.length - 1 ? ', et ' : ', ')}
          <Link to={it.href} style={{ color: 'var(--gold-light)' }}>{it.text}</Link>
        </span>
      ))}
      .
    </p>
  );
}

function VilleLocale() {
  const location = useLocation();
  const ville = Object.values(VILLES_LOCALES).find((v) => v.routePath === location.pathname);
  const [dataRef, dataInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  if (!ville) return null;

  const canonical = `${SITE}${ville.routePath}`;

  const JSONLD_BREADCRUMB = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: ville.breadcrumbName, item: canonical },
    ],
  };

  const JSONLD_FAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ville.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{ville.meta.title}</title>
        <meta name="description" content={ville.meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={ville.meta.title} />
        <meta property="og:description" content={ville.meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      {/* ── A. Hero + Answer Capsule ─────────────────────────────────────── */}
      <section style={{
        paddingTop: 140,
        paddingBottom: 48,
        textAlign: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 42% at 50% 0%, rgba(232,201,122,0.12) 0%, rgba(201,168,76,0.06) 35%, transparent 64%)',
        }} />
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}
        >
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={12} style={{ opacity: 0.5 }} /></li>
              <li aria-current="page" style={{ color: 'var(--text-subtle)' }}>{ville.nom}</li>
            </ol>
          </nav>

          <p style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            {ville.eyebrow}
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 58px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.03em',
            maxWidth: 900,
            margin: '0 auto 16px',
          }}>
            {ville.h1}
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 12px',
            lineHeight: 1.75,
          }}>
            {ville.intro}
          </p>
          <p style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 13,
            color: 'var(--text-subtle)',
            margin: '0 0 32px',
          }}>
            <Calendar size={13} strokeWidth={1.5} />
            Mis à jour le {ville.dateMaj}
          </p>

          <div style={{ maxWidth: 820, margin: '0 auto 8px' }}>
            <AnswerCapsule capsule={ville.capsule} />
          </div>
        </m.div>
      </section>

      {/* ── B. Bandeau de trois faits ────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '72px 24px 88px' }}>
        <div ref={dataRef} style={{ maxWidth: 900, margin: '0 auto' }}>
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={dataInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ borderBottom: '1px solid rgba(201,168,76,0.14)' }}
          >
            {ville.bandeau.map((item) => (
              <BandeauRow key={item.title} item={item} />
            ))}
          </m.div>
          <div style={{ marginTop: 40 }}>
            <DoubleCta />
          </div>
        </div>
      </section>

      {/* ── C. "À <ville>, concrètement" ─────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={eyebrowStyle}>CAS LOCAL</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--text)',
            margin: '0 0 20px',
          }}>
            {ville.concretement.title}
          </h2>
          {ville.concretement.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} style={{ fontSize: 15.5, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.8 }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── D. Fourrière ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <InfoBlock block={ville.fourriere} />
      </section>

      {/* ── E. Carte grise ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <InfoBlock block={ville.carteGrise} />
      </section>

      {/* ── F. FAQ ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '104px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={eyebrowStyle}>QUESTIONS FRÉQUENTES</p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              {ville.nom} : vos questions
            </h2>
          </div>
          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {ville.faq.map((item, i) => (
              <m.div key={item.q} variants={fadeUp}>
                <AccordionItem
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ── G. Maillage interne ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '72px 24px' }}>
        <Maillage maillage={ville.maillage} />
      </section>

      {/* ── H. CTA final ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            ...cardBase,
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'center',
            padding: '40px 32px',
          }}
        >
          <h2 style={{
            fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}>
            Assurance et carte grise à {ville.nom}, au même endroit
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 26px', lineHeight: 1.7 }}>
            Attestation d&apos;assurance immédiate, carte grise en ligne. Roulez couvert et en
            règle dès aujourd&apos;hui.
          </p>
          <DoubleCta />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '20px 0 0', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Phone size={14} strokeWidth={1.5} />
            09 74 19 78 20, Lun-Ven 9h-21h, Sam 9h-20h
          </p>
        </m.div>
      </section>

      <Footer />
    </>
  );
}

export default VilleLocale;
