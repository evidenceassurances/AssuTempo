/* AnswerCapsule : bloc "La réponse en bref" en tête d'article.
   Optimisé GEO : réponse directe (50 mots max), 3 faits précis ancrés
   (date ou référence vérifiable) et date de mise à jour explicite.
   100 % statique : aucun état initial invisible (règle du 8 juillet,
   contenu critique lisible dès le premier paint), aucune animation,
   texte intégralement présent dans le HTML prérendu. */

function AnswerCapsule({ capsule }) {
  const { answer, facts, updated } = capsule;
  return (
    <aside
      aria-label="La réponse en bref"
      style={{
        background: 'var(--gold-glow)',
        border: '1px solid var(--gold-border)',
        borderLeft: '3px solid var(--gold)',
        borderRadius: '0 14px 14px 0',
        padding: '22px 24px',
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
        La réponse en bref
      </p>

      <p
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: 'var(--text)',
          margin: '0 0 18px',
          lineHeight: 1.75,
        }}
      >
        {answer}
      </p>

      <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0 }}>
        {facts.map((fact) => (
          <li
            key={fact.anchor}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                padding: '3px 10px',
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid var(--gold-border)',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--gold)',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                marginTop: 2,
              }}
            >
              {fact.anchor}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              {fact.text}
            </span>
          </li>
        ))}
      </ul>

      <p
        style={{
          fontSize: 12,
          color: 'var(--text-subtle)',
          margin: 0,
          paddingTop: 12,
          borderTop: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        Faits vérifiés · mis à jour le {updated}
      </p>
    </aside>
  );
}

export default AnswerCapsule;
