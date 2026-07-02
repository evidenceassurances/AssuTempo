import { useMemo, useState } from 'react';
import { jsonLd } from '../lib/seo';
import { Helmet } from 'react-helmet-async';
import { LazyMotion, domMax, m, AnimatePresence, useReducedMotion } from 'framer-motion';
import Footer from '../components/Footer';
import { articles } from '../data/articlesData';
import {
  catKey, normalizeText, getReponseRapide,
  presentCategoryKeys, fadeUpVariants, stagger,
} from '../components/articles/articlesMeta';
import ScrollProgress from '../components/articles/ScrollProgress';
import ArticlesHero from '../components/articles/ArticlesHero';
import SituationGrid from '../components/articles/SituationGrid';
import FeaturedArticle from '../components/articles/FeaturedArticle';
import CategoryFilter from '../components/articles/CategoryFilter';
import ArticleCard from '../components/articles/ArticleCard';
import ArticlesFAQ from '../components/articles/ArticlesFAQ';

const SITE = 'https://assutempo.fr';

/* FAQ de repli (aucune source FAQ partagee exportee dans le projet). */
const FAQ_ITEMS = [
  {
    q: 'Qui peut souscrire une assurance temporaire ?',
    a: 'Tout conducteur titulaire d’un permis de conduire valide, pour une durée de 1 à 90 jours, dans 34 pays européens.',
  },
  {
    q: 'Quels véhicules sont couverts ?',
    a: 'Voitures, utilitaires, camping-cars, motos et poids lourds selon les cas. Le parcours de devis précise les genres éligibles.',
  },
  {
    q: 'Quand vais-je recevoir mon attestation ?',
    a: 'L’attestation et le Mémo Véhicule Assuré sont disponibles en téléchargement immédiat après la souscription, en quelques minutes.',
  },
  {
    q: 'L’assurance temporaire est-elle sans engagement ?',
    a: 'Oui : sans reconduction tacite ni engagement annuel, la couverture s’arrête à l’échéance choisie.',
  },
];

function Articles() {
  const reduce = useReducedMotion();
  const fadeUp = fadeUpVariants(reduce);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('tous');

  const categoryKeys = useMemo(() => presentCategoryKeys(articles), []);
  const counts = useMemo(() => {
    const acc = {};
    for (const a of articles) {
      const k = catKey(a.categorie);
      acc[k] = (acc[k] || 0) + 1;
    }
    return acc;
  }, []);

  const pillar = useMemo(() => articles.find((a) => a.featured) || articles[0], []);
  const isDefaultView = activeCategory === 'tous' && query.trim() === '';

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    const source = isDefaultView ? articles.filter((a) => a !== pillar) : articles;
    return source.filter((a) => {
      const matchCat = activeCategory === 'tous' || catKey(a.categorie) === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = normalizeText(`${a.titre} ${a.extrait} ${getReponseRapide(a)}`);
      return haystack.includes(q);
    });
  }, [query, activeCategory, isDefaultView, pillar]);

  const resultCount = filtered.length;

  /* Selection d'une situation (carte ou chip) : filtre + smooth-scroll vers la liste. */
  const selectCategory = (key) => {
    setActiveCategory(key);
    if (typeof document !== 'undefined') {
      requestAnimationFrame(() => {
        const target = document.getElementById('reponses');
        if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    }
  };

  const resetFilters = () => {
    setQuery('');
    setActiveCategory('tous');
  };

  /* ── JSON-LD ─────────────────────────────────────────────────────────── */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE}/articles` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles
      .filter((a) => a.hasPage)
      .map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.titre,
        url: `${SITE}/articles/${a.slug}`,
      })),
  };

  return (
    <LazyMotion features={domMax}>
      <Helmet>
        <title>Articles et conseils sur l'assurance temporaire | AssuTempo</title>
        <meta name="description" content="Le centre de réponses de l'assurance temporaire : fourrière, achat de véhicule, conduite à l'étranger, carte grise. Des réponses claires, situation par situation." />
        <link rel="canonical" href="https://assutempo.fr/articles" />
        <meta property="og:title" content="Articles et conseils sur l'assurance temporaire | AssuTempo" />
        <meta property="og:description" content="Le centre de réponses de l'assurance temporaire : fourrière, achat de véhicule, conduite à l'étranger, carte grise. Des réponses claires, situation par situation." />
        <meta property="og:url" content="https://assutempo.fr/articles" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemListSchema) }} />

      <ScrollProgress />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 132, paddingBottom: 56, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 64% 42% at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 62%)',
        }} />
        <ArticlesHero query={query} onQueryChange={setQuery} onChipSelect={selectCategory} />
      </section>

      {/* ── Par situation ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '8px 24px 16px' }}>
        <m.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 22px', letterSpacing: '-0.02em' }}
        >
          Par situation
        </m.h2>
        <SituationGrid categoryKeys={categoryKeys} counts={counts} active={activeCategory} onSelect={selectCategory} />
      </section>

      {/* ── Article a la une (pilier) ────────────────────────────────────── */}
      {isDefaultView && pillar && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 8px' }}>
          <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}>
            <FeaturedArticle article={pillar} />
          </m.div>
        </section>
      )}

      {/* ── Filtres + liste ──────────────────────────────────────────────── */}
      <section id="reponses" style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 104px', scrollMarginTop: 92 }}>
        <div style={{ marginBottom: 20 }}>
          <CategoryFilter categoryKeys={categoryKeys} active={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', minHeight: 22, marginBottom: 18, fontSize: 13, color: 'var(--text-muted)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={resultCount}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {resultCount} {resultCount > 1 ? 'réponses' : 'réponse'}
            </m.span>
          </AnimatePresence>
        </div>

        {resultCount === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 14px' }}>
              Aucune réponse pour cette recherche.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--gold)',
                textDecoration: 'underline',
              }}
            >
              Voir toutes les situations
            </button>
          </div>
        ) : (
          <m.div layout className="articles-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </AnimatePresence>
          </m.div>
        )}
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '88px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <ArticlesFAQ items={FAQ_ITEMS} />
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .situation-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .articles-list-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .situation-grid { grid-template-columns: 1fr !important; }
          .articles-list-grid { grid-template-columns: 1fr !important; }
        }
        .situation-card:hover { border-color: rgba(201,168,76,0.35) !important; }
        .situation-card:hover .situation-icon { transform: scale(1.12) translateY(-2px); }
        .article-card:hover { border-color: rgba(201,168,76,0.35) !important; }
        .article-card:hover .article-arrow { transform: translateX(4px); }
        .hero-chip:hover { color: var(--text); }
        @media (prefers-reduced-motion: reduce) {
          .situation-card:hover .situation-icon,
          .article-card:hover .article-arrow { transform: none !important; }
        }
      `}</style>
    </LazyMotion>
  );
}

export default Articles;
