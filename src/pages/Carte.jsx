import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ArrowRight, Phone } from 'lucide-react';
import AccordionItem from '../components/ui/AccordionItem';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  COUNTRIES,
  SLUG_TO_COUNTRY,
  ISO_TO_SLUG,
} from '../data/countries-content';

/* ── Constantes géo ──────────────────────────────────────────────────────── */
const GEO_URL = '/countries-110m.json';

const COVERED        = new Set(COUNTRIES.map(c => c.isoId));
const COUNTRY_NAMES  = Object.fromEntries(COUNTRIES.map(c => [c.isoId, c.nom]));

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "Dans quels pays mon assurance temporaire est-elle valable ?",
    a: "Dans 34 pays européens, dont la liste complète figure sur cette page. La responsabilité civile y est couverte dès le premier jour.",
  },
  {
    q: "L'assurance est-elle valable en Allemagne, en Espagne ou en Italie ?",
    a: "Oui. L'Allemagne, l'Espagne et l'Italie font partie des 34 pays couverts.",
  },
  {
    q: "Le Royaume-Uni et la Suisse sont-ils couverts ?",
    a: "Oui. Le Royaume-Uni, la Suisse, l'Andorre, le Monténégro et la Bosnie-Herzégovine font partie des pays couverts.",
  },
  {
    q: "La couverture est-elle immédiate à l'étranger ?",
    a: "Oui, dès le premier jour du contrat, avec une attestation délivrée immédiatement.",
  },
  {
    q: "Qu'est-ce que la carte internationale d'assurance automobile ?",
    a: "C'est le document qui atteste que votre véhicule est assuré et précise les pays couverts. Depuis avril 2024, la carte verte n'existe plus en France : la preuve d'assurance se fait via le Fichier des Véhicules Assurés (FVA). Votre carte internationale d'assurance automobile reste le document de référence pour circuler dans les 34 pays européens couverts.",
  },
];

