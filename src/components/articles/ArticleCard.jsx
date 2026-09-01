import { m, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getMeta, getReadMinutes, getReponseRapide } from './articlesMeta';

/* Carte d'article raffinee : tag teinte categorie, bloc reponse encadre
   (bordure gauche or animee en scaleY au scroll), ligne meta, lien Lire.
   La racine est un m.article (keye et anime par AnimatePresence du parent) ;
   le contenu cliquable (Link) vit a l'interieur pour ne pas casser l'exit. */
function ArticleCard({ article }) {
  const reduce = useReducedMotion();
  const meta = getMeta(article.categorie);
  const Icon = article.icone || meta.Icon;
  const accent = meta.accent;
  const minutes = getReadMinutes(article);
  const reponse = getReponseRapide(article);
  const hasPage = article.hasPage;

  const innerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '24px 22px',
    borderRadius: 16,
    background: '#15120B',
    border: '1px solid rgba(255,255,255,0.07)',
    transition: 'border-color 0.25s var(--ease-out)',
    textDecoration: 'none',
  };

  const content = (
    <>
      {/* Icone + tag categorie */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            background: `${accent}1A`,
            border: `1px solid ${accent}3D`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={21} color={accent} strokeWidth={1.6} />
          </span>
          <span style={{
            fontSize: 11,
            color: accent,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {meta.label}
          </span>
        </div>
        {!hasPage && (
          <span style={{
            padding: '4px 10px',
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 999,
            fontSize: 11,
            color: 'var(--text-subtle)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Bientôt disponible
          </span>
        )}
      </div>

      <h3 style={{
        margin: 0,
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--text)',
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
      }}>
        {article.titre}
      </h3>

      {/* Bloc reponse encadre */}
      <div style={{ position: 'relative', paddingLeft: 14, flexGrow: 1 }}>
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
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Réponse : </span>
          <span style={{ color: 'var(--text-muted)' }}>{reponse}</span>
        </p>
      </div>

      {/* Ligne meta */}
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

      {hasPage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--gold)',
          fontWeight: 600,
        }}>
          Lire l&apos;article
          <ArrowRight className="article-arrow" size={14} strokeWidth={2.2}
            style={{ transition: 'transform 0.25s var(--ease-out)' }} />
        </div>
      )}
    </>
  );

  return (
    <m.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -4 }}
      style={{ height: '100%' }}
    >
      {hasPage ? (
        <Link to={`/articles/${article.slug}`} aria-label={article.titre} className="article-card" style={innerStyle}>
          {content}
        </Link>
      ) : (
        <div className="article-card" style={innerStyle}>
          {content}
        </div>
      )}
    </m.article>
  );
}

export default ArticleCard;
