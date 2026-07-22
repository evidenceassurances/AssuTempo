/* ═══════════════════════════════════════════════════════════════════════════
   GlobeInternational : le globe signature du hero /assurance-internationale.

   Piece maitresse de la page, distincte du Cadran Tempo de l'accueil, mais de
   la meme famille d'execution : un limbe circulaire net sert d'ancre visuelle,
   comme l'anneau du Cadran.

   Un seul SVG, geometrie ecrite EN DUR (aucun calcul JS au runtime). Vu en
   legere perspective trois quarts (sous-observateur a ~25 deg au-dessus de
   l'equateur) : les paralleles sont des ellipses aplaties dont le centre monte
   vers le nord, les meridiens des ellipses verticales passant par les deux
   poles projetes a l'interieur du disque.

   Animations, uniquement transform / opacity / stroke-dashoffset :
     - rotation tres lente du groupe des meridiens (transform rotate, 110s) ;
     - trajectoire de voyage en pointille (stroke-dashoffset, 15s), seule
       animation lineaire de la scene ;
     - pulsation douce des 7 points de destination (opacity, decalee).
   prefers-reduced-motion : tout statique, arcs pleins, points fixes.
   ═══════════════════════════════════════════════════════════════════════════ */

/* 7 destinations, placement evocateur (pas cartographique) sur le disque.
   Maroc et Tunisie en bas a gauche, Turquie et Azerbaidjan a droite, les
   Balkans au centre. delai = decalage de la pulsation. */
const POINTS = [
  { cx: 118, cy: 210, r: 3.0, delay: '0s'   }, /* Maroc */
  { cx: 150, cy: 222, r: 2.8, delay: '1.4s' }, /* Tunisie */
  { cx: 140, cy: 175, r: 2.7, delay: '2.6s' }, /* Albanie */
  { cx: 162, cy: 165, r: 2.7, delay: '0.7s' }, /* Macedoine du Nord */
  { cx: 182, cy: 146, r: 2.7, delay: '3.3s' }, /* Moldavie */
  { cx: 214, cy: 188, r: 3.0, delay: '1.9s' }, /* Turquie */
  { cx: 236, cy: 170, r: 2.9, delay: '2.2s' }, /* Azerbaidjan */
];

/* Point de depart, haut du globe. Trois arcs de voyage en partent. */
const DEP = { cx: 150, cy: 72 };
const ARCS = [
  'M150,72 Q100,148 118,210', /* vers Maroc */
  'M150,72 Q214,118 214,188', /* vers Turquie */
  'M150,72 Q126,150 150,222', /* vers Tunisie */
];

export default function GlobeInternational() {
  return (
    <div className="gi-wrap" aria-hidden="true">
      <svg className="gi-svg" viewBox="0 0 320 320" role="presentation" focusable="false">
        <defs>
          <linearGradient id="gi-gold" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#E8C97A" />
            <stop offset="1" stopColor="#C9A84C" />
          </linearGradient>
          <radialGradient id="gi-body" cx="0.42" cy="0.36" r="0.72">
            <stop offset="0" stopColor="rgba(232,201,122,0.10)" />
            <stop offset="0.6" stopColor="rgba(201,168,76,0.03)" />
            <stop offset="1" stopColor="rgba(201,168,76,0)" />
          </radialGradient>
        </defs>

        {/* Corps de la sphere, un souffle de volume sous le fil */}
        <circle cx="160" cy="160" r="120" fill="url(#gi-body)" />

        {/* Paralleles (fixes). Ellipses aplaties, centre remontant vers le nord.
            Les lignes proches du limbe sont un peu plus presentes que les
            centrales : volume sans aucun filtre. */}
        <g fill="none" stroke="url(#gi-gold)">
          <ellipse cx="160" cy="64"    rx="56.3"  ry="23.8" strokeWidth="1"   opacity="0.5" />
          <ellipse cx="160" cy="93"    rx="94.6"  ry="40"   strokeWidth="1"   opacity="0.44" />
          <ellipse cx="160" cy="131.9" rx="115.9" ry="49"   strokeWidth="0.9" opacity="0.38" />
          <ellipse cx="160" cy="160"   rx="120"   ry="50.7" strokeWidth="0.9" opacity="0.4" />
          <ellipse cx="160" cy="188.1" rx="115.9" ry="49"   strokeWidth="0.9" opacity="0.38" />
          <ellipse cx="160" cy="227"   rx="94.6"  ry="40"   strokeWidth="1"   opacity="0.44" />
          <ellipse cx="160" cy="256"   rx="56.3"  ry="23.8" strokeWidth="1"   opacity="0.5" />
        </g>

        {/* Meridiens. Ellipses verticales passant par les deux poles projetes
            (y = 160 +/- 108.75), plus le meridien central. Statiques : la regle
            de Chanel a retire la rotation d'ensemble (la finition la plus faible,
            imperceptible et qui rompait la symetrie du fil au fil du cycle) au
            profit d'un globe net et symetrique a chaque instant. La vie vient de
            la trajectoire de voyage. */}
        <g className="gi-meridians" fill="none" stroke="url(#gi-gold)">
          <line x1="160" y1="51.3" x2="160" y2="268.7" strokeWidth="0.9" opacity="0.34" />
          <ellipse cx="160" cy="160" rx="50.7"  ry="108.75" strokeWidth="0.9" opacity="0.4" />
          <ellipse cx="160" cy="160" rx="91.9"  ry="108.75" strokeWidth="0.9" opacity="0.46" />
          <ellipse cx="160" cy="160" rx="115.9" ry="108.75" strokeWidth="1"   opacity="0.52" />
        </g>

        {/* Limbe : le contour net de la sphere, ancre visuelle de la page. */}
        <circle cx="160" cy="160" r="120" fill="none" stroke="#E8C97A" strokeWidth="1.1" opacity="0.9" />

        {/* Trajectoire de voyage : pointille fin, seule animation lineaire. */}
        <g className="gi-arcs" fill="none" stroke="#E8C97A" strokeWidth="1.1" strokeLinecap="round">
          {ARCS.map((d) => (
            <path key={d} className="gi-arc" d={d} />
          ))}
        </g>

        {/* Point de depart, haut du globe */}
        <circle className="gi-dep-ring" cx={DEP.cx} cy={DEP.cy} r="6" fill="none" stroke="#E8C97A" strokeWidth="1" opacity="0.7" />
        <circle cx={DEP.cx} cy={DEP.cy} r="2.6" fill="#E8C97A" opacity="0.95" />

        {/* 7 destinations, pulsation douce et decalee */}
        <g className="gi-points" fill="#E8C97A">
          {POINTS.map((p) => (
            <circle
              key={`${p.cx}-${p.cy}`}
              className="gi-point"
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              style={{ animationDelay: p.delay }}
            />
          ))}
        </g>
      </svg>

      <style>{`
        .gi-wrap {
          position: absolute;
          top: 46%;
          left: 50%;
          width: clamp(320px, 66vw, 720px);
          transform: translate(-50%, -50%);
          opacity: 0.18;
          pointer-events: none;
          z-index: 1;
        }
        .gi-svg { display: block; width: 100%; height: auto; }

        /* Le voyage : les tirets avancent le long des arcs. */
        .gi-arc {
          stroke-dasharray: 3 7;
          animation: gi-travel 15s linear infinite;
        }
        @keyframes gi-travel {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -100; }
        }

        /* Pulsation des destinations. */
        .gi-point {
          animation: gi-pulse 4.5s ease-in-out infinite;
        }
        @keyframes gi-pulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gi-arc { stroke-dasharray: none; animation: none; }
          .gi-point { animation: none; opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
