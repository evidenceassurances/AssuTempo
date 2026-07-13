/* Croissant de lune dore, signature visuelle du Guichet de Nuit dans le header
   et le footer. SVG inline (aucune image raster), halo en degrade radial SVG
   et JAMAIS en filter: blur (regle mobile : un blur de grand rayon re-rasterise
   la couche a chaque frame). Le halo respire en opacity seule, coupe par
   prefers-reduced-motion (classe .gn-halo, definie dans index.css).

   uid : prefixe des identifiants des defs SVG. Deux lunes coexistent dans la
   meme page (header + footer) : sans prefixe distinct, leurs <defs> porteraient
   le meme id. */
function CrescentMoon({ uid, size = 16 }) {
  const grad = `${uid}-moon-grad`;
  const halo = `${uid}-moon-halo`;
  const mask = `${uid}-moon-mask`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8C97A" />
          <stop offset="1" stopColor="#C9A84C" />
        </linearGradient>
        <radialGradient id={halo} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.35" stopColor="rgba(232,201,122,0.5)" />
          <stop offset="1" stopColor="rgba(232,201,122,0)" />
        </radialGradient>
        {/* Le croissant : un disque dont on soustrait un disque decale */}
        <mask id={mask}>
          <rect width="24" height="24" fill="#fff" />
          <circle cx="8.5" cy="10" r="8.5" fill="#000" />
        </mask>
      </defs>
      <circle className="gn-halo" cx="12" cy="12" r="11" fill={`url(#${halo})`} />
      <circle cx="12" cy="12" r="9" fill={`url(#${grad})`} mask={`url(#${mask})`} />
    </svg>
  );
}

export default CrescentMoon;