/* ── Variants Framer Motion ──────────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1];

const panelOuter = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.45, ease: EASE } },
  exit:    { opacity: 0, height: 0,    transition: { duration: 0.35, ease: EASE } },
};
const panelInner = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit:   { opacity: 0, y: -14, transition: { duration: 0.28, ease: EASE } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};
const lineVariant = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.55, delay: 0.15, ease: EASE } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/* ── Reveal scroll générique ─────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Panneau pays animé ───────────────────────────────────────────────────── */
function CountryPanel({ country }) {
  const reduce = useReducedMotion();
  const { h1, intro, points, flag, nom, slug } = country;

  return (
    <motion.div
      key={slug}
      variants={panelInner}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={stagger} initial="hidden" animate="visible">
        {/* En-tête */}
        <motion.div variants={fadeUp} style={{ marginBottom: 8 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              margin: '0 0 10px',
              fontWeight: 600,
            }}
          >
            {flag}&nbsp; PAYS COUVERT
          </p>
          <h2
            style={{
              fontSize: 'clamp(1.35rem, 3vw, 1.95rem)',
              fontWeight: 800,
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            {h1}
          </h2>
        </motion.div>

        {/* Filet doré — animation "dessin" */}
        <motion.div
          variants={lineVariant}
          style={{
            height: 1.5,
            background: 'var(--gold)',
            transformOrigin: 'left center',
            borderRadius: 1,
            margin: '18px 0 22px',
          }}
        />

        {/* Intro */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            lineHeight: 1.85,
            margin: '0 0 32px',
            maxWidth: 780,
          }}
        >
          {intro}
        </motion.p>

        {/* Points clés */}
        <motion.div
          variants={stagger}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 36,
          }}
        >
          {points.map((point, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              whileHover={
                reduce
                  ? {}
                  : {
                      y: -5,
                      boxShadow: '0 10px 32px rgba(201,168,76,0.18)',
                      borderColor: 'var(--gold-border)',
                    }
              }
              transition={{ duration: 0.25 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: 14,
                padding: '18px 20px',
                cursor: 'default',
                transition: 'border-color 0.25s',
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  margin: '0 0 7px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {point.titre}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.72,
                }}
              >
                {point.texte}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <Link
            to="/tarification"
            className="btn-gold"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 26px',
              fontSize: 14,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            Obtenir mon devis pour {nom}
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
          <a
            href="tel:0974197820"
            className="btn-glass"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
            }}
          >
            <Phone size={14} strokeWidth={1.5} />
            09 74 19 78 20
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Carte SVG ────────────────────────────────────────────────────────────── */
function EuropeMap({ selectedId, onCountryClick, isMobile }) {
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const reduce = useReducedMotion();

  const badgeName = tooltip.visible
    ? tooltip.name
    : selectedId != null
    ? COUNTRY_NAMES[selectedId]
    : null;

  const handleEnter = (id, e) => {
    const name = COUNTRY_NAMES[id];
    if (!name) return;
    setTooltip({ visible: true, name, x: e.clientX, y: e.clientY });
  };
  const handleMove = (id, e) => {
    if (!COUNTRY_NAMES[id]) return;
    setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }));
  };
  const handleLeave = () => setTooltip(t => ({ ...t, visible: false }));
  const handleClick = (id) => {
    if (!COUNTRY_NAMES[id]) return;
    onCountryClick(id);
  };

  return (
    <>
      {/* Tooltip curseur */}
      {tooltip.visible && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: tooltip.y - 44,
            left: tooltip.x,
            transform: 'translateX(-50%)',
            background: 'rgba(8,7,6,0.96)',
            border: '1px solid var(--gold-border)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--gold)',
            pointerEvents: 'none',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {tooltip.name}
        </div>
      )}

      {/* Carte container — vue fixe, toute l'Europe visible */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Badge nom pays */}
        <AnimatePresence mode="wait">
          {badgeName && (
            <motion.div
              key={badgeName}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              aria-live="polite"
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(8,7,6,0.9)',
                border: '1px solid var(--gold-border)',
                borderRadius: 999,
                padding: '5px 16px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--gold)',
                zIndex: 10,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {badgeName}
            </motion.div>
          )}
        </AnimatePresence>

        <ComposableMap
          role="img"
          aria-label="Carte des 34 pays européens couverts par l'assurance temporaire AssuTempo. Les pays couverts sont colorés en doré."
          projection="geoAzimuthalEqualArea"
          projectionConfig={{ rotate: [-15, -52, 0], scale: 680 }}
          width={800}
          height={520}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* ZoomableGroup toujours rendu (pas de conditionnel → pas de mismatch SSR).
              filterZoomEvent bloque tout sur bureau ; laisse passer sur mobile. */}
          <ZoomableGroup
            zoom={1}
            minZoom={1}
            maxZoom={4}
            filterZoomEvent={() => isMobile}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const id        = +geo.id;
                  const isCovered = COVERED.has(id);
                  const name      = COUNTRY_NAMES[id];
                  const isSelected = selectedId === id;
                  const baseFill  = isSelected ? '#E8C97A' : isCovered ? '#C9A84C' : '#1C1A16';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={baseFill}
                      stroke={isSelected ? 'rgba(232,201,122,0.55)' : '#080706'}
                      strokeWidth={isSelected ? 1.2 : 0.4}
                      aria-label={isCovered ? `${name} — pays couvert` : undefined}
                      tabIndex={isCovered ? 0 : -1}
                      role={isCovered ? 'button' : undefined}
                      style={{
                        default: {
                          outline: 'none',
                          transition: reduce ? 'none' : 'fill 0.28s ease, filter 0.3s ease',
                          fill: baseFill,
                          filter: isSelected
                            ? 'drop-shadow(0 0 9px rgba(232,201,122,0.55))'
                            : 'none',
                        },
                        hover: {
                          fill: isCovered ? '#E8C97A' : '#222018',
                          outline: 'none',
                          cursor: isCovered ? 'pointer' : 'default',
                          filter: isCovered ? 'drop-shadow(0 0 7px rgba(232,201,122,0.45))' : 'none',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(e) => handleEnter(id, e)}
                      onMouseMove={(e)  => handleMove(id, e)}
                      onMouseLeave={handleLeave}
                      onClick={() => handleClick(id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleClick(id);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Légende */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            padding: '14px 20px',
            borderTop: '1px solid var(--glass-border)',
          }}
        >
          {[
            { bg: '#C9A84C', label: '34 pays couverts' },
            { bg: '#E8C97A', border: 'none', label: 'Sélectionné' },
            { bg: '#1C1A16', border: '1px solid #333', label: 'Non couvert' },
          ].map(({ bg, border, label }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: bg, border, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Page principale ─────────────────────────────────────────────────────── */
function Carte() {
  const { pays: slugParam }  = useParams();
  const [searchParams]       = useSearchParams();
  const navigate             = useNavigate();
  const { state }            = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const [pillsRef, pillsInView] = useScrollReveal();
  const isMobile = useIsMobile();
  const mapRef   = useRef(null);
  const panelRef = useRef(null);

  /* ── Résolution du pays sélectionné ────────────────────────────────────── */
  const countryFromSlug = slugParam ? SLUG_TO_COUNTRY[slugParam] ?? null : null;

  /* Compat ascendante : ?pays=<isoId> → redirect vers /carte/:slug */
  const rawIso = Number(searchParams.get('pays'));
  const slugFromSearch = rawIso ? ISO_TO_SLUG[rawIso] : null;

  useEffect(() => {
    if (!slugParam && slugFromSearch) {
      navigate(`/carte/${slugFromSearch}`, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCountry = countryFromSlug;
  const selectedId      = selectedCountry?.isoId ?? null;

  /* ── Scroll depuis l'accueil ────────────────────────────────────────────── */
  useEffect(() => {
    if (state?.fromHome && mapRef.current) {
      const t = setTimeout(
        () => mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        380,
      );
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Scroll vers panneau quand pays changé depuis la carte ─────────────── */
  useEffect(() => {
    if (selectedCountry && panelRef.current) {
      const t = setTimeout(
        () => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
        460,
      );
      return () => clearTimeout(t);
    }
  }, [selectedCountry?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Clic sur la carte ──────────────────────────────────────────────────── */
  const handleCountryClick = (isoId) => {
    const slug = ISO_TO_SLUG[isoId];
    if (!slug) return;
    if (selectedId === isoId) {
      navigate('/carte');
    } else {
      navigate(`/carte/${slug}`);
    }
  };

  /* ── SEO ────────────────────────────────────────────────────────────────── */
  const seoTitle = selectedCountry
    ? selectedCountry.title
    : 'Carte des 34 pays couverts : assurance temporaire en Europe';
  const seoDesc = selectedCountry
    ? selectedCountry.metaDescription
    : "Découvrez les 34 pays européens où votre assurance temporaire AssuTempo est valable. Carte interactive et liste complète.";
  const canonical = selectedCountry
    ? `https://assutempo.fr/carte/${selectedCountry.slug}`
    : 'https://assutempo.fr/carte';

  /* ── JSON-LD (page générique) ───────────────────────────────────────────── */
  const jsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoTitle,
    description: seoDesc,
    url: canonical,
    publisher: { '@type': 'Organization', name: 'AssuTempo' },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(jsonLdBase)}</script>
      </Helmet>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 28,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 60%)',
          }}
        />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p
              style={{
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 16,
              }}
            >
              COUVERTURE EUROPE
            </p>

            {/* H1 — générique ou spécifique au pays */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={selectedCountry?.slug ?? 'default'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{
                  fontSize: 'clamp(1.75rem, 4.5vw, 2.8rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  margin: 0,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                }}
              >
                {selectedCountry
                  ? selectedCountry.h1
                  : 'Assurance temporaire en Europe : la carte des 34 pays couverts'}
              </motion.h1>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Carte SVG ───────────────────────────────────────────────────── */}
      <section ref={mapRef} style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 0' }}>
        <Reveal>
          <EuropeMap selectedId={selectedId} onCountryClick={handleCountryClick} isMobile={isMobile} />
        </Reveal>
      </section>

      {/* ── Encadré L'essentiel ─────────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 0' }}>
        <Reveal>
          <div
            style={{
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              borderLeft: '3px solid var(--gold)',
              borderRadius: '0 14px 14px 0',
              padding: '20px 24px',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '0 0 10px',
              }}
            >
              L&apos;essentiel
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--text)',
                margin: 0,
                lineHeight: 1.75,
              }}
            >
              Avec AssuTempo, votre assurance temporaire couvre la responsabilité civile
              obligatoire dans 34 pays européens, dès le premier jour. Depuis avril 2024,
              la carte verte n&apos;existe plus : en France, la preuve d&apos;assurance se fait
              directement à la plaque, via le Fichier des Véhicules Assurés (FVA). Votre
              contrat comprend votre Mémo Véhicule Assuré et votre carte internationale
              d&apos;assurance automobile, valable dans les 34 pays cités.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Panneau pays ────────────────────────────────────────────────── */}
      <section
        ref={panelRef}
        style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}
      >
        <AnimatePresence mode="wait">
          {selectedCountry && (
            <motion.div
              key="panel-wrapper"
              variants={panelOuter}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  marginTop: 32,
                  padding: '36px 40px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 20,
                  marginBottom: 32,
                }}
              >
                <AnimatePresence mode="wait">
                  <CountryPanel key={selectedCountry.slug} country={selectedCountry} />
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Pills des 34 pays ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '40px 0 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <h2
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 24px',
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              Les 34 pays couverts — cliquez pour en savoir plus
            </h2>
          </Reveal>
          <div
            ref={pillsRef}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
          >
            {COUNTRIES.map((c, i) => {
              const isActive = selectedCountry?.slug === c.slug;
              return (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={pillsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: i * 0.02, ease: EASE }}
                >
                  <Link
                    to={isActive ? '/carte' : `/carte/${c.slug}`}
                    style={{
                      display: 'block',
                      padding: '8px 14px',
                      background: isActive ? 'var(--gold-dim)' : 'var(--glass)',
                      border: `1px solid ${isActive ? 'var(--gold-border)' : 'var(--glass-border)'}`,
                      borderRadius: 999,
                      fontSize: 13,
                      color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'border-color 0.25s, background 0.25s, color 0.25s',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (isActive) return;
                      e.currentTarget.style.borderColor = 'var(--gold-border)';
                      e.currentTarget.style.background = 'var(--gold-glow)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      if (isActive) return;
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.background = 'var(--glass)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {c.flag} {c.nom}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Sections texte ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
        <Reveal>
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              Une couverture valable dans toute l&apos;Europe
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.8 }}>
              Votre couverture est reconnue dans ces 34 pays grâce à votre carte internationale
              d&apos;assurance automobile. La responsabilité civile obligatoire vous couvre dès le
              premier jour, et l&apos;assistance est incluse. Que vous traversiez une frontière pour
              un trajet ponctuel ou que vous rapatriiez un véhicule, vous roulez en règle.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              Carte internationale d&apos;assurance automobile
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.8 }}>
              Depuis avril 2024, la carte verte physique n&apos;existe plus en France. La preuve
              d&apos;assurance se fait directement via le Fichier des Véhicules Assurés (FVA),
              consultable par les forces de l&apos;ordre à votre plaque. Pour circuler dans les 34
              pays européens couverts, votre carte internationale d&apos;assurance automobile fait
              foi — elle est délivrée immédiatement avec votre Mémo Véhicule Assuré.
            </p>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              Questions fréquentes
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 28px' }}>
              Tout ce que vous devez savoir sur la couverture internationale.
            </p>
            <div>
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </section>
        </Reveal>

        {/* CTA global */}
        <Reveal>
          <div
            style={{
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              borderRadius: 16,
              padding: '36px 28px',
              textAlign: 'center',
              marginBottom: 80,
            }}
          >
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 10px',
                letterSpacing: '-0.02em',
              }}
            >
              Roulez assuré partout en Europe.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
              34 pays couverts, attestation immédiate, de 1 à 90 jours.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              <Link
                to="/tarification"
                className="btn-gold"
                style={{
                  textDecoration: 'none',
                  padding: '14px 28px',
                  fontSize: 15,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Obtenir mon devis
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <a
                href="tel:0974197820"
                className="btn-glass"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Phone size={15} strokeWidth={1.5} />
                09 74 19 78 20
              </a>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Lun-Ven 9h-21h · Sam 9h-20h
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}

export default Carte;
