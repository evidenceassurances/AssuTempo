import { useState } from 'react';
import { jsonLd } from '../lib/seo';
import { Link } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Check,
  Navigation,
  AlertTriangle,
  ArrowRight,
  Phone,
  Clock,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';
import ScrollProgress from './articles/ScrollProgress';
import AnswerCapsule from './articles/AnswerCapsule';
import { useScrollReveal } from '../hooks/useScrollReveal';
import AccordionItem from './ui/AccordionItem';
import Footer from './Footer';
import StepFlow from './StepFlow';
import DecisionSplit from './DecisionSplit';
import { articles } from '../data/articlesData';
import { ARTICLE_CLUSTERS } from '../data/articleClusters';

const ARTICLE_BY_SLUG = new Map(articles.map((a) => [a.slug, a]));

/* ─── Motion wrapper that respects prefers-reduced-motion ─── */
function Reveal({ children, delay = 0, style }) {
  const reduce = useReducedMotion();
  if (reduce) return <div style={style}>{children}</div>;
  return (
    <m.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </m.div>
  );
}

/* ─── Timeline step ─── */
function TimelineStep({ step, isLast }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 20,
        position: 'relative',
      }}
    >
      {/* Connector column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {/* Numbered circle */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--gold-glow)',
            border: '1.5px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.05em',
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          {String(step.num).padStart(2, '0')}
        </div>
        {/* Vertical connector line */}
        {!isLast && (
          <div
            style={{
              width: 1,
              flexGrow: 1,
              minHeight: 32,
              background: 'linear-gradient(to bottom, var(--gold-border), transparent)',
              marginTop: 4,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : 36, paddingTop: 8, minWidth: 0 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 8px',
            lineHeight: 1.4,
          }}
        >
          {step.title}
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
          {step.body}
        </p>
      </div>
    </div>
  );
}

/* ─── Section renderer ─── */
function RenderSection({ section }) {
  const delay = 0;

  switch (section.type) {
    case 'text':
      return (
        <Reveal delay={delay}>
          <section style={{ marginBottom: 40 }}>
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
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 16,
                  color: 'var(--text-muted)',
                  margin: i < section.paragraphs.length - 1 ? '0 0 14px' : 0,
                  lineHeight: 1.8,
                }}
              >
                {p}
              </p>
            ))}
            {section.relatedLink && (
              <Link
                to={section.relatedLink.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 16,
                  padding: '10px 16px',
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--gold)',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--gold-glow)')}
              >
                {section.relatedLink.text}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            )}
          </section>
        </Reveal>
      );

    case 'callout':
      return (
        <Reveal delay={delay}>
          <aside
            aria-label={section.title}
            style={{
              marginBottom: 40,
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              borderLeft: '3px solid var(--gold)',
              borderRadius: '0 12px 12px 0',
              padding: '20px 24px',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <Navigation size={20} color="var(--gold)" strokeWidth={1.5} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: '0 0 8px',
                }}
              >
                {section.title}
              </p>
              <p style={{ fontSize: 15, color: 'var(--text)', margin: 0, lineHeight: 1.75 }}>
                {section.text}
              </p>
            </div>
          </aside>
        </Reveal>
      );

    case 'timeline':
      return (
        <Reveal delay={delay}>
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 28px',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              {section.heading}
            </h2>
            <div>
              {section.steps.map((step, i) => (
                <TimelineStep
                  key={step.num}
                  step={step}
                  index={i}
                  isLast={i === section.steps.length - 1}
                />
              ))}
            </div>
          </section>
        </Reveal>
      );

    case 'alert':
      return (
        <Reveal delay={delay}>
          <aside
            aria-label={section.heading}
            style={{
              marginBottom: 40,
              background: 'rgba(201,168,76,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderLeft: '3px solid var(--gold-deep)',
              borderRadius: '0 12px 12px 0',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={16} color="var(--gold-deep)" strokeWidth={2} />
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--gold-deep)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: 0,
                }}
              >
                {section.heading}
              </p>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    marginBottom: i < section.items.length - 1 ? 8 : 0,
                  }}
                >
                  <span style={{ flexShrink: 0, marginTop: 4, fontSize: 10, color: 'var(--gold)' }}>▸</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
            {section.note && (
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  margin: '12px 0 0',
                  lineHeight: 1.6,
                }}
              >
                {section.note}
              </p>
            )}
          </aside>
        </Reveal>
      );

    case 'checklist':
      return (
        <Reveal delay={delay}>
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 20px',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              {section.heading}
            </h2>
            {section.intro && (
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.7 }}>
                {section.intro}
              </p>
            )}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ flexShrink: 0, marginTop: 3 }}>
                    <Check size={16} color="var(--gold)" strokeWidth={2.5} />
                  </span>
                  <span style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            {section.note && (
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-subtle)',
                  fontStyle: 'italic',
                  margin: '16px 0 0',
                  paddingLeft: 28,
                  lineHeight: 1.6,
                }}
              >
                {section.note}
              </p>
            )}
            {section.relatedLink && (
              <Link
                to={section.relatedLink.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 16,
                  padding: '10px 16px',
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--gold)',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--gold-glow)')}
              >
                {section.relatedLink.text}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            )}
          </section>
        </Reveal>
      );

    case 'table':
      return (
        <Reveal delay={delay}>
          <section style={{ marginBottom: 40 }}>
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
              {section.heading}
            </h2>
            {section.intro && (
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.7 }}>
                {section.intro}
              </p>
            )}
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: 480,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <thead>
                  <tr>
                    {section.columns.map((col, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--gold)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          background: 'var(--gold-glow)',
                          borderBottom: '1px solid var(--gold-border)',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          style={{
                            padding: '12px 16px',
                            fontSize: 14,
                            color: j === 0 ? 'var(--text)' : 'var(--text-muted)',
                            fontWeight: j === 0 ? 600 : 400,
                            borderTop: i > 0 ? '1px solid var(--glass-border)' : 'none',
                            lineHeight: 1.5,
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {section.note && (
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-subtle)',
                  fontStyle: 'italic',
                  margin: '12px 0 0',
                  lineHeight: 1.6,
                }}
              >
                {section.note}
              </p>
            )}
          </section>
        </Reveal>
      );

    case 'stepflow':
      return (
        <Reveal delay={delay}>
          <StepFlow steps={section.steps} ariaLabel={section.ariaLabel} />
        </Reveal>
      );

    case 'decisionsplit':
      return (
        <Reveal delay={delay}>
          <DecisionSplit
            question={section.question}
            voies={section.voies}
            ariaLabel={section.ariaLabel}
          />
        </Reveal>
      );

    default:
      return null;
  }
}

