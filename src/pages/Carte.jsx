import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { m, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import {
  ArrowRight, Phone,
  Shield, Globe, MailCheck, Info, FileSearch, Car,
  Gauge, Siren, Leaf, History, ShoppingCart,
  Lightbulb, Shirt, Route, Wind, RotateCw,
  CornerUpRight, Camera, GraduationCap, Flag, FileText,
  Sticker, Gavel, Bus, Mountain, Clapperboard,
  Ticket, Trophy, AlertTriangle, ShieldCheck,
  ScanLine, Bike, Waves, Cog,
  Anchor, HeartPulse, Zap,
  Wine, Sun, Snowflake, ArrowLeft, ArrowRightLeft,
  Milestone, CircleAlert, TriangleAlert,
  Receipt, Fuel, ShoppingBag, Building2, Ban,
} from 'lucide-react';

/* Résolution dynamique des icônes par nom (string stocké dans les données) */
const ICON_MAP = {
  Shield, Globe, MailCheck, Info, FileSearch, Car,
  Gauge, Siren, Leaf, History, ShoppingCart,
  Lightbulb, Shirt, Route, Wind, RotateCw,
  CornerUpRight, Camera, GraduationCap, Flag, FileText,
  Sticker, Gavel, Bus, Mountain, Clapperboard,
  Ticket, Trophy, AlertTriangle, ShieldCheck,
  ScanLine, Bike, Waves, Cog,
  Anchor, HeartPulse, Zap,
  Wine, Sun, Snowflake, ArrowLeft, ArrowRightLeft,
  Milestone, CircleAlert, TriangleAlert,
  Receipt, Fuel, ShoppingBag, Building2, Ban,
};
import AccordionItem from '../components/ui/AccordionItem';
import { PaysCarte, PaysLegende } from '../components/blocks/PaysCarte';
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

/* Pays disponibles sur demande (devis via la page internationale) */
const ON_DEMAND = [
  { isoId: 8,   slug: 'albanie',            nom: 'Albanie' },
  { isoId: 31,  slug: 'azerbaidjan',        nom: 'Azerbaïdjan' },
  { isoId: 807, slug: 'macedoine-du-nord',  nom: 'Macédoine du Nord' },
  { isoId: 504, slug: 'maroc',              nom: 'Maroc' },
  { isoId: 498, slug: 'moldavie',           nom: 'Moldavie' },
  { isoId: 788, slug: 'tunisie',            nom: 'Tunisie' },
  { isoId: 792, slug: 'turquie',            nom: 'Turquie' },
];
const ON_DEMAND_BY_ISO = Object.fromEntries(ON_DEMAND.map(c => [c.isoId, c]));

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
    <m.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

/* ── Panneau pays animé ───────────────────────────────────────────────────── */
function CountryPanel({ country }) {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(null);
  const { h1, intro, points, flag, nom, slug, faq } = country;

  return (
    <m.div
      key={slug}
      variants={panelInner}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <m.div variants={stagger} initial="hidden" animate="visible">
        {/* En-tête */}
        <m.div variants={fadeUp} style={{ marginBottom: 8 }}>
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
        </m.div>

        {/* Filet doré, animation "dessin" */}
        <m.div
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
        <m.p
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
        </m.p>

        {/* Légende catégories */}
        <m.div variants={fadeUp}>
          <PaysLegende />
        </m.div>

        {/* Points clés - cartes catégorisées */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 14,
            marginBottom: 36,
          }}
        >
          {points.map((point, i) => (
            <PaysCarte key={i} section={point} index={i} IconComp={ICON_MAP[point.icon] || Info} />
          ))}
        </div>

        {/* CTA */}
        <m.div
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
        </m.div>

        {/* FAQ pays, uniquement si des questions sont disponibles */}
        {faq && faq.length > 0 && (
          <m.div variants={fadeUp} style={{ marginTop: 32 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                margin: '0 0 4px',
              }}
            >
              Questions fréquentes
            </p>
            {faq.map((item, i) => (
              <AccordionItem
                key={item.q}
                item={item}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </m.div>
        )}
      </m.div>
    </m.div>
  );
}

/* ── Remontée des géographies chargées vers EuropeMap (pour le halo) ────── */
function GeoIndexReporter({ geographies, onGeographies }) {
  useEffect(() => {
    if (geographies.length > 0) onGeographies(geographies);
  }, [geographies, onGeographies]);
  return null;
}

/* ── Halo de lumière itinérant, clippé à l'intérieur du pays actif ───────── */
const HALO_BBOX_CACHE = new Map();

function CountryHalo({ geo }) {
  const pathRef = useRef(null);
  const [box, setBox] = useState(() => HALO_BBOX_CACHE.get(geo.rsmKey) ?? null);

  /* getBBox une seule fois par pays, résultat mémoïsé au niveau module */
  useEffect(() => {
    if (HALO_BBOX_CACHE.has(geo.rsmKey)) {
      setBox(HALO_BBOX_CACHE.get(geo.rsmKey));
      return;
    }
    if (!pathRef.current) return;
    const b = pathRef.current.getBBox();
    const next = { x: b.x, y: b.y, width: b.width, height: b.height };
    HALO_BBOX_CACHE.set(geo.rsmKey, next);
    setBox(next);
  }, [geo.rsmKey]);

  const clipId = `carte-halo-clip-${geo.rsmKey}`;

  return (
    <m.g
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ pointerEvents: 'none' }}
    >
      <clipPath id={clipId}>
        <path ref={pathRef} d={geo.svgPath} />
      </clipPath>
      {box && (
        <g clipPath={`url(#${clipId})`}>
          <m.circle
            cx={0}
            cy={0}
            r={Math.max(box.width, box.height) * 0.6}
            fill="url(#carteHaloGradient)"
            style={{ pointerEvents: 'none' }}
            animate={{
              x: [box.x, box.x + box.width, box.x + box.width, box.x, box.x],
              y: [box.y, box.y, box.y + box.height, box.y + box.height, box.y],
            }}
            transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
          />
        </g>
      )}
    </m.g>
  );
}

/* ── Paths pays, mémoïsés pour ne pas re-rendre au survol ─────────────────── */
const MapGeographies = memo(function MapGeographies({
  selectedId, reduce, inView, onEnter, onLeave, onActivate, onGeographies,
}) {
  return (
    <Geographies geography={GEO_URL}>
      {({ geographies }) => {
        let revealIdx = 0;
        const nodes = geographies.map((geo) => {
          const id            = +geo.id;
          const isCovered     = COVERED.has(id);
          const onDemand      = ON_DEMAND_BY_ISO[id];
          const isSelected    = selectedId === id;
          const isInteractive = isCovered || !!onDemand;
          const name          = onDemand ? onDemand.nom : COUNTRY_NAMES[id];

          const baseFill = isSelected
            ? '#D9B85E'
            : isCovered
            ? 'url(#carteGoldGradient)'
            : onDemand
            ? '#A05E26'
            : '#1C1A16';
          const hoverFill = onDemand ? '#C27A35' : isCovered ? '#E8C97A' : baseFill;
          const fillTransition = reduce ? 'none' : 'fill 200ms ease-out';

          const ariaLabel = onDemand
            ? `${name}, disponible sur demande, voir la page assurance internationale`
            : isCovered
            ? `${name}, pays couvert, voir les informations de couverture`
            : undefined;

          const geographyNode = (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={baseFill}
              stroke={isSelected ? 'rgba(232,201,122,0.55)' : onDemand ? '#D98E4A' : '#080706'}
              strokeWidth={isSelected ? 1.2 : 0.4}
              strokeDasharray={onDemand ? '4 3' : undefined}
              vectorEffect="non-scaling-stroke"
              aria-label={ariaLabel}
              tabIndex={isInteractive ? 0 : -1}
              role={isInteractive ? 'button' : undefined}
              style={{
                default: {
                  outline: 'none',
                  fill: baseFill,
                  transition: fillTransition,
                },
                hover: {
                  outline: 'none',
                  fill: hoverFill,
                  cursor: isInteractive ? 'pointer' : 'default',
                  transition: fillTransition,
                },
                pressed: { outline: 'none' },
              }}
              onMouseEnter={() => onEnter(id, geo)}
              onMouseLeave={onLeave}
              onClick={() => onActivate(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onActivate(id);
                }
              }}
            />
          );

          /* Révélation en cascade : uniquement les pays couverts et sur demande */
          if (!isInteractive || reduce) return geographyNode;
          const delay = revealIdx * 0.01;
          revealIdx += 1;
          return (
            <m.g
              key={geo.rsmKey}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              {geographyNode}
            </m.g>
          );
        });
        return (
          <>
            <GeoIndexReporter geographies={geographies} onGeographies={onGeographies} />
            {nodes}
          </>
        );
      }}
    </Geographies>
  );
});

