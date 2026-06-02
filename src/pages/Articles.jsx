import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Footer from '../components/Footer';
import { articles } from '../data/articlesData';

const CATEGORIES = ['Tous', 'Urgence', 'Achat', 'International', 'Pro', 'Carte grise'];

const CATEGORY_MAP = {
  Urgence: 'Urgence',
  Achat: ['Achat véhicule', 'Essai & achat'],
  International: 'International',
  Pro: 'Pro & convoyage',
  'Carte grise': 'Carte grise',
};

function matchesFilter(article, filter) {
  if (filter === 'Tous') return true;
  const match = CATEGORY_MAP[filter];
  if (Array.isArray(match)) return match.includes(article.categorie);
  return article.categorie === match;
}

/* ── Featured card (1st article with a real page) ── */
function FeaturedCard({ article }) {
  const Icon = article.icone;
  return (
    <Link
      to={`/articles/${article.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      aria-label={article.titre}
    >
      <div
        className="featured-card"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 20,
          padding: '36px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--gold-border)';
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(201,168,76,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Gold ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--gold-glow)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={20} color="var(--gold)" strokeWidth={1.5} />
            </div>
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
              {article.categorie}
            </span>
            {article.readTime && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                · Lecture {article.readTime}
              </span>
            )}
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--gold)',
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            À la une
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.65rem)',
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}
        >
          {article.titre}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.7,
            maxWidth: 580,
          }}
        >
          {article.extrait}
        </p>

        {/* CTA row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 4,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--gold)',
          }}
        >
          Lire l&apos;article
          <ArrowRight size={15} strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}

/* ── Regular article card ── */
function ArticleCard({ article, index, inView }) {
  const Icon = article.icone;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: 16,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: article.hasPage ? 'pointer' : 'default',
        transition: 'border-color 0.3s, transform 0.3s var(--ease-out)',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.transform = 'translateY(-4px)';
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
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} color="var(--gold)" strokeWidth={1.5} />
          </div>
          <span
            style={{
              fontSize: 11,
              color: 'var(--gold)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {article.categorie}
          </span>
        </div>
        {!article.hasPage && (
          <div
            style={{
              padding: '4px 10px',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 999,
              fontSize: 11,
              color: 'var(--text-subtle)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Bientôt disponible
          </div>
        )}
      </div>

      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
        }}
      >
        {article.titre}
      </h2>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 1.65,
          flexGrow: 1,
        }}
      >
        {article.extrait}
      </p>

      {article.hasPage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gold)', fontWeight: 500, marginTop: 4 }}>
          Lire <ArrowRight size={13} strokeWidth={2} />
        </div>
      )}
    </motion.div>
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

function Articles() {
  const [headRef, headInView] = useScrollReveal();
  const [gridRef, gridInView] = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('Tous');

  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = articles.filter((a) => !a.featured);
  const filteredRegular = regularArticles.filter((a) => matchesFilter(a, activeFilter));

  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: 140,
          paddingBottom: 64,
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
              'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          }}
        />
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', padding: '0 24px' }}
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
            ASSURANCE TEMPORAIRE
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 16,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Articles &amp; conseils
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Le guide de l&apos;assurance temporaire, situation par situation.
          </p>
        </motion.div>
      </section>

      {/* Featured article */}
      {featuredArticle && (activeFilter === 'Tous' || matchesFilter(featuredArticle, activeFilter)) && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <FeaturedCard article={featuredArticle} />
          </motion.div>
        </section>
      )}

      {/* Category filters */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 32px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
          role="group"
          aria-label="Filtrer par catégorie"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              style={{
                padding: '7px 16px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: activeFilter === cat ? 'var(--gold)' : 'var(--glass-border)',
                background: activeFilter === cat ? 'var(--gold-glow)' : 'transparent',
                color: activeFilter === cat ? 'var(--gold)' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: activeFilter === cat ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s var(--ease-out)',
                fontFamily: 'inherit',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles grid */}
      <section style={{ background: 'var(--bg)', padding: '0 0 120px' }}>
        <div
          ref={gridRef}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}
        >
          {filteredRegular.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 15, textAlign: 'center', padding: '40px 0' }}>
              Aucun article dans cette catégorie pour l&apos;instant.
            </p>
          ) : (
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
              className="articles-grid"
            >
              {filteredRegular.map((article, i) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  index={i}
                  inView={gridInView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .articles-grid { grid-template-columns: 1fr !important; }
          .featured-card { padding: 24px 20px 20px !important; }
        }
      `}</style>
    </>
  );
}

export default Articles;
