import { m, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getMeta, getReadMinutes, getReponseRapide } from './articlesMeta';

/* Article pilier "A LA UNE" : carte large bordee d'or, reponse-first. */
function FeaturedArticle({ article }) {
  const reduce = useReducedMotion();
  const meta = getMeta(article.categorie);
  const Icon = article.icone || meta.Icon;
  const accent = meta.accent;
  const minutes = getReadMinutes(article);
  const reponse = getReponseRapide(article);

  return (
    <m.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <Link
        to={`/articles/${article.slug}`}
        aria-label={article.titre}
        className="article-card"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '34px 34px 30px',
          borderRadius: 20,
          background: 'linear-gradient(180deg, rgba(201,168,76,0.06), rgba(21,18,11,0.4))',
          border: '1px solid var(--gold-border)',
          textDecoration: 'none',
          overflow: 'hidden',
          transition: 'border-color 0.25s var(--ease-out)',
        }}
      >
        <span aria-hidden="true" style={{
          position: 'absolute',
          top: -70,
          right: -70,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            padding: '5px 12px',
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            À la une
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Icon size={15} color={accent} strokeWidth={1.8} />
            {meta.label}
          </span>
        </div>

        <h2 style={{
          margin: 0,
          fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          maxWidth: 640,
        }}>
          {article.titre}
        </h2>

        <div style={{ position: 'relative', paddingLeft: 16, maxWidth: 620 }}>
          <m.span
            aria-hidden="true"
            initial={{ scaleY: reduce ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              left: 0,
              top: 2,
              bottom: 2,
              width: 2,
              borderRadius: 2,
              background: 'var(--gold)',
              transformOrigin: 'top',
            }}
          />
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Réponse : </span>
            <span style={{ color: 'var(--text-muted)' }}>{reponse}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginTop: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-subtle)' }}>
            <ShieldCheck size={13} color="var(--gold)" strokeWidth={2} style={{ flexShrink: 0 }} />
            <span>
              {article.updatedAt ? (
            <>
              Mis à jour le{' '}
              <time dateTime={article.updatedAtISO}>{article.updatedAt}</time>
              {' · '}
            </>
          ) : null}
              {minutes} min · Vérifié
            </span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--gold)' }}>
            Lire l&apos;article
            <ArrowRight className="article-arrow" size={15} strokeWidth={2.4}
              style={{ transition: 'transform 0.25s var(--ease-out)' }} />
          </span>
        </div>
      </Link>
    </m.div>
  );
}

export default FeaturedArticle;
