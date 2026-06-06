// Jeu d'icones vehicules en relief, 100% SVG (aucune image).
// VehicleIconDefs : a rendre UNE SEULE FOIS dans la page (degrades partages).
// VehicleIcon : <VehicleIcon type="4x4" size={58} />

const COLORS = {
  'voiture':'#6FA9C9','sportive':'#E2604A','berline':'#9FB4C6','utilitaire':'#CFD6DE',
  'minibus':'#E8924C','autocar':'#4FB3A3','poids-lourd':'#7FB36B','semi-remorque':'#7C8BD0',
  'pick-up':'#C0894F','4x4':'#9FA862','camping-car':'#E8C97A','caravane':'#D98C6A',
  'tracteur':'#E6C34C','quad':'#D24B45',
};

const shade = (hex, p) => {
  const n = parseInt(hex.slice(1), 16), r = (n>>16)&255, g = (n>>8)&255, b = n&255;
  const f = x => Math.round(p>0 ? x+(255-x)*p : x*(1+p));
  return '#' + [f(r),f(g),f(b)].map(v => Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('');
};

const GL = 'url(#glass)';

const W = (cx,cy,r,c) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#tire)"/>
  <circle cx="${cx}" cy="${cy}" r="${(r*0.52).toFixed(1)}" fill="#1b1b1f"/>
  <circle cx="${cx}" cy="${cy}" r="${(r*0.34).toFixed(1)}" fill="${c}"/>
  <circle cx="${cx}" cy="${cy}" r="${(r*0.34).toFixed(1)}" fill="url(#hub)"/>
  <circle cx="${(cx-r*0.32).toFixed(1)}" cy="${(cy-r*0.34).toFixed(1)}" r="${(r*0.15).toFixed(1)}" fill="#fff" opacity=".5"/>`;

const WQ = (cx,cy,r,c) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#tire)"/>
  <circle cx="${cx}" cy="${cy}" r="${(r-1).toFixed(1)}" fill="none" stroke="#3a3a40" stroke-width="2.4" stroke-dasharray="2.2 2.7"/>
  <circle cx="${cx}" cy="${cy}" r="${(r*0.46).toFixed(1)}" fill="#1b1b1f"/>
  <circle cx="${cx}" cy="${cy}" r="${(r*0.3).toFixed(1)}" fill="${c}"/>
  <circle cx="${cx}" cy="${cy}" r="${(r*0.3).toFixed(1)}" fill="url(#hub)"/>
  <circle cx="${(cx-r*0.3).toFixed(1)}" cy="${(cy-r*0.32).toFixed(1)}" r="${(r*0.13).toFixed(1)}" fill="#fff" opacity=".45"/>`;

const DRAW = {
  'voiture': (c,k) => `
    <path d="M10 35h44a3 3 0 0 1 3 3v6H7v-6a3 3 0 0 1 3-3z" fill="url(#b-${k})"/>
    <path d="M18 35l6-9h16l6 9z" fill="url(#b-${k})"/>
    <path d="M24.5 27.5h15l4 6.5h-23z" fill="${GL}"/>
    ${W(20,45,6,c)}${W(44,45,6,c)}`,
  'sportive': (c,k) => `
    <rect x="5.5" y="30.2" width="7.5" height="2" rx="1" fill="url(#b-${k})"/>
    <path d="M6 42 L6 34 Q6 31.5 9 31 L24 28 L34 28 L44 32 L57 37 Q60 38 60 40 L60 42 Z" fill="url(#b-${k})"/>
    <path d="M11 31.6 L24 28.6 L34 28.6 L43 31.8 Z" fill="${GL}"/>
    <rect x="54" y="40.6" width="6" height="1.8" rx="0.9" fill="${shade(c,-0.3)}"/>
    ${W(16,43,6.5,c)}${W(46,43,6.5,c)}`,
  'berline': (c,k) => `
    <path d="M7 35h50a2 2 0 0 1 2 2v7H5v-7a2 2 0 0 1 2-2z" fill="url(#b-${k})"/>
    <path d="M15 35l6-10h22l6 10z" fill="url(#b-${k})"/>
    <path d="M22 26.5h9v7h-13zM33 26.5h9l4 7h-13z" fill="${GL}"/>
    ${W(18,45,6,c)}${W(46,45,6,c)}`,
  'utilitaire': (c,k) => `
    <path d="M9 21h28a3 3 0 0 1 3 3v20H9z" fill="url(#b-${k})"/>
    <path d="M40 29h9a4 4 0 0 1 3 1.6L56 38v6H40z" fill="url(#b-${k})"/>
    <path d="M41 30h7l4.5 7H41z" fill="${GL}"/>
    <rect x="13" y="25" width="9" height="7" rx="1.5" fill="${GL}"/>
    ${W(19,45,6,c)}${W(48,45,6,c)}`,
  'minibus': (c,k) => `
    <rect x="7" y="21" width="50" height="23" rx="5" fill="url(#b-${k})"/>
    <rect x="11" y="25" width="42" height="8" rx="2" fill="${GL}"/>
    <rect x="24" y="25" width="2" height="8" fill="url(#b-${k})"/><rect x="38" y="25" width="2" height="8" fill="url(#b-${k})"/>
    ${W(18,45,6,c)}${W(46,45,6,c)}`,
  'autocar': (c,k) => `
    <rect x="4" y="19" width="56" height="26" rx="5" fill="url(#b-${k})"/>
    <rect x="8" y="23" width="48" height="9" rx="2" fill="${GL}"/>
    <rect x="20" y="23" width="2" height="9" fill="url(#b-${k})"/><rect x="32" y="23" width="2" height="9" fill="url(#b-${k})"/><rect x="44" y="23" width="2" height="9" fill="url(#b-${k})"/>
    ${W(16,45,6,c)}${W(48,45,6,c)}`,
  'poids-lourd': (c,k) => `
    <rect x="18" y="22" width="40" height="22" rx="3" fill="url(#b-${k})" opacity=".9"/>
    <path d="M6 28h11v16H6z" fill="url(#b-${k})"/>
    <path d="M7.5 29.5h7l1.5 5H7.5z" fill="${GL}"/>
    ${W(12,46,5.4,c)}${W(34,46,5.4,c)}${W(50,46,5.4,c)}`,
  'semi-remorque': (c,k) => `
    <rect x="18" y="20" width="44" height="24" rx="2" fill="url(#b-${k})" opacity=".95"/>
    <path d="M3 31 L6 25 L16 25 L16 44 L3 44 Z" fill="url(#b-${k})"/>
    <path d="M5.6 27 L9.6 27 L9.6 32 L4.2 32 Z" fill="${GL}"/>
    <rect x="17" y="40" width="45" height="4" fill="${shade(c,-0.3)}"/>
    ${W(10,47,4.6,c)}${W(21,47,4.6,c)}${W(45,47,4.6,c)}${W(52,47,4.6,c)}${W(59,47,4.6,c)}`,
  'pick-up': (c,k) => `
    <path d="M7 32l5-8h15v17H7z" fill="url(#b-${k})"/>
    <path d="M14 25.5h11v7H12z" fill="${GL}"/>
    <path d="M27 33h28v8H27z" fill="url(#b-${k})"/>
    <rect x="27" y="29" width="2.4" height="12" fill="url(#b-${k})"/><rect x="52.6" y="29" width="2.4" height="12" fill="url(#b-${k})"/>
    ${W(18,45,6,c)}${W(46,45,6,c)}`,
  '4x4': (c,k) => `
    <path d="M6 43 L6 31 L9 31 L14 18 L48 18 L53 31 L58 31 L58 43 Z" fill="url(#b-${k})"/>
    <rect x="13" y="16.3" width="36" height="2.4" rx="1.2" fill="url(#b-${k})"/>
    <path d="M14.5 21 L47.5 21 L50.3 28.5 L12 28.5 Z" fill="${GL}"/>
    <rect x="24.5" y="21" width="2" height="7.5" fill="url(#b-${k})"/>
    <rect x="37" y="21" width="2" height="7.5" fill="url(#b-${k})"/>
    <rect x="50" y="41" width="7" height="2.4" rx="1" fill="${shade(c,-0.3)}"/>
    ${W(17,45,8,c)}${W(47,45,8,c)}`,
  'camping-car': (c,k) => `
    <path d="M6 20h36a2 2 0 0 1 2 2v22H6z" fill="url(#b-${k})"/>
    <path d="M44 30h8a3 3 0 0 1 2.4 1.2L57 38v6H44z" fill="url(#b-${k})"/>
    <path d="M45 31h6l4 6.5h-10z" fill="${GL}"/>
    <rect x="10" y="24" width="11" height="8" rx="1.5" fill="${GL}"/>
    <rect x="26" y="24" width="13" height="16" rx="1.5" fill="rgba(0,0,0,.22)"/>
    ${W(18,45,6,c)}${W(49,45,6,c)}`,
  'caravane': (c,k) => `
    <path d="M14 25h36a6 6 0 0 1 6 6v13H10V31a6 6 0 0 1 6-6z" fill="url(#b-cream)"/>
    <path d="M10 25h46a6 6 0 0 0-6-6H16a6 6 0 0 0-6 6z" fill="url(#b-${k})"/>
    <rect x="16" y="30" width="14" height="9" rx="2" fill="${GL}"/>
    <path d="M10 41H2" stroke="#E6DCC4" stroke-width="2.4" stroke-linecap="round"/>
    ${W(40,46,5.4,c)}`,
  'tracteur': (c,k) => `
    <rect x="28" y="32" width="25" height="10" rx="2" fill="url(#b-${k})"/>
    <rect x="13" y="20" width="18" height="2.5" rx="1" fill="url(#b-${k})"/>
    <path d="M14 22 L30 22 L30 35 L14 35 Z" fill="url(#b-${k})"/>
    <rect x="16.5" y="24" width="11" height="8" rx="1.5" fill="${GL}"/>
    <rect x="29" y="23" width="2.4" height="10" rx="1" fill="${shade(c,-0.25)}"/>
    <rect x="52" y="33" width="2.5" height="8" rx="1" fill="${shade(c,-0.2)}"/>
    ${W(50,46,7,c)}${W(18,39,13,c)}`,
  'quad': (c,k) => `
    ${WQ(15,43,10,c)}${WQ(49,43,10,c)}
    <path d="M6 41 Q6 31 14 30.5 Q22 30.2 30 31 L38 31 Q46 29.8 50 30 Q59 30.5 60 40 L60 41 Q55 41 53 40.6 Q49 36.5 41 40.6 L40 41 Q33 41.6 26 41 Q24 41 23 40.6 Q15 36.5 8 40.6 Q6.5 41 6 41 Z" fill="url(#b-${k})"/>
    <rect x="25" y="40.3" width="13" height="2.2" rx="1" fill="rgba(0,0,0,.45)"/>
    <path d="M20 32 Q22.5 26.5 29 26.5 Q35.5 26.5 38 32 Z" fill="#17171a"/>
    <path d="M20.6 31.4 Q23 27.4 29 27.4 Q34.4 27.4 37 31 L37 31.6 Q34 28.6 29 28.6 Q23.6 28.6 21.6 31.6 Z" fill="rgba(255,255,255,.10)"/>
    <path d="M49 29.5 L58 30.6" stroke="${shade(c,-0.25)}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M51 28 L57.5 28.8" stroke="${shade(c,-0.25)}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M39 31 L45 21" stroke="${shade(c,-0.08)}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M42 21 L49.5 19" stroke="#26262a" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="49.7" cy="19" r="1.7" fill="#26262a"/>
    <ellipse cx="57.6" cy="35.4" rx="2.1" ry="2.9" fill="${GL}"/>`,
};

const SHADOW = `<ellipse cx="32" cy="54" rx="25" ry="3.6" fill="url(#gshadow)"/>`;
const GLOSS  = `<ellipse cx="23" cy="26" rx="16" ry="9" fill="url(#gloss)" opacity=".7"/>`;

const ALIASES = {
  'voiture':'voiture','berline':'berline','sportive':'sportive','utilitaire':'utilitaire',
  'fourgon':'utilitaire','van':'utilitaire','minibus':'minibus','autocar':'autocar','bus':'autocar','car':'autocar',
  'poids-lourd':'poids-lourd','camion':'poids-lourd','semi-remorque':'semi-remorque','semi':'semi-remorque',
  'pick-up':'pick-up','pickup':'pick-up','4x4':'4x4','suv':'4x4','4x4-suv':'4x4',
  'camping-car':'camping-car','caravane':'caravane','remorque':'caravane','tracteur':'tracteur','quad':'quad',
};

function resolveKey(input) {
  const s = String(input || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return ALIASES[s] || (DRAW[s] ? s : 'voiture');
}

function buildDefs() {
  const grad = (id, base) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(base,.34)}"/><stop offset="0.5" stop-color="${base}"/><stop offset="1" stop-color="${shade(base,-0.26)}"/></linearGradient>`;
  let s = `
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef5fa"/><stop offset="0.55" stop-color="#bcccd8"/><stop offset="1" stop-color="#8fa3b2"/></linearGradient>
    <radialGradient id="tire" cx="0.4" cy="0.34" r="0.78"><stop offset="0" stop-color="#43434a"/><stop offset="0.55" stop-color="#19191c"/><stop offset="1" stop-color="#0a0a0c"/></radialGradient>
    <radialGradient id="hub" cx="0.36" cy="0.32" r="0.7"><stop offset="0" stop-color="#ffffff" stop-opacity="0.45"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <radialGradient id="gloss" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <radialGradient id="gshadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000000" stop-opacity="0.55"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></radialGradient>
    ${grad('b-cream', '#E6DCC4')}`;
  Object.keys(COLORS).forEach(k => { s += grad('b-' + k, COLORS[k]); });
  return s;
}

export function VehicleIconDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}
      dangerouslySetInnerHTML={{ __html: `<defs>${buildDefs()}</defs>` }} />
  );
}

export function VehicleIcon({ type, size = 60, className = '' }) {
  const k = resolveKey(type);
  const c = COLORS[k];
  const svg = `<svg viewBox="0 0 64 64" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 5px 8px rgba(0,0,0,.45))">${SHADOW}${DRAW[k](c, k)}${GLOSS}</svg>`;
  return <span className={className} aria-hidden="true" style={{ display: 'inline-block', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