/* ─── Mid-article CTA block ───
   `cta` optionnel (voir data.cta dans les articles) : permet de rediriger
   vers /carte-grise plutot que /tarification pour un article pilier carte
   grise, sans changer le comportement des articles existants (replis
   identiques aux valeurs historiques). */
function ArticleCTABlock({ cta }) {
  const href = cta?.href ?? '/tarification';
  const label = cta?.label ?? 'Obtenir mon devis';
  const title = cta?.title ?? 'Assuré en 5 minutes, attestation immédiate.';
  const subtitle = cta?.subtitle ?? 'Récupérez votre véhicule sans attendre.';
  const suffix = cta?.suffix ?? '100 % en ligne, sans engagement.';
  const [ref, inView] = useScrollReveal();
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--gold-glow)',
        border: '1px solid var(--gold-border)',
        borderRadius: 16,
        padding: '32px 28px',
        textAlign: 'center',
        margin: '48px 0',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
          fontWeight: 700,
          color: 'var(--text)',
          margin: '0 0 10px',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
        {subtitle}{' '}
        <span style={{ color: 'var(--text)' }}>{suffix}</span>
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to={href}
          className="btn-gold"
          style={{
            textDecoration: 'none',
            padding: '13px 24px',
            fontSize: 15,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {label}
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
      <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '14px 0 0' }}>
        Lun-Ven 9h-21h · Sam 9h-20h
      </p>
    </m.div>
  );
}

