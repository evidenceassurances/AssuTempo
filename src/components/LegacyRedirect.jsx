import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* Redirection client-side pour une URL heritee de l'ancien site sans
   equivalent en 301 : vercel.json est une zone interdite aux missions
   automatiques (regle CLAUDE.md section 10). Meme mecanique que /urgence
   (src/pages/Urgence.jsx) : navigate en useEffect, jamais pendant le rendu
   (le HTML prerendu doit rester identique a l'arbre d'hydratation), noindex
   + canonical vers la destination, page exclue du sitemap. */
function LegacyRedirect({ to, title, description, eyebrow, heading, body, cta }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://assutempo.fr${to}`} />
      </Helmet>

      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '160px 24px 80px',
          background: 'linear-gradient(180deg, #05060F 0%, #0A0A0A 100%)',
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            {eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 14 }}>
            {heading}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
            {body}
          </p>
          <Link to={to} className="btn-gold">
            {cta}
            <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default LegacyRedirect;
