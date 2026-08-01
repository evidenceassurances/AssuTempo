import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/* Fil d'Ariane visuel partage, pour toute page profonde qui n'a pas deja son
   propre breadcrumb en dur (voir ArticleLayout.jsx, qui garde le sien).
   `steps` : [{ name, path }], le dernier element est la page courante
   (rendu sans lien). Le JSON-LD associe se genere a part, via
   breadcrumbJsonLd() dans src/lib/seo.js : le meme tableau `steps` alimente
   les deux, jamais de contenu invisible. */
function Breadcrumb({ steps, style }) {
  return (
    <nav aria-label="Fil d'Ariane" style={{ marginBottom: 22, ...style }}>
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
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={step.path} style={last ? { color: 'var(--text-subtle)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : { display: 'flex', alignItems: 'center', gap: 6 }} aria-current={last ? 'page' : undefined}>
            {last ? (
              step.name
            ) : (
              <>
                <Link
                  to={step.path}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {step.name}
                </Link>
                <ChevronRight size={12} style={{ opacity: 0.5 }} aria-hidden="true" />
              </>
            )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
