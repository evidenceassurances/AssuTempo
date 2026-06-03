import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ArrowRight, Phone } from 'lucide-react';
import AccordionItem from '../components/ui/AccordionItem';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* ── Données géographiques (bundlées en local pour éviter dépendance CDN) ── */
const GEO_URL = '/countries-110m.json';

/* ── ISO 3166-1 numérique des 34 pays couverts ── */
const COVERED = new Set([
  40, 56, 100, 196, 203, 276, 208, 724, 233, 250, 246, 300,
  348, 191, 380, 372, 352, 442, 440, 428, 470, 578, 528, 620,
  616, 642, 752, 703, 705, 756, 20, 70, 499, 826,
]);

const COUNTRY_NAMES = {
  40: 'Autriche', 56: 'Belgique', 100: 'Bulgarie', 196: 'Chypre',
  203: 'République tchèque', 276: 'Allemagne', 208: 'Danemark',
  724: 'Espagne', 233: 'Estonie', 250: 'France', 246: 'Finlande',
  300: 'Grèce', 348: 'Hongrie', 191: 'Croatie', 380: 'Italie',
  372: 'Irlande', 352: 'Islande', 442: 'Luxembourg', 440: 'Lituanie',
  428: 'Lettonie', 470: 'Malte', 578: 'Norvège', 528: 'Pays-Bas',
  620: 'Portugal', 616: 'Pologne', 642: 'Roumanie', 752: 'Suède',
  703: 'Slovaquie', 705: 'Slovénie', 756: 'Suisse', 20: 'Andorre',
  70: 'Bosnie-Herzégovine', 499: 'Monténégro', 826: 'Royaume-Uni',
};

