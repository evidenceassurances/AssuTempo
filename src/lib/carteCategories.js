export const CATS = {
  regle:  { label: 'Obligatoire',   color: '#E2795C', bg: 'rgba(226,121,92,0.10)',  border: 'rgba(226,121,92,0.26)',  hover: 'rgba(226,121,92,0.45)',  glow: 'rgba(226,121,92,0.16)' },
  peage:  { label: 'Peage & couts', color: '#6FA9C9', bg: 'rgba(111,169,201,0.10)', border: 'rgba(111,169,201,0.26)', hover: 'rgba(111,169,201,0.45)', glow: 'rgba(111,169,201,0.16)' },
  route:  { label: 'Sur la route',  color: '#8FBE86', bg: 'rgba(143,190,134,0.10)', border: 'rgba(143,190,134,0.26)', hover: 'rgba(143,190,134,0.45)', glow: 'rgba(143,190,134,0.16)' },
  astuce: { label: 'Bon a savoir',  color: '#E8C97A', bg: 'rgba(232,201,122,0.10)', border: 'rgba(232,201,122,0.26)', hover: 'rgba(232,201,122,0.45)', glow: 'rgba(232,201,122,0.16)' },
};

export const CAT_LABEL = {
  regle:  'Obligatoire',
  peage:  'Péage & coûts',
  route:  'Sur la route',
  astuce: 'Bon à savoir',
};

const ICON_CAT = {
  Wine:'regle', Sticker:'regle', Sun:'regle', Lightbulb:'regle', Snowflake:'regle',
  ArrowLeft:'regle', Milestone:'regle', Leaf:'regle', ShieldAlert:'regle', ShieldCheck:'regle',
  Camera:'regle', Ban:'regle', CircleAlert:'regle',
  Ticket:'peage', Receipt:'peage', Fuel:'peage', ShoppingBag:'peage',
  Mountain:'route', Waves:'route', TriangleAlert:'route', Car:'route', Bike:'route',
  Euro:'astuce', History:'astuce', Globe:'astuce', Building2:'astuce',
  ArrowRightLeft:'astuce', RotateCw:'astuce', RefreshCw:'astuce',
};

export function classifySection(section) {
  if (section && section.type && CATS[section.type]) return section.type;
  // data fields: icon, titre, texte (pays data uses "texte", not "contenu")
  const t = `${(section && section.titre) || ''} ${(section && (section.texte || section.contenu)) || ''}`.toLowerCase();
  const icon = section && section.icon;
  if (icon === 'Route')  return /(gratuit|p[ée]age)/.test(t) ? 'peage' : 'route';
  if (icon === 'Gauge')  return /(revenus|proportionnelle)/.test(t) ? 'astuce' : 'regle';
  if (icon && ICON_CAT[icon]) return ICON_CAT[icon];
  if (/(p[ée]age|ticket|ferry|carburant|gratuit|duty.?free|co[ûu]t)/.test(t)) return 'peage';
  if (/(alcool|vignette|feux|pneus|priorit|limit|obligatoire|gauche|carte verte|crit|zfe)/.test(t)) return 'regle';
  if (/(montagne|col|c[ôo]te|animal|animaux|rennes|[ée]lan|trafic|cyclist|v[ée]lo|transit|voie unique|[ée]troit)/.test(t)) return 'route';
  return 'astuce';
}