/* ─── Related article card ─── */
function RelatedCard({ article }) {
  const Icon = article.icone;
  const inner = (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: 14,
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height: '100%',
        transition: 'border-color 0.3s, transform 0.3s var(--ease-out)',
        cursor: article.hasPage ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} color="var(--gold)" strokeWidth={1.5} />
          </div>
          <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {article.categorie}
          </span>
        </div>
        {!article.hasPage && (
          <span
            style={{
              padding: '3px 8px',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 999,
              fontSize: 10,
              color: 'var(--text-subtle)',
              whiteSpace: 'nowrap',
            }}
          >
            Bientôt
          </span>
        )}
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {article.titre}
      </p>
    </div>
  );

  if (article.hasPage) {
    return (
      <Link to={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ─── Sticky mobile CTA bar ─── */
function StickyCTA({ cta }) {
  const href = cta?.href ?? '/tarification';
  const label = cta?.label ?? 'Obtenir mon devis';
  return (
    <>
      <div className="sticky-article-cta" role="complementary" aria-label={label}>
        <Link
          to={href}
          className="btn-gold"
          style={{
            textDecoration: 'none',
            flex: 1,
            justifyContent: 'center',
            padding: '13px 16px',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {label}
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
        <a
          href="tel:0974197820"
          aria-label="Appeler le 09 74 19 78 20"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '13px 18px',
            background: 'var(--glass)',
            border: '1px solid var(--gold-border)',
            borderRadius: 12,
            color: 'var(--gold)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Phone size={18} strokeWidth={1.5} />
        </a>
      </div>
      <style>{`
        .sticky-article-cta {
          display: none;
        }
        @media (max-width: 768px) {
          .sticky-article-cta {
            display: flex;
            align-items: center;
            gap: 10px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 16px max(12px, env(safe-area-inset-bottom));
            background: rgba(8, 7, 6, 0.96);
            border-top: 1px solid var(--gold-border);
            z-index: 100;
          }
        }
      `}</style>
    </>
  );
}

/* ─── ArticleLayout ─── */
function ArticleLayout({ data }) {
  const [openFaq, setOpenFaq] = useState(null);
  /* "A lire aussi" par cluster thematique (articleClusters.js) : chaque
     article renvoie vers 3 articles de sa famille + une rangee de liens
     "Pour aller plus loin" (page money du cluster en tete). Repli sur les
     3 premiers articles si le slug n'est pas encore dans un cluster. */
  const cluster = ARTICLE_CLUSTERS[data.slug];
  const relatedArticles = cluster
    ? cluster.related.map((slug) => ARTICLE_BY_SLUG.get(slug)).filter(Boolean)
    : articles.filter((a) => a.slug !== data.slug).slice(0, 3);
  const clusterLinks = cluster?.liens ?? [];

  const ctaInsertIndex = Math.floor(data.sections.length / 2);

  return (
    <>
      <Helmet>
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
        <link rel="canonical" href={data.seo.canonical} />
        <meta property="og:title" content={data.seo.title} />
        <meta property="og:description" content={data.seo.description} />
        <meta property="og:url" content={data.seo.canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="AssuTempo" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.seo.title} />
        <meta name="twitter:description" content={data.seo.description} />
        {data.seo.jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {jsonLd(schema)}
          </script>
        ))}
      </Helmet>

      {/* Barre de progression de lecture : composant dedie (portal + scaleX
          GPU), au lieu d'une animation de width qui re-rendait tout
          l'article a chaque frame de scroll */}
      <ScrollProgress />

      <article style={{ paddingBottom: 80 }}>
        {/* ── Hero header ── */}
        <section
          style={{
            paddingTop: 120,
            paddingBottom: 60,
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
                'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 65%)',
            }}
          />

          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              padding: '0 24px',
              position: 'relative',
            }}
          >
            {/* Breadcrumb */}
            <nav aria-label="Fil d'Ariane" style={{ marginBottom: 28 }}>
              <ol
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  color: 'var(--text-muted)',
                }}
              >
                <li>
                  <Link
                    to="/"
                    style={{
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={12} style={{ opacity: 0.5 }} />
                </li>
                <li>
                  <Link
                    to="/articles"
                    style={{
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    Articles
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={12} style={{ opacity: 0.5 }} />
                </li>
                <li aria-current="page" style={{ color: 'var(--text-subtle)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {data.category}
                </li>
              </ol>
            </nav>

            {/* Category + meta */}
            <Reveal>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                <span
                  style={{
                    padding: '5px 12px',
                    background: 'var(--gold-glow)',
                    border: '1px solid var(--gold-border)',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {data.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                  <Clock size={13} strokeWidth={1.5} />
                  Lecture {data.readTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                  <Calendar size={13} strokeWidth={1.5} />
                  Mis à jour le {data.updatedDate}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-muted)' }}>
                  <User size={13} strokeWidth={1.5} />
                  {data.author}
                </span>
              </div>
            </Reveal>

            {/* H1 */}
            <Reveal delay={0.05}>
              <h1
                style={{
                  fontSize: 'clamp(1.65rem, 4.5vw, 2.6rem)',
                  fontWeight: 800,
                  color: 'var(--text)',
                  margin: '0 0 32px',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                }}
              >
                {data.headline}
              </h1>
            </Reveal>

            {/* Capsule de reponse GEO si l'article en a une (statique, sans
                animation : contenu critique lisible des le premier paint),
                sinon bloc "Reponse immediate" historique. */}
            {data.answerCapsule ? (
              <AnswerCapsule capsule={data.answerCapsule} />
            ) : (
            <Reveal delay={0.1}>
              <div
                style={{
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                  borderLeft: '3px solid var(--gold)',
                  borderRadius: '0 14px 14px 0',
                  padding: '22px 24px',
                  marginBottom: 0,
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
                  {data.immediateAnswerLabel ?? 'Réponse immédiate'}
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: 'var(--text)',
                    margin: 0,
                    lineHeight: 1.75,
                  }}
                >
                  {data.immediateAnswer}
                </p>
              </div>
            </Reveal>
            )}
          </div>
        </section>

        {/* ── Article body ── */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          {data.sections.map((section, i) => (
            <div key={i}>
              {i === ctaInsertIndex && <ArticleCTABlock cta={data.cta} />}
              <RenderSection section={section} index={i} />
            </div>
          ))}

          {/* ── FAQ ── */}
          <Reveal>
            <section style={{ marginTop: 56, marginBottom: 48 }}>
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
                Tout ce que vous devez savoir avant d&apos;agir.
              </p>
              <div>
                {data.faqItems.map((item, i) => (
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

          {/* ── Final CTA ── */}
          <Reveal>
            <div
              style={{
                background: 'var(--gold-glow)',
                border: '1px solid var(--gold-border)',
                borderRadius: 16,
                padding: '36px 28px',
                textAlign: 'center',
                marginBottom: 56,
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
                {data.cta?.title ?? 'Assuré en 5 minutes, attestation immédiate.'}
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
                {data.cta?.subtitle ?? 'Récupérez votre véhicule sans attendre.'} {data.cta?.suffix ?? '100 % en ligne, sans engagement.'}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                <Link
                  to={data.cta?.href ?? '/tarification'}
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
                  {data.cta?.label ?? 'Obtenir mon devis'}
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

          {/* Encart auteur (E-E-A-T) : qui ecrit, sous quelle immatriculation,
              et la date de mise a jour reelle de l'article. */}
          <Reveal>
            <aside
              aria-label="À propos de l'auteur"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: 14,
                padding: '18px 22px',
                marginBottom: 56,
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={17} color="var(--gold)" strokeWidth={1.5} />
              </span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>
                  Rédigé par l&apos;équipe AssuTempo, courtier Evidence Assurances, ORIAS n&deg; 20005719.
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  Contenu vérifié et mis à jour le {data.updatedDate}.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>

        {/* ── À lire aussi ── */}
        <section
          style={{
            background: 'var(--bg)',
            padding: '0 0 80px',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <Reveal>
              <h2
                style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  margin: '0 0 24px',
                  letterSpacing: '-0.02em',
                }}
              >
                À lire aussi
              </h2>
            </Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
              }}
              className="related-grid"
            >
              {relatedArticles.map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.06}>
                  <RelatedCard article={article} />
                </Reveal>
              ))}
            </div>

            {/* Liens du cluster : page money d'abord, puis pages piliers */}
            {clusterLinks.length > 0 && (
              <Reveal>
                <div style={{ marginTop: 28 }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--text-subtle)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      margin: '0 0 12px',
                    }}
                  >
                    Pour aller plus loin
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {clusterLinks.map((l) => (
                      <Link
                        key={l.href}
                        to={l.href}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 7,
                          fontSize: 13.5,
                          fontWeight: 500,
                          textDecoration: 'none',
                          padding: '9px 16px',
                          borderRadius: 999,
                          border: '1px solid var(--gold-border)',
                          background: 'var(--gold-glow)',
                          color: 'var(--gold-light)',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--gold-glow)')}
                      >
                        {l.label}
                        <ArrowRight size={14} strokeWidth={2} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </article>

      <StickyCTA cta={data.cta} />
      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}

export default ArticleLayout;