/* ── Carte SVG ────────────────────────────────────────────────────────────── */
function EuropeMap({ selectedId, onCountryClick, isMobile }) {
  const [hovered, setHovered]   = useState(null);
  const [geoIndex, setGeoIndex] = useState(null);
  const [inView, setInView]     = useState(false);
  const [sweep, setSweep]       = useState('idle');
  const reduce   = useReducedMotion();
  const navigate = useNavigate();

  /* Tilt 3D au pointeur, desktop uniquement */
  const [finePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );
  const tiltActive = finePointer && !reduce;
  const tiltX   = useMotionValue(0);
  const tiltY   = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const springY = useSpring(tiltY, { stiffness: 120, damping: 18 });

  const handleTiltMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 6);
    tiltX.set(py * -6);
  }, [tiltX, tiltY]);
  const handleTiltLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  /* Balayage lumineux unique, 0.8s après l'entrée dans le viewport */
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => setSweep('run'), 800);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  const hoveredName = hovered
    ? ON_DEMAND_BY_ISO[hovered.id]?.nom ?? COUNTRY_NAMES[hovered.id]
    : null;
  const badgeName = hoveredName ?? (selectedId != null ? COUNTRY_NAMES[selectedId] : null);

  /* Un seul halo actif : le pays survolé, sinon le pays sélectionné */
  const activeGeo = hovered?.geo
    ?? (selectedId != null && geoIndex ? geoIndex[selectedId] ?? null : null);

  const handleGeographies = useCallback((geographies) => {
    setGeoIndex(Object.fromEntries(geographies.map(g => [+g.id, g])));
  }, []);
  const handleEnter = useCallback((id, geo) => {
    if (!COUNTRY_NAMES[id] && !ON_DEMAND_BY_ISO[id]) return;
    setHovered({ id, geo });
  }, []);
  const handleLeave = useCallback(() => {
    setHovered(null);
  }, []);
  const handleActivate = useCallback((id) => {
    const onDemand = ON_DEMAND_BY_ISO[id];
    if (onDemand) {
      navigate(`/assurance-internationale?pays=${onDemand.slug}`);
      return;
    }
    if (!COUNTRY_NAMES[id]) return;
    onCountryClick(id);
  }, [navigate, onCountryClick]);

  return (
    <>
      {/* Carte container, vue fixe, toute l'Europe visible, perspective pour le tilt */}
      <div style={{ position: 'relative', perspective: '1200px' }}>
        {/* Halo ambiant derrière la carte */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -32,
            background:
              'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
      <m.div
        onViewportEnter={() => setInView(true)}
        viewport={{ once: true, amount: 0.3 }}
        onMouseMove={tiltActive ? handleTiltMove : undefined}
        onMouseLeave={tiltActive ? handleTiltLeave : undefined}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          rotateX: tiltActive ? springX : 0,
          rotateY: tiltActive ? springY : 0,
          willChange: tiltActive ? 'transform' : undefined,
        }}
      >
        {/* Tooltip fixe : pill unique en haut de la carte, nom du pays seul */}
        <AnimatePresence>
          {badgeName && (
            <m.div
              key="carte-tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              aria-live="polite"
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                x: '-50%',
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
            </m.div>
          )}
        </AnimatePresence>

        {/* Balayage lumineux unique après la cascade */}
        {sweep === 'run' && !reduce && (
          <m.div
            aria-hidden="true"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            onAnimationComplete={() => setSweep('done')}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              pointerEvents: 'none',
              background:
                'linear-gradient(105deg, transparent 40%, rgba(232,201,122,0.12) 50%, transparent 60%)',
            }}
          />
        )}

        <ComposableMap
          role="img"
          aria-label="Carte des 34 pays européens couverts par l'assurance temporaire AssuTempo, et des 7 destinations disponibles sur demande comme le Maroc, la Tunisie ou la Turquie."
          projection="geoAzimuthalEqualArea"
          projectionConfig={{ rotate: [-15, -50, 0], scale: 680 }}
          width={800}
          height={560}
          shapeRendering="geometricPrecision"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Dégradé or des pays couverts, angle 135 degrés */}
            <linearGradient id="carteGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#E8C97A" />
            </linearGradient>
            {/* Dégradé radial du halo itinérant */}
            <radialGradient id="carteHaloGradient">
              <stop offset="0%" stopColor="#E8C97A" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#E8C97A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#E8C97A" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* ZoomableGroup toujours rendu (pas de conditionnel → pas de mismatch SSR).
              filterZoomEvent bloque tout sur bureau ; laisse passer sur mobile. */}
          <ZoomableGroup
            zoom={1}
            minZoom={1}
            maxZoom={4}
            filterZoomEvent={() => isMobile}
          >
            <MapGeographies
              selectedId={selectedId}
              reduce={reduce}
              inView={inView}
              onEnter={handleEnter}
              onLeave={handleLeave}
              onActivate={handleActivate}
              onGeographies={handleGeographies}
            />
            {/* Halo itinérant, désactivé si prefers-reduced-motion */}
            {!reduce && (
              <AnimatePresence>
                {activeGeo && <CountryHalo key={activeGeo.rsmKey} geo={activeGeo} />}
              </AnimatePresence>
            )}
          </ZoomableGroup>
        </ComposableMap>

        {/* Légende */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '14px 20px',
            borderTop: '1px solid var(--glass-border)',
          }}
        >
          {[
            { bg: '#C9A84C', label: '34 pays couverts' },
            ...(selectedId != null ? [{ bg: '#D9B85E', label: 'Sélectionné' }] : []),
            { bg: '#A05E26', border: '1px dashed #D98E4A', label: 'Sur demande' },
            { bg: '#1C1A16', border: '1px solid #333', label: 'Non couvert' },
          ].map(({ bg, border, label }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: bg, border, flexShrink: 0, boxSizing: 'border-box' }} />
              {label}
            </div>
          ))}
        </div>
      </m.div>
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
  const handleCountryClick = useCallback((isoId) => {
    const slug = ISO_TO_SLUG[isoId];
    if (!slug) return;
    if (selectedId === isoId) {
      navigate('/carte');
    } else {
      navigate(`/carte/${slug}`);
    }
  }, [navigate, selectedId]);

  /* ── SEO ────────────────────────────────────────────────────────────────── */
  const seoTitle = selectedCountry
    ? `Assurance Temporaire ${selectedCountry.nom} : Couvert dès le 1er Jour | AssuTempo`
    : 'Assurance Temporaire en Europe : 34 Pays Couverts | AssuTempo';
  const seoDesc = selectedCountry
    ? `Assurance temporaire valable en ${selectedCountry.nom} dès le 1er jour : responsabilité civile, règles locales, péages. Attestation immédiate en 5 minutes.`
    : "Assurance temporaire valable dans 34 pays européens dès le premier jour. Carte interactive, règles locales de circulation, péages et vignettes pays par pays.";
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
          <m.div
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

            {/* H1, générique ou spécifique au pays */}
            <AnimatePresence mode="wait">
              <m.h1
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
                  : 'Assurance temporaire : 34 pays européens couverts'}
              </m.h1>
            </AnimatePresence>
          </m.div>
        </div>
      </section>

      {/* ── Bandeau international ───────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid var(--gold-border)',
          borderRadius: 12,
          padding: '16px 24px',
          flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Vous roulez au-delà de l&apos;Europe ?</span>
            {' '}Maroc, Turquie, Tunisie et 4 autres destinations sur demande.
          </p>
          <Link
            to="/assurance-internationale"
            className="btn-glass"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 18px',
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            Demander un devis
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
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
            <m.div
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
            </m.div>
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
              Les 34 pays couverts, cliquez pour en savoir plus
            </h2>
          </Reveal>
          <div
            ref={pillsRef}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
          >
            {COUNTRIES.map((c, i) => {
              const isActive = selectedCountry?.slug === c.slug;
              return (
                <m.div
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
                </m.div>
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
              foi, elle est délivrée immédiatement avec votre Mémo Véhicule Assuré.
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

      {/* ── CTA destinations hors Europe ────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <Reveal>
          <div style={{
            background: 'var(--glass)',
            border: '1px solid var(--gold-border)',
            borderRadius: 16,
            padding: '36px 32px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', margin: '0 0 12px' }}>
              AU-DELÀ DE L&apos;EUROPE
            </p>
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
              fontWeight: 700,
              color: 'var(--text)',
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}>
              Une destination hors Europe ?
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.7, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Albanie, Azerbaïdjan, Macédoine du Nord, Maroc, Moldavie, Tunisie, Turquie :
              devis personnalisé sous 12h.
            </p>
            <Link
              to="/assurance-internationale"
              className="btn-gold"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 26px',
                fontSize: 15,
              }}
            >
              Destinations sur demande
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}

export default Carte;