/* ── Pills de pays (même style que Countries.jsx) ── */
const COUNTRY_PILLS = [
  '🇦🇹 Autriche', '🇧🇪 Belgique', '🇧🇬 Bulgarie', '🇨🇾 Chypre',
  '🇨🇿 République tchèque', '🇩🇪 Allemagne', '🇩🇰 Danemark',
  '🇪🇸 Espagne', '🇪🇪 Estonie', '🇫🇷 France', '🇫🇮 Finlande',
  '🇬🇷 Grèce', '🇭🇺 Hongrie', '🇭🇷 Croatie', '🇮🇹 Italie',
  '🇮🇪 Irlande', '🇮🇸 Islande', '🇱🇺 Luxembourg', '🇱🇹 Lituanie',
  '🇱🇻 Lettonie', '🇲🇹 Malte', '🇳🇴 Norvège', '🇳🇱 Pays-Bas',
  '🇵🇹 Portugal', '🇵🇱 Pologne', '🇷🇴 Roumanie', '🇸🇪 Suède',
  '🇸🇰 Slovaquie', '🇸🇮 Slovénie', '🇨🇭 Suisse', '🇦🇩 Andorre',
  '🇧🇦 Bosnie-Herzégovine', '🇲🇪 Monténégro', '🇬🇧 Royaume-Uni',
];

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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "Carte des 34 pays couverts : assurance temporaire en Europe",
    description:
      "Les 34 pays européens où l'assurance temporaire AssuTempo est valable. Carte interactive et liste complète.",
    url: 'https://assutempo.fr/carte',
    publisher: { '@type': 'Organization', name: 'AssuTempo' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Pays couverts par l'assurance temporaire AssuTempo",
    numberOfItems: 34,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Autriche' },
      { '@type': 'ListItem', position: 2, name: 'Belgique' },
      { '@type': 'ListItem', position: 3, name: 'Bulgarie' },
      { '@type': 'ListItem', position: 4, name: 'Chypre' },
      { '@type': 'ListItem', position: 5, name: 'République tchèque' },
      { '@type': 'ListItem', position: 6, name: 'Allemagne' },
      { '@type': 'ListItem', position: 7, name: 'Danemark' },
      { '@type': 'ListItem', position: 8, name: 'Espagne' },
      { '@type': 'ListItem', position: 9, name: 'Estonie' },
      { '@type': 'ListItem', position: 10, name: 'France' },
      { '@type': 'ListItem', position: 11, name: 'Finlande' },
      { '@type': 'ListItem', position: 12, name: 'Grèce' },
      { '@type': 'ListItem', position: 13, name: 'Hongrie' },
      { '@type': 'ListItem', position: 14, name: 'Croatie' },
      { '@type': 'ListItem', position: 15, name: 'Italie' },
      { '@type': 'ListItem', position: 16, name: 'Irlande' },
      { '@type': 'ListItem', position: 17, name: 'Islande' },
      { '@type': 'ListItem', position: 18, name: 'Luxembourg' },
      { '@type': 'ListItem', position: 19, name: 'Lituanie' },
      { '@type': 'ListItem', position: 20, name: 'Lettonie' },
      { '@type': 'ListItem', position: 21, name: 'Malte' },
      { '@type': 'ListItem', position: 22, name: 'Norvège' },
      { '@type': 'ListItem', position: 23, name: 'Pays-Bas' },
      { '@type': 'ListItem', position: 24, name: 'Portugal' },
      { '@type': 'ListItem', position: 25, name: 'Pologne' },
      { '@type': 'ListItem', position: 26, name: 'Roumanie' },
      { '@type': 'ListItem', position: 27, name: 'Suède' },
      { '@type': 'ListItem', position: 28, name: 'Slovaquie' },
      { '@type': 'ListItem', position: 29, name: 'Slovénie' },
      { '@type': 'ListItem', position: 30, name: 'Suisse' },
      { '@type': 'ListItem', position: 31, name: 'Andorre' },
      { '@type': 'ListItem', position: 32, name: 'Bosnie-Herzégovine' },
      { '@type': 'ListItem', position: 33, name: 'Monténégro' },
      { '@type': 'ListItem', position: 34, name: 'Royaume-Uni' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Dans quels pays mon assurance temporaire est-elle valable ?",
        acceptedAnswer: { '@type': 'Answer', text: "Dans 34 pays européens, dont la liste complète figure sur cette page. La responsabilité civile y est couverte dès le premier jour." },
      },
      {
        '@type': 'Question',
        name: "L'assurance est-elle valable en Allemagne, en Espagne ou en Italie ?",
        acceptedAnswer: { '@type': 'Answer', text: "Oui. L'Allemagne, l'Espagne et l'Italie font partie des 34 pays couverts." },
      },
      {
        '@type': 'Question',
        name: "Le Royaume-Uni et la Suisse sont-ils couverts ?",
        acceptedAnswer: { '@type': 'Answer', text: "Oui. Le Royaume-Uni, la Suisse, l'Andorre, le Monténégro et la Bosnie-Herzégovine font partie des pays couverts." },
      },
      {
        '@type': 'Question',
        name: "La couverture est-elle immédiate à l'étranger ?",
        acceptedAnswer: { '@type': 'Answer', text: "Oui, dès le premier jour du contrat, avec une attestation délivrée immédiatement." },
      },
      {
        '@type': 'Question',
        name: "Qu'est-ce que la carte internationale d'assurance automobile ?",
        acceptedAnswer: { '@type': 'Answer', text: "C'est le document qui atteste que votre véhicule est assuré et précise les pays couverts. Depuis avril 2024, la carte verte n'existe plus en France : la preuve d'assurance se fait via le Fichier des Véhicules Assurés (FVA). Votre carte internationale d'assurance automobile reste le document de référence pour circuler dans les 34 pays européens couverts." },
      },
    ],
  },
];

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Carte SVG ── */
function EuropeMap({ initialSelectedId = null }) {
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const reduce = useReducedMotion();

  /* Badge affiche le nom survolé pendant le survol, sinon le pays sélectionné */
  const badgeName = tooltip.visible
    ? tooltip.name
    : selectedId !== null
    ? COUNTRY_NAMES[selectedId]
    : null;

  const handleEnter = (geoId, e) => {
    const name = COUNTRY_NAMES[geoId];
    if (!name) return;
    setTooltip({ visible: true, name, x: e.clientX, y: e.clientY });
  };

  const handleMove = (geoId, e) => {
    if (!COUNTRY_NAMES[geoId]) return;
    setTooltip((t) => ({ ...t, x: e.clientX, y: e.clientY }));
  };

  const handleLeave = () => {
    setTooltip((t) => ({ ...t, visible: false }));
  };

  const handleClick = (geoId) => {
    if (!COUNTRY_NAMES[geoId]) return;
    setSelectedId((prev) => (prev === geoId ? null : geoId));
  };

  return (
    <>
      {/* Infobulle desktop (suit le curseur) */}
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

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Badge : nom survolé pendant le hover, pays sélectionné au repos */}
        {badgeName && (
          <div
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
          </div>
        )}

        <ComposableMap
          role="img"
          aria-label="Carte des 34 pays européens couverts par l'assurance temporaire AssuTempo. Les pays couverts sont colorés en doré."
          projection="geoAzimuthalEqualArea"
          projectionConfig={{ rotate: [-15, -52, 0], scale: 680 }}
          width={800}
          height={520}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = +geo.id;
                const isCovered = COVERED.has(id);
                const name = COUNTRY_NAMES[id];
                const isSelected = selectedId === id;
                /* Couleur de base : sélectionné → doré clair (token hover existant),
                   couvert → doré standard, non couvert → fond sombre */
                const baseFill = isSelected ? '#E8C97A' : isCovered ? '#C9A84C' : '#1C1A16';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={baseFill}
                    stroke={isSelected ? 'rgba(232,201,122,0.55)' : '#080706'}
                    strokeWidth={isSelected ? 1.2 : 0.4}
                    aria-label={isCovered ? `${name} - pays couvert` : undefined}
                    tabIndex={isCovered ? 0 : -1}
                    role={isCovered ? 'img' : undefined}
                    style={{
                      default: { outline: 'none', transition: reduce ? 'none' : 'fill 0.2s', fill: baseFill },
                      hover: {
                        fill: isCovered ? '#E8C97A' : '#222018',
                        outline: 'none',
                        cursor: isCovered ? 'pointer' : 'default',
                        filter: isCovered ? 'drop-shadow(0 0 6px rgba(232,201,122,0.4))' : 'none',
                      },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e) => handleEnter(id, e)}
                    onMouseMove={(e) => handleMove(id, e)}
                    onMouseLeave={handleLeave}
                    onClick={() => handleClick(id)}
                  />
                );
              })
            }
          </Geographies>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: '#C9A84C', flexShrink: 0 }} />
            34 pays couverts
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: '#1C1A16', border: '1px solid #333', flexShrink: 0 }} />
            Non couvert
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Page principale ── */
function Carte() {
  const [openFaq, setOpenFaq] = useState(null);
  const [pillsRef, pillsInView] = useScrollReveal();
  const [searchParams] = useSearchParams();
  const mapRef = useRef(null);

  const rawPays = Number(searchParams.get('pays'));
  const initialId = COVERED.has(rawPays) ? rawPays : null;

  useEffect(() => {
    if (!initialId || !mapRef.current) return;
    const t = setTimeout(
      () => mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      500,
    );
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>Carte des 34 pays couverts : assurance temporaire en Europe</title>
        <meta
          name="description"
          content="Découvrez en un coup d'oeil les 34 pays européens où votre assurance temporaire AssuTempo est valable. Carte interactive et liste complète des pays couverts."
        />
        <link rel="canonical" href="https://assutempo.fr/carte" />
        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 56,
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
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 2.8rem)',
                fontWeight: 800,
                color: 'var(--text)',
                margin: '0 0 32px',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              Assurance temporaire en Europe : la carte des 34 pays couverts
            </h1>

            {/* Encadré "L'essentiel" */}
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
                Avec AssuTempo, votre assurance temporaire couvre la responsabilité civile obligatoire dans 34 pays européens, dès le premier jour. Depuis avril 2024, la carte verte n&apos;existe plus : en France, la preuve d&apos;assurance se fait directement à la plaque, via le Fichier des Véhicules Assurés (FVA). Votre contrat comprend votre Mémo Véhicule Assuré et votre carte internationale d&apos;assurance automobile, valable dans les 34 pays cités. Voici la carte interactive et la liste complète des pays couverts.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Carte SVG ── */}
      <section ref={mapRef} style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
        <Reveal>
          <EuropeMap initialSelectedId={initialId} />
        </Reveal>
      </section>

      {/* ── Liste pills des 34 pays ── */}
      <section style={{ background: 'var(--bg)', padding: '0 0 72px' }}>
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
              Les 34 pays couverts
            </h2>
          </Reveal>
          <div
            ref={pillsRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
            }}
          >
            {COUNTRY_PILLS.map((country, i) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={pillsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  padding: '8px 14px',
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 999,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  transition: 'border-color 0.25s, background 0.25s, color 0.25s',
                  cursor: 'default',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-border)';
                  e.currentTarget.style.background = 'var(--gold-glow)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--glass)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {country}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sections texte ── */}
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
              Votre couverture est reconnue dans ces 34 pays grâce à votre carte internationale d&apos;assurance automobile. La responsabilité civile obligatoire vous couvre dès le premier jour, et l&apos;assistance est incluse. Que vous traversiez une frontière pour un trajet ponctuel ou que vous rapatriiez un véhicule, vous roulez en règle.
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
              Depuis avril 2024, la carte verte physique n&apos;existe plus en France. En France, la preuve
              d&apos;assurance se fait directement via le Fichier des Véhicules Assurés (FVA), consultable
              par les forces de l&apos;ordre à votre plaque. Pour circuler dans les 34 pays européens couverts,
              votre carte internationale d&apos;assurance automobile fait foi - elle est délivrée immédiatement
              avec votre Mémo Véhicule Assuré.
            </p>
          </div>
        </Reveal>

        {/* ── FAQ ── */}
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

        {/* ── CTA ── */}
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
            <p
              style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}
            >
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
